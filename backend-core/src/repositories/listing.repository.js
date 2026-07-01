/**
 * @file src/repositories/listing.repository.js
 * @description Data access layer for the Listing domain.
 */

import { Prisma } from "@prisma/client";
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
 * Supports geo-filter, text search, category, and price range.
 *
 * @param {{ lat?, lng?, radius_km?, limit?, q?, category?, min_price?, max_price? }} opts
 */
export async function find_active_listings({
  lat,
  lng,
  radius_km = 100,
  limit = 50,
  q,
  category,
  min_price,
  max_price,
} = {}) {

  if (lat != null && lng != null) {
    const sqlFilters = [];

    if (q) {
      const keyword = `%${q}%`;
      sqlFilters.push(Prisma.sql`
        AND (
          l.name ILIKE ${keyword}
          OR l.description ILIKE ${keyword}
          OR m.merchant_name ILIKE ${keyword}
        )
      `);
    }
    if (category) {
      const categoryKeyword = `%${category}%`;
      sqlFilters.push(Prisma.sql`
        AND (
          m.category ILIKE ${categoryKeyword}
          OR l.name ILIKE ${categoryKeyword}
        )
      `);
    }
    if (min_price != null) {
      sqlFilters.push(Prisma.sql`AND l.discount_price >= ${Number(min_price)}`);
    }
    if (max_price != null) {
      sqlFilters.push(Prisma.sql`AND l.discount_price <= ${Number(max_price)}`);
    }
    const rawFilterSql = sqlFilters.length > 0 ? Prisma.join(sqlFilters, " ") : Prisma.empty;

    // Haversine distance formula in PostgreSQL
    const rawListings = await prisma.$queryRaw(Prisma.sql`
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
        l.description,
        m.merchant_name,
        m.address,
        m.category AS merchant_category,
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
        ${rawFilterSql}
    )
    SELECT *
    FROM listings_with_distance
    WHERE distance_km <= ${radius_km}
    ORDER BY distance_km ASC
    LIMIT ${limit};
  `);

    return rawListings.map(item => ({
      id: item.id,
      public_id: item.public_id,
      name: item.name,
      description: item.description,
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
        category: item.merchant_category,
        latitude: item.latitude,
        longitude: item.longitude,
      }
    }));
  }

  // No geo-filter: use Prisma with where conditions
  const andFilters = [
    {
      status: "active",
      close_time: { gt: new Date() },
      stock_total: { gt: 0 },
      deleted_at: null,
    },
  ];

  if (q) {
    andFilters.push({
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { merchant: { merchant_name: { contains: q, mode: "insensitive" } } },
      ],
    });
  }
  if (category) {
    andFilters.push({
      OR: [
        { merchant: { category: { contains: category, mode: "insensitive" } } },
        { name: { contains: category, mode: "insensitive" } },
      ],
    });
  }
  const priceFilter = {};
  if (min_price != null) {
    priceFilter.gte = Number(min_price);
  }
  if (max_price != null) {
    priceFilter.lte = Number(max_price);
  }
  if (Object.keys(priceFilter).length > 0) {
    andFilters.push({ discount_price: priceFilter });
  }

  const listings = await prisma.listing.findMany({
    where: { AND: andFilters },
    orderBy: { close_time: "asc" },
    take: limit,
    include: {
      merchant: {
        select: { merchant_name: true, address: true, category: true },
      },
    },
  });

  return listings.map((item) => ({
    ...item,
    merchants: item.merchant,
  }));
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
