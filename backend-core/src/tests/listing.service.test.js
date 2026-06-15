/**
 * @file src/tests/listing.service.test.js
 * @description Unit tests for listing.service.js
 *
 * FR Coverage:
 *   FR-K-01  — get_active_listings (GPS discovery, Haversine)
 *   FR-M-02  — publish_listing (CRUD listing, price validation)
 *   FR-M-02  — update_listing_svc (ownership + update)
 *
 * Mocking guardrail:
 *   listing.repository.js is fully mocked — NO live DB calls.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock repository ───────────────────────────────────────────────────────────
vi.mock("../repositories/listing.repository.js", () => ({
  find_listing_by_id: vi.fn(),
  find_active_listings: vi.fn(),
  create_listing: vi.fn(),
  update_listing: vi.fn(),
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
  get_listing,
  get_active_listings,
  publish_listing,
  update_listing_svc,
} from "../services/listing.service.js";

import {
  find_listing_by_id,
  find_active_listings,
  create_listing,
  update_listing,
} from "../repositories/listing.repository.js";

// ─────────────────────────────────────────────────────────────────────────────

const MOCK_LISTING = {
  id: "listing-uuid-001",
  merchant_id: "merchant-uuid-001",
  title: "Nasi Box Sisa",
  original_price: 30000,
  discount_price: 15000,
  stock: 5,
  status: "PUBLISHED",
  expired_at: new Date(Date.now() + 3600 * 1000), // 1 hour from now
};

// ─────────────────────────────────────────────────────────────────────────────

describe("FR-K-01 — get_active_listings (GPS Discovery)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return listings from repository without geo filter", async () => {
    find_active_listings.mockResolvedValue([MOCK_LISTING]);

    const result = await get_active_listings({});

    expect(find_active_listings).toHaveBeenCalledWith({});
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("listing-uuid-001");
  });

  it("should pass lat/lng/radius_km to repository when provided", async () => {
    find_active_listings.mockResolvedValue([MOCK_LISTING]);

    const opts = { lat: 1.1, lng: 104.0, radius_km: 5 };
    await get_active_listings(opts);

    expect(find_active_listings).toHaveBeenCalledWith(opts);
  });

  it("should return an empty array when no listings are found", async () => {
    find_active_listings.mockResolvedValue([]);

    const result = await get_active_listings({});
    expect(result).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("FR-M-02 — publish_listing (Create Listing)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should create a listing when all fields are valid", async () => {
    create_listing.mockResolvedValue(MOCK_LISTING);

    const body = {
      title: "Nasi Box Sisa",
      original_price: 30000,
      discount_price: 15000,
      stock: 5,
      expired_at: new Date(Date.now() + 7200 * 1000).toISOString(),
    };

    const result = await publish_listing("merchant-uuid-001", body);

    expect(create_listing).toHaveBeenCalledOnce();
    expect(result.id).toBe("listing-uuid-001");
  });

  it("should throw 422 when discount_price >= original_price", async () => {
    const body = {
      title: "Test",
      original_price: 10000,
      discount_price: 10000, // equal → invalid
      stock: 3,
      expired_at: new Date(Date.now() + 3600 * 1000).toISOString(),
    };

    await expect(publish_listing("merchant-uuid-001", body)).rejects.toMatchObject(
      { statusCode: 422 }
    );
    expect(create_listing).not.toHaveBeenCalled();
  });

  it("should throw 422 when expired_at is in the past", async () => {
    const body = {
      title: "Expired Listing",
      original_price: 30000,
      discount_price: 15000,
      stock: 5,
      expired_at: new Date(Date.now() - 1000).toISOString(), // in the past
    };

    await expect(publish_listing("merchant-uuid-001", body)).rejects.toMatchObject(
      { statusCode: 422 }
    );
    expect(create_listing).not.toHaveBeenCalled();
  });

  it("should throw 400 when required fields are missing", async () => {
    const body = { title: "Incomplete" }; // missing price, stock, expired_at

    await expect(publish_listing("merchant-uuid-001", body)).rejects.toMatchObject(
      { statusCode: 400 }
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("FR-M-02 — update_listing_svc (Update Listing)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should update a listing when merchant owns it", async () => {
    find_listing_by_id
      .mockResolvedValueOnce(MOCK_LISTING) // first call: existing check
      .mockResolvedValueOnce({ ...MOCK_LISTING, title: "Updated Title" }); // second call: return updated

    update_listing.mockResolvedValue({ count: 1 });

    const result = await update_listing_svc(
      "listing-uuid-001",
      "merchant-uuid-001",
      { title: "Updated Title" }
    );

    expect(update_listing).toHaveBeenCalledOnce();
    expect(result.title).toBe("Updated Title");
  });

  it("should throw 403 when merchant does not own the listing", async () => {
    find_listing_by_id.mockResolvedValue({
      ...MOCK_LISTING,
      merchant_id: "other-merchant-uuid",
    });

    await expect(
      update_listing_svc("listing-uuid-001", "merchant-uuid-001", {
        title: "Hacked",
      })
    ).rejects.toMatchObject({ statusCode: 403 });
  });

  it("should throw 404 when listing does not exist", async () => {
    find_listing_by_id.mockResolvedValue(null);

    await expect(
      update_listing_svc("non-existent-id", "merchant-uuid-001", {})
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});
