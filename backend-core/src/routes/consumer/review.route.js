/**
 * @file src/routes/consumer/review.route.js
 *
 * GET    /review/merchant/:merchant_id          → public: list reviews
 * POST   /review/merchant/:merchant_id          → CUSTOMER: submit general merchant review
 * GET    /review/merchant/:merchant_id/status   → CUSTOMER: check if already reviewed
 * POST   /review/listing/:listing_public_id     → CUSTOMER: submit listing-level review
 * GET    /review/listing/:listing_public_id/status → CUSTOMER: check if already reviewed
 */

import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/rbac.middleware.js";
import { asyncHandler } from "../../middlewares/error.middleware.js";
import {
  check_listing_reviewed_handler,
  check_merchant_reviewed_handler,
  get_merchant_reviews_handler,
  submit_listing_review_handler,
  submit_merchant_review_handler,
} from "../../controllers/review.controller.js";

const review_route = express.Router();

// ── Public ────────────────────────────────────────────────────────────────────
review_route.get(
  "/merchant/:merchant_id",
  asyncHandler(get_merchant_reviews_handler)
);

// ── Authenticated (CUSTOMER only) ─────────────────────────────────────────────
review_route.post(
  "/merchant/:merchant_id",
  authenticate,
  authorize("CUSTOMER"),
  asyncHandler(submit_merchant_review_handler)
);

review_route.get(
  "/merchant/:merchant_id/status",
  authenticate,
  authorize("CUSTOMER"),
  asyncHandler(check_merchant_reviewed_handler)
);

review_route.post(
  "/listing/:listing_public_id",
  authenticate,
  authorize("CUSTOMER"),
  asyncHandler(submit_listing_review_handler)
);

review_route.get(
  "/listing/:listing_public_id/status",
  authenticate,
  authorize("CUSTOMER"),
  asyncHandler(check_listing_reviewed_handler)
);

export default review_route;
