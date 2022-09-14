const joi = require("joi");
const bikeValidationSchema = joi.object({
  model: joi.string().trim().min(3).required(),
  color: joi.string().trim().min(3).max(10).required(),
  isAvailable: joi.boolean().default(true),
  image: joi.string().trim().min(5).required(),
  location: joi.string().trim().min(3).max(10).required(),
});
const bikeUpdateValidationSchema = joi.object({
  model: joi.string().trim().min(3),
  color: joi.string().trim().min(3).max(10),
  isAvailable: joi.boolean(),
  image: joi.string().trim().min(5),
  location: joi.string().trim().min(3).max(10),
});

const bikeValidation = (req, res, next) => {
  const { value, error } = bikeValidationSchema.validate({
    model: req.body.model,
    color: req.body.color,
    isAvailable: req.body.isAvailable,
    image: req.body.image,
    location: req.body.location,
  });
  if (error) {
    return res.status(406).send({ message: error.message });
  } else {
    req.body.model = value.model;
    req.body.color = value.color;
    req.body.isAvailable = value.isAvailable;
    req.body.image = value.image;
    req.body.location = value.location;
    next();
  }
};
const bikeUpdateValidation = (req, res, next) => {
  const { value, error } = bikeUpdateValidationSchema.validate({
    model: req.body.model,
    color: req.body.color,
    isAvailable: req.body.isAvailable,
    image: req.body.image,
    location: req.body.location,
  });
  if (error) {
    return res.status(406).send({ message: error.message });
  } else {
    req.body.model = value.model;
    req.body.color = value.color;
    req.body.isAvailable = value.isAvailable;
    req.body.image = value.image;
    req.body.location = value.location;
    next();
  }
};

module.exports = { bikeValidation ,bikeUpdateValidation};
