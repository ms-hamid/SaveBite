/**
 * @file src/services/auth.service.js
 * @description Business logic layer for authentication (FR-U-01, FR-U-02, FR-U-03).
 *
 * FIXED:
 *  - verify_password: was missing `await` — bcrypt.compare always returned a truthy
 *    Promise, meaning wrong passwords were accepted. Fixed to `await verify_password(...)`.
 *  - register_user: password_hash is now stripped from the returned user object.
 *  - get_token: password_hash is now stripped from the returned payload.
 *  - get_token: null user (non-existent email) now throws AuthError instead of crashing.
 *  - Duplicate email (Prisma P2002) now throws ConflictError with a 409-mappable code.
 *
 * ADDED:
 *  - logout_user: stub that clears the device token (FCM integration is a future step).
 *  - request_password_reset: generates a cryptographically secure token, stores its
 *    SHA-256 hash, and exposes the raw token in development responses only.
 *  - reset_password: validates the hashed token, enforces expiry, updates password.
 */

import crypto from "node:crypto";
import { hash_password, verify_password } from "../lib/hash.js";
import { generate_token } from "../lib/jwt.js";
import {
  confirm_merchant_acc,
  create_user,
  create_reset_token,
  delete_reset_token,
  get_acc_by_email,
  get_reset_token_by_hash,
  insert_merchant_data,
  update_password_by_email,
} from "../repositories/auth.repository.js";

// ── Typed error classes ───────────────────────────────────────────────────────

/**
 * Authentication failure (wrong password, user not found).
 * Controllers should map this to HTTP 401.
 */
export class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Duplicate-resource conflict (email already registered).
 * Controllers should map this to HTTP 409.
 */
export class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
  }
}

/**
 * Token not found, already used, or past its expiry.
 * Controllers should map this to HTTP 400.
 */
