import api from "@/lib/api";

export async function getMyListing() {
  const response = await api.get("/listing/my");
  return response.data.data;
}

export type CreateListingPayload = {
  name: string;
  description?: string;
  stock_total: number;
  original_price: number;
  discount_price: number;
  discount_percentage: number;
  open_time: string;
  close_time: string;
  img_url?: string;
};

export async function createListing(payload: CreateListingPayload) {
  const response = await api.post("/listing", payload);
  return response.data;
}

export async function deleteListing(listingId: string) {
  const response = await api.delete(`/listing/${listingId}`);
  return response.data;
}

export type UpdateListingPayload = {
  name?: string;
  description?: string;
  stock_total?: number;
  original_price?: number;
  discount_price?: number;
  open_time?: string;
  close_time?: string;
  img_url?: string;
};

export async function updateListing(
  listingId: string,
  payload: UpdateListingPayload
) {
  const response = await api.patch(`/listing/${listingId}`, payload);
  return response.data;
}

export async function getListingByPublicID(listingId: string) {
  const response = await api.get(`/listing/${listingId}`);
  return response.data;
}

export async function getListingAll(
  lat?: number,
  lng?: number,
  radius_km?: number
) {
  const params: Record<string, number> = {};
  if (lat !== undefined && lat !== null) params.lat = lat;
  if (lng !== undefined && lng !== null) params.lng = lng;
  if (radius_km !== undefined && radius_km !== null) params.radius_km = radius_km;

  const response = await api.get("/listing", { params });
  return response.data;
}
