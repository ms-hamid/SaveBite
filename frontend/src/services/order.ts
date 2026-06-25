import api from "@/lib/api";

export async function  create_order(publicId: string | undefined, qty: number){

const response = await api.post("/order", {
    listing_id: publicId,
    qty: qty,
  });

  return response.data
}

export async function get_merchant_order() {
  const response = await api.get(
    "/order/merchant"
  );

  return response.data;
}

export async function update_order_status(
  orderId: string,
  status: string
) {
  const response = await api.patch(
    `/order/${orderId}/status`,
    {
      status,
    }
  );

  return response.data;
}

export async function pickupOrder(
  pickup_code: string,
  order_public_id: string
) {
  const response =
    await api.post(
      "/order/pickup",
      {
        pickup_code,
        order_public_id
      }
    );

  return response.data;
}

export async function getAllOrder() {
  const response = await api.get(
    "/order/admin"
  );

  return response.data;
}

export async function getCustomerOrder() {
  const response = await api.get(
    "/order"
  )

  return response.data;
}


export async function getOrderByPublicId(publicId: string) {
  const response = await api.get(
    `/order/${publicId}`
  );

  return response.data;
}