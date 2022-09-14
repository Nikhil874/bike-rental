const joi = require("joi");
const validataion = joi.object({
  name: joi.string().trim().min(3).required(),
  email: joi
    .string()
    .trim()
    .email({ tlds: { allow: false } })
    .required(),
  password: joi.string().min(6).required(),
  role: joi.string().valid("manager", "regular").default("regular"),
});
const loginValidataion = joi.object({
  email: joi
    .string()
    .trim()
    .email({ tlds: { allow: false } })
    .required(),
  password: joi.string().min(6).required(),
});

const updateValidation = joi.object({
  name: joi.string().trim().min(3),
  email: joi
    .string()
    .trim()
    .email({ tlds: { allow: false } }),
  role: joi.string().valid("manager", "regular"),
});

const userValidation = async (req, res, next) => {
  const payload = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  };

  const { error, value } = validataion.validate({
    ...payload,
  });
  if (error) {
    return res.status(406).send({ message: error.message });
  } else {
    req.body.name = value.name;
    req.body.email = value.email;
    req.body.password = value.password;
    req.body.role = value.role;
    next();
  }
};

const userLoginValidation = async (req, res, next) => {
  const payload = {
    email: req.body.email,
    password: req.body.password,
  };

  const { error, value } = loginValidataion.validate({
    ...payload,
  });
  if (error) {
   return  res.status(406).send({ message: error.message });
  } else {
    req.body.email = value.email;
    req.body.password = value.password;

    next();
  }
};
const userUpdateValidation = async (req, res, next) => {
  const payload = {
    name: req.body.name,
    email: req.body.email,

    role: req.body.role,
  };

  const { error, value } = updateValidation.validate({
    ...payload,
  });
  if (error) {
    return res.status(406).send({ message: error.message });
  } else {
    req.body.name = value.name;
    req.body.email = value.email;

    req.body.role = value.role;
    next();
  }
};
module.exports = { userValidation, userLoginValidation, userUpdateValidation };
