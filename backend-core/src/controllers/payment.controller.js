// controllers/payment.controller.js
import { serializeBigInt } from "../utils/json.js";
import { createPaymentTransaction, createQrisTransaction, updatePaymentStatus, checkPaymentStatus }
from "../services/payment.service.js";

export async function createQris(req, res) {
    try {

        const { payment_id } = req.body;

        const transaction =
            await createQrisTransaction(payment_id);

        return res.status(200).json(transaction);

    } catch (error) {

        return res.status(400).json({
            message: error.message
        });

    }
}

export async function createPaymentHandler(
    req,
    res
) {
    try {
        const { order_id, payment_method } = req.body;

        const customerId = req.user.id;

        const result =
            await createPaymentTransaction(
                order_id,
                customerId,
                payment_method ?? "qris"
            );


        return res.status(201).json({
            success: true,
            data: serializeBigInt(result)
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

export async function handleMidtransCallback(req, res) {
  try {
    const notification = req.body;

    await updatePaymentStatus(notification);

    res.status(200).json({
      message: "callback received"
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "callback failed"
    });
  }
}

/**
 * GET /payment/status/:order_public_id
 * Check the latest payment status for an order.
 */
export async function checkPaymentStatusHandler(req, res) {
    try {
        const { order_public_id } = req.params;

        const status = await checkPaymentStatus(order_public_id);

        return res.status(200).json({
            success: true,
            data: serializeBigInt(status)
        });

    } catch (error) {
        console.error("CHECK PAYMENT STATUS ERROR:", error);
        return res.status(error.message === "Order not found" ? 404 : 500).json({
            success: false,
            message: error.message
        });
    }
}