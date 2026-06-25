/**
 * @file src/repositories/listing.repository.js
 * @description Data access layer for the Listing domain.
 */

import {prisma} from "../lib/prisma.js";

/**
 * Find a listing by its UUID, with merchant info.
 * @param {string} listingId
 */
export async function find_listing_by_id(listingId) {
  return prisma.listing.findFirst({
    where: { public_id: listingId, deleted_at: null },
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
export async function find_active_listings({ lat, lng, radius_km = 100, limit = 20 } = {}) {

  if (lat != null && lng != null) {
    // Haversine distance formula in PostgreSQL
    // Returns listings within `radius_km` km, ordered nearest-first
    const rawListings = await prisma.$queryRaw`
      WITH listings_with_distance AS (
  SELECT
    l.id,
    l.name,
    l.original_price,
    l.discount_price,
    l.stock_total,
    l.sold_total,
    l.status,
    l.open_time,
    l.close_time,
    l.merchant_id,
    l.img_url,
    l.public_id,
    l.discount_percentage,
    m.merchant_name,
    m.address,
    m.latitude,
    m.longitude,
    ( 6371 * acos(
        cos(radians(${lat})) * cos(radians(m.latitude)) *
        cos(radians(m.longitude) - radians(${lng})) +
        sin(radians(${lat})) * sin(radians(m.latitude))
      )
    ) AS distance_km
  FROM public.listings l
  JOIN public.merchants m ON m.user_id = l.merchant_id
  WHERE
    l.status = 'active'::public.listing_status
    AND l.close_time > NOW()
    AND l.stock_total > 0
    AND l.deleted_at IS NULL
)

SELECT *
FROM listings_with_distance
WHERE distance_km <= ${radius_km}
ORDER BY distance_km ASC
LIMIT ${limit};
    `;

    return rawListings.map(item => ({
      id: item.id,
      public_id: item.public_id,
      name: item.name,
      open_time: item.open_time,
      close_time: item.close_time,
      sold_total: item.sold_total,
      stock_total: item.stock_total,
      status: item.status,
      original_price: item.original_price,
      discount_price: item.discount_price,
      discount_percentage: item.discount_percentage,
      merchant_id: item.merchant_id,
      img_url: item.img_url,
      distance_km: item.distance_km,
      merchants: {
        merchant_name: item.merchant_name,
        address: item.address,
        latitude: item.latitude,
        longitude: item.longitude,
      }
    }));
  }


  // No geo-filter: return newest published listings
  return prisma.listing.findMany({
    where: {
      status: "active",
      close_time: { gt: new Date() },
      stock_total: { gt: 0 },
    },
    orderBy: { close_time: "asc" }, // soonest-expiring first = urgency
    take: limit,
    include: { merchant: { select: { merchant_name: true, address: true } } },
  });
}


/**
 * Create a new listing (merchant action).
 * @param {string} merchantId
 * @param {object} data - title, original_price, discount_price, stock_total, close_time
 */
export async function create_listing(data) {

  const listing = await prisma.listing.findMany();

  return await prisma.listing.create({
    data,
    include: {
      merchant: {
        select: {
          merchant_name: true,
        },
      },
    },
  });
}

/**
 * Update a listing (merchant action — must own the listing).
 */
export async function update_listing(listingPublicId, merchantId, data) {
  return prisma.listing.updateMany({
    where: { public_id: listingPublicId, merchant_id: merchantId },
    data,
  });
}

export async function find_my_listings(
  merchant_id
) {
  return await prisma.listing.findMany({
    where: {
      merchant_id: merchant_id,
      deleted_at: null,
    },

    include: {
      merchant: {
        select: {
          merchant_name: true,
        },
      },
    },


    orderBy: {
      id: "desc",
    },
  });
}



export async function destroy_listing(listingId, merchantId) {
  const deleted_at = new Date();

  const result = await prisma.listing.updateMany({
    where: {
      public_id: listingId,
      merchant_id: merchantId,
      deleted_at: null,
    },
    data: { deleted_at },
  });

  return { count: result.count, deleted_at };
}