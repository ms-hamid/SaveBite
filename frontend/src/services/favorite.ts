import api from "@/lib/api";

export type FavoriteListingItem = {
  id: number;
  public_id: string;
  name: string | null;
  open_time: string | null;
  close_time: string | null;
  sold_total: number;
  stock_total: number;
  original_price: number | null;
  discount_price: number | null;
  discount_percentage: number | null;
  img_url: string | null;
  description: string | null;
  status: string;
  merchant_id: string | null;
  is_favorite: boolean;
  favorited_at: string;
  merchant?: {
    merchant_name: string | null;
    address: string | null;
    category: string | null;
    pickup_open: string | null;
    pickup_close: string | null;
  } | null;
  // alias used when returned from listing endpoint
  merchants?: {
    merchant_name: string | null;
    category?: string | null;
  } | null;
  distance_km?: number;
};

export type FavoriteFilters = {
  q?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
};

/** GET /favorite — list all saved listings with optional filters */
export async function getFavorites(filters: FavoriteFilters = {}) {
  const params: Record<string, unknown> = {};
  if (filters.q) params.q = filters.q;
  if (filters.category) params.category = filters.category;
  if (filters.min_price !== undefined) params.min_price = filters.min_price;
  if (filters.max_price !== undefined) params.max_price = filters.max_price;

  const response = await api.get("/favorite", { params });
  return response.data; // { success, data: FavoriteListingItem[] }
}

/** POST /favorite/:public_id/toggle — add or remove from favorites */
export async function toggleFavorite(listingPublicId: string) {
  const response = await api.post(`/favorite/${listingPublicId}/toggle`);
  return response.data; // { success, action: "added"|"removed", listing_id }
}

/** GET /favorite/:public_id/status — check is_favorite for one listing */
export async function checkFavorite(listingPublicId: string) {
  const response = await api.get(`/favorite/${listingPublicId}/status`);
  return response.data; // { success, is_favorite: boolean }
}
