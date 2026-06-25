/**
 * @file src/controllers/order.controller.js
 * @description HTTP handlers for the Order domain.
 *
 * Controllers are intentionally thin — they only:
 *   1. Extract data from req (params, body, user)
 *   2. Call the service
 *   3. Send the HTTP response
 *
 * All business logic lives in order.service.js.
 */

import {
  cancel_order_svc,
  change_order_status,
  confirm_payment,
  create_order,
  get_all_order_svc,
  get_customer_orders,
  get_merchant_orders,
  get_order,
  pickup_order,
} from "../services/order.service.js";
import { serializeBigInt } from "../utils/json.js";

/**
 * POST /api/orders
 * Create a new order with pessimistic stock locking.
 * Body: { listing_id, qty }
 */
export async function create_order_handler(req, res) {
  const { listing_id, qty } = req.body;
  const user_id = req.user.id;

  const order = await create_order(user_id, listing_id, Number(qty));

  return res.status(201).json({
    message: "Order created successfully",
    data: serializeBigInt(order),
  });
}

/**
 * GET /api/orders
 * Get all orders for the authenticated customer.
 */
export async function get_customer_orders_handler(req, res) {
  const orders = await get_customer_orders(req.user.id);
  return res.status(200).json({ data: serializeBigInt(orders) });
}

/**
 * GET /api/orders/:id
 * Get a single order by ID (with listing + payment info).
 */
export async function get_order_handler(req, res) {
  const order = await get_order(req.params.public_id, req.user.id, req.user.role);

  return res.status(200).json({ data: serializeBigInt(order) });
}

/**
 * PATCH /api/orders/:id/confirm-transfer
 * Customer confirms manual bank transfer → status moves to PAID_RESERVED
 * and the server generates the QR pickup code.
 * Body: { payment_method? }
 */
export async function confirm_transfer_handler(req, res) {
  const { payment_method } = req.body;
  const order = await confirm_payment(req.params.public_id, req.user.id, payment_method);

  return res.status(200).json({
    message: "Payment confirmed — your QR pickup code is ready",
    data: serializeBigInt(order),
  });
}

/**
 * PATCH /api/orders/:id/cancel
 * Cancel an order and release reserved stock.
 */
export async function cancel_order_handler(req, res) {
  const order = await cancel_order_svc(req.params.public_id, req.user.id, req.user.role);

  return res.status(200).json({
    message: "Order cancelled",
    data: serializeBigInt(order),
  });
}

export async function get_merchant_orders_handler(
  req,
  res,
  next
) {
  try {
    const merchant_id = req.user.id;

    const orders =
      await get_merchant_orders(
        merchant_id
      );

    return res.status(200).json({
      success: true,
      data: serializeBigInt(orders),
    });

  } catch (error) {
    console.log(error)
    next(error);
  }
}

export async function change_order_status_handler(
  req,
  res,
  next
) {
  try {
    const merchant_id =
      req.user.id;

    const { id } = req.params;

    const { status } = req.body;

    const order =
      await change_order_status(
        id,
        merchant_id,
        status
      );

    return res.json({
      success: true,
      message:
        "Order status updated",
      data: serializeBigInt(order),
    });
  } catch (error) {
    next(error);
  }
}

export async function pickup_order_handler(
  req,
  res,
  next
) {
  try {

    const merchant_id =
      req.user.id;

    const { pickup_code, order_public_id } =
      req.body;

    const order =
      await pickup_order(
        pickup_code,
        merchant_id,
        order_public_id
      );

    return res.status(200).json({
      success: true,
      message:
        "Order completed successfully",
      data: serializeBigInt(order),
    });

  } catch (error) {
    next(error);
  }
}


export async function get_all_order_handler(
  req,
  res,
  next
) {
  try {
    const orders =
      await get_all_order_svc();

    return res.json({
      success: true,
      data: serializeBigInt(orders),
    });
  } catch (error) {
    next(error);
  }
}