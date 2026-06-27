/**
 * @file tests/unit/notification.service.test.js
 * @description Unit tests for notification.service.js
 * Covers: save_token, remove_token, send_multicast_notification,
 *         notify_all_customers_of_new_listing
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { CUSTOMER_ID, mockListing } from "./mocks/mockData.js";

// ── Mock dependencies ─────────────────────────────────────────────────────────
vi.mock("../../src/lib/firebase-admin.js", () => ({
  messaging: {
    sendEachForMulticast: vi.fn(),
  },
}));

vi.mock("../../src/repositories/deviceToken.repository.js", () => ({
  upsert_device_token: vi.fn(),
  delete_device_token: vi.fn(),
  get_customer_device_tokens: vi.fn(),
}));

import {
  save_token,
  remove_token,
  send_multicast_notification,
  notify_all_customers_of_new_listing,
} from "../../src/services/notification.service.js";

import * as deviceTokenRepo from "../../src/repositories/deviceToken.repository.js";
import { messaging } from "../../src/lib/firebase-admin.js";

// ─────────────────────────────────────────────────────────────────────────────
describe("notification.service — save_token", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls upsert_device_token with correct args", async () => {
    deviceTokenRepo.upsert_device_token.mockResolvedValue({ token: "fcm-token-abc" });

    await save_token(CUSTOMER_ID, "fcm-token-abc", "android");
    expect(deviceTokenRepo.upsert_device_token).toHaveBeenCalledWith(
      CUSTOMER_ID,
      "fcm-token-abc",
      "android"
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("notification.service — remove_token", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls delete_device_token with correct args", async () => {
    deviceTokenRepo.delete_device_token.mockResolvedValue({ count: 1 });

    await remove_token(CUSTOMER_ID, "fcm-token-abc");
    expect(deviceTokenRepo.delete_device_token).toHaveBeenCalledWith(CUSTOMER_ID, "fcm-token-abc");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("notification.service — send_multicast_notification", () => {
  beforeEach(() => vi.clearAllMocks());

  it("sends multicast notification to all tokens", async () => {
    messaging.sendEachForMulticast.mockResolvedValue({ successCount: 2, failureCount: 0 });

    const result = await send_multicast_notification(
      ["token-1", "token-2"],
      "Test Title",
      "Test Body",
      { type: "test" }
    );

    expect(messaging.sendEachForMulticast).toHaveBeenCalledWith({
      tokens: ["token-1", "token-2"],
      notification: { title: "Test Title", body: "Test Body" },
      data: { type: "test" },
    });
    expect(result.successCount).toBe(2);
  });

  it("returns early when token list is empty", async () => {
    const result = await send_multicast_notification([], "Title", "Body");

    expect(messaging.sendEachForMulticast).not.toHaveBeenCalled();
    expect(result.success).toBe(true);
    expect(result.message).toBe("No tokens to notify");
  });

  it("returns early when tokens is null", async () => {
    const result = await send_multicast_notification(null, "Title", "Body");

    expect(messaging.sendEachForMulticast).not.toHaveBeenCalled();
    expect(result.success).toBe(true);
  });

  it("throws when Firebase sendEachForMulticast fails", async () => {
    messaging.sendEachForMulticast.mockRejectedValue(new Error("Firebase error"));

    await expect(
      send_multicast_notification(["token-1"], "Title", "Body")
    ).rejects.toThrow("Firebase error");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("notification.service — notify_all_customers_of_new_listing", () => {
  beforeEach(() => vi.clearAllMocks());

  it("sends notification to all customers when tokens exist", async () => {
    deviceTokenRepo.get_customer_device_tokens.mockResolvedValue(["token-1", "token-2"]);
    messaging.sendEachForMulticast.mockResolvedValue({ successCount: 2, failureCount: 0 });

    await notify_all_customers_of_new_listing(mockListing, "Toko Enak");

    expect(messaging.sendEachForMulticast).toHaveBeenCalledOnce();
    const callArg = messaging.sendEachForMulticast.mock.calls[0][0];
    expect(callArg.tokens).toEqual(["token-1", "token-2"]);
    expect(callArg.notification.title).toContain("Toko Enak");
    expect(callArg.notification.body).toContain("Nasi Padang Sisa");
  });

  it("skips sending when no customer tokens exist", async () => {
    deviceTokenRepo.get_customer_device_tokens.mockResolvedValue([]);

    await notify_all_customers_of_new_listing(mockListing, "Toko Enak");
    expect(messaging.sendEachForMulticast).not.toHaveBeenCalled();
  });

  it("skips sending when tokens is null", async () => {
    deviceTokenRepo.get_customer_device_tokens.mockResolvedValue(null);

    await notify_all_customers_of_new_listing(mockListing, "Toko Enak");
    expect(messaging.sendEachForMulticast).not.toHaveBeenCalled();
  });
});
