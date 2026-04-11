import { prisma } from "../lib/prisma.js";

export async function create_list(field) {
    return await prisma.listing.create({
        data: field
    });
}

export async function update_list_repo(field, list_id) {
    return await prisma.listing.update({
        data: field,
        where: {
            id: list_id
        }
    });
}

export async function delete_list_by_id(list_id) {
    return await prisma.listing.delete({
        where: {
            id: list_id
        }
    });
}

export async function get_merchant_listing(merchant_id) {
    return await prisma.listing.findMany({
        where: {
            merchant_id: merchant_id
        }
    });
}

export async function get_list_by_id_repo(list_id) {
    return await prisma.listing.findUnique({
        where: {
            id: list_id
        }
    });
}

export async function find_owned_listing(user_id) {
    return await prisma.listing.findMany({
        where: {
            merchant_id: user_id
        }
    });
}