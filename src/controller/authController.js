const jwt = require("jsonwebtoken");
const express = require("express");
const User = require("../model/userModel");
const {
  userValidation,
  userLoginValidation,
  userUpdateValidation,
} = require("../joi-schema/userJoiSchema");
const authMiddleware = require("../helpers/auth.middleware");
const roleMiddleware = require("../helpers/role.middleware");
const router = express.Router();
const newToken = (data) => {
  return jwt.sign({ data }, "secret");
};
router.get(
  "/check",
  authMiddleware,
  (req, res, next) => {
    roleMiddleware(req, res, next, "manager");
  },
  async (req, res) => {
    try {
      res.send({ message: "hi there !" });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

router.get(
  "",
  authMiddleware,
  (req, res, next) => {
    roleMiddleware(req, res, next, "manager");
  },
  async (req, res) => {
    try {
      let count = await User.find({}).count();

      let page;
      if (req.query.page) {
        page = req.query.page;
      } else {
        page = 1;
      }
      limit = 6;
      let users = await User.find({}, { password: 0 })
        .limit(6)
        .skip((page - 1) * 6)
        .lean()
        .exec();

      let pages = Math.ceil(count / 6);

      return res.status(200).send({ users, pages });
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }
);
router.post("/register", userValidation, async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email }).lean().exec();
    if (user) {
      return res.status(400).send({ message: "Email already exists" });
    }
    user = await User.create(req.body);
    return res.status(201).send({ message: "User created success" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});
router.post(
  "/",
  authMiddleware,
  (req, res, next) => {
    roleMiddleware(req, res, next, "manager");
  },
  userValidation,
  async (req, res) => {
    try {
      let user = await User.findOne({ email: req.body.email }).lean().exec();
      if (user) {
        return res.status(400).send({ message: "Email already exists" });
      }
      user = await User.create(req.body);
      res.status(201).send({ message: "User created success" });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);
router.post("/login", userLoginValidation, async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({ message: "User Not Found" });
    }
    const match = user.checkPassword(req.body.password);
    if (!match) return res.status(404).send({ message: "User Not Found" });
    let data = {
      id: user._id,
    };
    const token = newToken(data);
    let userData = {
      id: user._id,
      role: user.role,
    };
    res.send({ userData, token });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.patch(
  "/:id",
  authMiddleware,
  (req, res, next) => {
    roleMiddleware(req, res, next, "manager");
  },
  userUpdateValidation,
  async (req, res) => {
    try {
      let user = await User.findOne({ _id: req.params.id }).lean().exec();
      if (!user) {
        return res.status(404).send({ message: "User Not Found" });
      }
      if (user.email != req.body.email && req.body.email) {
        let checkUser = await User.findOne({ email: req.body.email })
          .lean()
          .exec();
        if (checkUser) {
          return res.status(400).send({ message: "Email already exists" });
        }
      }
      if (req.body.name) {
        user.name = req.body.name;
      }
      if (req.body.email) {
        user.email = req.body.email;
      }
      if (req.body.role) {
        user.role = req.body.role;
      }
      const updatedUser = await User.updateOne(
        { _id: req.params.id },
        { $set: { ...user } }
      );
      res.status(201).send({ message: "User update success" });
    } catch (err) {
      res.status(500).send(err.message);
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
      let user = await User.findOne({ _id: req.params.id }).lean().exec();
      if (!user) {
        return res.status(404).send({ message: "User Not Found" });
      }
      const deletedUser = await User.deleteOne({ _id: req.params.id });
      res.status(200).send({ message: "User delete success" });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

module.exports = router;
