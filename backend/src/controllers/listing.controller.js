import { add_new_listing, delete_list_service, get_owned_listing, update_listing_service } from "../services/listing.service.js";

export async function insert_listing(req, res) {
    
    try {

        const new_list = await add_new_listing(req.body, req.user.id);

        return res.status(201).json({
            messsage: "Berhasil menambahkan data listing baru!",
            listing: new_list
        });

    } catch (e) {
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}


export async function index_listing(req, res) {
    try {
        const owned_list = await get_owned_listing(req.user.id);

        return res.status(200).json({
            message: "Berhasil mendapatkan data list",
            lists: owned_list
        });
    } catch (e) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: e.message
        });
    }
}


export async function get_list_by_id(req, res) {
    try {
        const list_data = await get_owned_listing(req.user.id);

        return res.status(200).json({
            message: "Berhasil mendapatkan data list",
            list: list_data
        });
    } catch (e) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: e.message
        });
    }
}


export async function update_listing(req, res) {
    try {
        const owned_list = await update_listing_service(req.body, req.params.id);

        return res.status(200).json({
            message: "Berhasil mengubah data list",
            lists: owned_list
        });
    } catch (e) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: e.message
        });
    } 
}


export async function delete_listing(req, res) {
    try {
        const owned_list = await delete_list_service(req.params.id);

        return res.status(200).json({
            message: "Berhasil menghapus data list",
            lists: owned_list
        });
    } catch (e) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: e.message
        });
    } 
}