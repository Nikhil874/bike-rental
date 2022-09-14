const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const authMiddleware = async (req, res, next) => {
  const token = req.headers.jwt;

  if (!token) {
    return res.status(403).send({ message: "Forbidden Request" });
  }
  const decoded = jwt.verify(token, "secret");

  if (!decoded) {
    return res.status(403).send({ message: "Forbidden Request" });
  }
  const userId = decoded.data.id;
  const user = await User.findOne({ _id: userId }).lean().exec();
  if (!user) {
    return res.status(403).send({ message: "Forbidden Request" });
  }

  req.body.authUser = user;
  next();
};

module.exports = authMiddleware;
