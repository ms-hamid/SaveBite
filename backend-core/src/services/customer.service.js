/**
 * @file src/services/customer.service.js
 * @description Customer admin business logic layer
 */

import {
  getCustomersWithPagination,
  getSuspendedCustomersCount,
  getCustomerDetailWithOrders,
  getAllCustomersForExport,
} from "../repositories/customer.repository.js";
import { suspendUser, unsuspendUser } from "../repositories/user.repository.js";

/**
 * Get customers list with pagination for admin
 * @param {number} skip - Pagination skip
 * @param {number} take - Items per page
 * @returns {Promise<{customers: Array, total: number, suspended_count: number}>}
 */
export async function getCustomersListService(skip = 0, take = 10) {
  const [{ customers, total }, suspended_count] = await Promise.all([
    getCustomersWithPagination(skip, take),
    getSuspendedCustomersCount(),
  ]);

  // Transform customers to include status
  const customersWithStatus = customers.map((customer) => {
    const strikeCount = customer.strike_count ?? 0;
    const status = strikeCount >= 3 ? "Suspended" : "Active";

    return {
      user_id: customer.user_id,
      full_name: customer.full_name,
      exp: customer.exp,
      strike_count: customer.strike_count,
      email: customer.user?.email || "-",
      phone: customer.user?.phone || "-",
      joined_date: customer.user?.created_at || null,
      banned_until: customer.user?.banned_until || null,
      status,
    };
  });

  return {
    customers: customersWithStatus,
    total,
    suspended_count,
  };
}

/**
 * Get customer detail with orders
 * @param {string} userId - Customer user_id
 * @returns {Promise<object>}
 * @throws {Error} If customer not found
 */
export async function getCustomerDetailService(userId) {
  const customer = await getCustomerDetailWithOrders(userId);

  if (!customer) {
    throw new Error("Customer tidak ditemukan");
  }

  const strikeCount = customer.strike_count ?? 0;
  const status = strikeCount >= 3 ? "Suspended" : "Active";

  return {
    user_id: customer.user_id,
    full_name: customer.full_name,
    exp: customer.exp,
    strike_count: customer.strike_count,
    email: customer.user?.email || "-",
    phone: customer.user?.phone || "-",
    joined_date: customer.user?.created_at || null,
    banned_until: customer.user?.banned_until || null,
    status,
    orders: customer.orders || [],
  };
}

/**
 * Suspend customer account
 * @param {string} userId - Customer user_id
 * @param {Date|null} suspendUntil - Suspension end date
 * @param {string} adminId - Admin user_id
 * @returns {Promise<object>}
 */
export async function suspendCustomerAccountService(userId, suspendUntil = null, adminId = null) {
  const customer = await getCustomerDetailWithOrders(userId);
  
  if (!customer) {
    throw new Error("Customer tidak ditemukan");
  }

  let bannedUntil = suspendUntil;
  if (!bannedUntil) {
    // Default: 30 days from now
    bannedUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }

  const updated = await suspendUser(userId, bannedUntil);

  console.log(
    `[Customer Suspension] Admin ${adminId || "system"} suspended customer ${userId} until ${bannedUntil.toISOString()}`
  );

  return updated;
}

/**
 * Unsuspend customer account
 * @param {string} userId - Customer user_id
 * @param {string} adminId - Admin user_id
 * @returns {Promise<object>}
 */
export async function unsuspendCustomerAccountService(userId, adminId = null) {
  const customer = await getCustomerDetailWithOrders(userId);
  
  if (!customer) {
    throw new Error("Customer tidak ditemukan");
  }

  const updated = await unsuspendUser(userId);

  console.log(`[Customer Unsuspension] Admin ${adminId || "system"} unsuspended customer ${userId}`);

  return updated;
}

/**
 * Get customer statistics
 * @returns {Promise<object>}
 */
export async function getCustomerStatsService() {
  const { total } = await getCustomersWithPagination(0, 0);
  const suspended_count = await getSuspendedCustomersCount();

  // TODO: Implement active users 30d calculation
  // This requires tracking last_active_at or login history

  return {
    total_customers: total,
    active_users_30d: 0, // Placeholder
    suspended_count,
  };
}

/**
 * Get all customers for CSV export
 * @returns {Promise<Array>}
 */
export async function exportCustomersService() {
  const customers = await getAllCustomersForExport();

  return customers.map((customer) => {
    const strikeCount = customer.strike_count ?? 0;
    const status = strikeCount >= 3 ? "Suspended" : "Active";

    return {
      user_id: customer.user_id,
      full_name: customer.full_name,
      email: customer.user?.email || "-",
      phone: customer.user?.phone || "-",
      exp: customer.exp ?? 0,
      strike_count: customer.strike_count ?? 0,
      total_orders: customer._count?.orders ?? 0,
      joined_date: customer.user?.created_at || null,
      status,
    };
  });
}
