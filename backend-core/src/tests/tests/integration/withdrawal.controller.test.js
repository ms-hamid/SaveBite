/**
 * @file tests/integration/withdrawal.controller.test.js
 * @description Integration tests for withdrawal.controller.js via HTTP routes.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";
import {
  MERCHANT_ID,
  ADMIN_ID,
  mockWithdrawal,
  mockCompletedWithdrawal,
  mockMerchant,
} from "../unit/mocks/mockData.js";

// ── Mock service ──────────────────────────────────────────────────────────────
vi.mock("../../src/services/withdrawal.service.js", () => ({
  get_merchant_virtual_balance_svc: vi.fn(),
  get_my_withdrawals_svc: vi.fn(),
  get_admin_withdrawals_svc: vi.fn(),
  get_withdrawal_svc: vi.fn(),
  create_withdrawal_svc: vi.fn(),
  update_withdrawal_svc: vi.fn(),
  cancel_withdrawal_svc: vi.fn(),
  review_withdrawal_svc: vi.fn(),
}));

import * as withdrawalService from "../../src/services/withdrawal.service.js";
import {
  get_merchant_balance_handler,
  get_my_withdrawals_handler,
  get_admin_withdrawals_handler,
  get_withdrawal_handler,
  create_withdrawal_handler,
  update_withdrawal_handler,
  cancel_withdrawal_handler,
  review_withdrawal_handler,
} from "../../src/controllers/withdrawal.controller.js";

// ── Minimal Express app ───────────────────────────────────────────────────────
function buildApp(role = "MERCHANT", userId = MERCHANT_ID) {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    req.user = { id: userId, role };
    next();
  });
  app.get("/withdrawal/balance", get_merchant_balance_handler);
  app.get("/withdrawal/my", get_my_withdrawals_handler);
  app.get("/withdrawal/admin", get_admin_withdrawals_handler);
  app.get("/withdrawal/:id", get_withdrawal_handler);
  app.post("/withdrawal", create_withdrawal_handler);
  app.patch("/withdrawal/:id", update_withdrawal_handler);
  app.patch("/withdrawal/:id/cancel", cancel_withdrawal_handler);
  app.patch("/withdrawal/:id/review", review_withdrawal_handler);
  return app;
}

// ─────────────────────────────────────────────────────────────────────────────
describe("GET /withdrawal/balance", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 with merchant balance", async () => {
    withdrawalService.get_merchant_virtual_balance_svc.mockResolvedValue({
      virtual_balance: 150000,
      merchant_name: "Toko Enak",
      bank_name: "BCA",
      bank_account: "1234567890",
    });

    const res = await request(buildApp()).get("/withdrawal/balance");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.virtual_balance).toBe(150000);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("GET /withdrawal/my", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 with merchant withdrawals list", async () => {
    withdrawalService.get_my_withdrawals_svc.mockResolvedValue([mockWithdrawal]);

    const res = await request(buildApp()).get("/withdrawal/my");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("GET /withdrawal/admin (admin only)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 with all withdrawals", async () => {
    withdrawalService.get_admin_withdrawals_svc.mockResolvedValue([
      mockWithdrawal,
      mockCompletedWithdrawal,
    ]);

    const res = await request(buildApp("ADMIN", ADMIN_ID)).get("/withdrawal/admin");

    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it("filters withdrawals by status query param", async () => {
    withdrawalService.get_admin_withdrawals_svc.mockResolvedValue([mockWithdrawal]);

    await request(buildApp("ADMIN", ADMIN_ID)).get("/withdrawal/admin?status=pending");

    expect(withdrawalService.get_admin_withdrawals_svc).toHaveBeenCalledWith({
      status: "pending",
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("GET /withdrawal/:id", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 with withdrawal detail", async () => {
    withdrawalService.get_withdrawal_svc.mockResolvedValue(mockWithdrawal);

    const res = await request(buildApp()).get("/withdrawal/1");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("POST /withdrawal", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 201 on successful withdrawal creation", async () => {
    withdrawalService.create_withdrawal_svc.mockResolvedValue(mockWithdrawal);

    const res = await request(buildApp())
      .post("/withdrawal")
      .send({ amount: 100000, qty: 5 });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain("created");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("PATCH /withdrawal/:id", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 on successful withdrawal update", async () => {
    withdrawalService.update_withdrawal_svc.mockResolvedValue({
      ...mockWithdrawal,
      amount: 120000,
    });

    const res = await request(buildApp())
      .patch("/withdrawal/1")
      .send({ amount: 120000 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("PATCH /withdrawal/:id/cancel", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 on successful cancellation", async () => {
    withdrawalService.cancel_withdrawal_svc.mockResolvedValue({
      ...mockWithdrawal,
      status: "cancelled",
    });

    const res = await request(buildApp()).patch("/withdrawal/1/cancel");

    expect(res.status).toBe(200);
    expect(res.body.message).toContain("cancelled");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("PATCH /withdrawal/:id/review (admin)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 on admin approval", async () => {
    withdrawalService.review_withdrawal_svc.mockResolvedValue(mockCompletedWithdrawal);

    const res = await request(buildApp("ADMIN", ADMIN_ID))
      .patch("/withdrawal/1/review")
      .send({ status: "completed" });

    expect(res.status).toBe(200);
    expect(res.body.message).toContain("updated");
  });

  it("returns 200 on admin decline", async () => {
    withdrawalService.review_withdrawal_svc.mockResolvedValue({
      ...mockWithdrawal,
      status: "declinec",
    });

    const res = await request(buildApp("ADMIN", ADMIN_ID))
      .patch("/withdrawal/1/review")
      .send({ status: "declinec" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
