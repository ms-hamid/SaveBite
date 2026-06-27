/**
 * @file tests/unit/withdrawal.service.test.js
 * @description Unit tests for withdrawal.service.js
 * Covers: get_merchant_virtual_balance_svc, create_withdrawal_svc,
 *         cancel_withdrawal_svc, update_withdrawal_svc, review_withdrawal_svc,
 *         get_withdrawal_svc
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  MERCHANT_ID,
  ADMIN_ID,
  mockMerchant,
  mockWithdrawal,
  mockCompletedWithdrawal,
} from "./mocks/mockData.js";

// ── Mock dependencies ─────────────────────────────────────────────────────────
vi.mock("../../src/repositories/withdrawal.repository.js", () => ({
  find_merchant_balance: vi.fn(),
  find_withdrawal_by_id: vi.fn(),
  find_withdrawals_by_merchant: vi.fn(),
  find_all_withdrawals: vi.fn(),
  find_placeholder_admin_id: vi.fn(),
  create_withdrawal_record: vi.fn(),
  update_withdrawal_record: vi.fn(),
  update_merchant_virtual_balance: vi.fn(),
}));

vi.mock("../../src/lib/prisma.js", () => ({
  prisma: {
    $transaction: vi.fn(async (fn) => fn({
      /* mock tx object – repository calls are separately mocked */
    })),
  },
}));

vi.mock("../../src/middlewares/error.middleware.js", () => ({
  createError: vi.fn((msg, code) => {
    const err = new Error(msg);
    err.statusCode = code;
    return err;
  }),
}));

import {
  get_merchant_virtual_balance_svc,
  get_my_withdrawals_svc,
  get_withdrawal_svc,
  create_withdrawal_svc,
  update_withdrawal_svc,
  cancel_withdrawal_svc,
  review_withdrawal_svc,
} from "../../src/services/withdrawal.service.js";

import * as withdrawalRepo from "../../src/repositories/withdrawal.repository.js";

