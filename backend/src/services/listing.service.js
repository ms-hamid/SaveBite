import { create_list, delete_list_by_id, find_owned_listing, get_list_by_id_repo, update_list_repo } from "../repositories/listing.repository.js"

export async function add_new_listing(body, user_id) {
    const field = {
        title: body.title,
        original_price: body.original_price,
        discount_price: body.discount_price,
        stock: body.stock,
        expired_at: body.expired_at,

        // nanti tambahkan untuk open_at (kapn listingnya bisa diorder) nya

        merchant: {
            connect: {
                id: user_id
            }
        }
    };
    
    const new_list = await create_list(field);

    return new_list;
}

export async function get_list_by_id_service(list_id) {
    const list_data = await get_list_by_id_repo(list_id);
    return list_data;
}

export async function update_listing_service(body, list_id) {
    const field = {
        title: body.title,
        original_price: body.original_price,
        discount_price: body.discount_price,
        stock: body.stock,
        expired_at: body.expired_at,

        // nanti tambahkan untuk open_at (kapan listingnya bisa diorder) nya
    };
    
    const updated_list = await update_list_repo(field, list_id);

    return updated_list;
}

export async function delete_list_service(list_id) {
    const deleted_list = await delete_list_by_id(list_id);

    return deleted_list;
}

export async function get_owned_listing(user_id) {
    const owned_list = await find_owned_listing(user_id);

    return owned_list;
}
