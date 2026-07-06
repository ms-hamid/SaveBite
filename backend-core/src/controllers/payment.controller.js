// controllers/payment.controller.js
import { serializeBigInt } from "../utils/json.js";
import crypto from "crypto";
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

    const { order_id, status_code, gross_amount, signature_key } = notification;
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    
    if (serverKey) {
      const hash = crypto
        .createHash("sha512")
        .update(order_id + status_code + Number(gross_amount) + serverKey)
        .digest("hex");

        console.log("hash:", hash);
        console.log("signature_key:", signature_key);

        console.log("order_id:", order_id);
        console.log("status_code:", status_code);
        console.log("gross_amount:", gross_amount);
        console.log("serverKey:", serverKey);
        console.log("signature_key:", signature_key);

        process.env.MIDTRANS_SERVER_KEY = serverKey;
        console.log("process.env.MIDTRANS_SERVER_KEY:", process.env.MIDTRANS_SERVER_KEY);
        console.log("process.env.MIDTRANS_CLIENT_KEY:", process.env.MIDTRANS_CLIENT_KEY);
        if (hash !== signature_key) {
        console.error("Invalid signature key");
        return res.status(400).json({
          message: "Invalid signature key",
          error: "Signature key validation failed",
          hash: hash,
            signature_key: signature_key
        });
      }
    }

    await updatePaymentStatus(notification);

    res.status(200).json({
      message: "callback received"
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
        error: err.message,
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