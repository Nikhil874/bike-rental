const Bike = require("../model/bikeModel");
const express = require("express");
const authMiddleware = require("../helpers/auth.middleware");
const roleMiddleware = require("../helpers/role.middleware");
const {
  bikeValidation,
  bikeUpdateValidation,
} = require("../joi-schema/bikeJoiSchema");
const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  if (req.body.authUser.role == "manager") {
    try {
      let count = await Bike.find({}).count();
      let page;
      if (!req.query.page) {
        page = 1;
      }
      page = req.query.page;
      let bikes = await Bike.find({})
        .limit(6)
        .skip((page - 1) * 6);
      let pages = Math.ceil(count / 6);
      return res.status(200).send({ bikes, pages });
    } catch (error) {
      return res.status(500).send(error.message);
    }
  } else {
    try {
      let count = await Bike.find({ isAvailable: true }).count();
      let page;
      if (!req.query.page) {
        page = 1;
      }
      page = req.query.page;
      let bikes = await Bike.find({ isAvailable: true })
        .limit(6)
        .skip((page - 1) * 6);
      let pages = Math.ceil(count / 6);
      return res.status(200).send({ bikes, pages });
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }
});

router.post(
  "/",
  authMiddleware,
  (req, res, next) => {
    roleMiddleware(req, res, next, "manager");
  },
  bikeValidation,
  async (req, res) => {
    delete req.body["authUser"];
    try {
      const bike = await Bike.create(req.body);
      return res.status(201).send({ message: "bike created success" });
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }
);
router.patch(
  "/:id",
  authMiddleware,
  (req, res, next) => {
    roleMiddleware(req, res, next, "manager");
  },
  bikeUpdateValidation,
  async (req, res) => {
    delete req.body["authUser"];
    try {
      const bike = await Bike.findOne({ _id: req.params.id });
      if (!bike) {
        return res.status(404).send({ message: "bike not found" });
      }
      if (req.body.color) {
        bike.color = req.body.color;
      }
      if (req.body.model) {
        bike.model = req.body.model;
      }
      if (req.body.image) {
        bike.image = req.body.image;
      }
      if (req.body.isAvailable!=undefined) {
        bike.isAvailable = req.body.isAvailable;
      }
      if (req.body.location) {
        bike.location = req.body.location;
      }
      const updatedBike = await Bike.updateOne(
        { _id: req.params.id },
        { $set: { ...bike } }
      );
      return res.status(201).send({ message: "bike updated success" });
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }
);
router.delete(
  "/:id",
  authMiddleware,
  (req, res, next) => {
    roleMiddleware(req, res, next, "manager");
  },
  async (req, res) => {
    try {
      const bike = await Bike.findOne({ _id: req.params.id });
      if (!bike) {
        return res.status(404).send({ message: "bike not found" });
      }
      const deleteBike = await Bike.deleteOne({ _id: req.params.id });
      return res.status(200).send({ message: "delete bike success" });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }
);
module.exports = router;
