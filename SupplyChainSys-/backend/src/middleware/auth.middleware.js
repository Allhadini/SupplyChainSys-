const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * JWT authentication middleware.
 *
 * Expects:  Authorization: Bearer <token>
 *
 * On success, attaches decoded payload to `req.user` and continues.
 * On failure, returns 401 with a JSON error body.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn(`Auth failed — missing or malformed header [${req.method} ${req.originalUrl}]`);
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Provide a valid Bearer token.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn(`Auth failed — invalid token [${req.method} ${req.originalUrl}]: ${error.message}`);
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token.',
    });
  }
};

/**
 * Helper to generate a signed JWT for testing / login flows.
 */
const generateToken = (payload, expiresIn) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiresIn || process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = { authMiddleware, generateToken };
