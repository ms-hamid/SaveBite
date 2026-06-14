import type { OrderStatus } from "./enum";
import type { Listing } from "./listing";
import type { Merchant } from "./merchant";
import type { Customer } from "./customer";
import type { Payment } from "./payment";

export type Order = {
  id: number;
  qty: number;
  total_amount: number;
  qr_token: string | null;
  status: OrderStatus | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  listing_id: number;
  public_id: string;
  merchant_id: string;
  customer_id: string;
  order_code: string | null;
  order_code_expires_at: string | null;
  order_code_active: boolean;

  // Relations
  listing: Listing | null;
  merchant: Merchant | null;
  customer: Customer | null;
  payment: Payment | null;
};
