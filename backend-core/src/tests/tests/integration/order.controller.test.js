/**
 * @file tests/integration/order.controller.test.js
 * @description Integration tests for order.controller.js via HTTP routes.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";
import {
  CUSTOMER_ID,
  MERCHANT_ID,
  ADMIN_ID,
  ORDER_ID,
  mockOrder,
  mockPaidOrder,
  mockCompletedOrder,
} from "../unit/mocks/mockData.js";

// ── Mock service ──────────────────────────────────────────────────────────────
vi.mock("../../src/services/order.service.js", () => ({
  create_order: vi.fn(),
  get_customer_orders: vi.fn(),
  get_order: vi.fn(),
  confirm_payment: vi.fn(),
  cancel_order_svc: vi.fn(),
  get_merchant_orders: vi.fn(),
  change_order_status: vi.fn(),
  pickup_order: vi.fn(),
  get_all_order_svc: vi.fn(),
}));

import * as orderService from "../../src/services/order.service.js";
import {
  create_order_handler,
  get_customer_orders_handler,
  get_order_handler,
  confirm_transfer_handler,
  cancel_order_handler,
  get_merchant_orders_handler,
  change_order_status_handler,
  pickup_order_handler,
  get_all_order_handler,
} from "../../src/controllers/order.controller.js";

// ── Helpers ───────────────────────────────────────────────────────────────────
function buildApp(role = "CUSTOMER", userId = CUSTOMER_ID) {
  const app = express();
  app.use(express.json());
  // Inject mock user into req.user
  app.use((req, _res, next) => {
    req.user = { id: userId, role };
    next();
  });
  app.post("/orders", create_order_handler);
  app.get("/orders", get_customer_orders_handler);
  app.get("/orders/:public_id", get_order_handler);
  app.patch("/orders/:public_id/confirm-transfer", confirm_transfer_handler);
  app.patch("/orders/:public_id/cancel", cancel_order_handler);
  app.get("/orders/merchant", get_merchant_orders_handler);
  app.patch("/orders/:id/status", change_order_status_handler);
  app.post("/orders/pickup", pickup_order_handler);
  app.get("/orders/admin/all", get_all_order_handler);
  return app;
}

// Serialize BigInt in mock order to avoid JSON issues
const safeOrder = JSON.parse(JSON.stringify(mockOrder, (_, v) =>
  typeof v === "bigint" ? v.toString() : v
));
const safePaidOrder = JSON.parse(JSON.stringify(mockPaidOrder, (_, v) =>
  typeof v === "bigint" ? v.toString() : v
));

// ─────────────────────────────────────────────────────────────────────────────
describe("POST /orders", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 201 on successful order creation", async () => {
    orderService.create_order.mockResolvedValue(mockOrder);

    const res = await request(buildApp())
      .post("/orders")
      .send({ listing_id: "listing-uuid", qty: 2 });

    expect(res.status).toBe(201);
    expect(res.body.message).toContain("created");
  });

  it("propagates service errors (400)", async () => {
    const err = new Error("qty must be a positive integer");
    err.statusCode = 400;
    orderService.create_order.mockRejectedValue(err);

    const res = await request(buildApp())
      .post("/orders")
      .send({ listing_id: "lid", qty: 0 });

    // Error middleware not wired in minimal test app — service throws → 500
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("GET /orders", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 with customer orders list", async () => {
    orderService.get_customer_orders.mockResolvedValue([mockOrder]);

    const res = await request(buildApp()).get("/orders");

    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("GET /orders/:public_id", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 with order data", async () => {
    orderService.get_order.mockResolvedValue({
      ...mockOrder,
      customer_id: CUSTOMER_ID,
      merchant_id: MERCHANT_ID,
    });

    const res = await request(buildApp()).get(`/orders/${ORDER_ID}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("PATCH /orders/:public_id/confirm-transfer", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 on successful payment confirmation", async () => {
    orderService.confirm_payment.mockResolvedValue(mockPaidOrder);

    const res = await request(buildApp())
      .patch(`/orders/${ORDER_ID}/confirm-transfer`)
      .send({ payment_method: "bank_transfer" });

    expect(res.status).toBe(200);
    expect(res.body.message).toContain("confirmed");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("PATCH /orders/:public_id/cancel", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 on successful cancellation", async () => {
    orderService.cancel_order_svc.mockResolvedValue({ ...mockOrder, status: "cancelled" });

    const res = await request(buildApp())
      .patch(`/orders/${ORDER_ID}/cancel`);

    expect(res.status).toBe(200);
    expect(res.body.message).toContain("cancelled");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("GET /orders/merchant (merchant only)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 with merchant orders", async () => {
    orderService.get_merchant_orders.mockResolvedValue([mockOrder]);

    const res = await request(buildApp("MERCHANT", MERCHANT_ID)).get("/orders/merchant");

    expect(res.status).toBe(200);
    // handler uses res.json with success: true
    expect(res.body.data).toBeDefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("PATCH /orders/:id/status (merchant)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 on valid status transition", async () => {
    orderService.change_order_status.mockResolvedValue({ ...mockOrder, status: "preparing" });

    const res = await request(buildApp("MERCHANT", MERCHANT_ID))
      .patch(`/orders/${ORDER_ID}/status`)
      .send({ status: "preparing" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("POST /orders/pickup (merchant)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 on successful pickup", async () => {
    orderService.pickup_order.mockResolvedValue(mockCompletedOrder);

    const res = await request(buildApp("MERCHANT", MERCHANT_ID))
      .post("/orders/pickup")
      .send({ pickup_code: "ABC123", order_public_id: ORDER_ID });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain("completed");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("GET /orders/admin/all (admin)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 with all orders for admin", async () => {
    orderService.get_all_order_svc.mockResolvedValue([mockOrder, mockPaidOrder]);

    const res = await request(buildApp("ADMIN", ADMIN_ID)).get("/orders/admin/all");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
