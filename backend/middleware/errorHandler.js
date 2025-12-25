const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(`Error in ${req.method} ${req.path}: ${err.message}`, {
    error: err.stack,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  // Default error
  let statusCode = 500;
  let message = "Internal Server Error";

  // MySQL duplicate entry error
  if (err.code === "ER_DUP_ENTRY") {
    statusCode = 400;
    message = "Duplicate entry. Resource already exists.";
  }

  // MySQL foreign key constraint error
  if (err.code === "ER_NO_REFERENCED_ROW_2") {
    statusCode = 400;
    message = "Invalid reference. Related resource does not exist.";
  }

  // MySQL connection error
  if (err.code === "ER_ACCESS_DENIED_ERROR") {
    statusCode = 500;
    message = "Database connection error";
  }

  // Validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // Custom app errors
  if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).json({
    status: "error",
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      error: err,
    }),
  });
};

module.exports = errorHandler;
