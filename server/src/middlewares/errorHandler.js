const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode || (error.name === "ValidationError" ? 400 : 500);
  const message = error.message || "Internal server error";
  const payload = { message };

  if (process.env.NODE_ENV !== "production") {
    payload.error = error.name || "Error";
    payload.stack = error.stack;
  }

  return res.status(statusCode).json(payload);
};

module.exports = errorHandler;
