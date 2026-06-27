/**
 * @file tests/integration/payment.controller.test.js
 * @description Integration tests for payment.controller.js via HTTP routes.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";
import {
  CUSTOMER_ID,
  ORDER_ID,
  PAYMENT_ID,
  mockPayment,
  mockSettledPayment,
  mockOrder,
} from "../unit/mocks/mockData.js";

// ── Mock service ──────────────────────────────────────────────────────────────
vi.mock("../../src/services/payment.service.js", () => ({
  createPaymentTransaction: vi.fn(),
  createQrisTransaction: vi.fn(),
  updatePaymentStatus: vi.fn(),
  checkPaymentStatus: vi.fn(),
}));

vi.mock("../../src/utils/json.js", () => ({
  serializeBigInt: vi.fn((v) => JSON.parse(JSON.stringify(v, (_, val) =>
    typeof val === "bigint" ? val.toString() : val
  ))),
}));

import * as paymentService from "../../src/services/payment.service.js";
import {
  createPaymentHandler,
  createQris,
  handleMidtransCallback,
  checkPaymentStatusHandler,
} from "../../src/controllers/payment.controller.js";

// ── Minimal Express app ───────────────────────────────────────────────────────
function buildApp(userId = CUSTOMER_ID) {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    req.user = { id: userId, role: "CUSTOMER" };
    next();
  });
  app.post("/payment", createPaymentHandler);
  app.post("/payment/qris", createQris);
  app.post("/payment/midtrans/callback", handleMidtransCallback);
  app.get("/payment/status/:order_public_id", checkPaymentStatusHandler);
  return app;
}

// ─────────────────────────────────────────────────────────────────────────────
describe("POST /payment", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 201 with QRIS payment data", async () => {
    paymentService.createPaymentTransaction.mockResolvedValue({
      payment_id: PAYMENT_ID.toString(),
      qris_url: "https://qris.example.com/qr.png",
      expired_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    });

    const res = await request(buildApp())
      .post("/payment")
      .send({ order_id: ORDER_ID, payment_method: "qris" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.qris_url).toBeDefined();
    expect(paymentService.createPaymentTransaction).toHaveBeenCalledWith(
      ORDER_ID,
      CUSTOMER_ID,
      "qris"
    );
  });

  it("returns 201 with VA payment data", async () => {
    paymentService.createPaymentTransaction.mockResolvedValue({
      payment_id: PAYMENT_ID.toString(),
      va_number: "12345678901234",
      expired_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    });

    const res = await request(buildApp())
      .post("/payment")
      .send({ order_id: ORDER_ID, payment_method: "va_bca" });

    expect(res.status).toBe(201);
    expect(res.body.data.va_number).toBe("12345678901234");
    expect(paymentService.createPaymentTransaction).toHaveBeenCalledWith(
      ORDER_ID,
      CUSTOMER_ID,
      "va_bca"
    );
  });

  it("defaults to 'qris' when no payment_method provided", async () => {
    paymentService.createPaymentTransaction.mockResolvedValue({
      payment_id: "1",
      qris_url: "https://qris.example.com/qr.png",
    });

    await request(buildApp()).post("/payment").send({ order_id: ORDER_ID });

    expect(paymentService.createPaymentTransaction).toHaveBeenCalledWith(
      ORDER_ID,
      CUSTOMER_ID,
      "qris"
    );
  });

  it("returns 500 on service error", async () => {
    paymentService.createPaymentTransaction.mockRejectedValue(new Error("Order not found"));

    const res = await request(buildApp())
      .post("/payment")
      .send({ order_id: "nonexistent" });

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("POST /payment/midtrans/callback", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 on successful callback processing", async () => {
    paymentService.updatePaymentStatus.mockResolvedValue({});

    const res = await request(buildApp())
      .post("/payment/midtrans/callback")
      .send({
        order_id: `${ORDER_ID}@1`,
        transaction_status: "settlement",
        fraud_status: "accept",
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("callback received");
  });

  it("returns 500 when callback processing fails", async () => {
    paymentService.updatePaymentStatus.mockRejectedValue(new Error("DB error"));

    const res = await request(buildApp())
      .post("/payment/midtrans/callback")
      .send({ order_id: "bad-id", transaction_status: "settlement" });

    expect(res.status).toBe(500);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("GET /payment/status/:order_public_id", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 with payment status", async () => {
    paymentService.checkPaymentStatus.mockResolvedValue({
      pg_status: "settlement",
      order_status: "paid_reserved",
      payment_id: "1",
      order_public_id: ORDER_ID,
    });

    const res = await request(buildApp()).get(`/payment/status/${ORDER_ID}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.pg_status).toBe("settlement");
  });

  it("returns 404 when order not found", async () => {
    paymentService.checkPaymentStatus.mockRejectedValue(new Error("Order not found"));

    const res = await request(buildApp()).get(`/payment/status/nonexistent`);

    expect(res.status).toBe(404);
  });

  it("returns 500 on unknown error", async () => {
    paymentService.checkPaymentStatus.mockRejectedValue(new Error("DB connection failed"));

    const res = await request(buildApp()).get(`/payment/status/${ORDER_ID}`);

    expect(res.status).toBe(500);
  });
});
