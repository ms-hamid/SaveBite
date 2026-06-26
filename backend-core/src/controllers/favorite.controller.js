/**
 * @file src/controllers/favorite.controller.js
 */

import { serializeBigInt } from "../utils/json.js";
import {
  check_favorite,
  get_favorites,
  toggle_favorite,
} from "../services/favorite.service.js";

/**
 * GET /favorite
 * List all saved listings for the authenticated customer.
 * Query: ?q=&category=&min_price=&max_price=
 */
export async function get_favorites_handler(req, res) {
  const { q, category, min_price, max_price } = req.query;

  const listings = await get_favorites(req.user.id, {
    q: q || undefined,
    category: category || undefined,
    min_price: min_price ? Number(min_price) : undefined,
    max_price: max_price ? Number(max_price) : undefined,
  });

  return res.status(200).json({ success: true, data: serializeBigInt(listings) });
}

/**
 * POST /favorite/:public_id/toggle
 * Add or remove a listing from favorites (toggle).
 */
export async function toggle_favorite_handler(req, res) {
  const result = await toggle_favorite(req.user.id, req.params.public_id);
  return res.status(200).json({ success: true, ...result });
}

/**
 * GET /favorite/:public_id/status
 * Check if the authenticated user has favorited a listing.
 */
export async function check_favorite_handler(req, res) {
  const result = await check_favorite(req.user.id, req.params.public_id);
  return res.status(200).json({ success: true, ...result });
}
