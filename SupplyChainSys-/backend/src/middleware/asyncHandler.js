/**
 * Wraps an async Express handler so thrown errors are forwarded to
 * the centralised error middleware instead of crashing the process.
 *
 * Usage:
 *   router.get('/path', asyncHandler(myController));
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
