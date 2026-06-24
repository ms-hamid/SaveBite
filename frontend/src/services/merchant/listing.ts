import api from "@/lib/api";

export async function getListings() {
  const response = await api.get(
    "/api/listings"
  );

  return response.data;
}

export async function getListingById(
  id: string
) {
  const response = await api.get(
    `/api/listings/${id}`
  );

  return response.data;
}

export async function createListing(
  payload: {
    name: string;
    description?: string;
    stockTotal: number;
    originalPrice: number;
    discountPrice: number;
    discountPercentage?: number;
    imgUrl?: string;
    openTime?: string;
    closeTime?: string;
  }
) {
  const response = await api.post(
    "/api/listings",
    payload
  );

  return response.data;
}

export async function updateListing(
  id: string,
  payload: Partial<{
    name: string;
    description: string;
    stockTotal: number;
    originalPrice: number;
    discountPrice: number;
    discountPercentage: number;
    imgUrl: string;
    openTime: string;
    closeTime: string;
    isOpen: boolean;
  }>
) {
  const response = await api.patch(
    `/api/listings/${id}`,
    payload
  );

  return response.data;
}