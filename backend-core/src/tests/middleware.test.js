/**
 * @file src/tests/auth.middleware.test.js
 * @description Unit tests for auth.middleware.js (authenticate) and
 *              rbac.middleware.js (authorize)
 *
 * FR Coverage:
 *   FR-SEC-01 — JWT Bearer Guard (authenticate)
 *   FR-SEC-01 — Role-Based Access Control (authorize)
 *
 * Mocking guardrail:
 *   jwt.js verify_token is mocked — no real JWT crypto involved.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock JWT lib ──────────────────────────────────────────────────────────────
vi.mock("../lib/jwt.js", () => ({
  verify_token: vi.fn(),
}));

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/rbac.middleware.js";
import { verify_token } from "../lib/jwt.js";

// ── Mock Express req/res/next ─────────────────────────────────────────────────
function buildMockReqResNext(headers = {}) {
  const req = { headers };
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  const next = vi.fn();
  return { req, res, next };
}

// ─────────────────────────────────────────────────────────────────────────────

describe("FR-SEC-01 — authenticate middleware (JWT Bearer Guard)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should call next() and attach user to req when token is valid", () => {
    const decodedPayload = {
      id: "user-uuid-001",
      email: "user@test.com",
      role: "CONSUMER",
    };

    verify_token.mockReturnValue(decodedPayload);

    const { req, res, next } = buildMockReqResNext({
      authorization: "Bearer valid.jwt.token",
    });

    authenticate(req, res, next);

    expect(verify_token).toHaveBeenCalledWith("valid.jwt.token");
    expect(req.user).toEqual(decodedPayload);
    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should return 401 when Authorization header is missing", () => {
    const { req, res, next } = buildMockReqResNext({}); // no auth header

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "Unauthorized" })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 when header does not start with 'Bearer '", () => {
    const { req, res, next } = buildMockReqResNext({
      authorization: "Basic base64encodedcredentials",
    });

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 with expiry message when TokenExpiredError is thrown", () => {
    const expiredError = new Error("jwt expired");
    expiredError.name = "TokenExpiredError";
    verify_token.mockImplementation(() => {
      throw expiredError;
    });

    const { req, res, next } = buildMockReqResNext({
      authorization: "Bearer expired.jwt.token",
    });

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Token has expired — please log in again",
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 with 'Invalid token' message on JsonWebTokenError", () => {
    const invalidError = new Error("invalid signature");
    invalidError.name = "JsonWebTokenError";
    verify_token.mockImplementation(() => {
      throw invalidError;
    });

    const { req, res, next } = buildMockReqResNext({
      authorization: "Bearer tampered.jwt.token",
    });

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Invalid token" })
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("FR-SEC-01 — authorize middleware (RBAC Guard)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should call next() when user role is in allowedRoles", () => {
    const req = { user: { role: "MERCHANT" } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    const next = vi.fn();

    const middleware = authorize("MERCHANT");
    middleware(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should return 403 when user role is NOT in allowedRoles", () => {
    const req = { user: { role: "CONSUMER" } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    const next = vi.fn();

    // Consumer tries to access MERCHANT-only route
    const middleware = authorize("MERCHANT");
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "Forbidden",
        message: "Access denied for role: CONSUMER",
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should allow multiple roles (CONSUMER or ADMIN)", () => {
    const middleware = authorize("CONSUMER", "ADMIN");

    // CONSUMER should pass
    const req1 = { user: { role: "CONSUMER" } };
    const res1 = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next1 = vi.fn();
    middleware(req1, res1, next1);
    expect(next1).toHaveBeenCalledOnce();

    // ADMIN should also pass
    const req2 = { user: { role: "ADMIN" } };
    const res2 = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next2 = vi.fn();
    middleware(req2, res2, next2);
    expect(next2).toHaveBeenCalledOnce();

    // MERCHANT should be blocked
    const req3 = { user: { role: "MERCHANT" } };
    const res3 = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next3 = vi.fn();
    middleware(req3, res3, next3);
    expect(res3.status).toHaveBeenCalledWith(403);
  });

  it("should return 401 when req.user is not set", () => {
    const req = {}; // no user attached
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    const next = vi.fn();

    const middleware = authorize("ADMIN");
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
