/**
 * @file tests/unit/payment.service.test.js
 * @description Unit tests for payment.service.js
 * Covers: createPaymentTransaction (qris + va), updatePaymentStatus,
 *         checkPaymentStatus
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  CUSTOMER_ID,
  MERCHANT_ID,
  ORDER_ID,
  PAYMENT_ID,
  mockOrder,
  mockPayment,
  mockSettledPayment,
} from "./mocks/mockData.js";

// ── Mock all external dependencies ───────────────────────────────────────────
vi.mock("../../src/lib/midtrans/snap.js", () => ({
  core_api: {
    charge: vi.fn(),
  },
}));

vi.mock("../../src/repositories/payment.repository.js", () => ({
  createPayment: vi.fn(),
  updatePayment: vi.fn(),
  get_payment_by_id: vi.fn(),
  get_last_payment_by_order_id: vi.fn(),
  update_payment_by_order_id: vi.fn(),
  update_payment_by_transaction_id: vi.fn(),
}));

vi.mock("../../src/repositories/order.repository.js", () => ({
  find_order_by_id: vi.fn(),
  update_order_status: vi.fn(),
}));

import {
  createPaymentTransaction,
  updatePaymentStatus,
  checkPaymentStatus,
} from "../../src/services/payment.service.js";

import * as paymentRepo from "../../src/repositories/payment.repository.js";
import * as orderRepo from "../../src/repositories/order.repository.js";
import { core_api } from "../../src/lib/midtrans/snap.js";

// ─────────────────────────────────────────────────────────────────────────────
describe("payment.service — createPaymentTransaction (QRIS)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates a new QRIS payment and returns qris_url", async () => {
    orderRepo.find_order_by_id.mockResolvedValue({ ...mockOrder, id: BigInt(1) });
    paymentRepo.get_last_payment_by_order_id.mockResolvedValue([]);
    paymentRepo.createPayment.mockResolvedValue({ ...mockPayment, id: PAYMENT_ID });
    paymentRepo.updatePayment.mockResolvedValue({});

    core_api.charge.mockResolvedValue({
      order_id: `${ORDER_ID}@1`,
      redirect_url: null,
      actions: [{ name: "generate-qr-code", url: "https://qris.example.com/qr.png" }],
    });

    const result = await createPaymentTransaction(ORDER_ID, CUSTOMER_ID, "qris");

    expect(result.qris_url).toBe("https://qris.example.com/qr.png");
    expect(result.expired_at).toBeDefined();
    expect(paymentRepo.createPayment).toHaveBeenCalledOnce();
  });

  it("reuses existing pending payment without creating a new one", async () => {
    orderRepo.find_order_by_id.mockResolvedValue({ ...mockOrder, id: BigInt(1) });
    paymentRepo.get_last_payment_by_order_id.mockResolvedValue([
      {
        ...mockPayment,
        pg_status: "pending",
        payment_method: "qris",
        midtrans_trx_id: "TRX-EXISTING",
      },
    ]);

    const result = await createPaymentTransaction(ORDER_ID, CUSTOMER_ID, "qris");

    expect(paymentRepo.createPayment).not.toHaveBeenCalled();
    expect(core_api.charge).not.toHaveBeenCalled();
    expect(result.qris_url).toBeDefined();
  });

  it("returns settled message when payment already settled", async () => {
    orderRepo.find_order_by_id.mockResolvedValue({ ...mockOrder, id: BigInt(1) });
    paymentRepo.get_last_payment_by_order_id.mockResolvedValue([
      { ...mockPayment, pg_status: "settlement" },
    ]);

    const result = await createPaymentTransaction(ORDER_ID, CUSTOMER_ID, "qris");
    expect(result.message).toBe("Payment already settled");
  });

  it("throws when order not found", async () => {
    orderRepo.find_order_by_id.mockResolvedValue(null);

    await expect(
      createPaymentTransaction("nonexistent-order", CUSTOMER_ID, "qris")
    ).rejects.toThrow("Order not found");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("payment.service — createPaymentTransaction (Virtual Account)", () => {
  beforeEach(() => vi.clearAllMocks());

  const setupVAMocks = (bankCode = "bca") => {
    orderRepo.find_order_by_id.mockResolvedValue({ ...mockOrder, id: BigInt(1) });
    paymentRepo.get_last_payment_by_order_id.mockResolvedValue([]);
    paymentRepo.createPayment.mockResolvedValue({ ...mockPayment, id: PAYMENT_ID });
    paymentRepo.updatePayment.mockResolvedValue({});

    core_api.charge.mockResolvedValue({
      order_id: `${ORDER_ID}@1`,
      redirect_url: null,
      va_numbers: [{ bank: bankCode, va_number: "12345678901234" }],
    });
  };

  it.each(["va_bca", "va_bri", "va_bni"])("creates VA payment for %s", async (method) => {
    setupVAMocks(method.replace("va_", ""));

    const result = await createPaymentTransaction(ORDER_ID, CUSTOMER_ID, method);

    expect(result.va_number).toBe("12345678901234");
    expect(result).not.toHaveProperty("qris_url");
    expect(paymentRepo.createPayment).toHaveBeenCalledOnce();
  });

  it("creates Mandiri VA and extracts bill_key", async () => {
    orderRepo.find_order_by_id.mockResolvedValue({ ...mockOrder, id: BigInt(1) });
    paymentRepo.get_last_payment_by_order_id.mockResolvedValue([]);
    paymentRepo.createPayment.mockResolvedValue({ ...mockPayment, id: PAYMENT_ID });
    paymentRepo.updatePayment.mockResolvedValue({});

    core_api.charge.mockResolvedValue({
      order_id: `${ORDER_ID}@1`,
      redirect_url: null,
      biller_code: "70012",
      bill_key: "99999999",
    });

    const result = await createPaymentTransaction(ORDER_ID, CUSTOMER_ID, "va_mandiri");
    expect(result.va_number).toContain("99999999");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("payment.service — updatePaymentStatus (Midtrans webhook)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("marks order as paid_reserved on settlement", async () => {
    orderRepo.update_order_status.mockResolvedValue({ ...mockOrder, status: "paid_reserved" });
    paymentRepo.updatePayment.mockResolvedValue({});

    await updatePaymentStatus({
      order_id: `${ORDER_ID}@1`,
      transaction_status: "settlement",
      fraud_status: "accept",
    });

    expect(orderRepo.update_order_status).toHaveBeenCalledWith(ORDER_ID, "paid_reserved");
  });

  it("marks order as paid_reserved on capture + accept", async () => {
    orderRepo.update_order_status.mockResolvedValue({ ...mockOrder, status: "paid_reserved" });
    paymentRepo.updatePayment.mockResolvedValue({});

    await updatePaymentStatus({
      order_id: `${ORDER_ID}@1`,
      transaction_status: "capture",
      fraud_status: "accept",
    });

    expect(orderRepo.update_order_status).toHaveBeenCalledWith(ORDER_ID, "paid_reserved");
  });

  it("cancels payment on expire status", async () => {
    paymentRepo.update_payment_by_transaction_id.mockResolvedValue({});

    await updatePaymentStatus({
      order_id: `${ORDER_ID}@1`,
      transaction_status: "expire",
      fraud_status: null,
    });

    expect(paymentRepo.update_payment_by_transaction_id).toHaveBeenCalledWith(
      `${ORDER_ID}@1`,
      { pg_status: "cancel" }
    );
  });

  it("does nothing on pending status", async () => {
    await updatePaymentStatus({
      order_id: `${ORDER_ID}@1`,
      transaction_status: "pending",
      fraud_status: null,
    });

    expect(orderRepo.update_order_status).not.toHaveBeenCalled();
    expect(paymentRepo.update_payment_by_transaction_id).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("payment.service — checkPaymentStatus", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns payment status for an order", async () => {
    orderRepo.find_order_by_id.mockResolvedValue({
      ...mockOrder,
      status: "paid_reserved",
      payment: mockSettledPayment,
    });

    const result = await checkPaymentStatus(ORDER_ID);
    expect(result.pg_status).toBe("settlement");
    expect(result.order_status).toBe("paid_reserved");
    expect(result.order_public_id).toBe(ORDER_ID);
  });

  it("returns null pg_status when no payment exists", async () => {
    orderRepo.find_order_by_id.mockResolvedValue({
      ...mockOrder,
      status: "pending_payment",
      payment: null,
    });

    const result = await checkPaymentStatus(ORDER_ID);
    expect(result.pg_status).toBeNull();
    expect(result.order_status).toBe("pending_payment");
  });

  it("throws when order not found", async () => {
    orderRepo.find_order_by_id.mockResolvedValue(null);

    await expect(checkPaymentStatus("nonexistent")).rejects.toThrow("Order not found");
  });
});
