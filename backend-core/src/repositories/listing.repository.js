/**
 * @file src/repositories/listing.repository.js
 * @description Data access layer for the Listing domain.
 */

import { prisma } from "../lib/prisma.js";

/**
 * Find a listing by its UUID, with merchant info.
 * @param {string} listingId
 */
export async function find_listing_by_id(listingId) {
  return prisma.listing.findUnique({
    where: { id: listingId },
    include: { merchant: true },
  });
}

/**
 * Find all published, non-expired listings.
 * Optional geo-filter: orders by Haversine distance if lat/lng provided.
 *
 * @param {{ lat?: number, lng?: number, radius_km?: number, limit?: number }} opts
 * @returns {Promise<Listing[]>}
 */
export async function find_active_listings({ lat, lng, radius_km = 10, limit = 20 } = {}) {
  if (lat != null && lng != null) {
    // Haversine distance formula in PostgreSQL
    // Returns listings within `radius_km` km, ordered nearest-first
    return prisma.$queryRaw`
      SELECT
        l.id, l.title, l.original_price, l.discount_price, l.stock,
        l.status, l.expired_at, l.merchant_id,
        m.shop_name, m.address, m.latitude, m.longitude,
        ( 6371 * acos(
            cos(radians(${lat})) * cos(radians(m.latitude::float8)) *
            cos(radians(m.longitude::float8) - radians(${lng})) +
            sin(radians(${lat})) * sin(radians(m.latitude::float8))
          )
        ) AS distance_km
      FROM "Listing" l
      JOIN "Merchant" m ON m.id = l.merchant_id
      WHERE
        l.status = 'PUBLISHED'::"List_Status"
        AND l.expired_at > NOW()
        AND l.stock > 0
      HAVING ( 6371 * acos(
            cos(radians(${lat})) * cos(radians(m.latitude::float8)) *
            cos(radians(m.longitude::float8) - radians(${lng})) +
            sin(radians(${lat})) * sin(radians(m.latitude::float8))
          )) <= ${radius_km}
      ORDER BY distance_km ASC
      LIMIT ${limit}
    `;
  }

  // No geo-filter: return newest published listings
  return prisma.listing.findMany({
    where: {
      status: "PUBLISHED",
      expired_at: { gt: new Date() },
      stock: { gt: 0 },
    },
    orderBy: { expired_at: "asc" }, // soonest-expiring first = urgency
    take: limit,
    include: { merchant: { select: { shop_name: true, address: true } } },
  });
}

/**
 * Create a new listing (merchant action).
 * @param {string} merchantId
 * @param {object} data - title, original_price, discount_price, stock, expired_at
 */
export async function create_listing(merchantId, data) {
  return prisma.listing.create({
    data: {
      merchant_id: merchantId,
      ...data,
    },
    include: { merchant: { select: { shop_name: true } } },
  });
}

/**
 * Update a listing (merchant action — must own the listing).
 */
export async function update_listing(listingId, merchantId, data) {
  // Prisma will throw P2025 if not found
  return prisma.listing.updateMany({
    where: { id: listingId, merchant_id: merchantId },
    data,
  });
}
