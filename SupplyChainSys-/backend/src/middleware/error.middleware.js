const logger = require('../utils/logger');

/**
 * Centralised error-handling middleware.
 *
 * Express recognises a middleware with 4 params as an error handler.
 * Every unhandled throw / next(err) ends up here.
 */
// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, _next) => {
  // Default to 500 if no status was set
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log full stack for server errors; message-only for client errors
  if (statusCode >= 500) {
    logger.error(`[${req.method} ${req.originalUrl}] ${statusCode} — ${err.stack || message}`);
  } else {
    logger.warn(`[${req.method} ${req.originalUrl}] ${statusCode} — ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * Custom operational error class.
 * Throw this in services to set a specific HTTP status code.
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { errorMiddleware, AppError };
