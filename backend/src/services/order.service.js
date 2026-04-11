import { create_order_repo, delete_order_repo } from "../repositories/order.repository.js"

export async function create_order_service(body) {
    // const qr_token = create_token()
    
    const field = {
        list: {
            connect: {
                id: body.list_id
            }
        },
        qty: body.qty,
        total_amount: body.total_amount,
        // qr_token: qr_token,
    };

    const new_order = create_order_repo(field);
    return new_order;
}

export async function delete_order_service(body) {
    const order_id = body.params.id;

    const deleted_order = await delete_order_repo(order_id);

    return deleted_order;
    
}