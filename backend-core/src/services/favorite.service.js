/**
 * @file src/services/favorite.service.js
 */

import {
  create_favorite,
  delete_favorite,
  find_favorite,
  find_favorites_by_user,
} from "../repositories/favorite.repository.js";
import { find_listing_by_id } from "../repositories/listing.repository.js";
import { createError } from "../middlewares/error.middleware.js";

/**
 * Get all saved listings for the authenticated customer,
 * with optional search/price/category filters.
 */
export async function get_favorites(userId, opts = {}) {
  return find_favorites_by_user(userId, opts);
}

/**
 * Toggle favorite (add if not yet saved, remove if already saved).
 * Returns { action: "added" | "removed", listing_id }
 */
export async function toggle_favorite(userId, listingPublicId) {
  // Resolve public_id → internal id
  const listing = await find_listing_by_id(listingPublicId);
  if (!listing) throw createError("Listing not found", 404);

  const existing = await find_favorite(userId, listing.id);

  if (existing) {
    await delete_favorite(userId, listing.id);
    return { action: "removed", listing_id: listing.public_id };
  }

  await create_favorite(userId, listing.id);
  return { action: "added", listing_id: listing.public_id };
}

/**
 * Check if a listing is favorited by the user.
 */
export async function check_favorite(userId, listingPublicId) {
  const listing = await find_listing_by_id(listingPublicId);
  if (!listing) throw createError("Listing not found", 404);
  const fav = await find_favorite(userId, listing.id);
  return { is_favorite: !!fav };
}
