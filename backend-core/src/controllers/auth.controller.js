/**
 * @file src/controllers/auth.controller.js
 * @description HTTP request handlers for /auth routes.
 *              This is the thin layer — all business logic lives in auth.service.js.
 *
 * Error mapping:
 *  AuthError     → 401 Unauthorized
 *  ConflictError → 409 Conflict
 *  TokenError    → 400 Bad Request
 *  ValidationErr → 400 (handled by validator middleware upstream)
 *  All others    → 500 Internal Server Error (no details leaked)
 *
 * Security:
 *  - password_hash is never included in any response (stripped in service layer).
 *  - Error messages do not distinguish "user not found" from "wrong password"
 *    to prevent user enumeration.
 */

import {
  AuthError,
  ConflictError,
  TokenError,
  get_token,
  logout_user,
  register_user,
  request_password_reset,
  reset_password,
} from "../services/auth.service.js";

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Map a service-layer typed error to the appropriate HTTP status code.
 * @param {Error} err
 * @returns {number}
 */
function error_status(err) {
  if (err instanceof AuthError) return 401;
  if (err instanceof ConflictError) return 409;
  if (err instanceof TokenError) return 400;
  return 500;
}

// ── FR-U-01 — Consumer registration ──────────────────────────────────────────

/**
 * POST /auth/reg
 * Registers a new CONSUMER account.
 * Responds 201 on success, 409 on duplicate email.
 */
export async function register(req, res) {
  try {
    const new_user = await register_user(req.body);

    return res.status(201).json({
      message: "Account created successfully.",
      user: new_user, // password_hash already stripped in service
    });
  } catch (err) {
    const status = error_status(err);
    if (status === 500) console.error("[register]", err);
    return res.status(status).json({
      error: err.name,
      message: err.message,
    });
  }
}

// ── FR-U-01 — Merchant registration ──────────────────────────────────────────

/**
 * POST /auth/merch_reg
 * Registers a new MERCHANT account (with merchant profile).
 * Responds 201 on success, 409 on duplicate email.
 */
export async function merchant_register(req, res) {
  try {
    const new_user = await register_user(req.body, "MERCHANT");

    return res.status(201).json({
      message: "Merchant account created successfully.",
      user: new_user, // password_hash already stripped in service
    });
  } catch (err) {
    const status = error_status(err);
    if (status === 500) console.error("[merchant_register]", err);
    return res.status(status).json({
      error: err.name,
      message: err.message,
    });
  }
}

// ── FR-U-01 — Login ───────────────────────────────────────────────────────────

/**
 * POST /auth/login
 * Authenticates credentials and returns a signed JWT.
 * Responds 200 on success, 401 on invalid credentials.
 */
export async function login(req, res) {
  try {
    const { token, user } = await get_token(req.body);

    return res.status(200).json({
      message: "Login successful.",
      token, // HS256 JWT — store as sb_access_token (ADR-002)
      user,  // Safe user object (no password_hash)
    });
  } catch (err) {
    const status = error_status(err);
    if (status === 500) console.error("[login]", err);
    return res.status(status).json({
      error: err.name,
      message: err.message,
    });
  }
}

// ── FR-U-02 — Logout ──────────────────────────────────────────────────────────

/**
 * POST /auth/logout
 * Server-side logout: clears device_token (FCM stub).
 * The client must delete the sb_access_token from localStorage.
 * Requires valid JWT Bearer token (authenticate middleware).
 */
export async function logout(req, res) {
  try {
    await logout_user(req.user.id);

    return res.status(200).json({
      message: "Logged out successfully. Please clear your local token.",
    });
  } catch (err) {
    console.error("[logout]", err);
    return res.status(500).json({
      error: "InternalError",
      message: "An unexpected error occurred during logout.",
    });
  }
}

// ── FR-U-03 — Forgot password ─────────────────────────────────────────────────

/**
 * POST /auth/forgot-password
 * Generates a reset token (hashed in DB) and sends it via email.
 * Always responds 200 regardless of whether the email exists (prevents enumeration).
 */
export async function forgot_password(req, res) {
  try {
    const result = await request_password_reset(req.body.email);

    return res.status(200).json(result);
  } catch (err) {
    // Deliberately broad catch — we must not leak "email not found"
    console.error("[forgot_password]", err);
    return res.status(200).json({
      message: "If that email is registered, a reset link has been sent.",
    });
  }
}

// ── FR-U-03 — Reset password ──────────────────────────────────────────────────

/**
 * POST /auth/reset-password
 * Validates the reset token and updates the user's password.
 * Responds 400 on invalid/expired token, 200 on success.
 */
export async function reset_password_handler(req, res) {
  try {
    await reset_password(req.body.token, req.body.new_password);

    return res.status(200).json({
      message: "Password has been reset successfully. Please log in with your new password.",
    });
  } catch (err) {
    const status = error_status(err);
    if (status === 500) console.error("[reset_password]", err);
    return res.status(status).json({
      error: err.name,
      message: err.message,
    });
  }
}