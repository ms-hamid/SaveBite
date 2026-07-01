/**
 * @file src/controllers/listing.controller.js
 */

import {
  get_active_listings,
  get_listing,
  publish_listing,
  update_listing_svc,
} from "../services/listing.service.js";



import * as listingService from "../services/listing.service.js";
import { serializeBigInt } from "../utils/json.js";

/** GET /listing?lat=&lng=&radius_km=&q=&category=&min_price=&max_price= */
export async function get_listings_handler(req, res) {

  const { lat, lng, radius_km, q, category, min_price, max_price } = req.query;

  console.log("Received query parameters:", { lat, lng, radius_km, q, category, min_price, max_price });

  const listings = await get_active_listings({
    lat: lat ? Number(lat) : undefined,
    lng: lng ? Number(lng) : undefined,
    radius_km: radius_km ? Number(radius_km) : 100,
    q: q || undefined,
    category: category || undefined,
    min_price: min_price ? Number(min_price) : undefined,
    max_price: max_price ? Number(max_price) : undefined,
  });
  return res.status(200).json({ data: serializeBigInt(listings) });
}

/** GET /api/listings/:id */
export async function get_listing_handler(req, res) {
  const listing = await get_listing(req.params.public_id);
  return res.status(200).json({ data: serializeBigInt(listing) });
}

/** POST /api/listings — merchant only */
export async function create_listing_handler(req, res) {
  const listing = await publish_listing(req.user.id, req.body);
  return res.status(201).json({ message: "Listing published", data: serializeBigInt(listing) });
}

/** PATCH /api/listings/:id — merchant only */
export async function update_listing_handler(req, res) {
  const listing = await update_listing_svc(req.params.public_id, req.user.id, req.body);
  return res.status(200).json({
    message: "Listing updated",
    data: serializeBigInt(listing),
  });
}

export async function delete_listing_handler(req, res) {
  const result = await listingService.delete_listing_svc(
    req.params.public_id,
    req.user.id
  );
  return res.status(200).json({
    message: "Listing deleted",
    data: serializeBigInt(result),
  });
}


export async function getAllListings(
  req,
  res
) {
  try {
    const listings =
      await listingService.getAllListings();

    return res.status(200).json({
      success: true,
      data: listings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function get_my_listings_handler(
  req,
  res
) {
  const merchant_id = req.user.id;

  const listings =
    await listingService.get_my_listings(
      merchant_id
    );

  return res.status(200).json({
    success: true,
    data: serializeBigInt(listings),
  });
}