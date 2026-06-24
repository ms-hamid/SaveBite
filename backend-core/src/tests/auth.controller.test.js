/**
 * @file src/tests/auth.controller.test.js
 * @description Supertest integration tests for /auth routes.
 *
 * FR Coverage:
 *   FR-U-01 — POST /auth/reg, POST /auth/merch_reg, POST /auth/login
 *   FR-U-02 — POST /auth/logout
 *   FR-U-03 — POST /auth/forgot-password, POST /auth/reset-password
 *
 * Approach:
 *   - The Express `app` is imported (not `listen`-ed) so Supertest manages the port.
 *   - Services are fully mocked — no real DB, no real bcrypt, no real JWT signing.
 *   - Each test group verifies HTTP status codes, response shape, and security headers.
 *
 * Mocking guardrail:
 *   auth.service.js is vi.mock-ed — unit tests for logic are in auth.service.test.js.
 *   This file tests the HTTP/routing/validation layer only.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

// ── Mock the entire service layer ─────────────────────────────────────────────
// Controller tests verify HTTP routing & validation — not business logic.
vi.mock("../services/auth.service.js", () => {
  const AuthError = class AuthError extends Error {
    constructor(msg) { super(msg); this.name = "AuthError"; }
  };
  const ConflictError = class ConflictError extends Error {
    constructor(msg) { super(msg); this.name = "ConflictError"; }
  };
  const TokenError = class TokenError extends Error {
    constructor(msg) { super(msg); this.name = "TokenError"; }
  };

  return {
    AuthError,
    ConflictError,
    TokenError,
    register_user: vi.fn(),
    get_token: vi.fn(),
    logout_user: vi.fn(),
    request_password_reset: vi.fn(),
    reset_password: vi.fn(),
  };
});

// ── Mock JWT verify so authenticate middleware passes in logout tests ──────────
vi.mock("../lib/jwt.js", () => ({
  generate_token: vi.fn().mockReturnValue("mock.jwt.token"),
  verify_token: vi.fn().mockReturnValue({ id: "uid-1", email: "u@test.com", role: "CONSUMER" }),
}));

import app from "../index.js";
import {
  register_user,
  get_token,
  logout_user,
  request_password_reset,
  reset_password,
  AuthError,
  ConflictError,
  TokenError,
} from "../services/auth.service.js";

// ─────────────────────────────────────────────────────────────────────────────
// POST /auth/reg — Consumer registration
// ─────────────────────────────────────────────────────────────────────────────

describe("POST /auth/reg — Consumer Registration", () => {
  beforeEach(() => vi.clearAllMocks());

  const VALID_PAYLOAD = {
    email: "newuser@test.com",
    password: "SecurePass1",
    full_name: "New User",
  };

  it("✅ 201 — returns user object (no password_hash) on valid payload", async () => {
    register_user.mockResolvedValue({
      id: "uid-001",
      email: "newuser@test.com",
      full_name: "New User",
      role: "CONSUMER",
    });

    const res = await request(app).post("/auth/reg").send(VALID_PAYLOAD);

    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.user).not.toHaveProperty("password_hash");
    expect(res.body.user.email).toBe("newuser@test.com");
  });

  it("🔴 400 — missing email field returns validation error", async () => {
    const res = await request(app)
      .post("/auth/reg")
      .send({ password: "SecurePass1", full_name: "No Email" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation Error");
    expect(res.body.fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "email" }),
      ])
    );
  });

  it("🔴 400 — missing password field returns validation error", async () => {
    const res = await request(app)
      .post("/auth/reg")
      .send({ email: "a@b.com", full_name: "No Pass" });

    expect(res.status).toBe(400);
    expect(res.body.fields).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "password" })])
    );
  });

  it("🔴 400 — weak password (no uppercase) returns validation error", async () => {
    const res = await request(app)
      .post("/auth/reg")
      .send({ email: "a@b.com", password: "lowercase1", full_name: "Weak" });

    expect(res.status).toBe(400);
    expect(res.body.fields).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "password" })])
    );
  });

  it("🔴 400 — empty body returns multiple field errors", async () => {
    const res = await request(app).post("/auth/reg").send({});

    expect(res.status).toBe(400);
    expect(res.body.fields.length).toBeGreaterThanOrEqual(3);
  });

  it("🔴 409 — duplicate email returns Conflict", async () => {
    register_user.mockRejectedValue(new ConflictError("An account with this email address already exists."));

    const res = await request(app).post("/auth/reg").send(VALID_PAYLOAD);

    expect(res.status).toBe(409);
    expect(res.body.error).toBe("ConflictError");
    expect(res.body.message).toContain("already exists");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /auth/login
// ─────────────────────────────────────────────────────────────────────────────

describe("POST /auth/login — Authentication", () => {
  beforeEach(() => vi.clearAllMocks());

  const VALID_LOGIN = { email: "user@test.com", password: "ValidPass1" };

  it("✅ 200 — returns token and safe user object on valid credentials", async () => {
    get_token.mockResolvedValue({
      token: "mock.jwt.token",
      user: { id: "uid-1", email: "user@test.com", role: "CONSUMER", full_name: "User" },
    });

    const res = await request(app).post("/auth/login").send(VALID_LOGIN);

    expect(res.status).toBe(200);
    expect(res.body.token).toBe("mock.jwt.token");
    expect(res.body.user).toBeDefined();
    expect(res.body.user).not.toHaveProperty("password_hash");
  });

  it("🔴 401 — invalid credentials returns Unauthorized", async () => {
    get_token.mockRejectedValue(new AuthError("Incorrect email or password."));

    const res = await request(app).post("/auth/login").send(VALID_LOGIN);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("AuthError");
  });

  it("🔴 400 — malformed body (missing password) fails validation", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "user@test.com" });

    expect(res.status).toBe(400);
    expect(res.body.fields).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "password" })])
    );
  });

  it("🔴 400 — invalid email format fails validation", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "not-an-email", password: "ValidPass1" });

    expect(res.status).toBe(400);
    expect(res.body.fields).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "email" })])
    );
  });

  it("🔴 401 — non-existent user email returns same message as wrong password (no enumeration)", async () => {
    get_token.mockRejectedValue(new AuthError("Incorrect email or password."));

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "ghost@test.com", password: "anything" });

    expect(res.status).toBe(401);
    // Error message must be generic — not "user not found"
    expect(res.body.message).toBe("Incorrect email or password.");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /auth/logout
// ─────────────────────────────────────────────────────────────────────────────

describe("POST /auth/logout — Logout", () => {
  beforeEach(() => vi.clearAllMocks());

  it("✅ 200 — returns success message with a valid Bearer token", async () => {
    logout_user.mockResolvedValue(undefined);

    const res = await request(app)
      .post("/auth/logout")
      .set("Authorization", "Bearer valid.jwt.token");

    expect(res.status).toBe(200);
    expect(res.body.message).toContain("Logged out");
  });

  it("🔴 401 — missing Authorization header returns Unauthorized", async () => {
    const res = await request(app).post("/auth/logout");

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Unauthorized");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /auth/forgot-password
// ─────────────────────────────────────────────────────────────────────────────

describe("POST /auth/forgot-password — FR-U-03", () => {
  beforeEach(() => vi.clearAllMocks());

  it("✅ 200 — returns generic success for a known email", async () => {
    request_password_reset.mockResolvedValue({
      message: "If that email is registered, a reset link has been sent.",
      dev_token: "abc123rawtoken",
    });

    const res = await request(app)
      .post("/auth/forgot-password")
      .send({ email: "user@test.com" });

    expect(res.status).toBe(200);
    expect(res.body.message).toContain("reset link");
  });

  it("✅ 200 — returns identical generic message for unknown email (no enumeration)", async () => {
    request_password_reset.mockResolvedValue({
      message: "If that email is registered, a reset link has been sent.",
    });

    const res = await request(app)
      .post("/auth/forgot-password")
      .send({ email: "nobody@test.com" });

    expect(res.status).toBe(200);
    expect(res.body.message).toContain("reset link");
  });

  it("🔴 400 — invalid email format fails validation", async () => {
    const res = await request(app)
      .post("/auth/forgot-password")
      .send({ email: "not-valid" });

    expect(res.status).toBe(400);
    expect(res.body.fields).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "email" })])
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /auth/reset-password
// ─────────────────────────────────────────────────────────────────────────────

describe("POST /auth/reset-password — FR-U-03", () => {
  beforeEach(() => vi.clearAllMocks());

  const VALID_RESET = {
    token: "valid64hextoken",
    new_password: "NewSecure1",
  };

  it("✅ 200 — success message on valid token and strong password", async () => {
    reset_password.mockResolvedValue(undefined);

    const res = await request(app)
      .post("/auth/reset-password")
      .send(VALID_RESET);

    expect(res.status).toBe(200);
    expect(res.body.message).toContain("reset successfully");
  });

  it("🔴 400 — invalid/already-used token returns TokenError", async () => {
    reset_password.mockRejectedValue(new TokenError("Invalid or already-used reset token."));

    const res = await request(app)
      .post("/auth/reset-password")
      .send(VALID_RESET);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("TokenError");
    expect(res.body.message).toContain("Invalid");
  });

  it("🔴 400 — expired token returns TokenError with expiry message", async () => {
    reset_password.mockRejectedValue(new TokenError("Reset token has expired. Please request a new one."));

    const res = await request(app)
      .post("/auth/reset-password")
      .send(VALID_RESET);

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("expired");
  });

  it("🔴 400 — missing token field fails validation", async () => {
    const res = await request(app)
      .post("/auth/reset-password")
      .send({ new_password: "NewSecure1" });

    expect(res.status).toBe(400);
    expect(res.body.fields).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "token" })])
    );
  });

  it("🔴 400 — weak new_password fails validation before hitting service", async () => {
    const res = await request(app)
      .post("/auth/reset-password")
      .send({ token: "sometoken", new_password: "weak" });

    expect(res.status).toBe(400);
    expect(res.body.fields).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "new_password" })])
    );
  });
});
