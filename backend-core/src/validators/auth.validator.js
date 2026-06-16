/**
 * @file src/validators/auth.validator.js
 * @description Request body validation middleware for all /auth routes.
 *
 * Returns 400 Bad Request with a structured `{ error, fields }` body
 * before any business logic executes.
 *
 * Deliberately lightweight — uses plain JS rather than a schema library
 * so that no additional runtime dependencies are needed.
 */

// ── Helpers ───────────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Send a 400 response with a list of field-level validation messages.
 * @param {import('express').Response} res
 * @param {Array<{field: string, message: string}>} fields
 */
function fail(res, fields) {
  return res.status(400).json({
    error: "Validation Error",
    message: "One or more fields failed validation.",
    fields,
  });
}

// ── Middleware exports ─────────────────────────────────────────────────────────

/**
 * Validates POST /auth/reg and POST /auth/merch_reg request bodies.
 * Required: email, password, full_name
 * Password must be at least 8 characters with mixed case and a digit.
 */
export function validate_register(req, res, next) {
  const { email, password, full_name } = req.body ?? {};
  const errors = [];

  if (!full_name || typeof full_name !== "string" || !full_name.trim()) {
    errors.push({ field: "full_name", message: "Full name is required." });
  }

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    errors.push({ field: "email", message: "A valid email address is required." });
  }

  if (!password || typeof password !== "string") {
    errors.push({ field: "password", message: "Password is required." });
  } else if (password.length < 8) {
    errors.push({ field: "password", message: "Password must be at least 8 characters." });
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    errors.push({
      field: "password",
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one digit.",
    });
  }

  if (errors.length) return fail(res, errors);
  next();
}

/**
 * Validates POST /auth/login request body.
 * Required: email (valid format), password (non-empty).
 */
export function validate_login(req, res, next) {
  const { email, password } = req.body ?? {};
  const errors = [];

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    errors.push({ field: "email", message: "A valid email address is required." });
  }

  if (!password || typeof password !== "string" || !password.trim()) {
    errors.push({ field: "password", message: "Password is required." });
  }

  if (errors.length) return fail(res, errors);
  next();
}

/**
 * Validates POST /auth/forgot-password request body.
 * Required: email (valid format).
 */
export function validate_forgot_password(req, res, next) {
  const { email } = req.body ?? {};
  const errors = [];

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    errors.push({ field: "email", message: "A valid email address is required." });
  }

  if (errors.length) return fail(res, errors);
  next();
}

/**
 * Validates POST /auth/reset-password request body.
 * Required: token (non-empty), new_password (strength rules).
 */
export function validate_reset_password(req, res, next) {
  const { token, new_password } = req.body ?? {};
  const errors = [];

  if (!token || typeof token !== "string" || !token.trim()) {
    errors.push({ field: "token", message: "Reset token is required." });
  }

  if (!new_password || typeof new_password !== "string") {
    errors.push({ field: "new_password", message: "New password is required." });
  } else if (new_password.length < 8) {
    errors.push({ field: "new_password", message: "Password must be at least 8 characters." });
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(new_password)) {
    errors.push({
      field: "new_password",
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one digit.",
    });
  }

  if (errors.length) return fail(res, errors);
  next();
}
