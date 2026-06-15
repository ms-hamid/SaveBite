/**
 * @file src/tests/auth.service.test.js
 * @description Unit tests for auth.service.js
 *
 * FR Coverage:
 *   FR-U-01  — register_user (consumer & merchant) + get_token (login)
 *
 * Mocking guardrail:
 *   Prisma is fully mocked via vi.mock — NO live DB calls.
 *   bcrypt and jwt libs are mocked so tests are synchronous-safe.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock Prisma singleton ────────────────────────────────────────────────────
vi.mock("../lib/prisma.js", () => ({
  prisma: {
    $transaction: vi.fn(),
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    merchant: {
      create: vi.fn(),
    },
  },
}));

// ── Mock hash helpers ────────────────────────────────────────────────────────
vi.mock("../lib/hash.js", () => ({
  hash_password: vi.fn().mockResolvedValue("$2b$12$hashedpassword"),
  verify_password: vi.fn().mockReturnValue(true),
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
}));

import {
  register_user,
  get_token,
} from "../services/auth.service.js";

import {
  create_user,
  get_acc_by_email,
} from "../repositories/auth.repository.js";

import { hash_password, verify_password } from "../lib/hash.js";
import { generate_token } from "../lib/jwt.js";

// ─────────────────────────────────────────────────────────────────────────────

describe("FR-U-01 — register_user (CONSUMER)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call create_user with hashed password for a consumer", async () => {
    const mockUser = {
      id: "user-uuid-123",
      email: "consumer@test.com",
      full_name: "Test Consumer",
      role: "CONSUMER",
    };

    create_user.mockResolvedValue(mockUser);

    const body = {
      email: "consumer@test.com",
      password: "plainpassword",
      full_name: "Test Consumer",
    };

    const result = await register_user(body, "CONSUMER");

    expect(hash_password).toHaveBeenCalledOnce();
    expect(hash_password).toHaveBeenCalledWith("plainpassword");
    expect(create_user).toHaveBeenCalledOnce();
    expect(create_user).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "consumer@test.com",
        password_hash: "$2b$12$hashedpassword",
        full_name: "Test Consumer",
      })
    );
    expect(result).toEqual(mockUser);
  });

  it("should call create_user with MERCHANT role and merchant fields", async () => {
    const mockMerchantUser = {
      id: "merch-uuid-456",
      email: "merchant@test.com",
      role: "MERCHANT",
    };

    create_user.mockResolvedValue(mockMerchantUser);

    const body = {
      email: "merchant@test.com",
      password: "merch123",
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
    // Second arg must be "MERCHANT"
    expect(create_user.mock.calls[0][1]).toBe("MERCHANT");
    expect(result).toEqual(mockMerchantUser);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("FR-U-01 — get_token (login)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return a JWT token on valid credentials", async () => {
    const mockAcc = {
      id: "user-uuid-123",
      email: "consumer@test.com",
      full_name: "Test Consumer",
      role: "CONSUMER",
      password_hash: "$2b$12$hashedpassword",
    };

    get_acc_by_email.mockResolvedValue(mockAcc);
    verify_password.mockReturnValue(true);
    generate_token.mockReturnValue("mock.jwt.token");

    const result = await get_token({
      email: "consumer@test.com",
      password: "correctpassword",
    });

    expect(get_acc_by_email).toHaveBeenCalledWith("consumer@test.com");
    expect(verify_password).toHaveBeenCalledWith(
      "correctpassword",
      "$2b$12$hashedpassword"
    );
    expect(generate_token).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "user-uuid-123",
        email: "consumer@test.com",
        role: "CONSUMER",
      })
    );
    expect(result).toBe("mock.jwt.token");
  });

  it("should throw an error when password does not match", async () => {
    get_acc_by_email.mockResolvedValue({
      id: "user-uuid-123",
      email: "consumer@test.com",
      password_hash: "$2b$12$hashedpassword",
      role: "CONSUMER",
      full_name: "Test",
    });

    verify_password.mockReturnValue(false);

    await expect(
      get_token({ email: "consumer@test.com", password: "wrongpassword" })
    ).rejects.toThrow("Incorrect Username or Password!");
  });
});
