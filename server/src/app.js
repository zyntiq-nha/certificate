const express = require("express");
const cors = require("cors");
// adminRoutes removed
const internRoutes = require("./routes/internRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const errorHandler = require("./middlewares/errorHandler");
const { rateLimit, setSecurityHeaders } = require("./middlewares/security");

const app = express();
app.set("trust proxy", 1);

const publicApiBase = process.env.PUBLIC_API_BASE || "/api";
const adminApiBase = process.env.ADMIN_API_BASE || "/admin-api";

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
app.get("/ready", (req, res) => {
  const mongoose = require("mongoose");
  const isConnected = mongoose.connection.readyState === 1;
  if (!isConnected) {
    return res.status(503).json({ status: "degraded", db: "disconnected" });
  }
  return res.json({ status: "ok", db: "connected" });
});

// app.use("/api/admin", adminRoutes) removed
app.use(`${adminApiBase}/interns`, internRoutes);
app.use(publicApiBase, certificateRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

module.exports = app;
