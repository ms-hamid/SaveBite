/**
 * @file src/repositories/user.repository.js
 * @description User data access layer (Prisma queries).
 */

import { prisma } from "../lib/prisma.js";

/**
 * Get user by ID with role-specific data
 * @param {string} userId - User UUID
 * @returns {Promise<object>} User record with merchant/customer/admin data
 */
export async function getUserById(userId) {
  return await prisma.authUser.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      merchant: true,
      customer: true,
      admin: true,
    },
  });
}

/**
 * Get all merchants with pagination
 * @param {number} skip - Number of records to skip
 * @param {number} take - Number of records to take (max 10)
 * @returns {Promise<object>} { merchants: array, total: number }
 */
export async function getAllMerchantsWithPagination(skip = 0, take = 10) {
  // Enforce max 10 per page
  const limit = Math.min(Math.max(parseInt(take), 1), 10);
  const offset = Math.max(parseInt(skip), 0);

  const [merchants, total] = await Promise.all([
    prisma.merchant.findMany({
      skip: offset,
      take: limit,
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
          select: { id: true, name: true, status: true },
        },
        withdrawals: {
          select: { id: true, status: true, amount: true },
        },
      },
      orderBy: { auth_user: { createdAt: "desc" } },
    }),
    prisma.merchant.count(),
  ]);

  return {
    merchants,
    total,
    page: Math.floor(offset / limit) + 1,
    pageSize: limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getAllMerchantsPendingWithPagination(skip = 0, take = 10) {
  // Enforce max 10 per page
  const limit = Math.min(Math.max(parseInt(take), 1), 10);
  const offset = Math.max(parseInt(skip), 0);

  const [merchants, total] = await Promise.all([
    prisma.merchant.findMany({
      
      where: {
        'kyc_status': "pending"
      },
      skip: offset,
      take: limit,
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
          select: { id: true, name: true, status: true },
        },
        withdrawals: {
          select: { id: true, status: true, amount: true },
        },
      },
      orderBy: { auth_user: { createdAt: "desc" } },
    }),
    prisma.merchant.count(),
  ]);

  return {
    merchants,
    total,
    page: Math.floor(offset / limit) + 1,
    pageSize: limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get all users with pagination (for admin)
 * @param {number} skip - Number of records to skip
 * @param {number} take - Number of records to take (max 10)
 * @returns {Promise<object>} { users: array, total: number }
 */
export async function getAllUsersWithPagination(skip = 0, take = 10) {
  const limit = Math.min(Math.max(parseInt(take), 1), 10);
  const offset = Math.max(parseInt(skip), 0);

  const [users, total] = await Promise.all([
    prisma.authUser.findMany({
      skip: offset,
      take: limit,
      select: {
        id: true,
        email: true,
        role: true,
        banned_until: true,
        deleted_at: true,
        createdAt: true,
        profile: { select: { full_name: true, role: true } },
        merchant: { select: { merchant_name: true, kyc_status: true } },
        customer: { select: { full_name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.authUser.count(),
  ]);

  return {
    users,
    total,
    page: Math.floor(offset / limit) + 1,
    pageSize: limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Confirm KYC status for merchant
 * @param {string} merchantId - Merchant user_id (UUID)
 * @param {string} status - KYC status ('approved', 'rejected', 'pending')
 * @returns {Promise<object>} Updated merchant record
 */
export async function confirmMerchantKycStatus(merchantId, status) {
  const validStatuses = ["approved", "rejected", "pending"];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid KYC status. Must be one of: ${validStatuses.join(", ")}`);
  }

  return await prisma.merchant.update({
    where: { user_id: merchantId },
    data: { kyc_status: status },
    include: {
      auth_user: { select: { email: true } },
    },
  });
}

/**
 * Suspend user (set banned_until timestamp)
 * @param {string} userId - User UUID
 * @param {Date|null} bannedUntil - Suspension end date (null to unsuspend)
 * @returns {Promise<object>} Updated user record
 */
export async function suspendUser(userId, bannedUntil = null) {
  return await prisma.authUser.update({
    where: { id: userId },
    data: {
      banned_until: bannedUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
    },
    include: {
      profile: true,
      merchant: { select: { merchant_name: true } },
      customer: { select: { full_name: true } },
    },
  });
}

/**
 * Unsuspend user (clear banned_until)
 * @param {string} userId - User UUID
 * @returns {Promise<object>} Updated user record
 */
export async function unsuspendUser(userId) {
  return await prisma.authUser.update({
    where: { id: userId },
    data: { banned_until: null },
    include: {
      profile: true,
      merchant: { select: { merchant_name: true } },
      customer: { select: { full_name: true } },
    },
  });
}

/**
 * Check if user is currently suspended
 * @param {string} userId - User UUID
 * @returns {Promise<boolean>} True if user is suspended
 */
export async function isUserSuspended(userId) {
  const user = await prisma.authUser.findUnique({
    where: { id: userId },
    select: { banned_until: true },
  });

  if (!user || !user.banned_until) return false;

  // Check if banned_until date is in the future
  return new Date(user.banned_until) > new Date();
}

/**
 * Get merchant by ID
 * @param {string} merchantId - Merchant user_id (UUID)
 * @returns {Promise<object>} Merchant record with related data
 */
export async function getMerchantById(merchantId) {
  return await prisma.merchant.findUnique({
    where: { user_id: merchantId },
    include: {
      auth_user: {
        select: {
          id: true,
          email: true,
          banned_until: true,
          deleted_at: true,
        },
      },
      listings: true,
      orders: true,
    },
  });
}

/**
 * Get customer by ID
 * @param {string} customerId - Customer user_id (UUID)
 * @returns {Promise<object>} Customer record with related data
 */
export async function getCustomerById(customerId) {
  return await prisma.customer.findUnique({
    where: { user_id: customerId },
    include: {
      auth_user: {
        select: {
          id: true,
          email: true,
          banned_until: true,
          deleted_at: true,
        },
      },
      orders: true,
    },
  });
}

/**
 * Get all merchants with pending KYC status with pagination
 * @param {number} skip - Number of records to skip
 * @param {number} take - Number of records to take (max 10)
 * @returns {Promise<object>} { merchants: array, total: number, pagination info }
 */
export async function getPendingMerchantsWithPagination(skip = 0, take = 10) {
  const limit = Math.min(Math.max(parseInt(take), 1), 10);
  const offset = Math.max(parseInt(skip), 0);

  const [merchants, total] = await Promise.all([
    prisma.merchant.findMany({
      where: {
        kyc_status: "pending",
      },
      skip: offset,
      take: limit,
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
          select: { id: true, name: true, status: true },
        },
      },
      orderBy: { auth_user: { createdAt: "asc" } }, // Oldest first
    }),
    prisma.merchant.count({ where: { kyc_status: "pending" } }),
  ]);

  return {
    merchants,
    total,
    page: Math.floor(offset / limit) + 1,
    pageSize: limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get all customers with pagination
 * @param {number} skip - Number of records to skip
 * @param {number} take - Number of records to take (max 10)
 * @returns {Promise<object>} { customers: array, total: number, pagination info }
 */
export async function getAllCustomersWithPagination(skip = 0, take = 10) {
  const limit = Math.min(Math.max(parseInt(take), 1), 10);
  const offset = Math.max(parseInt(skip), 0);

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      skip: offset,
      take: limit,
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
        orders: {
          select: { id: true, status: true, created_at: true },
          orderBy: { created_at: "desc" },
          take: 5, // Last 5 orders
        },
      },
      orderBy: { auth_user: { createdAt: "desc" } },
    }),
    prisma.customer.count(),
  ]);

  return {
    customers,
    total,
    page: Math.floor(offset / limit) + 1,
    pageSize: limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Search customers by email or name
 * @param {string} query - Search query (email or full_name)
 * @param {number} skip - Number of records to skip
 * @param {number} take - Number of records to take (max 10)
 * @returns {Promise<object>} { customers: array, total: number, pagination info }
 */
export async function searchCustomers(query = "", skip = 0, take = 10) {
  const limit = Math.min(Math.max(parseInt(take), 1), 10);
  const offset = Math.max(parseInt(skip), 0);
  const searchQuery = String(query).toLowerCase().trim();

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where: {
        OR: [
          {
            full_name: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
          {
            auth_user: {
              email: {
                contains: searchQuery,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      skip: offset,
      take: limit,
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
        orders: {
          select: { id: true, status: true, created_at: true },
          take: 3,
        },
      },
      orderBy: { auth_user: { createdAt: "desc" } },
    }),
    prisma.customer.count({
      where: {
        OR: [
          {
            full_name: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
          {
            auth_user: {
              email: {
                contains: searchQuery,
                mode: "insensitive",
              },
            },
          },
        ],
      },
    }),
  ]);

  return {
    customers,
    total,
    page: Math.floor(offset / limit) + 1,
    pageSize: limit,
    totalPages: Math.ceil(total / limit),
    query: searchQuery,
  };
}
