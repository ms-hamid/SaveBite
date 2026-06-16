/**
 * @file src/tests/auth.service.test.js
 * @description Unit tests for auth.service.js
 *
 * FR Coverage:
 *   FR-U-01 — register_user (consumer & merchant) + get_token (login)
 *   FR-U-02 — logout_user
 *   FR-U-03 — request_password_reset + reset_password
 *
 * Mocking guardrail:
 *   Prisma is fully mocked via vi.mock — NO live DB calls.
 *   bcrypt, jwt, and crypto are mocked/patched so tests run synchronously.
 *
 * Test design:
 *   - Positive cases: valid inputs yield the expected return shape.
 *   - Negative cases: invalid inputs throw the correct typed error class.
 *   - Edge cases: non-existent users, expired tokens, token enumeration safety.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock Prisma singleton ────────────────────────────────────────────────────
vi.mock("../lib/prisma.js", () => ({
  prisma: {
    $transaction: vi.fn(),
    user: { create: vi.fn(), findUnique: vi.fn() },
    merchant: { create: vi.fn() },
    passwordReset: {
      deleteMany: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

// ── Mock hash helpers ────────────────────────────────────────────────────────
vi.mock("../lib/hash.js", () => ({
  hash_password: vi.fn().mockResolvedValue("$2b$12$hashedpassword"),
  verify_password: vi.fn().mockResolvedValue(true),
}));

// ── Mock JWT ─────────────────────────────────────────────────────────────────
vi.mock("../lib/jwt.js", () => ({
  generate_token: vi.fn().mockReturnValue("mock.jwt.token"),
}));

// ── Mock repositories ────────────────────────────────────────────────────────
vi.mock("../repositories/auth.repository.js", () => ({
  create_user: vi.fn(),
  get_acc_by_email: vi.fn(),
  insert_merchant_data: vi.fn(),
  confirm_merchant_acc: vi.fn(),
  update_password_by_email: vi.fn(),
  create_reset_token: vi.fn(),
  get_reset_token_by_hash: vi.fn(),
  delete_reset_token: vi.fn(),
}));

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

import {
  create_user,
  get_acc_by_email,
  update_password_by_email,
  create_reset_token,
  get_reset_token_by_hash,
  delete_reset_token,
} from "../repositories/auth.repository.js";

import { hash_password, verify_password } from "../lib/hash.js";
import { generate_token } from "../lib/jwt.js";

// ─────────────────────────────────────────────────────────────────────────────
// FR-U-01 — register_user (CONSUMER)
// ─────────────────────────────────────────────────────────────────────────────

describe("FR-U-01 — register_user (CONSUMER)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("✅ calls create_user with hashed password and returns safe user (no password_hash)", async () => {
    const mockUser = {
      id: "user-uuid-123",
      email: "consumer@test.com",
      full_name: "Test Consumer",
      role: "CONSUMER",
      password_hash: "$2b$12$hashedpassword",
    };

    create_user.mockResolvedValue(mockUser);

    const body = {
      email: "consumer@test.com",
      password: "Abcdef1!",
      full_name: "Test Consumer",
    };

    const result = await register_user(body, "CONSUMER");

    expect(hash_password).toHaveBeenCalledOnce();
    expect(hash_password).toHaveBeenCalledWith("Abcdef1!");
    expect(create_user).toHaveBeenCalledOnce();
    expect(create_user).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "consumer@test.com",
        password_hash: "$2b$12$hashedpassword",
        full_name: "Test Consumer",
      })
    );

    // password_hash must be stripped from the response
    expect(result).not.toHaveProperty("password_hash");
    expect(result.id).toBe("user-uuid-123");
    expect(result.email).toBe("consumer@test.com");
  });

  it("✅ normalises email to lowercase before storing", async () => {
    create_user.mockResolvedValue({
      id: "uid-1",
      email: "consumer@test.com",
      full_name: "Test",
      role: "CONSUMER",
    });

    await register_user({ email: "Consumer@TEST.com", password: "Abcdef1!", full_name: "Test" });

    const callArgs = create_user.mock.calls[0][0];
    expect(callArgs.email).toBe("consumer@test.com");
  });

  it("🔴 throws ConflictError (409) on Prisma P2002 duplicate email", async () => {
    const p2002 = new Error("Unique constraint failed on the fields: (`email`)");
    p2002.code = "P2002";
    p2002.meta = { target: ["email"] };
    create_user.mockRejectedValue(p2002);

    await expect(
      register_user({ email: "dup@test.com", password: "Abcdef1!", full_name: "Dup User" })
    ).rejects.toThrow(ConflictError);

    await expect(
      register_user({ email: "dup@test.com", password: "Abcdef1!", full_name: "Dup User" })
    ).rejects.toThrow("already exists");
  });

  it("✅ calls create_user with MERCHANT role and merchant fields", async () => {
    const mockMerchantUser = {
      id: "merch-uuid-456",
      email: "merchant@test.com",
      role: "MERCHANT",
      full_name: "Test Merchant",
    };

    create_user.mockResolvedValue(mockMerchantUser);

    const body = {
      email: "merchant@test.com",
      password: "Merch1234",
      full_name: "Test Merchant",
      shop_name: "Warung Test",
      address: "Jl. Test No.1",
      latitude: "1.0",
      longitude: "104.0",
      virtual_balance: 0,
      bank_name: "BCA",
      bank_account: "1234567890",
    };

    const result = await register_user(body, "MERCHANT");

    expect(create_user).toHaveBeenCalledOnce();
    expect(create_user.mock.calls[0][1]).toBe("MERCHANT");
    expect(result.role).toBe("MERCHANT");
    expect(result).not.toHaveProperty("password_hash");
  });

  it("🔴 re-throws unexpected errors (non-P2002) without wrapping", async () => {
    const networkErr = new Error("DB connection refused");
    networkErr.code = "P1001";
    create_user.mockRejectedValue(networkErr);

    await expect(
      register_user({ email: "a@b.com", password: "Abcdef1!", full_name: "A" })
    ).rejects.toThrow("DB connection refused");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// FR-U-01 — get_token (login)
// ─────────────────────────────────────────────────────────────────────────────

describe("FR-U-01 — get_token (login)", () => {
  beforeEach(() => vi.clearAllMocks());

  const MOCK_ACC = {
    id: "user-uuid-123",
    email: "consumer@test.com",
    full_name: "Test Consumer",
    role: "CONSUMER",
    password_hash: "$2b$12$hashedpassword",
  };

  it("✅ returns { token, user } on valid credentials; user has no password_hash", async () => {
    get_acc_by_email.mockResolvedValue(MOCK_ACC);
    verify_password.mockResolvedValue(true);
    generate_token.mockReturnValue("mock.jwt.token");

    const result = await get_token({
      email: "consumer@test.com",
      password: "correctpassword",
    });

    expect(get_acc_by_email).toHaveBeenCalledWith("consumer@test.com");
    expect(verify_password).toHaveBeenCalledWith("correctpassword", "$2b$12$hashedpassword");
    expect(generate_token).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "user-uuid-123",
        email: "consumer@test.com",
        role: "CONSUMER",
      })
    );
    expect(result.token).toBe("mock.jwt.token");
    expect(result.user).not.toHaveProperty("password_hash");
    expect(result.user.id).toBe("user-uuid-123");
  });

  it("✅ normalises email to lowercase before lookup", async () => {
    get_acc_by_email.mockResolvedValue(MOCK_ACC);
    verify_password.mockResolvedValue(true);

    await get_token({ email: "Consumer@TEST.com", password: "correctpassword" });

    expect(get_acc_by_email).toHaveBeenCalledWith("consumer@test.com");
  });

  it("🔴 throws AuthError when user does not exist (null from repo)", async () => {
    get_acc_by_email.mockResolvedValue(null);

    await expect(
      get_token({ email: "ghost@test.com", password: "whatever" })
    ).rejects.toThrow(AuthError);

    await expect(
      get_token({ email: "ghost@test.com", password: "whatever" })
    ).rejects.toThrow("Incorrect email or password.");
  });

  it("🔴 throws AuthError when password does not match", async () => {
    get_acc_by_email.mockResolvedValue(MOCK_ACC);
    verify_password.mockResolvedValue(false);

    await expect(
      get_token({ email: "consumer@test.com", password: "wrongpassword" })
    ).rejects.toThrow(AuthError);

    // Error message must NOT distinguish "wrong password" from "user not found"
    await expect(
      get_token({ email: "consumer@test.com", password: "wrongpassword" })
    ).rejects.toThrow("Incorrect email or password.");
  });

  it("🔴 error message is identical for non-existent user and wrong password (prevents enumeration)", async () => {
    // Non-existent user path
    get_acc_by_email.mockResolvedValue(null);
    let msg1;
    try {
      await get_token({ email: "nope@test.com", password: "pw" });
    } catch (e) {
      msg1 = e.message;
    }

    // Wrong password path
    get_acc_by_email.mockResolvedValue(MOCK_ACC);
    verify_password.mockResolvedValue(false);
    let msg2;
    try {
      await get_token({ email: "consumer@test.com", password: "wrong" });
    } catch (e) {
      msg2 = e.message;
    }

    expect(msg1).toBe(msg2);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// FR-U-02 — logout_user
// ─────────────────────────────────────────────────────────────────────────────

describe("FR-U-02 — logout_user", () => {
  it("✅ resolves without throwing for a valid user_id", async () => {
    await expect(logout_user("user-uuid-123")).resolves.toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// FR-U-03 — request_password_reset
// ─────────────────────────────────────────────────────────────────────────────

describe("FR-U-03 — request_password_reset", () => {
  beforeEach(() => vi.clearAllMocks());

  it("✅ creates a reset token record for a known email", async () => {
    get_acc_by_email.mockResolvedValue({
      id: "uid-1",
      email: "user@test.com",
      password_hash: "$2b$12$x",
    });
    create_reset_token.mockResolvedValue({});

    const result = await request_password_reset("user@test.com");

    expect(get_acc_by_email).toHaveBeenCalledWith("user@test.com");
    expect(create_reset_token).toHaveBeenCalledOnce();

    // token_hash stored must be a 64-char SHA-256 hex string (never the raw token)
    const [, storedHash] = create_reset_token.mock.calls[0];
    expect(storedHash).toHaveLength(64);
    expect(storedHash).toMatch(/^[0-9a-f]{64}$/);

    expect(result.message).toContain("reset link");
  });

  it("✅ exposes dev_token only when NODE_ENV === development", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    get_acc_by_email.mockResolvedValue({ id: "uid-1", email: "dev@test.com", password_hash: "$x" });
    create_reset_token.mockResolvedValue({});

    const result = await request_password_reset("dev@test.com");
    expect(result.dev_token).toBeDefined();
    // dev_token must be a 64-char hex string (32 raw bytes → hex)
    expect(result.dev_token).toHaveLength(64);

    process.env.NODE_ENV = originalEnv;
  });

  it("🔒 does NOT expose dev_token in production", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    get_acc_by_email.mockResolvedValue({ id: "uid-1", email: "prod@test.com", password_hash: "$x" });
    create_reset_token.mockResolvedValue({});

    const result = await request_password_reset("prod@test.com");
    expect(result.dev_token).toBeUndefined();

    process.env.NODE_ENV = originalEnv;
  });

  it("🔒 returns identical generic message for unknown email (prevents enumeration)", async () => {
    get_acc_by_email.mockResolvedValue(null);

    const result = await request_password_reset("nobody@test.com");

    expect(create_reset_token).not.toHaveBeenCalled();
    expect(result.message).toContain("reset link");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// FR-U-03 — reset_password
// ─────────────────────────────────────────────────────────────────────────────

describe("FR-U-03 — reset_password", () => {
  beforeEach(() => vi.clearAllMocks());

  it("✅ updates password and deletes token on valid, non-expired token", async () => {
    const future = new Date(Date.now() + 60_000);
    get_reset_token_by_hash.mockResolvedValue({
      email: "user@test.com",
      token_hash: "abc123",
      expires_at: future,
    });
    delete_reset_token.mockResolvedValue({});
    update_password_by_email.mockResolvedValue({});

    await expect(reset_password("rawtoken", "NewPass1!")).resolves.toBeUndefined();

    expect(update_password_by_email).toHaveBeenCalledWith(
      "user@test.com",
      "$2b$12$hashedpassword" // from mock hash_password
    );
    expect(delete_reset_token).toHaveBeenCalledOnce();
  });

  it("🔴 throws TokenError when token hash is not found in DB", async () => {
    get_reset_token_by_hash.mockResolvedValue(null);

    await expect(reset_password("badtoken", "NewPass1!")).rejects.toThrow(TokenError);
    await expect(reset_password("badtoken", "NewPass1!")).rejects.toThrow("Invalid");
  });

  it("🔴 throws TokenError when token is expired; also deletes the expired record", async () => {
    const past = new Date(Date.now() - 60_000);
    get_reset_token_by_hash.mockResolvedValue({
      email: "user@test.com",
      token_hash: "expired-hash",
      expires_at: past,
    });
    delete_reset_token.mockResolvedValue({});

    await expect(reset_password("expiredtoken", "NewPass1!")).rejects.toThrow(TokenError);
    await expect(reset_password("expiredtoken", "NewPass1!")).rejects.toThrow("expired");

    // Expired record should be cleaned up
    expect(delete_reset_token).toHaveBeenCalled();
  });

  it("🔒 token is one-time-use — delete_reset_token called after successful reset", async () => {
    const future = new Date(Date.now() + 60_000);
    get_reset_token_by_hash.mockResolvedValue({
      email: "user@test.com",
      token_hash: "valid-hash",
      expires_at: future,
    });
    delete_reset_token.mockResolvedValue({});
    update_password_by_email.mockResolvedValue({});

    await reset_password("validtoken", "NewPass1!");

    expect(delete_reset_token).toHaveBeenCalledOnce();
  });
});
