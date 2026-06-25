/**
 * @file src/routes/merchant/listing.route.js
 * @description REST routes for the Listing domain.
 *
 * Route Map:
 *   GET    /api/listings          → public: all active listings (geo-optional)
 *   GET    /api/listings/:id      → public: single listing detail
 *   POST   /api/listings          → MERCHANT: publish a new listing
 *   PATCH  /api/listings/:id      → MERCHANT: update own listing
 */

import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/rbac.middleware.js";
import { asyncHandler } from "../../middlewares/error.middleware.js";
import {
  create_listing_handler,
  delete_listing_handler,
  get_listing_handler,
  get_listings_handler,
  get_my_listings_handler,
  update_listing_handler,
} from "../../controllers/listing.controller.js";

const listing_route = express.Router();

// ── Protected routes (MERCHANT only) ─────────────────────────────────────────
listing_route.get(
  "/my",
  authenticate,
  authorize("MERCHANT"),
  asyncHandler(get_my_listings_handler)
);

listing_route.post(
  "/",
  authenticate,
  authorize("MERCHANT"),
  asyncHandler(create_listing_handler)
);

listing_route.patch(
  "/:public_id",
  authenticate,
  authorize("MERCHANT"),
  asyncHandler(update_listing_handler)
);

listing_route.delete(
  "/:public_id",
  authenticate,
  authorize("MERCHANT"),
  asyncHandler(delete_listing_handler)
);

// ── Public routes (no auth required for reads) ────────────────────────────────
listing_route.get("/", asyncHandler(get_listings_handler));
listing_route.get("/:public_id", asyncHandler(get_listing_handler));

export default listing_route;
