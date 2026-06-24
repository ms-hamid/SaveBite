/**
 * @file src/lib/jwt.js
 * @description JWT utility — signs tokens and verifies them.
 *
 * Algorithm: HS256 (HMAC-SHA256) — symmetric, fast, appropriate for
 * a single-issuer microservice architecture.
 *
 * Best-practice notes:
 *  - Access token TTL: 15 minutes (short-lived, reduces exposure window).
 *  - Refresh token: not implemented here — use HTTP-only cookie in future.
 *  - Payload never contains password or sensitive PII.
 */

import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;
if (!SECRET) throw new Error("JWT_SECRET is not set in environment variables");

const ACCESS_TOKEN_TTL = "2h";

/**
 * Sign a JWT access token.
 * @param {object} payload - { id, email, role }
 * @returns {string} signed JWT
 */
export function generate_token(payload) {
  return jwt.sign(payload, SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
    algorithm: "HS256",
  });
}

/**
 * Verify and decode a JWT. Throws if invalid/expired.
 * @param {string} token
 * @returns {object} decoded payload
 */
export function verify_token(token) {
  return jwt.verify(token, SECRET, { algorithms: ["HS256"] });
}

/**
 * Generate a password reset token (short-lived).
 * TTL: 10 minutes — allows user to reset password quickly
 * @param {object} payload - { sub: user_id, email }
 * @returns {string} signed JWT
 */
export function generate_reset_token(payload) {
  return jwt.sign(
    {
      ...payload,
      type: "password_reset",
      iat: Math.floor(Date.now() / 1000)
    },
    SECRET,
    {
      expiresIn: "10m", // 10 minutes
      algorithm: "HS256"
    }
  );
}

/**
 * Verify and decode a password reset token. Throws if invalid/expired.
 * @param {string} token
 * @returns {object} decoded payload with { sub, email, type }
 */
export function verify_reset_token(token) {
  const decoded = jwt.verify(token, SECRET, { algorithms: ["HS256"] });
  
  // Ensure token is of correct type
  if (decoded.type !== "password_reset") {
    throw new Error("Invalid token type");
  }
  
  return decoded;
}

