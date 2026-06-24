import type { PgStatus } from "./enum";
import type { Order } from "./order";

export type Payment = {
  id: number;
  amount: number | null;
  midtrans_trx_id: string | null;
  pg_status: PgStatus | null;
  time_limit: string;
  created_at: string;
  updated_at: string;
  order_id: number;
  customer_id: string | null;
  payment_method: string | null;
  paid_at: string | null;
  expired_at: string | null;
  qris_url: string | null;
  // Relation
  order?: Order | null;
};
