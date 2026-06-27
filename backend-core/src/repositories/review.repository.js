/**
 * @file src/repositories/review.repository.js
 * @description Data access for the reviews table.
 *
 * Schema: reviews {
 *   id, created_at, img_url, rating, review(date),
 *   merchant_id (FK → profiles.user_id),
 *   listing_id  (FK → listings.id, nullable),
 *   customer_id (FK → auth.users.id, nullable)
 * }
 *
 * Uniqueness per spec: one review per (merchant_id, listing_id, customer_id)
 *   - listing_id = null  → review via /merchant/[id]/review
 *   - listing_id = bigint → review via /order/[id]/rate
 */

import { prisma } from "../lib/prisma.js";

/**
 * Find all reviews for a merchant, newest first.
 * Includes reviewer name from profiles.
 */
export async function find_reviews_by_merchant(merchant_id, { take = 20, skip = 0 } = {}) {
  return prisma.review.findMany({
    where: { merchant_id },
    orderBy: { created_at: "desc" },
    take,
    skip,
    include: {
      users: {
        select: { id: true },
      },
      profile: {
        select: { full_name: true },
      },
    },
  });
}

/**
 * Count total reviews for a merchant.
 */
export async function count_reviews_by_merchant(merchant_id) {
  return prisma.review.count({ where: { merchant_id } });
}

/**
 * Check if a customer already reviewed a merchant (optionally for a specific listing).
 * listing_id = null means the "general merchant" review.
 */
export async function find_existing_review(customer_id, merchant_id, listing_id = null) {
  return prisma.review.findFirst({
    where: {
      customer_id,
      merchant_id,
      listing_id: listing_id ? BigInt(listing_id) : null,
    },
  });
}

/**
 * Create a new review.
 */
export async function create_review({ rating, review_text, img_url, merchant_id, listing_id, customer_id }) {
  return prisma.review.create({
    data: {
      rating,
      review: new Date(),   // Review.review is a Date (db.Date)
      img_url: img_url ?? null,
      merchant_id,
      listing_id: listing_id ? BigInt(listing_id) : null,
      customer_id: customer_id ?? null,
    },
  });
}

/**
 * Recompute and save the aggregate rating on the merchant record.
 * Called after every insert.
 */
export async function update_merchant_rating(merchant_id) {
  const { _avg, _count } = await prisma.review.aggregate({
    where: { merchant_id },
    _avg: { rating: true },
    _count: { rating: true },
  });

  return prisma.merchant.update({
    where: { user_id: merchant_id },
    data: {
      rating: _avg.rating ?? 0,
      rating_times: BigInt(_count.rating),
    },
  });
}
