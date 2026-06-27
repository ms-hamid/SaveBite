/**
 * @file tests/integration/notification.controller.test.js
 * @description Integration tests for notification.controller.js via HTTP routes.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";
import { CUSTOMER_ID } from "../unit/mocks/mockData.js";

// ── Mock service ──────────────────────────────────────────────────────────────
vi.mock("../../src/services/notification.service.js", () => ({
  save_token: vi.fn(),
  remove_token: vi.fn(),
}));

import * as notificationService from "../../src/services/notification.service.js";
import {
  save_token_handler,
  delete_token_handler,
} from "../../src/controllers/notification.controller.js";

// ── Minimal Express app ───────────────────────────────────────────────────────
function buildApp(userId = CUSTOMER_ID) {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    req.user = { id: userId };
    next();
  });
  app.post("/notifications/device-token", save_token_handler);
  app.delete("/notifications/device-token/:token", delete_token_handler);
  return app;
}

// ─────────────────────────────────────────────────────────────────────────────
describe("POST /notifications/device-token", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 on successful token registration", async () => {
    notificationService.save_token.mockResolvedValue({ token: "fcm-token-abc" });

    const res = await request(buildApp())
      .post("/notifications/device-token")
      .send({ token: "fcm-token-abc", platform: "android" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain("registered");
    expect(notificationService.save_token).toHaveBeenCalledWith(
      CUSTOMER_ID,
      "fcm-token-abc",
      "android"
    );
  });

  it("returns 200 without platform (optional field)", async () => {
    notificationService.save_token.mockResolvedValue({});

    const res = await request(buildApp())
      .post("/notifications/device-token")
      .send({ token: "fcm-token-ios" });

    expect(res.status).toBe(200);
    expect(notificationService.save_token).toHaveBeenCalledWith(
      CUSTOMER_ID,
      "fcm-token-ios",
      undefined
    );
  });

  it("returns 400 when token is missing", async () => {
    const res = await request(buildApp())
      .post("/notifications/device-token")
      .send({ platform: "android" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("required");
    expect(notificationService.save_token).not.toHaveBeenCalled();
  });

  it("returns 400 when token is empty string", async () => {
    const res = await request(buildApp())
      .post("/notifications/device-token")
      .send({ token: "" });

    expect(res.status).toBe(400);
    expect(notificationService.save_token).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("DELETE /notifications/device-token/:token", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 on successful token deletion", async () => {
    notificationService.remove_token.mockResolvedValue({ count: 1 });

    const res = await request(buildApp()).delete(
      "/notifications/device-token/fcm-token-abc"
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain("deleted");
    expect(notificationService.remove_token).toHaveBeenCalledWith(
      CUSTOMER_ID,
      "fcm-token-abc"
    );
  });

  it("returns 200 even when token doesn't exist (idempotent delete)", async () => {
    notificationService.remove_token.mockResolvedValue({ count: 0 });

    const res = await request(buildApp()).delete(
      "/notifications/device-token/nonexistent-token"
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
