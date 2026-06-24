/**
 * @file src/services/listing.service.js
 * @description Business logic for the Listing domain.
 */

import {
  create_listing,
  destroy_listing,
  find_active_listings,
  find_listing_by_id,
  find_my_listings,
  update_listing,
} from "../repositories/listing.repository.js";
import { createError } from "../middlewares/error.middleware.js";
import { notify_all_customers_of_new_listing } from "./notification.service.js";

/**
 * Get a single published listing by ID.
 * @param {string} listingId
 */
export async function get_listing(listingPublicId) {
  const listing = await find_listing_by_id(listingPublicId);
  if (!listing) throw createError("Listing not found", 404);
  return listing;
}

/**
 * Get all active listings, optionally filtered by geo-proximity.
 * @param {{ lat?: number, lng?: number, radius_km?: number }} opts
 */
export async function get_active_listings(opts = {}) {
  const result = await find_active_listings(opts);
  console.log(result)
  return result;
}

/**
 * Create a new listing — only MERCHANT role can call this.
 * @param {string} merchant_id
 * @param {object} body
 */
export async function publish_listing(
  merchant_id,
  body
) {

  console.log("create listing 2")

  const {
    name,
    description,
    stock_total,
    original_price,
    discount_price,
    open_time,
    close_time,
    img_url,
  } = body;

  // Validation Required Fields
  if (
    !name ||
    !stock_total ||
    !original_price ||
    !discount_price ||
    !open_time ||
    !close_time
  ) {
    throw createError(
      "name, stock_total, original_price, discount_price, open_time, close_time are required",
      400
    );
  }

  // Validation Price
  if (
    Number(discount_price) >=
    Number(original_price)
  ) {
    throw createError(
      "discount_price must be less than original_price",
      422
    );
  }

  // Validation Stock
  if (Number(stock_total) <= 0) {
    throw createError(
      "stock_total must be greater than 0",
      422
    );
  }

  // Validation Time
  const openDate = new Date(open_time);
  const closeDate = new Date(close_time);

  if (closeDate <= openDate) {
    throw createError(
      "close_time must be after open_time",
      422
    );
  }

  // Calculate Discount Percentage
  const discount_percentage =
    Math.round(
      ((Number(original_price) -
        Number(discount_price)) /
        Number(original_price)) *
        100
    );
    console.log("create listing 3")

    console.log(original_price)
    console.log(discount_price)

  const listing = await create_listing({
    
      merchant: {
        connect: {
          user_id: merchant_id,
        }
      },
  
    name,
    description,

    stock_total: Number(stock_total),

    original_price: Number(original_price),
    discount_price: Number(discount_price),
    discount_percentage,

    open_time: openDate,
    close_time: closeDate,

    img_url,

    is_open: true,
    status: "active",
  });

  // Notify customers of new surplus listing
  try {
    const merchantName = listing.merchant?.merchant_name || "Artisan Bakery";
    await notify_all_customers_of_new_listing(listing, merchantName);
  } catch (err) {
    console.error("FCM listing notification failed:", err);
  }

  return listing;
}

/**
 * Update a listing — merchant must own it.
 */
export async function update_listing_svc(listingPublicId, merchant_id, body) {
  const existing = await find_listing_by_id(listingPublicId);

  if (!existing) throw createError("Listing not found", 404);
  if (existing.merchant_id !== merchant_id) {
    throw createError("You do not own this listing", 403);
  }

  const {
    name,
    description,
    stock_total,
    original_price,
    discount_price,
    open_time,
    close_time,
    img_url,
  } = body;

  const data = {};

  if (name !== undefined) data.name = name;
  if (description !== undefined) data.description = description;

  if (stock_total !== undefined) {
    if (Number(stock_total) <= 0) {
      throw createError("stock_total must be greater than 0", 422);
    }
    data.stock_total = Number(stock_total);
  }

  if (img_url !== undefined) data.img_url = img_url;

  const openDate =
    open_time !== undefined
      ? new Date(open_time)
      : existing.open_time
        ? new Date(existing.open_time)
        : null;
  const closeDate =
    close_time !== undefined
      ? new Date(close_time)
      : existing.close_time
        ? new Date(existing.close_time)
        : null;

  if (open_time !== undefined) data.open_time = openDate;
  if (close_time !== undefined) data.close_time = closeDate;

  if (open_time !== undefined || close_time !== undefined) {
    if (openDate && closeDate && closeDate <= openDate) {
      throw createError("close_time must be after open_time", 422);
    }
  }

  const orig = original_price !== undefined ? Number(original_price) : Number(existing.original_price);
  const disc = discount_price !== undefined ? Number(discount_price) : Number(existing.discount_price);

  if (original_price !== undefined) data.original_price = orig;
  if (discount_price !== undefined) data.discount_price = disc;

  if (original_price !== undefined || discount_price !== undefined) {
    if (disc >= orig) {
      throw createError("discount_price must be less than original_price", 422);
    }
    data.discount_percentage = Math.round(((orig - disc) / orig) * 100);
  }

  const result = await update_listing(listingPublicId, merchant_id, data);
  if (result.count === 0) throw createError("No changes made", 400);

  return find_listing_by_id(listingPublicId);
}

export async function delete_listing_svc(listingId, merchant_id) {
  const existing = await find_listing_by_id(listingId);
  if (!existing) throw createError("Listing not found", 404);

  if (existing.merchant_id !== merchant_id) {
    throw createError("You do not own this listing", 403);
  }

  const result = await destroy_listing(listingId, merchant_id);
  if (result.count === 0) throw createError("Listing not found", 404);

  return { public_id: listingId, deleted_at: result.deleted_at };
}



export async function get_my_listings(
  merchant_id
) {

  console.log(merchant_id)
  return await find_my_listings(
    merchant_id
  );
}