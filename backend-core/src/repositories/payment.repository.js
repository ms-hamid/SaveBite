import { prisma } from "../lib/prisma.js";

export async function get_payment_by_id(payment_id) {
    const payment = await prisma.payment.findUnique({
        where: {
            id: payment_id
        }
    });
    return payment;
}

export async function createPayment(data) {
    return prisma.payment.create({
        data
    });
}

export async function updatePayment(id, data) {
    return prisma.payment.update({
        where: {
            id
        },
        data
    });
}

export async function get_last_payment_by_order_id(order_id) {
    const payment = await prisma.payment.findMany({
        where: {
            order_id: order_id
        },
        orderBy: {
            id: "desc"
        },
        take: 1
    });
    return payment;
}

export async function update_payment_by_order_id(order_id, data) {
    return await prisma.payment.update({
        where: {
            order_id: Number(order_id)
        },
        data
    });
}

export async function update_payment_by_transaction_id(transaction_id, data) {
    return await prisma.payment.update({
        where: {
            transaction_id: transaction_id
        },
        data
    });
}

/**
 * Get the most recent payment for an order using the order's public_id (UUID).
 * @param {string} order_public_id - The order's public_id (UUID)
 * @returns {Promise<Payment|null>}
 */
export async function get_last_payment_by_order_public_id(order_public_id) {
    const payments = await prisma.payment.findMany({
        where: {
            order: {
                public_id: order_public_id
            }
        },
        orderBy: {
            created_at: "desc"
        },
        take: 1
    });
    return payments[0] ?? null;
}