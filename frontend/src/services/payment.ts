import api from "@/lib/api";

export async function create_payment(order_id: string ) {
    console.log("order_id", order_id);  
    const response = await api.post(`/payment`, {
        order_id,
    });
    console.log("response", response)

    return response.data;
}

export async function check_payment_status(order_public_id: string) {
    const response = await api.get(`/payment/status/${order_public_id}`);
    return response.data;
}