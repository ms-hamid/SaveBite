/**
 * @file src/routes/auth.route.js
 * @description Express Router for all /auth endpoints.
 *
 * Route summary:
 *  POST /auth/reg              — FR-U-01: Consumer registration
 *  POST /auth/merch_reg        — FR-U-01: Merchant registration
 *  POST /auth/login            — FR-U-01: Authenticate + issue JWT
 *  POST /auth/logout           — FR-U-02: Server-side logout (JWT required)
 *  POST /auth/forgot-password  — FR-U-03: Request password reset token
 *  POST /auth/reset-password   — FR-U-03: Consume token + update password
 */

import express from "express";
import { 
    login, 
    merchant_register, 
    register,
    forgot_password,
    verify_reset_otp,
    reset_password,
    logout
} from "../controllers/auth.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import {
  validate_forgot_password,
  validate_login,
  validate_register,
  validate_reset_password,
} from "../validators/auth.validator.js";

const auth_route = express.Router();

// ── FR-U-01 — Registration ────────────────────────────────────────────────────

/** Register a consumer account */
auth_route.post("/reg", validate_register, register);

/** Register a merchant account (same validation — service handles role-specific fields) */
auth_route.post("/merch_reg", validate_register, merchant_register);

// Password reset endpoints
auth_route.post("/forgot-password", (req, res) => {
    forgot_password(req, res);
});

auth_route.post("/verify-reset-otp", (req, res) => {
    verify_reset_otp(req, res);
});

auth_route.post("/reset-password", (req, res) => {
    reset_password(req, res);
});

auth_route.post("/logout", (req, res) => {
    logout(req, res);
})
// ── FR-U-01 — Login ───────────────────────────────────────────────────────────

/** Authenticate and receive a signed JWT */
// auth_route.post("/login", validate_login, login);

// // ── FR-U-02 — Logout ──────────────────────────────────────────────────────────

// /** Invalidate server-side state; client must clear localStorage token */
// auth_route.post("/logout", authenticate, logout);

// // ── FR-U-03 — Forgot / Reset Password ────────────────────────────────────────

// /** Request a password-reset token (emailed in production) */
// auth_route.post("/forgot-password", validate_forgot_password, forgot_password);

// /** Consume the reset token and set a new password */
// auth_route.post("/reset-password", validate_reset_password, reset_password_handler);

export default auth_route;