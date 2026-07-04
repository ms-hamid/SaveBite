/**
 * @file src/services/refund.ts
 * @description Refund API service for frontend.
 */

import api from "@/lib/api";

export type RefundStatus = "pending" | "cancel" | "rejected" | "done";

export type Refund = {
  id: string;
  public_id: string;
  created_at: string;
  customer_id: string | null;
  payments_id: string;
  order_id: string;
  amount: string | number;
  status: RefundStatus;
  desc: string | null;
  orders?: {
    public_id: string;
    total_amount: string | number;
    qty: number;
    status: string;
    created_at: string;
    listing?: {
      name: string | null;
      img_url: string | null;
      discount_price: string | number | null;
    } | null;
    merchant?: {
      merchant_name: string | null;
      address: string | null;
    } | null;
  } | null;
  payments?: {
    payment_method: string | null;
    pg_status: string | null;
    amount: string | number | null;
  } | null;
  users?: {
    email: string | null;
  } | null;
};

/** Customer: request a refund for a cancelled order */
export async function requestRefund(payload: { order_id: string; desc?: string }) {
  const response = await api.post("/refund", payload);
  return response.data.data as Refund;
}

/** Customer: list own refund requests */
export async function getMyRefunds() {
  const response = await api.get("/refund/my");
  return response.data.data as Refund[];
}

/** Admin: list all refund requests */
export async function getAdminRefunds(status?: RefundStatus) {
  const response = await api.get("/refund/admin/list", {
    params: status ? { status } : undefined,
  });
  return response.data.data as Refund[];
}

/** Get single refund by ID */
export async function getRefundByPublicId(public_id: string | undefined) {
  const response = await api.get(`/refund/${public_id}`);
  return response.data.data as Refund;
}

/** Admin: review a refund (approve/reject) */
export async function reviewRefund(
  public_id: string | undefined,
  payload: { status: "done" | "rejected" | "cancel"; desc?: string }
) {
  const response = await api.patch(`/refund/${public_id}/review`, payload);
  return response.data.data as Refund;
}
