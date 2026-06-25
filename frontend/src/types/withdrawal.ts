import type { WithdrawStatus } from "./enum";
import type { Merchant } from "./merchant";

export type Withdrawal = {
  id: string;
  created_at: string;
  updated_at: string | null;
  merchant_id: string;
  admin_id: string;
  status: WithdrawStatus;
  amount: number;
  qty: string;
  merchant?: Pick<
    Merchant,
    "merchant_name" | "bank_name" | "bank_account" | "address"
  > | null;
};
