import { prisma } from "../lib/prisma.js";

export async function create_order_repo(field) {
    return await prisma.order.create({
        data: field
    });
}

export async function get_order_repo(user_id) {
    return await prisma.order.findMany({
        where: {
            user_id: user_id
        }
    });
}

export async function update_order_repo(field, order_id) {
    return await prisma.order.update({
       data: field,
       where: {
        id: order_id
       } 
    });
}

export async function delete_order_repo(order_id) {
    return await prisma.order.delete({
        where: {
            id: order_id
        } 
    });
}