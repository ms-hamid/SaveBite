import api from "@/lib/api";
import type { Withdrawal, WithdrawStatus } from "@/types";

export type { Withdrawal, WithdrawStatus };

export type MerchantBalance = {
  virtual_balance: number;
  bank_name: string | null;
  bank_account: string | null;
  merchant_name: string | null;
};

export async function getMyWithdrawals() {
  const response = await api.get("/withdrawal/my");
  return response.data.data as Withdrawal[];
}

export async function getMerchantBalance() {
  const response = await api.get("/withdrawal/balance");
  return response.data.data as MerchantBalance;
}

export async function getWithdrawalById(id: string) {
  const response = await api.get(`/withdrawal/${id}`);
  return response.data.data as Withdrawal;
}

export async function createWithdrawal(payload: { amount: number }) {
  const response = await api.post("/withdrawal", payload);
  return response.data;
}

export async function updateWithdrawal(id: string, payload: { amount: number }) {
  const response = await api.patch(`/withdrawal/${id}`, payload);
  return response.data;
}

export async function cancelWithdrawal(id: string) {
  const response = await api.patch(`/withdrawal/${id}/cancel`);
  return response.data;
}

export async function getAdminWithdrawals(status?: WithdrawStatus) {
  const response = await api.get("/withdrawal/admin/list", {
    params: status ? { status } : undefined,
  });
  return response.data.data as Withdrawal[];
}

export async function reviewWithdrawal(
  id: string,
  payload: { status: "completed" | "declinec" }
) {
  const response = await api.patch(`/withdrawal/${id}/review`, payload);
  return response.data;
}
