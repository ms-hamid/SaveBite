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
  const token = req.cookies.sb_access_token;
  console.log(token)

  if (!token) {
    console.log("Token tidak ditemukan")
    return res.status(401).json({
      error: "Unauthorized",
      message: "Missing or malformed Authorization header",
    });
  }

  // const token = token; // Strip "Bearer "

  try {
    console.log(" ditemukan")

    const decoded = verify_token(token);
    console.log(decoded);
    req.user = decoded; // { id, email, role }
    console.log("Decoded")
    next();
  } catch (err) {
    // Distinguish between expired and genuinely invalid tokens
    console.log(err)
    const message =
      err.name === "TokenExpiredError"
        ? "Token has expired — please log in again"
        : "Invalid token";

    res.clearCookie("sb_access_token");
    return res.status(401).json({ error: "Unauthorized", message });
  }
}
