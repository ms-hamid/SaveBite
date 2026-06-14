import type { Profile } from "./profile";

export type Review = {
  id: number;
  created_at: string;
  img_url: string | null;
  rating: number;
  review: string;
  merchant_id: string;

  // Relation
  profile?: Profile | null;
};
