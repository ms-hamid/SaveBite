/**
 * @file src/services/user.service.js
 * @description User business logic layer.
 */

import {
  getUserById,
  getAllMerchantsWithPagination,
  getAllUsersWithPagination,
  confirmMerchantKycStatus,
  suspendUser,
  unsuspendUser,
  isUserSuspended,
  getMerchantById,
  getCustomerById,
  getAllMerchantsPendingWithPagination,
} from "../repositories/user.repository.js";
import { updateCustomerProfile } from "../repositories/customer.repository.js";
import { updateMerchantProfile } from "../repositories/merchant.repository.js";

/**
 * Get user profile by ID
 * @param {string} userId - User UUID
 * @returns {Promise<object>} User with role-specific data
 * @throws {Error} If user not found
 */
export async function getUserProfileService(userId) {
  const user = await getUserById(userId);

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  // Check if user is suspended
  if (user.banned_until && new Date(user.banned_until) > new Date()) {
    throw new Error("User telah di-suspend");
  }

  return user;
}

/**
 * Get all merchants with pagination service
 * @param {number} skip - Skip count (pagination offset)
 * @param {number} take - Take count (max 10)
 * @returns {Promise<object>} Paginated merchants list
 */
export async function getMerchantsListService(skip = 0, take = 10) {
  return await getAllMerchantsWithPagination(skip, take);
}

export async function getMerchantsPendingListService(skip = 0, take = 10) {
  return await getAllMerchantsPendingWithPagination(skip, take);
}

/**
 * Get all users with pagination service (admin only)
 * @param {number} skip - Skip count (pagination offset)
 * @param {number} take - Take count (max 10)
 * @returns {Promise<object>} Paginated users list
 */
export async function getUsersListService(skip = 0, take = 10) {
  return await getAllUsersWithPagination(skip, take);
}

/**
 * Confirm merchant KYC status service
 * @param {string} merchantId - Merchant user_id (UUID)
 * @param {string} status - KYC status ('approved', 'rejected', 'pending')
 * @param {string} adminId - Admin user_id (for audit logging)
 * @returns {Promise<object>} Updated merchant record
 * @throws {Error} If merchant not found or invalid status
 */
export async function confirmMerchantKycService(merchantId, status, adminId) {
  // Validate merchant exists
  const merchant = await getMerchantById(merchantId);
  if (!merchant) {
    throw new Error("Merchant tidak ditemukan");
  }

  // Validate status
  const validStatuses = ["approved", "rejected", "pending"];
  if (!validStatuses.includes(status.toLowerCase())) {
    throw new Error(`Status KYC tidak valid. Harus salah satu: ${validStatuses.join(", ")}`);
  }

  // Update KYC status
  const updated = await confirmMerchantKycStatus(merchantId, status.toLowerCase());

  console.log(`[KYC Confirmation] Admin ${adminId} confirmed KYC for merchant ${merchantId} with status: ${status}`);

  return updated;
}

/**
 * Suspend user service (merchant or customer)
 * @param {string} userId - User UUID
 * @param {Date|null} suspendUntil - Suspension end date (null = default 30 days)
 * @param {string} adminId - Admin user_id (for audit logging)
 * @returns {Promise<object>} Updated user record
 * @throws {Error} If user not found
 */
export async function suspendUserService(userId, suspendUntil = null, adminId = null) {
  // Verify user exists
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  // Calculate suspension end date
  let bannedUntil = suspendUntil;
  if (!bannedUntil) {
    // Default: 30 days from now
    bannedUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }

  // Perform suspension
  const updated = await suspendUser(userId, bannedUntil);

  console.log(
    `[User Suspension] Admin ${adminId || "system"} suspended user ${userId} until ${bannedUntil.toISOString()}`
  );

  return updated;
}

/**
 * Unsuspend user service
 * @param {string} userId - User UUID
 * @param {string} adminId - Admin user_id (for audit logging)
 * @returns {Promise<object>} Updated user record
 * @throws {Error} If user not found
 */
export async function unsuspendUserService(userId, adminId = null) {
  // Verify user exists
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  // Perform unsuspension
  const updated = await unsuspendUser(userId);

  console.log(`[User Unsuspension] Admin ${adminId || "system"} unsuspended user ${userId}`);

  return updated;
}

