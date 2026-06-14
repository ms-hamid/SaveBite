import type { ListingStatus } from "./enum";
import type { Merchant } from "./merchant";

export type Listing = {
  id: number;
  name: string | null;
  open_time: string | null;
  close_time: string | null;
  sold_total: number;
  stock_total: number;
  description: string | null;
  is_open: boolean | null;
  original_price: number | null;
  discount_price: number | null;
  discount_percentage: number | null;
  deleted_at: string | null;
  merchant_id: string | null;
  img_url: string | null;
  public_id: string;
  status: ListingStatus;

  // Relation
  merchant?: Merchant | null;
};
