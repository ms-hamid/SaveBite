/**
 * @file src/lib/hash.js
 * @description bcrypt password hashing helpers.
 *
 * Cost factor: 12 rounds — OWASP 2023 minimum recommendation.
 * Higher rounds increase security but also CPU cost on auth servers.
 * For UMKM-scale (< 10k users), bcrypt is appropriate. At 100k+ req/s,
 * consider Argon2id (winner of Password Hashing Competition 2015).
 */

import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

/**
 * Hash a plain-text password.
 * @param {string} password - raw password from user
 * @returns {Promise<string>} bcrypt hash
 */
export async function hash_password(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plain-text password against a bcrypt hash.
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export async function verify_password(password, hash) {
  return bcrypt.compare(password, hash);
}
