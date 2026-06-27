import type { Profile } from "./profile";

export type Review = {
  id: number;
  created_at: string;
  img_url: string | null;
  /** SmallInt 1–5 */
  rating: number;
  /** Date stored as ISO date string (from db.Date) */
  review: string;
  /** FK → profiles.user_id (merchant being reviewed) */
  merchant_id: string;
  /** FK → listings.id — null means general merchant review */
  listing_id: number | null;
  /** FK → auth.users.id */
  customer_id: string | null;

  // Relations
  profile?: Profile | null;
  users?: {
    id: string;
  } | null;
};
