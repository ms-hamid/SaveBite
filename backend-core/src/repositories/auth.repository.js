// import { KYC_Status } from "@prisma/client";
// import { prisma } from "../lib/prisma.js";

import { profile } from "console";
import {prisma} from "../lib/prisma.js";
import crypto from "crypto";



/**
 * @file src/repositories/auth.repository.js
 * @description Data access layer for authentication operations.
 *              All database queries are isolated here — services MUST NOT
 *              import Prisma directly.
 *
 * FIXED:
 *  - create_user: Prisma $transaction callback now returns new_user (was returning undefined)
 *  - create_user: default param typo "CONSUMSER" corrected to "CONSUMER"
 *  - Added: update_password_by_email, create_reset_token, get_reset_token_by_hash, delete_reset_token
 */


// ── User creation ─────────────────────────────────────────────────────────────

/**
 * Create a new user, optionally inside a merchant sub-transaction.
 *
 * @param {object} user_field       - { email, password_hash, full_name, role? }
 * @param {"CONSUMER"|"MERCHANT"}   account_type
 * @param {object} [merchant_field] - Merchant profile fields (when account_type === "MERCHANT")
 * @returns {Promise<object>} The newly created user (without merchant sub-record for CONSUMER)
 */
export async function create_user(user_field, account_type = "CONSUMER", merchant_field = {}) {
  return await prisma.$transaction(async (tx) => {
    const new_user = await tx.user.create({
      data: user_field,
    });

    if (account_type === "MERCHANT") {
      merchant_field.user = {
        connect: { id: new_user.id },
      };

      const merchant_data = await tx.merchant.create({
        data: merchant_field,
      });

      new_user.merchant = merchant_data;
    }

    // ✅ FIX: was missing — transaction returned undefined
    return new_user;
  });
}

// ── Lookups ───────────────────────────────────────────────────────────────────

/**
 * Find a single user by email. Returns null when not found.
 *
 * @param {string} email
 * @returns {Promise<object|null>}
 */
export async function get_acc_by_email(email) {
  return await prisma.authUser.findFirst({
      where: {
      email,
      },
      include: {
      profile: true,
      merchant: true
  },
  });
}
// ── Merchant helpers ──────────────────────────────────────────────────────────

/**
 * Insert a standalone merchant profile row (used in admin flows).
 * @param {object} field
 */
export async function insert_merchant_data(field) {
  return await prisma.merchant.create({ data: field });
}

/**
 * Approve a merchant's KYC — sets kyc_status → APPROVED.
 * @param {string} merchant_id
 */
export async function confirm_merchant_acc(merchant_id) {
    return await prisma.merchant.update({
        data: {
            kyc_status: "APPROVED"
        },
        where: {
            id: merchant_id
        }
    })
}

/**
 * Create password reset token record in database
 * @param {string} email
 * @param {string} tokenHash - hashed token
 * @param {Date} expiresAt - token expiration time
 * @returns {object} created password_resets record
 */
export async function create_password_reset_token(email, tokenHash, expiresAt) {
    return await prisma.password_resets.create({
        data: {
            email,
            token_hash: tokenHash,
            expires_at: expiresAt
        }
    });
}

/**
 * Get valid password reset token by email
 * @param {string} email
 * @returns {object|null} password_resets record if exists and not expired
 */
export async function get_password_reset_token(email) {
    return await prisma.password_resets.findFirst({
        where: {
            email,
            expires_at: { gt: new Date() } // Not expired
        }
    });
}

/**
 * Delete password reset token (invalidate after use)
 * @param {string} email
 * @returns {object} deleted count info
 */
export async function delete_password_reset_token(email) {
    return await prisma.password_resets.deleteMany({
        where: { email }
    });
}

/**
 * Update user password in auth.users table
 * @param {string} email
 * @param {string} hashedPassword - bcryptjs hashed password
 * @returns {object} updated user record
 */
export async function update_user_password(id, hashedPassword) {
    return await prisma.authUser.update({
        where: { id },
        data: {
            encrypted_password: hashedPassword,
            updated_at: new Date()
        }
    });
}

/**
 * Hash token using SHA-256 for storage
 * @param {string} token - plain token
 * @returns {string} hashed token
 */
export function hash_token(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
};

// ── Password reset ────────────────────────────────────────────────────────────

/**
 * Update a user's hashed password. Called after a valid reset token is consumed.
 *
 * @param {string} email
 * @param {string} new_hash - bcrypt hash of the new password
 */
export async function update_password_by_email(email, new_hash) {
  return await prisma.user.update({
    data: { password_hash: new_hash },
    where: { email },
  });
}

/**
 * Persist a password reset token record.
 * IMPORTANT: `token_hash` must be a SHA-256 digest — the raw token is NEVER stored.
 *
 * @param {string} email
 * @param {string} token_hash  - SHA-256 hex of the raw token
 * @param {Date}   expires_at
 */
export async function create_reset_token(email, token_hash, expires_at) {
  // Invalidate any existing tokens for this email before inserting a new one.
  await prisma.passwordReset.deleteMany({ where: { email } });

  return await prisma.passwordReset.create({
    data: { email, token_hash, expires_at },
  });
}

/**
 * Retrieve a PasswordReset record by its hashed token.
 * Returns null when no matching record exists.
 *
 * @param {string} token_hash
 * @returns {Promise<object|null>}
 */
export async function get_reset_token_by_hash(token_hash) {
  return await prisma.passwordReset.findUnique({
    where: { token_hash },
  });
}

/**
 * Delete a consumed or invalidated reset token record.
 * @param {string} token_hash
 */
export async function delete_reset_token(token_hash) {
  return await prisma.passwordReset.delete({
    where: { token_hash },
  });
}