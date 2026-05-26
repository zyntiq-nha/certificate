const jwt = require("jsonwebtoken");

const requireAdminAuth = (req, res, next) => {
  // Authentication disabled per user request
  // Everyone has admin access for speed of generation
  req.admin = { email: "admin@zyntiq.com" };
  return next();
};

module.exports = {
  requireAdminAuth
};
