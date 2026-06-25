import api from "@/lib/api";

export async function create_payment(order_id: string, payment_method: string = "qris") {
    const response = await api.post(`/payment`, {
        order_id,
        payment_method,
    });

    return response.data;
}

export async function check_payment_status(order_public_id: string) {
    const response = await api.get(`/payment/status/${order_public_id}`);
    return response.data;
}