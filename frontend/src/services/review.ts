import api from "@/lib/api";

export type ReviewItem = {
  id: number;
  created_at: string;
  img_url: string | null;
  rating: number;
  review: string;
  merchant_id: string;
  listing_id: number | null;
  customer_id: string | null;
  profile?: { full_name: string | null } | null;
};

export type ReviewsResponse = {
  reviews: ReviewItem[];
  total: number;
};

/**
 * GET /review/merchant/:merchantId
 * Public — no auth required
 */
export async function getMerchantReviews(
  merchantId: string,
  { take = 20, skip = 0 }: { take?: number; skip?: number } = {}
): Promise<ReviewsResponse> {
  const res = await api.get(`/review/merchant/${merchantId}`, {
    params: { take, skip },
  });
  return res.data.data;
}

/**
 * GET /review/merchant/:merchantId/status
 * Auth: CUSTOMER — check if already reviewed this merchant (general)
 */
export async function checkMerchantReviewed(
  merchantId: string
): Promise<{ has_reviewed: boolean; review: ReviewItem | null }> {
  const res = await api.get(`/review/merchant/${merchantId}/status`);
  return res.data;
}

/**
 * POST /review/merchant/:merchantId
 * Auth: CUSTOMER — submit general merchant review (listing_id = null)
 */
export async function submitMerchantReview(
  merchantId: string,
  payload: { rating: number; review_text?: string; img_url?: string | null }
): Promise<ReviewItem> {
  const res = await api.post(`/review/merchant/${merchantId}`, payload);
  return res.data.data;
}

/**
 * GET /review/listing/:listingPublicId/status?merchant_id=
 * Auth: CUSTOMER — check if already reviewed this listing
 */
export async function checkListingReviewed(
  listingPublicId: string,
  merchantId: string
): Promise<{ has_reviewed: boolean; review: ReviewItem | null }> {
  const res = await api.get(`/review/listing/${listingPublicId}/status`, {
    params: { merchant_id: merchantId },
  });
  return res.data;
}

/**
 * POST /review/listing/:listingPublicId
 * Auth: CUSTOMER — submit listing-level review (via order rate flow)
 * Requires merchant_id in body
 */
export async function submitListingReview(
  listingPublicId: string,
  payload: {
    merchant_id: string;
    rating: number;
    review_text?: string;
    img_url?: string | null;
  }
): Promise<ReviewItem> {
  const res = await api.post(`/review/listing/${listingPublicId}`, payload);
  return res.data.data;
}
