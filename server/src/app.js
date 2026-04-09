const express = require("express");
const cors = require("cors");
const adminRoutes = require("./routes/adminRoutes");
const internRoutes = require("./routes/internRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const errorHandler = require("./middlewares/errorHandler");
const { rateLimit, setSecurityHeaders } = require("./middlewares/security");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      const isVercel = origin && (origin.endsWith(".vercel.app") || origin.includes("localhost"));
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin) || isVercel) {
        return callback(null, true);
      }
      const error = new Error("CORS blocked for this origin");
      error.statusCode = 403;
      return callback(error);
    }
  })
);
app.use(setSecurityHeaders);
app.use(rateLimit);
app.use(express.json({ limit: "200kb" }));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/admin", adminRoutes);
app.use("/api/interns", internRoutes);
app.use("/api", certificateRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

module.exports = app;
