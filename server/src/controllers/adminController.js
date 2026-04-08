const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const { isValidEmail, normalizeEmail } = require("../utils/validators");

const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const admin = await Admin.findOne({ email: normalizeEmail(email) });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await admin.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { adminId: admin._id, email: admin.email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    return res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  loginAdmin
};
