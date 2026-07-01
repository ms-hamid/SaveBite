// services/payment.service.js

import { core_api } from "../lib/midtrans/snap.js";
import { createPayment, get_last_payment_by_order_id, get_payment_by_id, update_payment_by_order_id, update_payment_by_transaction_id, updatePayment } from "../repositories/payment.repository.js";
import { find_order_by_id, update_order_status } from "../repositories/order.repository.js";


const FEE = 2000;

export async function createQrisTransaction(payment_id) {

    const payment = await get_payment_by_id(payment_id);

    if (!payment) {
        throw new Error("Payment not found");
    }

    if (!payment.amount) {
        throw new Error("Payment amount is required");
    }

    const parameter = {
        transaction_details: {
            order_id: payment.order_id.toString(),
            gross_amount: Number(payment.amount)
        },

        enabled_payments: ["qris"]
    };

    const transaction =
        await core_api.charge(parameter);

    await prisma.payment.update({
        where: {
            id: payment.id
        },
        data: {
            payment_method: "qris",
            pg_status: "pending"
        }
    });


    return {
        result: transaction
    };
}



export async function createPaymentTransaction(
    orderId,
    customerId,
    paymentMethod = "qris"
) {
    try {

        const order = await find_order_by_id(orderId);

        if (!order) {
            throw new Error("Order not found");
        }


        const amount = Number(order.total_amount) + Number(2000);

        const expiredAt = new Date(
            Date.now() + 15 * 60 * 1000
        );

        const existing_payment = await get_last_payment_by_order_id(order.id);
        const last_existing_payment = existing_payment[0];

        if (last_existing_payment) {

            
            if (last_existing_payment.pg_status === 'settlement') {
                return {
                    message: "Payment already settled"
                };
            }
            

            if (last_existing_payment.pg_status === 'pending') {
                // Return existing payment data with relevant fields
                const result = {
                    payment_id: last_existing_payment.id,
                    token: last_existing_payment.midtrans_trx_id,
                    redirected_url: last_existing_payment.redirect_url,
                    expired_at: last_existing_payment.expired_at,
                };
                // Attach method-specific fields
                if (last_existing_payment.payment_method === 'qris') {
                    result.qris_url = last_existing_payment.qris_url;
                } else {
                    // VA — midtrans_trx_id stores the VA number
                    result.va_number = last_existing_payment.midtrans_trx_id;
                }
                return result;
            }
        }
        
        

        const isQris = paymentMethod === "qris";

        // Map frontend method name to Midtrans bank
        const VA_BANK_MAP = {
            va_bca:     "bca",
            va_mandiri: "mandiri",
            va_bri:     "bri",
            va_bni:     "bni",
        };

        const payment = await createPayment({
            order_id: order.id,
            customer_id: customerId,
            amount: amount,
            payment_method: paymentMethod,
            time_limit: expiredAt,
            expired_at: expiredAt
        });

        const midtransOrderId = order.public_id + '@' + payment.id.toString();

        let transaction;
        let qris_url = null;
        let va_number = null;

        console.log("amount")
        console.log(amount)
        console.log("amount")


        if (isQris) {
            const parameter = {
                payment_type: "qris",
                transaction_details: {
                    order_id: midtransOrderId,
                    gross_amount: amount,
                },
                qris: {
                    acquirer: "gopay"
                },
            };
            transaction = await core_api.charge(parameter);
            const qris_action = transaction.actions?.find(
                (a) => a.name === "generate-qr-code"
            );
            qris_url = qris_action?.url ?? null;
        } else {
            // Virtual Account
            const bankCode = VA_BANK_MAP[paymentMethod] ?? "bca";
            const parameter = {
                payment_type: "bank_transfer",
                transaction_details: {
                    order_id: midtransOrderId,
                    gross_amount: amount,
                },
                bank_transfer: {
                    bank: bankCode,
                },
            };
            transaction = await core_api.charge(parameter);
            // Extract VA number from response
            if (bankCode === "mandiri") {
                va_number = transaction.bill_key
                    ? `${transaction.biller_code} ${transaction.bill_key}`
                    : null;
            } else {
                const vaData = transaction.va_numbers?.[0];
                va_number = vaData?.va_number ?? null;
            }
        }


        await updatePayment(payment.id, {
            midtrans_trx_id: isQris ? transaction.order_id : (va_number ?? transaction.order_id),
            redirected_url: transaction.redirect_url ?? null,
            qris_url: qris_url
        });

        const result = {
            payment_id: payment.id.toString(),
            token: transaction.order_id,
            redirected_url: transaction.redirect_url,
            expired_at: expiredAt.toISOString(),
            result: transaction
        };

        if (isQris) {
            result.qris_url = qris_url;
        } else {
            result.va_number = va_number;
        }

        return result;

    } catch (error) {

        console.error(
            "CREATE PAYMENT TRANSACTION ERROR:"
        );

        console.error(error);

        if (error?.ApiResponse) {
            console.error(
                "MIDTRANS RESPONSE:",
                error.ApiResponse
            );
        }

        throw error;
    }
}

export async function updatePaymentStatus(data) {

  const {
    order_id,
    transaction_status,
    fraud_status
  } = data;

  if (
    transaction_status === "settlement" ||
    (
      transaction_status === "capture" &&
      fraud_status === "accept"
    )
  ) {

    const order_split = order_id.split('@');

    const order_public_id = order_split[0];
    const payment_id = order_split[1];

    const order = await update_order_status(order_public_id, "paid_reserved");

    await updatePayment(payment_id, {
        pg_status: "settlement",
    })
  }


  if (transaction_status === "expire") {

    await update_payment_by_transaction_id(order_id, {
        pg_status: "cancel",
    })

  }
}

/**
 * Check the payment status of the latest payment for an order.
 * @param {string} order_public_id - The order's public_id (UUID)
 * @returns {Promise<{pg_status: string, order_status: string, payment_id: string|null}>}
 */
export async function checkPaymentStatus(order_public_id) {
    const order = await find_order_by_id(order_public_id);

    if (!order) {
        throw new Error("Order not found");
    }

    const payment = order.payment;

    return {
        pg_status: payment?.pg_status ?? null,
        order_status: order.status,
        payment_id: payment?.id ? payment.id.toString() : null,
        order_public_id: order.public_id,
    };
}