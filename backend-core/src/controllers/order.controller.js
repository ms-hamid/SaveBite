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
  confirm_payment,
  create_order,
  get_customer_orders,
  get_order,
} from "../services/order.service.js";

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
    order,
  });
}

/**
 * GET /api/orders
 * Get all orders for the authenticated customer.
 */
export async function get_customer_orders_handler(req, res) {
  const orders = await get_customer_orders(req.user.id);
  return res.status(200).json({ orders });
}

/**
 * GET /api/orders/:id
 * Get a single order by ID (with listing + payment info).
 */
export async function get_order_handler(req, res) {
  const order = await get_order(req.params.id, req.user.id, req.user.role);
  return res.status(200).json({ order });
}

/**
 * PATCH /api/orders/:id/confirm-transfer
 * Customer confirms manual bank transfer → status moves to PAID_RESERVED
 * and the server generates the QR pickup code.
 * Body: { payment_method? }
 */
export async function confirm_transfer_handler(req, res) {
  const { payment_method } = req.body;
  const order = await confirm_payment(req.params.id, req.user.id, payment_method);

  return res.status(200).json({
    message: "Payment confirmed — your QR pickup code is ready",
    order,
  });
}

/**
 * PATCH /api/orders/:id/cancel
 * Cancel an order and release reserved stock.
 */
export async function cancel_order_handler(req, res) {
  const order = await cancel_order_svc(req.params.id, req.user.id, req.user.role);

  return res.status(200).json({
    message: "Order cancelled",
    order,
  });
}
