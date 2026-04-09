
const app = require("../server/src/app");
const connectDB = require("../server/src/config/db");

// Vercel Serverless Function entry point
module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Vercel Function Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
