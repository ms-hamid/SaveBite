/**
 * @file tests/unit/listing.service.test.js
 * @description Unit tests for listing.service.js
 * Covers: get_listing, get_active_listings, publish_listing,
 *         update_listing_svc, delete_listing_svc, get_my_listings
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { MERCHANT_ID, LISTING_ID, mockListing } from "./mocks/mockData.js";

// ── Mock dependencies ─────────────────────────────────────────────────────────
vi.mock("../../src/repositories/listing.repository.js", () => ({
  find_listing_by_id: vi.fn(),
  find_active_listings: vi.fn(),
  create_listing: vi.fn(),
  update_listing: vi.fn(),
  destroy_listing: vi.fn(),
  find_my_listings: vi.fn(),
}));

vi.mock("../../src/services/notification.service.js", () => ({
  notify_all_customers_of_new_listing: vi.fn().mockResolvedValue({}),
}));

vi.mock("../../src/middlewares/error.middleware.js", () => ({
  createError: vi.fn((msg, code) => {
    const err = new Error(msg);
    err.statusCode = code;
    return err;
  }),
}));

import {
  get_listing,
  get_active_listings,
  publish_listing,
  update_listing_svc,
  delete_listing_svc,
  get_my_listings,
} from "../../src/services/listing.service.js";

import * as listingRepo from "../../src/repositories/listing.repository.js";

// ─────────────────────────────────────────────────────────────────────────────
describe("listing.service — get_listing", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns listing when found", async () => {
    listingRepo.find_listing_by_id.mockResolvedValue(mockListing);

    const result = await get_listing(LISTING_ID);
    expect(result.public_id).toBe(LISTING_ID);
    expect(result.name).toBe("Nasi Padang Sisa");
  });

  it("throws 404 when listing not found", async () => {
    listingRepo.find_listing_by_id.mockResolvedValue(null);

    await expect(get_listing("nonexistent-id")).rejects.toMatchObject({
      statusCode: 404,
      message: "Listing not found",
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("listing.service — get_active_listings", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns all active listings without geo filter", async () => {
    listingRepo.find_active_listings.mockResolvedValue([mockListing]);

    const result = await get_active_listings({});
    expect(result).toHaveLength(1);
    expect(listingRepo.find_active_listings).toHaveBeenCalledWith({});
  });

  it("passes geo params to repository", async () => {
    listingRepo.find_active_listings.mockResolvedValue([mockListing]);
    const opts = { lat: 1.13, lng: 104.05, radius_km: 5 };

    await get_active_listings(opts);
    expect(listingRepo.find_active_listings).toHaveBeenCalledWith(opts);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("listing.service — publish_listing", () => {
  const validBody = {
    name: "Roti Sisa",
    description: "Roti berkualitas",
    stock_total: 5,
    original_price: 20000,
    discount_price: 10000,
    open_time: new Date(Date.now() - 3_600_000).toISOString(),
    close_time: new Date(Date.now() + 3_600_000).toISOString(),
    img_url: "https://example.com/roti.jpg",
  };

  beforeEach(() => vi.clearAllMocks());

  it("creates a listing with correct discount percentage", async () => {
    listingRepo.create_listing.mockResolvedValue({
      ...mockListing,
      name: "Roti Sisa",
      discount_percentage: 50,
    });

    const result = await publish_listing(MERCHANT_ID, validBody);
    expect(result.discount_percentage).toBe(50);
    expect(listingRepo.create_listing).toHaveBeenCalledOnce();
  });

  it("throws 400 when required fields are missing", async () => {
    await expect(
      publish_listing(MERCHANT_ID, { name: "Only name" })
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it("throws 422 when discount_price >= original_price", async () => {
    await expect(
      publish_listing(MERCHANT_ID, {
        ...validBody,
        discount_price: 25000, // >= original_price (20000)
      })
    ).rejects.toMatchObject({ statusCode: 422 });
  });

  it("throws when stock_total is 0 (falsy, caught by required check)", async () => {
    // stock_total: 0 is falsy → caught by required-fields check (400)
    await expect(
      publish_listing(MERCHANT_ID, { ...validBody, stock_total: 0 })
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it("throws 422 when stock_total is negative (passes truthy, fails > 0 check)", async () => {
    await expect(
      publish_listing(MERCHANT_ID, { ...validBody, stock_total: -1 })
    ).rejects.toMatchObject({ statusCode: 422 });
  });

  it("throws 422 when close_time <= open_time", async () => {
    const now = new Date();
    await expect(
      publish_listing(MERCHANT_ID, {
        ...validBody,
        open_time: new Date(now.getTime() + 3_600_000).toISOString(),
        close_time: now.toISOString(),
      })
    ).rejects.toMatchObject({ statusCode: 422 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("listing.service — update_listing_svc", () => {
  beforeEach(() => vi.clearAllMocks());

  it("updates listing for owner", async () => {
    listingRepo.find_listing_by_id
      .mockResolvedValueOnce({ ...mockListing, merchant_id: MERCHANT_ID })
      .mockResolvedValueOnce({ ...mockListing, name: "Updated Name" });
    listingRepo.update_listing.mockResolvedValue({ count: 1 });

    const result = await update_listing_svc(LISTING_ID, MERCHANT_ID, { name: "Updated Name" });
    expect(result.name).toBe("Updated Name");
  });

  it("throws 403 when non-owner tries to update", async () => {
    listingRepo.find_listing_by_id.mockResolvedValue({
      ...mockListing,
      merchant_id: "other-merchant",
    });

    await expect(
      update_listing_svc(LISTING_ID, MERCHANT_ID, { name: "Hack" })
    ).rejects.toMatchObject({ statusCode: 403 });
  });

  it("throws 404 when listing not found", async () => {
    listingRepo.find_listing_by_id.mockResolvedValue(null);

    await expect(
      update_listing_svc("nonexistent", MERCHANT_ID, { name: "X" })
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it("throws 422 when updated discount_price >= original_price", async () => {
    listingRepo.find_listing_by_id.mockResolvedValue({
      ...mockListing,
      merchant_id: MERCHANT_ID,
      original_price: 20000,
      discount_price: 10000,
    });

    await expect(
      update_listing_svc(LISTING_ID, MERCHANT_ID, { discount_price: 25000 })
    ).rejects.toMatchObject({ statusCode: 422 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("listing.service — delete_listing_svc", () => {
  beforeEach(() => vi.clearAllMocks());

  it("soft-deletes listing for owner", async () => {
    listingRepo.find_listing_by_id.mockResolvedValue({ ...mockListing, merchant_id: MERCHANT_ID });
    listingRepo.destroy_listing.mockResolvedValue({ count: 1, deleted_at: new Date() });

    const result = await delete_listing_svc(LISTING_ID, MERCHANT_ID);
    expect(result.public_id).toBe(LISTING_ID);
  });

  it("throws 403 when non-owner tries to delete", async () => {
    listingRepo.find_listing_by_id.mockResolvedValue({
      ...mockListing,
      merchant_id: "other-merchant",
    });

    await expect(delete_listing_svc(LISTING_ID, MERCHANT_ID)).rejects.toMatchObject({
      statusCode: 403,
    });
  });

  it("throws 404 when listing not found", async () => {
    listingRepo.find_listing_by_id.mockResolvedValue(null);

    await expect(delete_listing_svc("ghost", MERCHANT_ID)).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("listing.service — get_my_listings", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns merchant's own listings", async () => {
    listingRepo.find_my_listings.mockResolvedValue([mockListing]);

    const result = await get_my_listings(MERCHANT_ID);
    expect(result).toHaveLength(1);
    expect(listingRepo.find_my_listings).toHaveBeenCalledWith(MERCHANT_ID);
  });

  it("returns empty array when merchant has no listings", async () => {
    listingRepo.find_my_listings.mockResolvedValue([]);

    const result = await get_my_listings(MERCHANT_ID);
    expect(result).toHaveLength(0);
  });
});
