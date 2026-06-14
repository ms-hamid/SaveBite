import type { WithdrawStatus } from "./enum";
import type { Merchant } from "./merchant";
import type { Admin } from "./admin";

export type Withdrawal = {
  id: number;
  created_at: string;
  updated_at: string | null;
  customer_id: string;
  admin_id: string;
  status: WithdrawStatus;
  amount: number;
  qty: number;

  // Relations
  merchant?: Merchant | null;
  admin?: Admin | null;
};
