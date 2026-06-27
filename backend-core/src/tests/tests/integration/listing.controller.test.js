/**
 * @file tests/integration/listing.controller.test.js
 * @description Integration tests for listing.controller.js via HTTP routes.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";
import { MERCHANT_ID, LISTING_ID, mockListing } from "../unit/mocks/mockData.js";

// ── Mock service ──────────────────────────────────────────────────────────────
vi.mock("../../src/services/listing.service.js", () => ({
  get_listing: vi.fn(),
  get_active_listings: vi.fn(),
  publish_listing: vi.fn(),
  update_listing_svc: vi.fn(),
  delete_listing_svc: vi.fn(),
  getAllListings: vi.fn(),
  get_my_listings: vi.fn(),
}));

import * as listingService from "../../src/services/listing.service.js";
import {
  get_listing_handler,
  get_listings_handler,
  create_listing_handler,
  update_listing_handler,
  delete_listing_handler,
  get_my_listings_handler,
} from "../../src/controllers/listing.controller.js";

// ── Minimal Express app ───────────────────────────────────────────────────────
function buildApp(role = "MERCHANT", userId = MERCHANT_ID) {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    req.user = { id: userId, role };
    next();
  });
  app.get("/listings", get_listings_handler);
  app.get("/listings/me", get_my_listings_handler);
  app.get("/listings/:public_id", get_listing_handler);
  app.post("/listings", create_listing_handler);
  app.patch("/listings/:public_id", update_listing_handler);
  app.delete("/listings/:public_id", delete_listing_handler);
  return app;
}

// Safely serialized mock
const safeListing = JSON.parse(JSON.stringify(mockListing, (_, v) =>
  typeof v === "bigint" ? v.toString() : v
));

// ─────────────────────────────────────────────────────────────────────────────
describe("GET /listings", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 with listings array", async () => {
    listingService.get_active_listings.mockResolvedValue([mockListing]);

    const res = await request(buildApp()).get("/listings");

    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it("passes geo query params to service", async () => {
    listingService.get_active_listings.mockResolvedValue([]);

    await request(buildApp()).get("/listings?lat=1.13&lng=104.05&radius_km=5");

    expect(listingService.get_active_listings).toHaveBeenCalledWith({
      lat: 1.13,
      lng: 104.05,
      radius_km: 5,
    });
  });

  it("uses default radius_km=10 when not provided", async () => {
    listingService.get_active_listings.mockResolvedValue([]);

    await request(buildApp()).get("/listings?lat=1.13&lng=104.05");

    expect(listingService.get_active_listings).toHaveBeenCalledWith(
      expect.objectContaining({ radius_km: 10 })
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("GET /listings/:public_id", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 with listing detail", async () => {
    listingService.get_listing.mockResolvedValue(mockListing);

    const res = await request(buildApp()).get(`/listings/${LISTING_ID}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("POST /listings (merchant only)", () => {
  const validBody = {
    name: "Roti Sisa",
    description: "Roti segar",
    stock_total: 5,
    original_price: 20000,
    discount_price: 10000,
    open_time: new Date(Date.now() - 3_600_000).toISOString(),
    close_time: new Date(Date.now() + 3_600_000).toISOString(),
  };

  beforeEach(() => vi.clearAllMocks());

  it("returns 201 on successful listing creation", async () => {
    listingService.publish_listing.mockResolvedValue(mockListing);

    const res = await request(buildApp()).post("/listings").send(validBody);

    expect(res.status).toBe(201);
    expect(res.body.message).toContain("published");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("PATCH /listings/:public_id (merchant only)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 on successful update", async () => {
    listingService.update_listing_svc.mockResolvedValue({ ...mockListing, name: "Updated" });

    const res = await request(buildApp())
      .patch(`/listings/${LISTING_ID}`)
      .send({ name: "Updated" });

    expect(res.status).toBe(200);
    expect(res.body.message).toContain("updated");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("DELETE /listings/:public_id (merchant only)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 on successful soft-delete", async () => {
    listingService.delete_listing_svc.mockResolvedValue({
      public_id: LISTING_ID,
      deleted_at: new Date(),
    });

    const res = await request(buildApp()).delete(`/listings/${LISTING_ID}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toContain("deleted");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("GET /listings/me (merchant only)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 200 with merchant own listings", async () => {
    listingService.get_my_listings.mockResolvedValue([mockListing]);

    const res = await request(buildApp()).get("/listings/me");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
  });
});
