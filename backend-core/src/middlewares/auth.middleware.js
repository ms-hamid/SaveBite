/**
 * @file src/middlewares/auth.middleware.js
 * @description JWT authentication guard.
 *
 * Extracts Bearer token from Authorization header, verifies it,
 * and attaches the decoded payload to `req.user`.
 *
 * Usage:
 *   router.get('/protected', authenticate, handler);
 */

import { verify_token } from "../lib/jwt.js";

/**
 * Express middleware — verifies JWT and populates req.user.
 * Returns 401 if the token is missing or invalid/expired.
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Missing or malformed Authorization header",
    });
  }

  const token = authHeader.slice(7); // Strip "Bearer "

  try {
    const decoded = verify_token(token);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    // Distinguish between expired and genuinely invalid tokens
    const message =
      err.name === "TokenExpiredError"
        ? "Token has expired — please log in again"
        : "Invalid token";

    return res.status(401).json({ error: "Unauthorized", message });
  }
}
