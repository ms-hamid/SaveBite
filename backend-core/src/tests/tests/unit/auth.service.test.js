/**
 * @file tests/unit/auth.service.test.js
 * @description Unit tests for auth.service.js
 * Covers: register_user, get_token, completeRegister, forgot_password_service,
 *         verify_reset_otp_service, reset_password_service
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { CUSTOMER_ID, MERCHANT_ID, mockAuthUser, mockMerchantAuthUser } from "./mocks/mockData.js";

// ── Mock all repository & library dependencies ────────────────────────────────
vi.mock("../../src/repositories/auth.repository.js", () => ({
  create_user: vi.fn(),
  get_acc_by_email: vi.fn(),
  confirm_merchant_acc: vi.fn(),
  insert_merchant_data: vi.fn(),
  create_password_reset_token: vi.fn(),
  get_password_reset_token: vi.fn(),
  delete_password_reset_token: vi.fn(),
  update_user_password: vi.fn(),
  hash_token: vi.fn((t) => `hashed_${t}`),
}));

vi.mock("../../src/repositories/customer.repository.js", () => ({
  createCustomerData: vi.fn(),
}));

vi.mock("../../src/repositories/merchant.repository.js", () => ({
  createMerchantData: vi.fn(),
}));

vi.mock("../../src/lib/hash.js", () => ({
  hash_password: vi.fn(async (pw) => `hashed_${pw}`),
  verify_password: vi.fn(),
}));

vi.mock("../../src/lib/jwt.js", () => ({
  generate_token: vi.fn(() => "mock.jwt.token"),
  generate_reset_token: vi.fn(() => "mock.reset.token"),
  verify_reset_token: vi.fn(() => ({ sub: CUSTOMER_ID, email: "customer@example.com" })),
}));

vi.mock("../../src/validators/auth.validator.js", () => ({
  validateEmail: vi.fn(),
  validateOTP: vi.fn(),
  validatePassword: vi.fn(),
  validatePasswordMatch: vi.fn(),
  validateResetToken: vi.fn(),
}));

// ── Import service AFTER mocks ────────────────────────────────────────────────
import {
  register_user,
  get_token,
  completeRegister,
  forgot_password_service,
  verify_reset_otp_service,
  reset_password_service,
  ConflictError,
} from "../../src/services/auth.service.js";

import * as authRepo from "../../src/repositories/auth.repository.js";
import * as customerRepo from "../../src/repositories/customer.repository.js";
import * as merchantRepo from "../../src/repositories/merchant.repository.js";
import * as hashLib from "../../src/lib/hash.js";
import * as jwtLib from "../../src/lib/jwt.js";

// ─────────────────────────────────────────────────────────────────────────────
describe("auth.service — completeRegister", () => {
  beforeEach(() => vi.clearAllMocks());

  it("routes CUSTOMER payload to createCustomerData", async () => {
    customerRepo.createCustomerData.mockResolvedValue({ user_id: CUSTOMER_ID });
    const result = await completeRegister({ user_id: CUSTOMER_ID, full_name: "Budi", role: "CUSTOMER" });
    expect(customerRepo.createCustomerData).toHaveBeenCalledOnce();
    expect(result.user_id).toBe(CUSTOMER_ID);
  });

  it("routes MERCHANT payload to createMerchantData", async () => {
    merchantRepo.createMerchantData.mockResolvedValue({ user_id: MERCHANT_ID });
    const result = await completeRegister({ user_id: MERCHANT_ID, full_name: "Toko", role: "MERCHANT" });
    expect(merchantRepo.createMerchantData).toHaveBeenCalledOnce();
    expect(result.user_id).toBe(MERCHANT_ID);
  });

  it("throws for invalid role", async () => {
    await expect(
      completeRegister({ user_id: CUSTOMER_ID, full_name: "X", role: "INVALID" })
    ).rejects.toThrow("Role tidak valid");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("auth.service — register_user", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates a CONSUMER account and strips password_hash", async () => {
    authRepo.create_user.mockResolvedValue({
      id: CUSTOMER_ID,
      email: "customer@example.com",
      full_name: "Budi",
      password_hash: "secret",
    });

    const result = await register_user({
      email: "customer@example.com",
      password: "Password123!",
      full_name: "Budi",
    });

    expect(hashLib.hash_password).toHaveBeenCalledWith("Password123!");
    expect(result).not.toHaveProperty("password_hash");
    expect(result.email).toBe("customer@example.com");
  });

  it("throws ConflictError on duplicate email (P2002)", async () => {
    const err = new Error("Unique constraint");
    err.code = "P2002";
    err.meta = { target: ["email"] };
    authRepo.create_user.mockRejectedValue(err);

    await expect(
      register_user({ email: "dup@example.com", password: "pw", full_name: "X" })
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("creates a MERCHANT account with merchant fields", async () => {
    authRepo.create_user.mockResolvedValue({
      id: MERCHANT_ID,
      email: "merchant@example.com",
      full_name: "Toko",
      role: "MERCHANT",
    });

    const result = await register_user(
      {
        email: "merchant@example.com",
        password: "Password123!",
        full_name: "Toko",
        shop_name: "Toko Enak",
        address: "Jl. Batam",
        latitude: 1.13,
        longitude: 104.05,
      },
      "MERCHANT"
    );

    expect(authRepo.create_user).toHaveBeenCalledWith(
      expect.objectContaining({ role: "MERCHANT" }),
      "MERCHANT",
      expect.any(Object)
    );
    expect(result.email).toBe("merchant@example.com");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("auth.service — get_token", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns token + role on correct credentials", async () => {
    authRepo.get_acc_by_email.mockResolvedValue(mockAuthUser);
    hashLib.verify_password.mockResolvedValue(true);

    const result = await get_token({ email: "customer@example.com", password: "correctpw" });

    expect(jwtLib.generate_token).toHaveBeenCalledOnce();
    expect(result.token).toBe("mock.jwt.token");
    expect(result.role).toBe("CUSTOMER");
  });

  it("throws on wrong password", async () => {
    authRepo.get_acc_by_email.mockResolvedValue(mockAuthUser);
    hashLib.verify_password.mockResolvedValue(false);

    await expect(
      get_token({ email: "customer@example.com", password: "wrong" })
    ).rejects.toThrow("Incorrect Username or Password!");
  });

  it("propagates error when email not found", async () => {
    authRepo.get_acc_by_email.mockRejectedValue(new Error("Not found"));

    await expect(
      get_token({ email: "notfound@example.com", password: "pw" })
    ).rejects.toThrow("Not found");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("auth.service — forgot_password_service", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls supabase signInWithOtp when user exists", async () => {
    authRepo.get_acc_by_email.mockResolvedValue(mockAuthUser);
    const mockSupabase = {
      auth: { signInWithOtp: vi.fn().mockResolvedValue({ error: null }) },
    };

    const result = await forgot_password_service("customer@example.com", mockSupabase);

    expect(mockSupabase.auth.signInWithOtp).toHaveBeenCalledWith({
      email: "customer@example.com",
      options: { shouldCreateUser: false },
    });
    expect(result.success).toBe(true);
  });

  it("returns success even when user does not exist (anti-enumeration)", async () => {
    authRepo.get_acc_by_email.mockRejectedValue(new Error("not found"));
    const mockSupabase = {
      auth: { signInWithOtp: vi.fn().mockResolvedValue({ error: null }) },
    };

    const result = await forgot_password_service("ghost@example.com", mockSupabase);
    expect(result.success).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("auth.service — verify_reset_otp_service", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns resetToken on valid OTP", async () => {
    const mockSupabase = {
      auth: { verifyOtp: vi.fn().mockResolvedValue({ data: { user: { id: CUSTOMER_ID } }, error: null }) },
    };
    authRepo.get_acc_by_email.mockResolvedValue(mockAuthUser);
    authRepo.create_password_reset_token.mockResolvedValue({});
    authRepo.hash_token.mockReturnValue("hashed_reset_token");

    const result = await verify_reset_otp_service("customer@example.com", "123456", mockSupabase);

    expect(result.success).toBe(true);
    expect(result.resetToken).toBe("mock.reset.token");
  });

  it("throws when Supabase OTP verification fails", async () => {
    const mockSupabase = {
      auth: {
        verifyOtp: vi.fn().mockResolvedValue({ data: null, error: new Error("invalid otp") }),
      },
    };

    await expect(
      verify_reset_otp_service("customer@example.com", "000000", mockSupabase)
    ).rejects.toThrow("OTP invalid atau expired");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("auth.service — reset_password_service", () => {
  beforeEach(() => vi.clearAllMocks());

  it("resets password successfully with valid token", async () => {
    authRepo.get_password_reset_token.mockResolvedValue({ email: "customer@example.com" });
    authRepo.get_acc_by_email.mockResolvedValue(mockAuthUser);
    authRepo.update_user_password.mockResolvedValue({ id: CUSTOMER_ID });
    authRepo.delete_password_reset_token.mockResolvedValue({});

    const result = await reset_password_service(
      "mock.reset.token",
      "NewPassword123!",
      "NewPassword123!"
    );

    expect(result.success).toBe(true);
    expect(hashLib.hash_password).toHaveBeenCalledWith("NewPassword123!");
  });

  it("throws when JWT verify_reset_token fails", async () => {
    jwtLib.verify_reset_token.mockImplementation(() => { throw new Error("Token invalid atau expired"); });

    await expect(
      reset_password_service("invalid.token", "pw", "pw")
    ).rejects.toThrow("Token invalid atau expired");
  });

  it("throws when token not found in DB", async () => {
    jwtLib.verify_reset_token.mockReturnValue({ sub: CUSTOMER_ID, email: "customer@example.com" });
    authRepo.get_password_reset_token.mockRejectedValue(new Error("not found"));

    await expect(
      reset_password_service("mock.reset.token", "pw", "pw")
    ).rejects.toThrow("Token not found or already used");
  });
});
