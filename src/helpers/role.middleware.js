const roleMiddleware = (req, res, next, role) => {
  if (req.body.authUser.role != role) {
    return res.status(403).send({ message: "Forbidden Request" });
  }
  next();
};
module.exports = roleMiddleware;
