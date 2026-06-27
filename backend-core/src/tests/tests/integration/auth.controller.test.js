/**
 * @file tests/integration/auth.controller.test.js
 * @description Integration tests for auth.controller.js via HTTP routes.
 * Mocks service layer — tests HTTP concerns only (status, body shape, cookies).
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";
import { CUSTOMER_ID } from "../unit/mocks/mockData.js";

// ── Mock service ──────────────────────────────────────────────────────────────
vi.mock("../../src/services/auth.service.js", () => ({
  completeRegister: vi.fn(),
  register_user: vi.fn(),
  get_token: vi.fn(),
  forgot_password_service: vi.fn(),
  verify_reset_otp_service: vi.fn(),
  reset_password_service: vi.fn(),
}));

vi.mock("../../src/lib/supabase.js", () => ({
  supabase: {},
}));

import * as authService from "../../src/services/auth.service.js";
import {
  register,
  login,
  logout,
  forgot_password,
  verify_reset_otp,
  reset_password,
} from "../../src/controllers/auth.controller.js";
import { serializeBigInt } from "../../src/utils/json.js";

// ── Minimal Express app ───────────────────────────────────────────────────────
function buildApp() {
  const app = express();
  app.use(express.json());
  app.post("/auth/reg", register);
  app.post("/auth/login", login);
  app.post("/auth/logout", logout);
  app.post("/auth/forgot-password", forgot_password);
  app.post("/auth/verify-reset-otp", verify_reset_otp);
  app.post("/auth/reset-password", reset_password);
  return app;
}

// ─────────────────────────────────────────────────────────────────────────────
describe("POST /auth/reg", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 201 on successful registration", async () => {
    authService.completeRegister.mockResolvedValue({
      user_id: CUSTOMER_ID,
      full_name: "Budi",
    });

    const res = await request(buildApp())
      .post("/auth/reg")
      .send({ user_id: CUSTOMER_ID, full_name: "Budi", role: "CUSTOMER" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user_id).toBe(CUSTOMER_ID);
  });

  it("returns 400 when service throws", async () => {
    authService.completeRegister.mockRejectedValue(new Error("Role tidak valid"));

    const res = await request(buildApp())
      .post("/auth/reg")
      .send({ user_id: CUSTOMER_ID, role: "INVALID" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("Role tidak valid");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("POST /auth/login", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 with token and sets cookie", async () => {
    authService.get_token.mockResolvedValue({
      token: "mock.jwt.token",
      role: "CUSTOMER",
    });

    const res = await request(buildApp())
      .post("/auth/login")
      .send({ email: "customer@example.com", password: "Password123!" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBe("mock.jwt.token");
    expect(res.body.role).toBe("CUSTOMER");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("returns 500 on invalid credentials", async () => {
    authService.get_token.mockRejectedValue(new Error("Incorrect Username or Password!"));

    const res = await request(buildApp())
      .post("/auth/login")
      .send({ email: "wrong@example.com", password: "badpw" });

    expect(res.status).toBe(500);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("POST /auth/logout", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 and clears cookie", async () => {
    const res = await request(buildApp()).post("/auth/logout");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain("Logout");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("POST /auth/forgot-password", () => {
  beforeEach(() => vi.clearAllMocks());

  it("always returns 200 regardless of email existence", async () => {
    authService.forgot_password_service.mockResolvedValue({ success: true });

    const res = await request(buildApp())
      .post("/auth/forgot-password")
      .send({ email: "anyone@example.com" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("returns 200 even when service throws (anti-enumeration)", async () => {
    authService.forgot_password_service.mockRejectedValue(new Error("Internal"));

    const res = await request(buildApp())
      .post("/auth/forgot-password")
      .send({ email: "ghost@example.com" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("POST /auth/verify-reset-otp", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 with resetToken on valid OTP", async () => {
    authService.verify_reset_otp_service.mockResolvedValue({
      success: true,
      resetToken: "mock.reset.token",
      message: "OTP verified successfully",
    });

    const res = await request(buildApp())
      .post("/auth/verify-reset-otp")
      .send({ email: "customer@example.com", otp: "123456" });

    expect(res.status).toBe(200);
    expect(res.body.resetToken).toBe("mock.reset.token");
  });

  it("returns 400 when email or otp is missing", async () => {
    const res = await request(buildApp())
      .post("/auth/verify-reset-otp")
      .send({ email: "customer@example.com" }); // missing otp

    expect(res.status).toBe(400);
  });

  it("returns 401 when OTP is invalid", async () => {
    authService.verify_reset_otp_service.mockRejectedValue(
      new Error("OTP invalid atau expired")
    );

    const res = await request(buildApp())
      .post("/auth/verify-reset-otp")
      .send({ email: "customer@example.com", otp: "000000" });

    expect(res.status).toBe(401);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("POST /auth/reset-password", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 on successful password reset", async () => {
    authService.reset_password_service.mockResolvedValue({
      success: true,
      message: "Password reset successfully. Please log in with your new password",
    });

    const res = await request(buildApp())
      .post("/auth/reset-password")
      .send({
        resetToken: "mock.reset.token",
        password: "NewPassword123!",
        confirmPassword: "NewPassword123!",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await request(buildApp())
      .post("/auth/reset-password")
      .send({ resetToken: "token" }); // missing password + confirmPassword

    expect(res.status).toBe(400);
  });

  it("returns 401 when token is invalid or expired", async () => {
    authService.reset_password_service.mockRejectedValue(
      new Error("Token invalid atau expired")
    );

    const res = await request(buildApp())
      .post("/auth/reset-password")
      .send({
        resetToken: "bad.token",
        password: "NewPw!",
        confirmPassword: "NewPw!",
      });

    expect(res.status).toBe(401);
  });
});
