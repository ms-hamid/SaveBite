/**
 * @file src/services/listing.service.js
 * @description Business logic for the Listing domain.
 */

import {
  create_listing,
  find_active_listings,
  find_listing_by_id,
  update_listing,
} from "../repositories/listing.repository.js";
import { createError } from "../middlewares/error.middleware.js";

/**
 * Get a single published listing by ID.
 * @param {string} listingId
 */
export async function get_listing(listingId) {
  const listing = await find_listing_by_id(listingId);
  if (!listing) throw createError("Listing not found", 404);
  return listing;
}

/**
 * Get all active listings, optionally filtered by geo-proximity.
 * @param {{ lat?: number, lng?: number, radius_km?: number }} opts
 */
export async function get_active_listings(opts = {}) {
  return find_active_listings(opts);
}

/**
 * Create a new listing — only MERCHANT role can call this.
 * @param {string} merchantId
 * @param {object} body
 */
export async function publish_listing(merchantId, body) {
  const { title, original_price, discount_price, stock, expired_at } = body;

  if (!title || !original_price || !discount_price || !stock || !expired_at) {
    throw createError(
      "title, original_price, discount_price, stock, expired_at are required",
      400
    );
  }

  if (Number(discount_price) >= Number(original_price)) {
    throw createError("discount_price must be less than original_price", 422);
  }

  if (new Date(expired_at) <= new Date()) {
    throw createError("expired_at must be in the future", 422);
  }

  return create_listing(merchantId, {
    title,
    original_price,
    discount_price,
    stock: Number(stock),
    expired_at: new Date(expired_at),
  });
}

/**
 * Update a listing — merchant must own it.
 */
export async function update_listing_svc(listingId, merchantId, body) {
  const existing = await find_listing_by_id(listingId);

  if (!existing) throw createError("Listing not found", 404);
  if (existing.merchant_id !== merchantId) {
    throw createError("You do not own this listing", 403);
  }

  const result = await update_listing(listingId, merchantId, body);
  if (result.count === 0) throw createError("No changes made", 400);

  return find_listing_by_id(listingId); // Return updated record
}
