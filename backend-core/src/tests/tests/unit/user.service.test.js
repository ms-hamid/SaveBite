/**
 * @file tests/unit/user.service.test.js
 * @description Unit tests for user.service.js
 * Covers: getUserProfileService, confirmMerchantKycService,
 *         suspendUserService, unsuspendUserService,
 *         suspendMerchantService, suspendCustomerService,
 *         updateCustomerProfileService, updateMerchantProfileService,
 *         getMerchantDetailService
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { CUSTOMER_ID, MERCHANT_ID, ADMIN_ID, mockMerchant, mockCustomer, mockAuthUser } from "./mocks/mockData.js";

// ── Mock dependencies ─────────────────────────────────────────────────────────
vi.mock("../../src/repositories/user.repository.js", () => ({
  getUserById: vi.fn(),
  getAllMerchantsWithPagination: vi.fn(),
  getAllUsersWithPagination: vi.fn(),
  confirmMerchantKycStatus: vi.fn(),
  suspendUser: vi.fn(),
  unsuspendUser: vi.fn(),
  isUserSuspended: vi.fn(),
  getMerchantById: vi.fn(),
  getCustomerById: vi.fn(),
  getAllMerchantsPendingWithPagination: vi.fn(),
}));

vi.mock("../../src/repositories/customer.repository.js", () => ({
  createCustomerData: vi.fn(),
  updateCustomerProfile: vi.fn(),
}));

vi.mock("../../src/repositories/merchant.repository.js", () => ({
  createMerchantData: vi.fn(),
  updateMerchantProfile: vi.fn(),
}));

import {
  getUserProfileService,
  confirmMerchantKycService,
  suspendUserService,
  unsuspendUserService,
  suspendMerchantService,
  suspendCustomerService,
  updateCustomerProfileService,
  updateMerchantProfileService,
  getMerchantDetailService,
} from "../../src/services/user.service.js";

import * as userRepo from "../../src/repositories/user.repository.js";
import * as customerRepo from "../../src/repositories/customer.repository.js";
import * as merchantRepo from "../../src/repositories/merchant.repository.js";

// ─────────────────────────────────────────────────────────────────────────────
describe("user.service — getUserProfileService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns user when found and not suspended", async () => {
    userRepo.getUserById.mockResolvedValue({ ...mockAuthUser, banned_until: null });

    const result = await getUserProfileService(CUSTOMER_ID);
    expect(result.id).toBe(CUSTOMER_ID);
  });

  it("throws when user not found", async () => {
    userRepo.getUserById.mockResolvedValue(null);

    await expect(getUserProfileService("ghost-id")).rejects.toThrow("User tidak ditemukan");
  });

  it("throws when user is suspended", async () => {
    const bannedUntil = new Date(Date.now() + 86_400_000); // tomorrow
    userRepo.getUserById.mockResolvedValue({ ...mockAuthUser, banned_until: bannedUntil });

    await expect(getUserProfileService(CUSTOMER_ID)).rejects.toThrow("User telah di-suspend");
  });

  it("does not throw when ban date is in the past", async () => {
    const pastDate = new Date(Date.now() - 86_400_000); // yesterday
    userRepo.getUserById.mockResolvedValue({ ...mockAuthUser, banned_until: pastDate });

    const result = await getUserProfileService(CUSTOMER_ID);
    expect(result).toBeDefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("user.service — confirmMerchantKycService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("approves merchant KYC", async () => {
    userRepo.getMerchantById.mockResolvedValue(mockMerchant);
    userRepo.confirmMerchantKycStatus.mockResolvedValue({ ...mockMerchant, kyc_status: "approved" });

    const result = await confirmMerchantKycService(MERCHANT_ID, "approved", ADMIN_ID);
    expect(result.kyc_status).toBe("approved");
  });

  it("throws when merchant not found", async () => {
    userRepo.getMerchantById.mockResolvedValue(null);

    await expect(confirmMerchantKycService("ghost", "approved", ADMIN_ID)).rejects.toThrow(
      "Merchant tidak ditemukan"
    );
  });

  it("throws on invalid KYC status value", async () => {
    userRepo.getMerchantById.mockResolvedValue(mockMerchant);

    await expect(
      confirmMerchantKycService(MERCHANT_ID, "verified", ADMIN_ID)
    ).rejects.toThrow("Status KYC tidak valid");
  });

  it.each(["approved", "rejected", "pending"])(
    "accepts valid status: %s",
    async (status) => {
      userRepo.getMerchantById.mockResolvedValue(mockMerchant);
      userRepo.confirmMerchantKycStatus.mockResolvedValue({
        ...mockMerchant,
        kyc_status: status,
      });

      const result = await confirmMerchantKycService(MERCHANT_ID, status, ADMIN_ID);
      expect(result.kyc_status).toBe(status);
    }
  );
});

// ─────────────────────────────────────────────────────────────────────────────
describe("user.service — suspendUserService / unsuspendUserService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("suspends user with default 30-day ban", async () => {
    userRepo.getUserById.mockResolvedValue(mockAuthUser);
    userRepo.suspendUser.mockResolvedValue({ ...mockAuthUser, is_suspended: true });

    const result = await suspendUserService(CUSTOMER_ID, null, ADMIN_ID);
    const callArgs = userRepo.suspendUser.mock.calls[0];
    const bannedUntil = callArgs[1];
    expect(bannedUntil).toBeInstanceOf(Date);
    expect(bannedUntil.getTime()).toBeGreaterThan(Date.now());
  });

  it("suspends user with custom ban date", async () => {
    userRepo.getUserById.mockResolvedValue(mockAuthUser);
    userRepo.suspendUser.mockResolvedValue({ ...mockAuthUser, is_suspended: true });

    const customDate = new Date(Date.now() + 7 * 86_400_000);
    await suspendUserService(CUSTOMER_ID, customDate, ADMIN_ID);

    expect(userRepo.suspendUser).toHaveBeenCalledWith(CUSTOMER_ID, customDate);
  });

  it("throws when user to suspend not found", async () => {
    userRepo.getUserById.mockResolvedValue(null);

    await expect(suspendUserService("ghost", null, ADMIN_ID)).rejects.toThrow("User tidak ditemukan");
  });

  it("unsuspends user", async () => {
    userRepo.getUserById.mockResolvedValue(mockAuthUser);
    userRepo.unsuspendUser.mockResolvedValue({ ...mockAuthUser, banned_until: null });

    const result = await unsuspendUserService(CUSTOMER_ID, ADMIN_ID);
    expect(userRepo.unsuspendUser).toHaveBeenCalledWith(CUSTOMER_ID);
  });

  it("throws when user to unsuspend not found", async () => {
    userRepo.getUserById.mockResolvedValue(null);

    await expect(unsuspendUserService("ghost", ADMIN_ID)).rejects.toThrow("User tidak ditemukan");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("user.service — suspendMerchantService / suspendCustomerService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("suspends merchant after merchant check", async () => {
    userRepo.getMerchantById.mockResolvedValue(mockMerchant);
    userRepo.getUserById.mockResolvedValue(mockAuthUser);
    userRepo.suspendUser.mockResolvedValue({ ...mockAuthUser, is_suspended: true });

    await suspendMerchantService(MERCHANT_ID, null, ADMIN_ID);
    expect(userRepo.getMerchantById).toHaveBeenCalledWith(MERCHANT_ID);
    expect(userRepo.suspendUser).toHaveBeenCalledOnce();
  });

  it("throws when merchant not found", async () => {
    userRepo.getMerchantById.mockResolvedValue(null);

    await expect(suspendMerchantService("ghost", null, ADMIN_ID)).rejects.toThrow(
      "Merchant tidak ditemukan"
    );
  });

  it("suspends customer after customer check", async () => {
    userRepo.getCustomerById.mockResolvedValue(mockCustomer);
    userRepo.getUserById.mockResolvedValue(mockAuthUser);
    userRepo.suspendUser.mockResolvedValue({ ...mockAuthUser, is_suspended: true });

    await suspendCustomerService(CUSTOMER_ID, null, ADMIN_ID);
    expect(userRepo.getCustomerById).toHaveBeenCalledWith(CUSTOMER_ID);
  });

  it("throws when customer not found", async () => {
    userRepo.getCustomerById.mockResolvedValue(null);

    await expect(suspendCustomerService("ghost", null, ADMIN_ID)).rejects.toThrow(
      "Customer tidak ditemukan"
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("user.service — updateCustomerProfileService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("updates customer profile with valid data", async () => {
    customerRepo.updateCustomerProfile.mockResolvedValue({
      ...mockCustomer,
      full_name: "Nama Baru",
    });

    const result = await updateCustomerProfileService(CUSTOMER_ID, { full_name: "Nama Baru" });
    expect(result.full_name).toBe("Nama Baru");
  });

  it("throws when full_name is empty string", async () => {
    await expect(
      updateCustomerProfileService(CUSTOMER_ID, { full_name: "  " })
    ).rejects.toThrow("Full name tidak boleh kosong");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("user.service — updateMerchantProfileService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("updates merchant profile with valid data", async () => {
    merchantRepo.updateMerchantProfile.mockResolvedValue({
      ...mockMerchant,
      merchant_name: "Toko Baru",
    });

    const result = await updateMerchantProfileService(MERCHANT_ID, { merchant_name: "Toko Baru" });
    expect(result.merchant_name).toBe("Toko Baru");
  });

  it("throws when merchant_name is empty", async () => {
    await expect(
      updateMerchantProfileService(MERCHANT_ID, { merchant_name: "" })
    ).rejects.toThrow("Nama toko tidak boleh kosong");
  });

  it("parses pickup_open and pickup_close time strings", async () => {
    merchantRepo.updateMerchantProfile.mockResolvedValue(mockMerchant);

    await updateMerchantProfileService(MERCHANT_ID, {
      pickup_open: "11:00",
      pickup_close: "13:00",
    });

    const callArgs = merchantRepo.updateMerchantProfile.mock.calls[0][1];
    expect(callArgs.pickup_open).toBeInstanceOf(Date);
    expect(callArgs.pickup_close).toBeInstanceOf(Date);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("user.service — getMerchantDetailService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns merchant detail with real coordinates", async () => {
    userRepo.getMerchantById.mockResolvedValue({ ...mockMerchant });

    const result = await getMerchantDetailService(MERCHANT_ID);
    expect(result.latitude).toBe(mockMerchant.latitude);
    expect(result.isPlaceholderGeo).toBe(false);
  });

  it("uses placeholder coordinates when null", async () => {
    userRepo.getMerchantById.mockResolvedValue({
      ...mockMerchant,
      latitude: null,
      longitude: null,
    });

    const result = await getMerchantDetailService(MERCHANT_ID);
    expect(result.isPlaceholderGeo).toBe(true);
    expect(result.latitude).toBe(-6.2088);
    expect(result.longitude).toBe(106.8456);
  });

  it("throws when merchant not found", async () => {
    userRepo.getMerchantById.mockResolvedValue(null);

    await expect(getMerchantDetailService("ghost")).rejects.toThrow("Merchant tidak ditemukan");
  });
});
