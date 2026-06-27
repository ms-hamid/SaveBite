/**
 * @file src/controllers/review.controller.js
 */

import { serializeBigInt } from "../utils/json.js";
import {
  check_reviewed,
  get_merchant_reviews,
  submit_review,
} from "../services/review.service.js";

/**
 * GET /review/merchant/:merchant_id
 * List reviews for a merchant. Public.
 * Query: ?take=&skip=
 */
export async function get_merchant_reviews_handler(req, res) {
  const { merchant_id } = req.params;
  const take = req.query.take ? Number(req.query.take) : 20;
  const skip = req.query.skip ? Number(req.query.skip) : 0;

  const result = await get_merchant_reviews(merchant_id, { take, skip });
  return res.status(200).json({ success: true, data: serializeBigInt(result) });
}

/**
 * POST /review/merchant/:merchant_id
 * Submit a review for a merchant (general — listing_id = null).
 * Body: { rating, review_text?, img_url? }
 * Auth: CUSTOMER
 */
export async function submit_merchant_review_handler(req, res) {
  const { merchant_id } = req.params;
  const { rating, review_text, img_url } = req.body;

  const review = await submit_review({
    customer_id: req.user.id,
    merchant_id,
    listing_public_id: null,
    rating,
    review_text,
    img_url,
  });

  return res.status(201).json({ success: true, data: serializeBigInt(review) });
}

/**
 * POST /review/listing/:listing_public_id
 * Submit a review tied to a specific listing (via order rate flow).
 * Body: { rating, review_text?, img_url?, merchant_id }
 * Auth: CUSTOMER
 */
export async function submit_listing_review_handler(req, res) {
  const { listing_public_id } = req.params;
  const { rating, review_text, img_url, merchant_id } = req.body;

  if (!merchant_id) {
    return res.status(400).json({ success: false, message: "merchant_id is required" });
  }

  const review = await submit_review({
    customer_id: req.user.id,
    merchant_id,
    listing_public_id,
    rating,
    review_text,
    img_url,
  });

  return res.status(201).json({ success: true, data: serializeBigInt(review) });
}

/**
 * GET /review/merchant/:merchant_id/status
 * Check if the authenticated customer has already reviewed this merchant (general).
 * Auth: CUSTOMER
 */
export async function check_merchant_reviewed_handler(req, res) {
  const { merchant_id } = req.params;
  const result = await check_reviewed(req.user.id, merchant_id, null);
  return res.status(200).json({ success: true, ...serializeBigInt(result) });
}

/**
 * GET /review/listing/:listing_public_id/status
 * Check if the authenticated customer has already reviewed this listing.
 * Body requires merchant_id as query param.
 * Auth: CUSTOMER
 */
export async function check_listing_reviewed_handler(req, res) {
  const { listing_public_id } = req.params;
  const { merchant_id } = req.query;

  if (!merchant_id) {
    return res.status(400).json({ success: false, message: "merchant_id query param is required" });
  }

  const result = await check_reviewed(req.user.id, merchant_id, listing_public_id);
  return res.status(200).json({ success: true, ...serializeBigInt(result) });
}
