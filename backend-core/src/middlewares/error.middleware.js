/**
 * @file src/middlewares/error.middleware.js
 * @description Centralised async error handler.
 *
 * All async route handlers should be wrapped with asyncHandler() so that
 * thrown errors are forwarded to this middleware instead of crashing the
 * process with an UnhandledPromiseRejection.
 *
 * Usage:
 *   // In route file:
 *   router.post('/orders', authenticate, asyncHandler(create_order));
 *
 *   // In app bootstrap (MUST be last middleware):
 *   app.use(globalErrorHandler);
 */

/**
 * Wraps an async Express handler so that any thrown error is passed to next().
 * @param {Function} fn - async (req, res, next) => void
 * @returns {Function} Express-compatible handler
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Global error handler middleware.
 * Must be registered with app.use() AFTER all routes.
 *
 * Distinguishes between operational errors (safe to expose message)
 * and programmer errors (log stack, return generic 500).
 */
export function globalErrorHandler(err, req, res, next) {
  // Log every error server-side (replace with Winston/Sentry in production)
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message, err.stack);

  // Prisma unique constraint violation (e.g. duplicate email)
  if (err.code === "P2002") {
    return res.status(409).json({
      error: "Conflict",
      message: `A record with this ${err.meta?.target?.join(", ")} already exists`,
    });
  }

  // Prisma record not found
  if (err.code === "P2025") {
    return res.status(404).json({ error: "Not Found", message: err.meta?.cause });
  }

  // Custom operational errors thrown with a status property
  if (err.statusCode) {
    return res.status(err.statusCode).json({ error: err.name, message: err.message });
  }

  // Default: Internal Server Error — never expose stack in production
  const message =
    process.env.NODE_ENV === "development" ? err.message : "Internal Server Error";

  return res.status(500).json({ error: "Internal Server Error", message });
}

/**
 * Creates an operational error with a custom HTTP status code.
 * @param {string} message
 * @param {number} statusCode
 */
export function createError(message, statusCode = 500) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}
