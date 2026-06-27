/**
 * @file tests/unit/order.service.test.js
 * @description Unit tests for order.service.js
 * Covers: create_order, confirm_payment, cancel_order_svc, get_order,
 *         get_customer_orders, get_merchant_orders, change_order_status,
 *         pickup_order, get_all_order_svc
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  CUSTOMER_ID,
  MERCHANT_ID,
  ADMIN_ID,
  ORDER_ID,
  mockOrder,
  mockPaidOrder,
  mockCompletedOrder,
} from "./mocks/mockData.js";

// ── Mock dependencies ─────────────────────────────────────────────────────────
vi.mock("../../src/repositories/order.repository.js", () => ({
  create_order_atomic: vi.fn(),
  find_order_by_id: vi.fn(),
  find_order_by_code: vi.fn(),
  find_orders_by_user: vi.fn(),
  find_orders_by_merchant: vi.fn(),
  cancel_order: vi.fn(),
  confirm_order_payment: vi.fn(),
  complete_order: vi.fn(),
  update_order_status: vi.fn(),
  fetch_all_order: vi.fn(),
}));

vi.mock("../../src/events/order.events.js", () => ({
  orderEmitter: { emit: vi.fn() },
}));

vi.mock("../../src/middlewares/error.middleware.js", () => ({
  createError: vi.fn((msg, code) => {
    const err = new Error(msg);
    err.statusCode = code;
    return err;
  }),
}));

import {
  create_order,
  confirm_payment,
  cancel_order_svc,
  get_order,
  get_customer_orders,
  get_merchant_orders,
  change_order_status,
  pickup_order,
  get_all_order_svc,
} from "../../src/services/order.service.js";

import * as orderRepo from "../../src/repositories/order.repository.js";

// ─────────────────────────────────────────────────────────────────────────────
describe("order.service — create_order", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates order successfully with valid inputs", async () => {
    orderRepo.create_order_atomic.mockResolvedValue(mockOrder);

    const result = await create_order(CUSTOMER_ID, "listing-uuid", 2);
    expect(orderRepo.create_order_atomic).toHaveBeenCalledWith(CUSTOMER_ID, "listing-uuid", 2);
    expect(result.status).toBe("pending_payment");
  });

  it("throws 400 when userId is missing", async () => {
    await expect(create_order(null, "listing-id", 1)).rejects.toMatchObject({
      message: "userId and listingId are required",
      statusCode: 400,
    });
  });

  it("throws 400 when listingId is missing", async () => {
    await expect(create_order(CUSTOMER_ID, null, 1)).rejects.toMatchObject({
      statusCode: 400,
    });
  });

  it("throws 400 when qty is not a positive integer", async () => {
    await expect(create_order(CUSTOMER_ID, "lid", 0)).rejects.toMatchObject({
      statusCode: 400,
    });
    await expect(create_order(CUSTOMER_ID, "lid", -1)).rejects.toMatchObject({
      statusCode: 400,
    });
    await expect(create_order(CUSTOMER_ID, "lid", 1.5)).rejects.toMatchObject({
      statusCode: 400,
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("order.service — confirm_payment", () => {
  beforeEach(() => vi.clearAllMocks());

  it("confirms payment for order owner", async () => {
    orderRepo.find_order_by_id.mockResolvedValue({ ...mockOrder, customerId: CUSTOMER_ID, customer_id: CUSTOMER_ID });
    orderRepo.confirm_order_payment.mockResolvedValue(mockPaidOrder);

    const result = await confirm_payment(ORDER_ID, CUSTOMER_ID, "bank_transfer");
    expect(result.status).toBe("paid_reserved");
  });

  it("throws 404 when order not found", async () => {
    orderRepo.find_order_by_id.mockResolvedValue(null);

    await expect(confirm_payment(ORDER_ID, CUSTOMER_ID)).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it("throws 403 when non-owner tries to confirm", async () => {
    orderRepo.find_order_by_id.mockResolvedValue({
      ...mockOrder,
      customerId: "different-user-id",
    });

    await expect(confirm_payment(ORDER_ID, CUSTOMER_ID)).rejects.toMatchObject({
      statusCode: 403,
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("order.service — cancel_order_svc", () => {
  beforeEach(() => vi.clearAllMocks());

  it("allows customer to cancel own order", async () => {
    orderRepo.find_order_by_id.mockResolvedValue({ ...mockOrder, customerId: CUSTOMER_ID, customer_id: CUSTOMER_ID });
    orderRepo.cancel_order.mockResolvedValue({ ...mockOrder, status: "cancelled" });

    const result = await cancel_order_svc(ORDER_ID, CUSTOMER_ID, "CUSTOMER");
    expect(result.status).toBe("cancelled");
  });

  it("allows ADMIN to cancel any order", async () => {
    orderRepo.find_order_by_id.mockResolvedValue({ ...mockOrder, customerId: CUSTOMER_ID, customer_id: CUSTOMER_ID });
    orderRepo.cancel_order.mockResolvedValue({ ...mockOrder, status: "cancelled" });

    const result = await cancel_order_svc(ORDER_ID, ADMIN_ID, "ADMIN");
    expect(result.status).toBe("cancelled");
  });

  it("throws 404 when order not found", async () => {
    orderRepo.find_order_by_id.mockResolvedValue(null);

    await expect(cancel_order_svc(ORDER_ID, CUSTOMER_ID, "CUSTOMER")).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it("throws 403 when non-owner non-admin tries to cancel", async () => {
    orderRepo.find_order_by_id.mockResolvedValue({
      ...mockOrder,
      customerId: "someone-else",
    });

    await expect(cancel_order_svc(ORDER_ID, CUSTOMER_ID, "CUSTOMER")).rejects.toMatchObject({
      statusCode: 403,
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("order.service — get_order", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns order for owner (customer)", async () => {
    orderRepo.find_order_by_id.mockResolvedValue({
      ...mockOrder,
      customer_id: CUSTOMER_ID,
      merchant_id: MERCHANT_ID,
    });

    const result = await get_order(ORDER_ID, CUSTOMER_ID, "CUSTOMER");
    expect(result.public_id).toBe(ORDER_ID);
  });

  it("returns order for merchant (owner)", async () => {
    orderRepo.find_order_by_id.mockResolvedValue({
      ...mockOrder,
      customer_id: CUSTOMER_ID,
      merchant_id: MERCHANT_ID,
    });

    const result = await get_order(ORDER_ID, MERCHANT_ID, "MERCHANT");
    expect(result.merchant_id).toBe(MERCHANT_ID);
  });

  it("returns order for ADMIN regardless of ownership", async () => {
    orderRepo.find_order_by_id.mockResolvedValue({
      ...mockOrder,
      customer_id: CUSTOMER_ID,
      merchant_id: MERCHANT_ID,
    });

    const result = await get_order(ORDER_ID, ADMIN_ID, "ADMIN");
    expect(result).toBeDefined();
  });

  it("throws 404 when order not found", async () => {
    orderRepo.find_order_by_id.mockResolvedValue(null);

    await expect(get_order(ORDER_ID, CUSTOMER_ID, "CUSTOMER")).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it("throws 403 when unrelated user tries to access", async () => {
    orderRepo.find_order_by_id.mockResolvedValue({
      ...mockOrder,
      customer_id: "other-customer",
      merchant_id: "other-merchant",
    });

    await expect(get_order(ORDER_ID, CUSTOMER_ID, "CUSTOMER")).rejects.toMatchObject({
      statusCode: 403,
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("order.service — change_order_status", () => {
  beforeEach(() => vi.clearAllMocks());

  const transitions = [
    ["paid_reserved", "preparing"],
    ["preparing", "ready_to_pickup"],
    ["ready_to_pickup", "completed"],
  ];

  it.each(transitions)(
    "allows status transition from %s to %s",
    async (from, to) => {
      orderRepo.find_order_by_id.mockResolvedValue({
        ...mockOrder,
        merchant_id: MERCHANT_ID,
        status: from,
      });
      orderRepo.update_order_status.mockResolvedValue({ ...mockOrder, status: to });

      const result = await change_order_status(ORDER_ID, MERCHANT_ID, to);
      expect(result.status).toBe(to);
    }
  );

  it("throws 409 on invalid status transition", async () => {
    orderRepo.find_order_by_id.mockResolvedValue({
      ...mockOrder,
      merchant_id: MERCHANT_ID,
      status: "pending_payment",
    });

    await expect(change_order_status(ORDER_ID, MERCHANT_ID, "completed")).rejects.toMatchObject({
      statusCode: 409,
    });
  });

  it("throws 403 when merchant does not own order", async () => {
    orderRepo.find_order_by_id.mockResolvedValue({
      ...mockOrder,
      merchant_id: "other-merchant",
      status: "paid_reserved",
    });

    await expect(change_order_status(ORDER_ID, MERCHANT_ID, "preparing")).rejects.toMatchObject({
      statusCode: 403,
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("order.service — pickup_order", () => {
  beforeEach(() => vi.clearAllMocks());

  it("completes order with valid pickup code", async () => {
    orderRepo.find_order_by_code.mockResolvedValue({
      ...mockPaidOrder,
      merchant_id: MERCHANT_ID,
    });
    orderRepo.complete_order.mockResolvedValue(mockCompletedOrder);

    const result = await pickup_order("ABC123", MERCHANT_ID, ORDER_ID);
    expect(result.status).toBe("completed");
  });

  it("throws 404 on invalid pickup code", async () => {
    orderRepo.find_order_by_code.mockResolvedValue(null);

    await expect(pickup_order("WRONG", MERCHANT_ID, ORDER_ID)).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it("throws 403 when order belongs to different merchant", async () => {
    orderRepo.find_order_by_code.mockResolvedValue({
      ...mockPaidOrder,
      merchant_id: "other-merchant",
    });

    await expect(pickup_order("ABC123", MERCHANT_ID, ORDER_ID)).rejects.toMatchObject({
      statusCode: 403,
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("order.service — get_customer_orders / get_merchant_orders / get_all_order_svc", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns customer orders", async () => {
    orderRepo.find_orders_by_user.mockResolvedValue([mockOrder]);
    const result = await get_customer_orders(CUSTOMER_ID);
    expect(result).toHaveLength(1);
    expect(result[0].customer_id).toBe(CUSTOMER_ID);
  });

  it("returns merchant orders", async () => {
    orderRepo.find_orders_by_merchant.mockResolvedValue([mockOrder]);
    const result = await get_merchant_orders(MERCHANT_ID);
    expect(result).toHaveLength(1);
  });

  it("returns all orders for admin", async () => {
    orderRepo.fetch_all_order.mockResolvedValue([mockOrder, mockPaidOrder]);
    const result = await get_all_order_svc();
    expect(result).toHaveLength(2);
  });
});
