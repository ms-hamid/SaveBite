/**
 * @file frontend/src/services/customer.ts
 * @description Customer API service layer
 */

import api from "@/lib/api";

export interface Customer {
  user_id: string;
  full_name: string;
  exp: number | null;
  strike_count: number | null;
  email?: string;
  phone?: string;
  location?: string;
  joined_date?: string;
  status?: "Active" | "Suspended";
}

export interface CustomerWithOrders extends Customer {
  orders: CustomerOrder[];
}

export interface CustomerOrder {
  id: string;
  public_id: string;
  qty: number;
  total_amount: number;
  qr_token: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  listing_id: string;
  merchant_id: string;
  customer_id: string;
}

export interface CustomerListResponse {
  success: boolean;
  data: {
    customers: Customer[];
    total: number;
    suspended_count: number;
  };
  message?: string;
}

export interface CustomerDetailResponse {
  success: boolean;
  data: CustomerWithOrders;
  message?: string;
}

/**
 * Get paginated list of customers
 */
export async function getCustomers(page: number = 1, pageSize: number = 5): Promise<CustomerListResponse> {
  const skip = (page - 1) * pageSize;
  const response = await api.get(`/api/admin/customers?skip=${skip}&take=${pageSize}`);
  return response.data;
}

/**
 * Get customer detail by user_id
 */
export async function getCustomerDetail(userId: string): Promise<CustomerDetailResponse> {
  const response = await api.get(`/api/admin/customers/${userId}`);
  return response.data;
}

/**
 * Suspend customer account
 */
export async function suspendCustomer(userId: string, suspendUntil?: Date): Promise<{ success: boolean; message: string }> {
  const response = await api.patch(`/api/admin/customers/${userId}/suspend`, {
    suspendUntil: suspendUntil?.toISOString(),
  });
  return response.data;
}

/**
 * Unsuspend (reactivate) customer account
 */
export async function unsuspendCustomer(userId: string): Promise<{ success: boolean; message: string }> {
  const response = await api.patch(`/api/admin/customers/${userId}/unsuspend`);
  return response.data;
}

/**
 * Get customer statistics
 */
export async function getCustomerStats(): Promise<{
  success: boolean;
  data: {
    total_customers: number;
    active_users_30d: number;
    suspended_count: number;
  };
}> {
  const response = await api.get('/api/admin/customers/stats');
  return response.data;
}

/**
 * Export customers data to CSV
 */
export async function exportCustomersCSV(): Promise<Blob> {
  const response = await api.get('/api/admin/customers/export', {
    responseType: 'blob',
  });
  return response.data;
}