/**
 * Check if user is currently suspended
 * @param {string} userId - User UUID
 * @returns {Promise<boolean>} True if user is suspended
 */
export async function checkUserSuspensionService(userId) {
  return await isUserSuspended(userId);
}

/**
 * Suspend merchant specifically
 * @param {string} merchantId - Merchant user_id (UUID)
 * @param {Date|null} suspendUntil - Suspension end date
 * @param {string} adminId - Admin user_id (for audit logging)
 * @returns {Promise<object>} Updated merchant record
 * @throws {Error} If merchant not found
 */
export async function suspendMerchantService(merchantId, suspendUntil = null, adminId = null) {
  const merchant = await getMerchantById(merchantId);
  if (!merchant) {
    throw new Error("Merchant tidak ditemukan");
  }

  return await suspendUserService(merchantId, suspendUntil, adminId);
}

/**
 * Suspend customer specifically
 * @param {string} customerId - Customer user_id (UUID)
 * @param {Date|null} suspendUntil - Suspension end date
 * @param {string} adminId - Admin user_id (for audit logging)
 * @returns {Promise<object>} Updated customer record
 * @throws {Error} If customer not found
 */
export async function suspendCustomerService(customerId, suspendUntil = null, adminId = null) {
  const customer = await getCustomerById(customerId);
  if (!customer) {
    throw new Error("Customer tidak ditemukan");
  }

  return await suspendUserService(customerId, suspendUntil, adminId);
}

/**
 * Unsuspend merchant specifically
 * @param {string} merchantId - Merchant user_id (UUID)
 * @param {string} adminId - Admin user_id (for audit logging)
 * @returns {Promise<object>} Updated merchant record
 */
export async function unsuspendMerchantService(merchantId, adminId = null) {
  return await unsuspendUserService(merchantId, adminId);
}

/**
 * Unsuspend customer specifically
 * @param {string} customerId - Customer user_id (UUID)
 * @param {string} adminId - Admin user_id (for audit logging)
 * @returns {Promise<object>} Updated customer record
 */
export async function unsuspendCustomerService(customerId, adminId = null) {
  return await unsuspendUserService(customerId, adminId);
}

/**
 * Update customer profile service
 * @param {string} userId - Customer user ID
 * @param {object} data - Updated customer data
 */
export async function updateCustomerProfileService(userId, data) {
  if (data.full_name !== undefined && (!data.full_name || data.full_name.trim() === "")) {
    throw new Error("Full name tidak boleh kosong");
  }
  return await updateCustomerProfile(userId, data);
}

/**
 * Update merchant profile service
 * @param {string} userId - Merchant user ID
 * @param {object} data - Updated merchant data
 */
export async function updateMerchantProfileService(userId, data) {
  if (data.full_name !== undefined && (!data.full_name || data.full_name.trim() === "")) {
    throw new Error("Full name tidak boleh kosong");
  }
  if (data.merchant_name !== undefined && (!data.merchant_name || data.merchant_name.trim() === "")) {
    throw new Error("Nama toko tidak boleh kosong");
  }

  // Parse time fields if they are sent as strings
  const parseTime = (timeStr) => {
    if (!timeStr) return null;
    if (timeStr instanceof Date) return timeStr;
    const today = new Date().toISOString().split("T")[0];
    const parsed = new Date(`${today}T${timeStr}:00Z`);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const formattedData = { ...data };
  if (data.pickup_open !== undefined) formattedData.pickup_open = parseTime(data.pickup_open);
  if (data.pickup_close !== undefined) formattedData.pickup_close = parseTime(data.pickup_close);

  return await updateMerchantProfile(userId, formattedData);
}

/**
 * Get merchant detail by ID (user_id / public_id)
 * @param {string} merchantId - Merchant user ID
 */
export async function getMerchantDetailService(merchantId) {
  const merchant = await getMerchantById(merchantId);
  if (!merchant) {
    throw new Error("Merchant tidak ditemukan");
  }

  const latitude = merchant.latitude ?? -6.2088;
  const longitude = merchant.longitude ?? 106.8456;

  return {
    ...merchant,
    latitude,
    longitude,
    isPlaceholderGeo: merchant.latitude == null || merchant.longitude == null,
  };
}

