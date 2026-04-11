import { create_order_service, delete_order_service } from "../services/order.service.js";

export async function create_order(req, res) {
    try {
        const new_order = create_order_service(req.body);

        return res.status(201).json({
            message: "Berhasil mendapatkan data order",
            order: new_order
        });
    } catch (e) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: e.message
        });
    }
}

export async function delete_order(req, res) {
    try {
        const deleted_order = delete_order_service()

    } catch (e) {
        return req.status(500).json({
            message: "Internal Server Error",
            error: e.message
        });
    }
}