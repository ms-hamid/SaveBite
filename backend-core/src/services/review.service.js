/**
 * @file src/services/review.service.js
 */

import {
  count_reviews_by_merchant,
  create_review,
  find_existing_review,
  find_reviews_by_merchant,
  update_merchant_rating,
} from "../repositories/review.repository.js";
import { find_listing_by_id } from "../repositories/listing.repository.js";
import { createError } from "../middlewares/error.middleware.js";

/**
 * Get paginated reviews for a merchant, with rating distribution.
 * @param {string} merchant_id  (UUID of the merchant / profile user_id)
 */
export async function get_merchant_reviews(merchant_id, { take = 20, skip = 0 } = {}) {
  const [reviews, total] = await Promise.all([
    find_reviews_by_merchant(merchant_id, { take, skip }),
    count_reviews_by_merchant(merchant_id),
  ]);

  return { reviews, total };
}

/**
 * Submit a review.
 *
 * Context A — from /merchant/[id]/review  → listing_id = null
 * Context B — from /order/[id]/rate       → listing_id = listing.id (from the order's listing)
 *
 * Uniqueness: one review per (customer_id, merchant_id, listing_id).
 * If listing_id is null, the customer can only have ONE general merchant review.
 */
export async function submit_review({
  customer_id,
  merchant_id,
  listing_public_id,   // may be undefined/null → general merchant review
  rating,
  review_text,
  img_url,
}) {
  // Validate rating
  const ratingNum = Number(rating);
  if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    throw createError("Rating must be an integer between 1 and 5", 422);
  }

  // Resolve listing_id if provided
  let listing_id = null;
  if (listing_public_id) {
    const listing = await find_listing_by_id(listing_public_id);
    if (!listing) throw createError("Listing not found", 404);
    listing_id = listing.id;
  }

  // Enforce one-review-per-context uniqueness
  const existing = await find_existing_review(customer_id, merchant_id, listing_id);
  if (existing) {
    throw createError("You have already reviewed this.", 409);
  }

  // Persist the review
  const review = await create_review({
    rating: ratingNum,
    review_text,
    img_url: img_url ?? null,
    merchant_id,
    listing_id,
    customer_id,
  });

  // Update merchant aggregate rating
  await update_merchant_rating(merchant_id);

  return review;
}

/**
 * Check if the authenticated user already has a review for this context.
 */
export async function check_reviewed(customer_id, merchant_id, listing_public_id = null) {
  let listing_id = null;
  if (listing_public_id) {
    const listing = await find_listing_by_id(listing_public_id);
    if (listing) listing_id = listing.id;
  }
  const existing = await find_existing_review(customer_id, merchant_id, listing_id);
  return { has_reviewed: !!existing, review: existing ?? null };
}
