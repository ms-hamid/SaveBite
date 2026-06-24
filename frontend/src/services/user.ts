/**
 * @file frontend/src/services/user.ts
 * @description User management API service for frontend.
 * 
 * Handles all communication with backend-core user endpoints:
 * - GET /api/users/:id - Get user profile
 * - GET /api/merchants - Get all merchants with pagination
 * - GET /api/users - Get all users with pagination (admin)
 * - PATCH /api/merchants/:id/kyc - Confirm KYC status
 * - PATCH /api/users/:id/suspend - Suspend user
 * - PATCH /api/users/:id/unsuspend - Unsuspend user
 * - PATCH /api/merchants/:id/suspend - Suspend merchant
 * - PATCH /api/merchants/:id/unsuspend - Unsuspend merchant
 * - PATCH /api/customers/:id/suspend - Suspend customer
 * - PATCH /api/customers/:id/unsuspend - Unsuspend customer
 */

import api from "@/lib/api";

export interface PaginationParams {
  skip?: number;
  take?: number;
}

export interface KycConfirmPayload {
  status: "approved" | "rejected" | "pending";
}

export interface SuspendPayload {
  suspendUntil?: Date | string;
}

/**
 * Get user profile by ID
 * @param userId - User UUID
 * @returns User profile with role-specific data
 */
export async function getUserProfile(userId: string) {
  try {
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

/**
 * Get all merchants with pagination
 * @param skip - Number of records to skip
 * @param take - Number of records per page (max 10)
 * @returns Paginated merchants list
 */
export async function getMerchantsList(skip: number = 0, take: number = 10) {
  try {
    const response = await api.get("/api/users/merchants/list", {
      params: { skip, take },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching merchants list:", error);
    throw error;
  }
}

export async function getMerchantsPendingList(skip: number = 0, take: number = 10) {
  try {
    const response = await api.get("/api/users/merchants/list/pending", {
      params: { skip, take },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching merchants list:", error);
    throw error;
  }
}

/**
 * Get all users with pagination (admin only)
 * @param skip - Number of records to skip
 * @param take - Number of records per page (max 10)
 * @returns Paginated users list
 */
export async function getUsersList(skip: number = 0, take: number = 10) {
  try {
    const response = await api.get("/api/users", {
      params: { skip, take },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users list:", error);
    throw error;
  }
}

/**
 * Confirm merchant KYC status (admin action)
 * @param merchantId - Merchant user ID
 * @param status - KYC status ('approved', 'rejected', or 'pending')
 * @returns Updated merchant record
 */
export async function confirmMerchantKyc(
  merchantId: string,
  status: "approved" | "rejected" | "pending"
) {
  try {
    const response = await api.patch(
      `/api/users/merchants/${merchantId}/kyc`,
      { status }
    );
    return response.data;
  } catch (error) {
    console.error("Error confirming merchant KYC:", error);
    throw error;
  }
}

/**
 * Suspend user (merchant or customer)
 * @param userId - User ID
 * @param suspendUntil - Optional suspension end date (defaults to 30 days)
 * @returns Updated user record
 */
export async function suspendUser(
  userId: string,
  suspendUntil?: Date | string
) {
  try {
    const payload: any = {};
    if (suspendUntil) {
      payload.suspendUntil = suspendUntil;
    }

    const response = await api.patch(
      `/api/users/${userId}/suspend`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error suspending user:", error);
    throw error;
  }
}

/**
 * Unsuspend user (merchant or customer)
 * @param userId - User ID
 * @returns Updated user record
 */
export async function unsuspendUser(userId: string) {
  try {
    const response = await api.patch(
      `/api/users/${userId}/unsuspend`,
      {}
    );
    return response.data;
  } catch (error) {
    console.error("Error unsuspending user:", error);
    throw error;
  }
}

/**
 * Suspend merchant
 * @param merchantId - Merchant user ID
 * @param suspendUntil - Optional suspension end date (defaults to 30 days)
 * @returns Updated merchant record
 */
export async function suspendMerchant(
  merchantId: string,
  suspendUntil?: Date | string
) {
  try {
    const payload: any = {};
    if (suspendUntil) {
      payload.suspendUntil = suspendUntil;
    }

    const response = await api.patch(
      `/api/users/merchants/${merchantId}/suspend`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error suspending merchant:", error);
    throw error;
  }
}

/**
 * Unsuspend merchant
 * @param merchantId - Merchant user ID
 * @returns Updated merchant record
 */
export async function unsuspendMerchant(merchantId: string) {
  try {
    const response = await api.patch(
      `/api/users/merchants/${merchantId}/unsuspend`,
      {}
    );
    return response.data;
  } catch (error) {
    console.error("Error unsuspending merchant:", error);
    throw error;
  }
}

/**
 * Suspend customer
 * @param customerId - Customer user ID
 * @param suspendUntil - Optional suspension end date (defaults to 30 days)
 * @returns Updated customer record
 */
export async function suspendCustomer(
  customerId: string,
  suspendUntil?: Date | string
) {
  try {
    const payload: any = {};
    if (suspendUntil) {
      payload.suspendUntil = suspendUntil;
    }

    const response = await api.patch(
      `/api/users/customers/${customerId}/suspend`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error suspending customer:", error);
    throw error;
  }
}

/**
 * Unsuspend customer
 * @param customerId - Customer user ID
 * @returns Updated customer record
 */
export async function unsuspendCustomer(customerId: string) {
  try {
    const response = await api.patch(
      `/api/users/customers/${customerId}/unsuspend`,
      {}
    );
    return response.data;
  } catch (error) {
    console.error("Error unsuspending customer:", error);
    throw error;
  }
}

/**
 * Get current authenticated user profile
 */
export async function getMyProfile() {
  try {
    const response = await api.get("/api/users/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching current user profile:", error);
    throw error;
  }
}

/**
 * Update authenticated customer profile details
 * @param data - Updated customer data e.g. { full_name }
 */
export async function updateCustomerProfile(data: { full_name: string }) {
  try {
    const response = await api.patch("/api/users/profile/customer", data);
    return response.data;
  } catch (error) {
    console.error("Error updating customer profile:", error);
    throw error;
  }
}

/**
 * Update authenticated merchant profile details
 * @param data - Updated merchant data
 */
export async function updateMerchantProfile(data: any) {
  try {
    const response = await api.patch("/api/users/profile/merchant", data);
    return response.data;
  } catch (error) {
    console.error("Error updating merchant profile:", error);
    throw error;
  }
}

/**
 * Fetch merchant details by ID
 * @param id - Merchant user ID
 */
export async function getMerchantDetail(id: string) {
  try {
    const response = await api.get(`/api/users/merchants/${id}/detail`);
    return response.data;
  } catch (error) {
    console.error("Error fetching merchant detail:", error);
    throw error;
  }
}