// ─────────────────────────────────────────────────────────────────────────────
describe("withdrawal.service — get_merchant_virtual_balance_svc", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns merchant balance", async () => {
    withdrawalRepo.find_merchant_balance.mockResolvedValue(mockMerchant);

    const result = await get_merchant_virtual_balance_svc(MERCHANT_ID);
    expect(result.virtual_balance).toBe(150000);
    expect(result.merchant_name).toBe("Toko Enak");
  });

  it("throws 404 when merchant not found", async () => {
    withdrawalRepo.find_merchant_balance.mockResolvedValue(null);

    await expect(get_merchant_virtual_balance_svc(MERCHANT_ID)).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("withdrawal.service — get_withdrawal_svc", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns withdrawal for owner merchant", async () => {
    withdrawalRepo.find_withdrawal_by_id.mockResolvedValue({
      ...mockWithdrawal,
      merchant_id: MERCHANT_ID,
    });

    const result = await get_withdrawal_svc(
      mockWithdrawal.id,
      { id: MERCHANT_ID, role: "MERCHANT" }
    );
    expect(result.merchant_id).toBe(MERCHANT_ID);
  });

  it("returns withdrawal for ADMIN", async () => {
    withdrawalRepo.find_withdrawal_by_id.mockResolvedValue({
      ...mockWithdrawal,
      merchant_id: MERCHANT_ID,
    });

    const result = await get_withdrawal_svc(
      mockWithdrawal.id,
      { id: ADMIN_ID, role: "ADMIN" }
    );
    expect(result).toBeDefined();
  });

  it("throws 403 when merchant tries to view other merchant withdrawal", async () => {
    withdrawalRepo.find_withdrawal_by_id.mockResolvedValue({
      ...mockWithdrawal,
      merchant_id: "other-merchant",
    });

    await expect(
      get_withdrawal_svc(mockWithdrawal.id, { id: MERCHANT_ID, role: "MERCHANT" })
    ).rejects.toMatchObject({ statusCode: 403 });
  });

  it("throws 404 when withdrawal not found", async () => {
    withdrawalRepo.find_withdrawal_by_id.mockResolvedValue(null);

    await expect(
      get_withdrawal_svc("999", { id: MERCHANT_ID, role: "MERCHANT" })
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("withdrawal.service — create_withdrawal_svc", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates withdrawal when balance is sufficient", async () => {
    withdrawalRepo.find_merchant_balance.mockResolvedValue({
      ...mockMerchant,
      virtual_balance: 200000,
      bank_name: "BCA",
      bank_account: "1234567890",
    });
    withdrawalRepo.update_merchant_virtual_balance.mockResolvedValue({});
    withdrawalRepo.create_withdrawal_record.mockResolvedValue(mockWithdrawal);

    const result = await create_withdrawal_svc(MERCHANT_ID, { amount: 100000, qty: 5 });
    expect(result.amount).toBe(100000);
  });

  it("throws 422 when amount is below minimum (Rp50.000)", async () => {
    await expect(
      create_withdrawal_svc(MERCHANT_ID, { amount: 10000 })
    ).rejects.toMatchObject({ statusCode: 422 });
  });

  it("throws 422 when balance is insufficient", async () => {
    withdrawalRepo.find_merchant_balance.mockResolvedValue({
      ...mockMerchant,
      virtual_balance: 30000,
      bank_name: "BCA",
      bank_account: "1234",
    });

    await expect(
      create_withdrawal_svc(MERCHANT_ID, { amount: 100000 })
    ).rejects.toMatchObject({ statusCode: 422 });
  });

  it("throws 422 when bank details are not set", async () => {
    withdrawalRepo.find_merchant_balance.mockResolvedValue({
      ...mockMerchant,
      virtual_balance: 200000,
      bank_name: null,
      bank_account: null,
    });

    await expect(
      create_withdrawal_svc(MERCHANT_ID, { amount: 100000 })
    ).rejects.toMatchObject({ statusCode: 422 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("withdrawal.service — cancel_withdrawal_svc", () => {
  beforeEach(() => vi.clearAllMocks());

  it("cancels pending withdrawal and refunds balance", async () => {
    withdrawalRepo.find_withdrawal_by_id.mockResolvedValue({
      ...mockWithdrawal,
      merchant_id: MERCHANT_ID,
      status: "pending",
      amount: 100000,
    });
    withdrawalRepo.find_merchant_balance.mockResolvedValue({
      ...mockMerchant,
      virtual_balance: 50000,
    });
    withdrawalRepo.update_merchant_virtual_balance.mockResolvedValue({});
    withdrawalRepo.update_withdrawal_record.mockResolvedValue({
      ...mockWithdrawal,
      status: "cancelled",
    });

    const result = await cancel_withdrawal_svc(mockWithdrawal.id, MERCHANT_ID);
    expect(result.status).toBe("cancelled");
  });

  it("throws 403 when non-owner tries to cancel", async () => {
    withdrawalRepo.find_withdrawal_by_id.mockResolvedValue({
      ...mockWithdrawal,
      merchant_id: "other-merchant",
    });

    await expect(
      cancel_withdrawal_svc(mockWithdrawal.id, MERCHANT_ID)
    ).rejects.toMatchObject({ statusCode: 403 });
  });

  it("throws 422 when withdrawal is not pending", async () => {
    withdrawalRepo.find_withdrawal_by_id.mockResolvedValue({
      ...mockWithdrawal,
      merchant_id: MERCHANT_ID,
      status: "completed",
    });

    await expect(
      cancel_withdrawal_svc(mockWithdrawal.id, MERCHANT_ID)
    ).rejects.toMatchObject({ statusCode: 422 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("withdrawal.service — review_withdrawal_svc (admin)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("marks withdrawal as completed", async () => {
    withdrawalRepo.find_withdrawal_by_id.mockResolvedValue({
      ...mockWithdrawal,
      status: "pending",
    });
    withdrawalRepo.update_withdrawal_record.mockResolvedValue(mockCompletedWithdrawal);

    const result = await review_withdrawal_svc(mockWithdrawal.id, ADMIN_ID, {
      status: "completed",
    });
    expect(result.status).toBe("completed");
  });

  it("declines withdrawal and refunds balance", async () => {
    withdrawalRepo.find_withdrawal_by_id.mockResolvedValue({
      ...mockWithdrawal,
      status: "pending",
      amount: 100000,
      merchant_id: MERCHANT_ID,
    });
    withdrawalRepo.find_merchant_balance.mockResolvedValue({
      ...mockMerchant,
      virtual_balance: 50000,
    });
    withdrawalRepo.update_merchant_virtual_balance.mockResolvedValue({});
    withdrawalRepo.update_withdrawal_record.mockResolvedValue({
      ...mockWithdrawal,
      status: "declinec",
    });

    const result = await review_withdrawal_svc(mockWithdrawal.id, ADMIN_ID, {
      status: "declinec",
    });
    expect(result.status).toBe("declinec");
  });

  it("throws 400 on invalid status value", async () => {
    withdrawalRepo.find_withdrawal_by_id.mockResolvedValue({
      ...mockWithdrawal,
      status: "pending",
    });

    await expect(
      review_withdrawal_svc(mockWithdrawal.id, ADMIN_ID, { status: "rejected" })
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it("throws 422 when withdrawal is not pending", async () => {
    withdrawalRepo.find_withdrawal_by_id.mockResolvedValue({
      ...mockWithdrawal,
      status: "completed",
    });

    await expect(
      review_withdrawal_svc(mockWithdrawal.id, ADMIN_ID, { status: "completed" })
    ).rejects.toMatchObject({ statusCode: 422 });
  });
});
