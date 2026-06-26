/**
 * @file src/repositories/favorite.repository.js
 * @description Data access for the favorites table.
 *
 * Schema: favorites { customer_id, listing_id, created_at }
 * PK: (customer_id, listing_id)
 */

import { prisma } from "../lib/prisma.js";

/**
 * Get all favorite listings for a user, with optional search/filter.
 * Returns listings enriched with is_favorite: true.
 * @param {string} userId
 * @param {{ q?, category?, min_price?, max_price? }} opts
 */
export async function find_favorites_by_user(userId, { q, category, min_price, max_price } = {}) {
  const andWhere = [
    {
      status: "active",
      deleted_at: null,
    },
  ];

  if (q) {
    andWhere.push({
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { merchant: { merchant_name: { contains: q, mode: "insensitive" } } },
      ],
    });
  }

  if (category) {
    andWhere.push({
      OR: [
        { merchant: { category: { contains: category, mode: "insensitive" } } },
        { name: { contains: category, mode: "insensitive" } },
      ],
    });
  }

  const priceFilter = {};
  if (min_price != null) priceFilter.gte = Number(min_price);
  if (max_price != null) priceFilter.lte = Number(max_price);
  if (Object.keys(priceFilter).length > 0) andWhere.push({ discount_price: priceFilter });

  const rows = await prisma.favorites.findMany({
    where: {
      customer_id: userId,
      listings: { AND: andWhere },
    },
    include: {
      listings: {
        include: {
          merchant: {
            select: { merchant_name: true, address: true, category: true, pickup_open: true, pickup_close: true },
          },
        },
      },
    },
    orderBy: { created_at: "desc" },
  });

  return rows.map((row) => ({
    ...row.listings,
    is_favorite: true,
    favorited_at: row.created_at,
  }));
}

/**
 * Check whether a user has favorited a specific listing.
 * @param {string} userId
 * @param {bigint|number} listingId
 */
export async function find_favorite(userId, listingId) {
  return prisma.favorites.findUnique({
    where: {
      customer_id_listing_id: {
        customer_id: userId,
        listing_id: BigInt(listingId),
      },
    },
  });
}

/**
 * Add a favorite.
 */
export async function create_favorite(userId, listingId) {
  return prisma.favorites.create({
    data: {
      customer_id: userId,
      listing_id: BigInt(listingId),
    },
  });
}

/**
 * Remove a favorite.
 */
export async function delete_favorite(userId, listingId) {
  return prisma.favorites.delete({
    where: {
      customer_id_listing_id: {
        customer_id: userId,
        listing_id: BigInt(listingId),
      },
    },
  });
}

/**
 * Return a Set of listing_ids the user has favorited — used to annotate
 * listing results from other queries.
 * @param {string} userId
 * @returns {Promise<Set<string>>}
 */
export async function get_favorite_listing_ids(userId) {
  const rows = await prisma.favorites.findMany({
    where: { customer_id: userId },
    select: { listing_id: true },
  });
  return new Set(rows.map((r) => r.listing_id.toString()));
}
