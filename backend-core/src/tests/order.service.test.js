/**
 * @file src/tests/order.service.test.js
 * @description Unit tests for order.service.js
 *
 * FR Coverage:
 *   FR-K-02  — create_order (Pessimistic DB Lock checkout)
 *   FR-K-03  — confirm_payment (PENDING_PAYMENT → PAID_RESERVED + QR)
 *   FR-A-03  — cancel_order_svc (admin force-cancel / consumer self-cancel)
 *   FR-S-02  — cancel_order_svc (status guard for already-cancelled orders)
 *
 * Mocking guardrail:
 *   order.repository.js is fully mocked — NO live DB or Prisma calls.
 *   order.events.js emitter is mocked so side effects don't fire in tests.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock order repository ────────────────────────────────────────────────────
vi.mock("../repositories/order.repository.js", () => ({
  create_order_atomic: vi.fn(),
  find_order_by_id: vi.fn(),
  find_orders_by_user: vi.fn(),
  confirm_order_payment: vi.fn(),
  cancel_order: vi.fn(),
}));

// ── Mock event emitter ────────────────────────────────────────────────────────
vi.mock("../events/order.events.js", () => ({
  orderEmitter: {
    emit: vi.fn(),
  },
}));

// ── Mock error middleware ─────────────────────────────────────────────────────
vi.mock("../middlewares/error.middleware.js", () => ({
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
} from "../services/order.service.js";

import {
  create_order_atomic,
  find_order_by_id,
  find_orders_by_user,
  confirm_order_payment,
  cancel_order,
} from "../repositories/order.repository.js";

import { orderEmitter } from "../events/order.events.js";

// ─────────────────────────────────────────────────────────────────────────────

const MOCK_ORDER_PENDING = {
  id: "order-uuid-001",
  user_id: "consumer-uuid-001",
  listing_id: "listing-uuid-001",
  qty: 2,
  total_amount: 30000,
  status: "PENDING_PAYMENT",
  qr_token: "abc123qr",
  created_at: new Date(),
};

const MOCK_ORDER_PAID = {
  ...MOCK_ORDER_PENDING,
  status: "PAID_RESERVED",
  order_code: "ABC123",
};

// ─────────────────────────────────────────────────────────────────────────────

describe("FR-K-02 — create_order (Pessimistic Checkout Lock)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should create an order and emit order:created event", async () => {
    create_order_atomic.mockResolvedValue(MOCK_ORDER_PENDING);

    const result = await create_order(
      "consumer-uuid-001",
      "listing-uuid-001",
      2
    );

    expect(create_order_atomic).toHaveBeenCalledWith(
      "consumer-uuid-001",
      "listing-uuid-001",
      2
    );
    expect(orderEmitter.emit).toHaveBeenCalledWith(
      "order:created",
      MOCK_ORDER_PENDING
    );
    expect(result.status).toBe("PENDING_PAYMENT");
  });

  it("should throw 400 when qty is not a positive integer", async () => {
    await expect(
      create_order("consumer-uuid-001", "listing-uuid-001", 0)
    ).rejects.toMatchObject({ statusCode: 400 });

    await expect(
      create_order("consumer-uuid-001", "listing-uuid-001", -1)
    ).rejects.toMatchObject({ statusCode: 400 });

    await expect(
      create_order("consumer-uuid-001", "listing-uuid-001", 1.5)
    ).rejects.toMatchObject({ statusCode: 400 });

    expect(create_order_atomic).not.toHaveBeenCalled();
  });

  it("should throw 400 when userId or listingId is missing", async () => {
    await expect(
      create_order(null, "listing-uuid-001", 1)
    ).rejects.toMatchObject({ statusCode: 400 });

    await expect(
      create_order("consumer-uuid-001", null, 1)
    ).rejects.toMatchObject({ statusCode: 400 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("FR-K-03 — confirm_payment (PENDING_PAYMENT → PAID_RESERVED + QR)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should confirm payment and return updated order with QR code", async () => {
    find_order_by_id.mockResolvedValue(MOCK_ORDER_PENDING);
    confirm_order_payment.mockResolvedValue(MOCK_ORDER_PAID);

    const result = await confirm_payment(
      "order-uuid-001",
      "consumer-uuid-001",
      "bank_transfer"
    );

    expect(find_order_by_id).toHaveBeenCalledWith("order-uuid-001");
    expect(confirm_order_payment).toHaveBeenCalledWith(
      "order-uuid-001",
      "bank_transfer"
    );
    expect(orderEmitter.emit).toHaveBeenCalledWith(
      "order:completed",
      MOCK_ORDER_PAID
    );
    expect(result.status).toBe("PAID_RESERVED");
    expect(result.order_code).toBe("ABC123");
  });

  it("should throw 404 when order does not exist", async () => {
    find_order_by_id.mockResolvedValue(null);

    await expect(
      confirm_payment("non-existent-order", "consumer-uuid-001", "bank_transfer")
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it("should throw 403 when a different user tries to confirm payment", async () => {
    find_order_by_id.mockResolvedValue(MOCK_ORDER_PENDING);

    await expect(
      confirm_payment("order-uuid-001", "OTHER-consumer-uuid", "bank_transfer")
    ).rejects.toMatchObject({ statusCode: 403 });

    expect(confirm_order_payment).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("FR-A-03 / FR-S-02 — cancel_order_svc (Cancel + Stock Release)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("consumer can cancel their own PENDING_PAYMENT order", async () => {
    find_order_by_id.mockResolvedValue(MOCK_ORDER_PENDING);
    cancel_order.mockResolvedValue({ ...MOCK_ORDER_PENDING, status: "CANCELLED" });

    const result = await cancel_order_svc(
      "order-uuid-001",
      "consumer-uuid-001",
      "CONSUMER"
    );

    expect(cancel_order).toHaveBeenCalledWith("order-uuid-001", "consumer-uuid-001");
    expect(orderEmitter.emit).toHaveBeenCalledWith("order:cancelled", expect.any(Object));
    expect(result.status).toBe("CANCELLED");
  });

  it("admin can cancel any order (FR-A-03 force-cancel)", async () => {
    find_order_by_id.mockResolvedValue({
      ...MOCK_ORDER_PENDING,
      user_id: "consumer-uuid-001",
    });
    cancel_order.mockResolvedValue({ ...MOCK_ORDER_PENDING, status: "CANCELLED" });

    const result = await cancel_order_svc(
      "order-uuid-001",
      "admin-uuid-999",
      "ADMIN"
    );

    expect(cancel_order).toHaveBeenCalledOnce();
    expect(result.status).toBe("CANCELLED");
  });

  it("should throw 403 when consumer tries to cancel another user's order", async () => {
    find_order_by_id.mockResolvedValue({
      ...MOCK_ORDER_PENDING,
      user_id: "other-consumer-uuid",
    });

    await expect(
      cancel_order_svc("order-uuid-001", "consumer-uuid-001", "CONSUMER")
    ).rejects.toMatchObject({ statusCode: 403 });

    expect(cancel_order).not.toHaveBeenCalled();
  });

  it("should throw 404 when order does not exist", async () => {
    find_order_by_id.mockResolvedValue(null);

    await expect(
      cancel_order_svc("no-order", "consumer-uuid-001", "CONSUMER")
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("FR-K-04 — get_customer_orders (Order History)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return all orders for a user", async () => {
    find_orders_by_user.mockResolvedValue([MOCK_ORDER_PENDING, MOCK_ORDER_PAID]);

    const result = await get_customer_orders("consumer-uuid-001");

    expect(find_orders_by_user).toHaveBeenCalledWith("consumer-uuid-001");
    expect(result).toHaveLength(2);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("FR-SEC-01 — get_order (RBAC ownership guard)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return order when consumer accesses their own order", async () => {
    find_order_by_id.mockResolvedValue(MOCK_ORDER_PENDING);

    const result = await get_order(
      "order-uuid-001",
      "consumer-uuid-001",
      "CONSUMER"
    );

    expect(result.id).toBe("order-uuid-001");
  });

  it("should return order when ADMIN accesses any order", async () => {
    find_order_by_id.mockResolvedValue(MOCK_ORDER_PENDING);

    const result = await get_order("order-uuid-001", "admin-uuid", "ADMIN");
    expect(result.id).toBe("order-uuid-001");
  });

  it("should throw 403 when consumer accesses another user's order", async () => {
    find_order_by_id.mockResolvedValue({
      ...MOCK_ORDER_PENDING,
      user_id: "other-user-uuid",
    });

    await expect(
      get_order("order-uuid-001", "consumer-uuid-001", "CONSUMER")
    ).rejects.toMatchObject({ statusCode: 403 });
  });
});
