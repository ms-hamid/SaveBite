import type { KycStatus } from "./enum";
import { Order } from "./order";

export type Merchant = {
  merchant_name: string | null;
  latitude: number | null;
  longitude: number | null;
  kyc_status: KycStatus | null;
  google_map_url: string | null;
  virtual_balance: number | null;
  address: string | null;
  bank_name: string | null;
  bank_account: string | null;
  user_id: string;
  category: string | null;
  desc: string | null;
  pickup_instruction: string | null;
  contactless_pickup: boolean;
  notify_staff_upon_arrival: boolean;
  pickup_open: string | null;
  pickup_close: string | null;
  same_day_pickup: boolean;
  max_prep_time: number | null;
  rating: number | null;
  rating_times: number;
  profile_pic: string | null;

  orders?: Order[]
};
