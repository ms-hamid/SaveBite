/**
 * @file src/controllers/listing.controller.js
 */

import {
  get_active_listings,
  get_listing,
  publish_listing,
  update_listing_svc,
} from "../services/listing.service.js";

/** GET /api/listings?lat=&lng=&radius_km= */
export async function get_listings_handler(req, res) {
  const { lat, lng, radius_km } = req.query;
  const listings = await get_active_listings({
    lat: lat ? Number(lat) : undefined,
    lng: lng ? Number(lng) : undefined,
    radius_km: radius_km ? Number(radius_km) : 10,
  });
  return res.status(200).json({ listings });
}

/** GET /api/listings/:id */
export async function get_listing_handler(req, res) {
  const listing = await get_listing(req.params.id);
  return res.status(200).json({ listing });
}

/** POST /api/listings — merchant only */
export async function create_listing_handler(req, res) {
  const listing = await publish_listing(req.user.id, req.body);
  return res.status(201).json({ message: "Listing published", listing });
}

/** PATCH /api/listings/:id — merchant only */
export async function update_listing_handler(req, res) {
  const listing = await update_listing_svc(req.params.id, req.user.id, req.body);
  return res.status(200).json({ message: "Listing updated", listing });
}
