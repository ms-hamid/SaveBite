// import { kyc_status } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

export async function createMerchantData(
    payload
  ) {
    return prisma.$transaction(
      async (tx) => {
        const profile =
          await tx.profile.create({
            data: {
              user_id: payload.user_id,
              full_name: payload.full_name,
              role: "MERCHANT",
            },
          });
  
        const merchant =
          await tx.merchant.create({
            data: {
              user_id: payload.user_id,
  
              merchant_name: payload.merchant_name,
  
              address: payload.address,
  
              category: payload.category,
  
              kyc_status: "pending",
              latitude: payload.latitude,
              longitude: payload.longitude
            },
          });
  
        return {
          profile,
          merchant,
        };
      }
    );
  }

/**
 * Get merchant details by ID with pagination-friendly structure
 * @param {string} merchantId - Merchant user_id (UUID)
 * @returns {Promise<object>} Merchant record with auth and listing data
 */
export async function getMerchantDetails(merchantId) {
  return await prisma.merchant.findUnique({
    where: { user_id: merchantId },
    include: {
      auth_user: {
        select: {
          id: true,
          email: true,
          banned_until: true,
          deleted_at: true,
          createdAt: true,
        },
      },
      listings: {
        select: {
          id: true,
          name: true,
          status: true,
          stock_total: true,
          sold_total: true,
        },
        take: 5, // Limit to recent 5 listings
      },
    },
  });
}

/**
 * Get all merchants with filters and pagination
 * @param {number} skip - Pagination offset
 * @param {number} take - Pagination limit (max 10)
 * @param {string} kycStatus - Filter by KYC status (optional)
 * @returns {Promise<object>} Paginated merchants with count
 */
export async function getMerchantsWithFilters(skip = 0, take = 10, kycStatus = null) {
  const limit = Math.min(Math.max(parseInt(take), 1), 10);
  const offset = Math.max(parseInt(skip), 0);

  const where = kycStatus ? { kyc_status: kycStatus } : {};

  const [merchants, total] = await Promise.all([
    prisma.merchant.findMany({
      where,
      skip: offset,
      take: limit,
      include: {
        auth_user: {
          select: {
            email: true,
            banned_until: true,
          },
        },
        listings: {
          select: { id: true, status: true },
        },
      },
      orderBy: { auth_user: { createdAt: "desc" } },
    }),
    prisma.merchant.count({ where }),
  ]);

  return {
    merchants,
    total,
    page: Math.floor(offset / limit) + 1,
    pageSize: limit,
  };
}

export async function updateMerchantProfile(userId, data) {
  return prisma.$transaction(async (tx) => {
    let profileUpdate;
    if (data.full_name !== undefined) {
      profileUpdate = await tx.profile.update({
        where: { user_id: userId },
        data: { full_name: data.full_name },
      });
    }

    const merchantData = {};
    if (data.merchant_name !== undefined) merchantData.merchant_name = data.merchant_name;
    if (data.latitude !== undefined) merchantData.latitude = data.latitude !== null ? parseFloat(data.latitude) : null;
    if (data.longitude !== undefined) merchantData.longitude = data.longitude !== null ? parseFloat(data.longitude) : null;
    if (data.address !== undefined) merchantData.address = data.address;
    if (data.bank_name !== undefined) merchantData.bank_name = data.bank_name;
    if (data.bank_account !== undefined) merchantData.bank_account = data.bank_account;
    if (data.category !== undefined) merchantData.category = data.category;
    if (data.desc !== undefined) merchantData.desc = data.desc;
    if (data.pickup_instruction !== undefined) merchantData.pickup_instruction = data.pickup_instruction;
    if (data.contactless_pickup !== undefined) merchantData.contactless_pickup = data.contactless_pickup;
    if (data.notify_staff_upon_arrival !== undefined) merchantData.notify_staff_upon_arrival = data.notify_staff_upon_arrival;
    if (data.pickup_open !== undefined) merchantData.pickup_open = data.pickup_open;
    if (data.pickup_close !== undefined) merchantData.pickup_close = data.pickup_close;
    if (data.same_day_pickup !== undefined) merchantData.same_day_pickup = data.same_day_pickup;
    if (data.max_prep_time !== undefined) merchantData.max_prep_time = data.max_prep_time !== null ? BigInt(data.max_prep_time) : null;
    if (data.profile_pic !== undefined) merchantData.profile_pic = data.profile_pic;

    let merchantUpdate;
    if (Object.keys(merchantData).length > 0) {
      merchantUpdate = await tx.merchant.update({
        where: { user_id: userId },
        data: merchantData,
      });
    }

    return {
      profile: profileUpdate,
      merchant: merchantUpdate,
    };
  });
}