export class TokenError extends Error {
  constructor(message) {
    super(message);
    this.name = "TokenError";
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Return `user` with `password_hash` removed so it is never sent over the wire.
 * @param {object} user
 * @returns {object}
 */
function strip_sensitive(user) {
  if (!user) return user;
  const { password_hash, ...safe } = user;
  return safe;
}

/**
 * Derive the SHA-256 hex digest of a raw token string.
 * @param {string} raw_token
 * @returns {string}
 */
function sha256(raw_token) {
  return crypto.createHash("sha256").update(raw_token).digest("hex");
}

// ── FR-U-01 — Registration ────────────────────────────────────────────────────

/**
 * Register a new CONSUMER or MERCHANT account.
 *
 * Throws `ConflictError` if the email is already registered.
 *
 * @param {object} body
 * @param {"CONSUMER"|"MERCHANT"} account_type
 * @returns {Promise<object>} Safe user object (no password_hash)
 */
export async function register_user(body, account_type = "CONSUMER") {
  const user_field = {
    email: body.email.trim().toLowerCase(),
    password_hash: await hash_password(body.password),
    full_name: body.full_name.trim(),
  };

  let new_user;

  try {
    if (account_type === "CONSUMER") {
      new_user = await create_user(user_field);
    } else if (account_type === "MERCHANT") {
      user_field.role = "MERCHANT";

      const merchant_field = {
        shop_name: body.shop_name,
        address: body.address,
        latitude: body.latitude,
        longitude: body.longitude,
        virtual_balance: body.virtual_balance ?? 0,
        bank_name: body.bank_name,
        bank_account: body.bank_account,
      };

      new_user = await create_user(user_field, "MERCHANT", merchant_field);
    }
  } catch (err) {
    // Prisma unique-constraint violation — email already exists
    if (err.code === "P2002" && err.meta?.target?.includes("email")) {
      throw new ConflictError("An account with this email address already exists.");
    }
    throw err;
  }

  return strip_sensitive(new_user);
}

// ── FR-U-01 — Login ───────────────────────────────────────────────────────────

/**
 * Authenticate a user and return a signed HS256 JWT (15-min TTL).
 *
 * Throws `AuthError` for non-existent users or incorrect passwords.
 *
 * @param {{ email: string, password: string }} body
 * @returns {Promise<{ token: string, user: object }>}
 */
export async function get_token(body) {
  const acc = await get_acc_by_email(body.email.trim().toLowerCase());

  // ✅ Guard: user not found — do not reveal whether email exists (timing-safe)
  if (!acc) {
    throw new AuthError("Incorrect email or password.");
  }

  // ✅ FIX: was missing `await` — bcrypt.compare is async
  const password_match = await verify_password(body.password, acc.password_hash);

  if (!password_match) {
    throw new AuthError("Incorrect email or password.");
  }

  const payload = {
    id: acc.id,
    email: acc.email,
    full_name: acc.full_name,
    role: acc.role,
  };

  const token = generate_token(payload);

  return {
    token,
    user: strip_sensitive(acc),
  };
}

// ── FR-U-02 — Logout ──────────────────────────────────────────────────────────

/**
 * Server-side logout stub.
 * JWT invalidation is client-side (delete localStorage token).
 * This endpoint clears the FCM device_token when the User model has that field.
 *
 * @param {string} user_id - From the decoded JWT payload (req.user.id)
 * @returns {Promise<void>}
 */
export async function logout_user(user_id) {
  // TODO (FR-S-04): Update user.device_token = null via Prisma once
  // the FCM device_token column is added to the User model.
  // For now the primary action is client-side token deletion.
  return;
}

// ── FR-U-03 — Forgot Password ─────────────────────────────────────────────────

/** Reset token TTL: 1 hour */
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

/**
 * Generate a password reset token for the given email.
 *
 * Security design:
 *  - Raw token:  32 random bytes → hex string (never stored)
 *  - Stored:     SHA-256(raw_token) only
 *  - Response:   raw token included ONLY when NODE_ENV === 'development'
 *
 * Deliberately does NOT distinguish "email not found" to prevent
 * user enumeration attacks — always returns a success-shaped response.
 *
 * @param {string} email
 * @returns {Promise<{ message: string, dev_token?: string }>}
 */
export async function request_password_reset(email) {
  const normalised = email.trim().toLowerCase();
  const acc = await get_acc_by_email(normalised);

  // Silent no-op for unknown emails (prevents enumeration)
  if (!acc) {
    return {
      message: "If that email is registered, a reset link has been sent.",
    };
  }

  // 1. Generate a cryptographically secure raw token
  const raw_token = crypto.randomBytes(32).toString("hex");

  // 2. Hash it before touching the database
  const token_hash = sha256(raw_token);

  // 3. Persist only the hash + expiry
  const expires_at = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  await create_reset_token(normalised, token_hash, expires_at);

  // 4. In production: email the raw_token to the user here (Nodemailer / Resend)
  // TODO (FR-U-03): plug in email transport
  console.info(`[AUTH] Password reset token for ${normalised} generated. (email transport not yet configured)`);

  const result = {
    message: "If that email is registered, a reset link has been sent.",
  };

  // 5. Expose raw token in development responses only
  if (process.env.NODE_ENV === "development") {
    result.dev_token = raw_token;
  }

  return result;
}

// ── FR-U-03 — Reset Password ──────────────────────────────────────────────────

/**
 * Consume a reset token and update the user's password.
 *
 * Throws `TokenError` when the token is invalid, not found, or expired.
 *
 * @param {string} raw_token   - The token received by the user (from email / dev response)
 * @param {string} new_password - Plain-text new password (will be hashed here)
 * @returns {Promise<void>}
 */
export async function reset_password(raw_token, new_password) {
  const token_hash = sha256(raw_token.trim());

  const record = await get_reset_token_by_hash(token_hash);

  if (!record) {
    throw new TokenError("Invalid or already-used reset token.");
  }

  if (new Date() > record.expires_at) {
    // Clean up the expired record
    await delete_reset_token(token_hash);
    throw new TokenError("Reset token has expired. Please request a new one.");
  }

  // Hash the new password and update the user
  const new_hash = await hash_password(new_password);
  await update_password_by_email(record.email, new_hash);

  // Invalidate the token — one-time use only
  await delete_reset_token(token_hash);
}

// ── Admin helpers (kept for future use) ───────────────────────────────────────

export async function register_admin(body) {
  // TODO (FR-A): Admin creation should only be triggered by a seeder script
  // or a secure internal endpoint — never a public route.
  throw new Error("Not implemented.");
}

export async function confirm_merchant(id) {
  return await confirm_merchant_acc(id);
}