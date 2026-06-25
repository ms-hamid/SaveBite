/**
 * @file src/services/order.service.js
 * @description Business logic for the Order domain.
 *
 * The service layer orchestrates:
 *   - Input validation / pre-conditions
 *   - Repository calls (DB operations)
 *   - Side-effect triggering (events, notifications)
 *
 * Controllers stay thin — they only handle HTTP serialization.
 */

import {
  cancel_order,
  complete_order,
  confirm_order_payment,
  create_order_atomic,
  fetch_all_order,
  find_order_by_code,
  find_order_by_id,
  find_orders_by_merchant,
  find_orders_by_user,
  update_order_status,
} from "../repositories/order.repository.js";
import { orderEmitter } from "../events/order.events.js";
import { createError } from "../middlewares/error.middleware.js";

/**
 * Create a new order for a customer.
 *
 * Implements FR-K-02: Pessimistic DB Locking to prevent race conditions.
 * The repository runs the entire operation in a Serializable transaction.
 *
 * @param {string} userId
 * @param {string} listingId
 * @param {number} qty
 * @returns {Promise<Order>}
 */
export async function create_order(userId, listingId, qty) {
  if (!userId || !listingId) {
    throw createError("userId and listingId are required", 400);
  }

  if (!Number.isInteger(qty) || qty < 1) {
    throw createError("qty must be a positive integer", 400);
  }

  const order = await create_order_atomic(userId, listingId, qty);

  // Fire-and-forget: emit event for push notification side-effects
  orderEmitter.emit("order:created", order);

  return order;
}

/**
 * Confirm payment for an order — transitions PENDING_PAYMENT → PAID_RESERVED
 * and generates the QR pickup code server-side.
 *
 * In production, this will be replaced by the Midtrans webhook handler
 * (FR-S-01). This endpoint is used for manual "I have transferred" flow.
 *
 * @param {string} order_id
 * @param {string} requestingUserId
 * @param {string} paymentMethod
 * @returns {Promise<Order>}
 */
export async function confirm_payment(order_id, requestingUserId, paymentMethod) {
  // Fetch to verify ownership before mutating
  const existing = await find_order_by_id(order_id);


  if (!existing) throw createError("Order not found", 404);


  if (existing.customerId !== requestingUserId) {
    throw createError("You are not authorized to modify this order", 403);
  }

  const updated = await confirm_order_payment(order_id, paymentMethod ?? "bank_transfer");

  orderEmitter.emit("order:completed", updated);

  return updated;
}

/**
 * Cancel an order (customer self-cancel or admin force-cancel).
 *
 * Implements FR-S-02 logic (timeout-based cancellation uses the cron job).
 *
 * @param {string} order_id
 * @param {string} requestingUserId
 * @param {string} requestingRole - 'CONSUMER' | 'ADMIN'
 * @returns {Promise<Order>}
 */
export async function cancel_order_svc(order_id, requestingUserId, requestingRole) {
  const existing = await find_order_by_id(order_id);


  if (!existing) throw createError("Order not found", 404);



  // Ownership check — admins can always cancel (FR-A-03)
  if (requestingRole !== "ADMIN" && existing.customerId !== requestingUserId) {
    throw createError("You are not authorized to cancel this order", 403);
  }

  const cancelled = await cancel_order(order_id, requestingUserId);

  orderEmitter.emit("order:cancelled", cancelled);

  return cancelled;
}

/**
 * Get a single order by ID with all relations.
 * @param {string} order_id
 * @param {string} requestingUserId
 * @param {string} requestingRole
 */
export async function get_order(order_id, requestingUserId, requestingRole) {
  const order = await find_order_by_id(order_id);

  if (!order) throw createError("Order not found", 404);

  if (requestingRole !== "ADMIN" && order.customer_id !== requestingUserId && order.merchant_id !== requestingUserId) {
    
    throw createError("Forbidden", 403);
  }

  return order;
}

/**
 * Get all orders for the authenticated customer.
 * @param {string} userId
 */
export async function get_customer_orders(userId) {
  return find_orders_by_user(userId);
}

export async function get_merchant_orders(
  merchant_id
) {
  return find_orders_by_merchant(
    merchant_id
  );
}


export async function change_order_status(
  order_id,
  merchant_id,
  new_status
) {
  const order =
    await find_order_by_id(order_id);

  if (!order) {
    throw createError(
      "Order not found",
      404
    );
  }

  if (
    order.merchant_id !== merchant_id
  ) {
    throw createError(
      "Forbidden",
      403
    );
  }

  const allowedTransitions = {
    paid_reserved: ["preparing"],
    preparing: ["ready_to_pickup"],
    ready_to_pickup: ["completed"],
  };

  const currentStatus =
    order.status;

  const allowed =
    allowedTransitions[
      currentStatus
    ] || [];

  if (
    !allowed.includes(new_status)
  ) {
    throw createError(
      `Cannot change status from '${currentStatus}' to '${new_status}'`,
      409
    );
  }

  return update_order_status(
    order_id,
    new_status
  );
}


export async function pickup_order(
  pickup_code,
  merchant_id,
  order_public_id
) {
  const order =
    await find_order_by_code(
      pickup_code,
    );

  if (!order) {
    throw createError(
      "Invalid pickup code",
      404
    );
  }

  if (
    order.merchant_id !== merchant_id
  ) {
    throw createError(
      "This order does not belong to your store",
      403
    );
  }

  // if (
  //   !order.orderCodeExpiresAt
  // ) {
  //   throw createError(
  //     "Pickup code expired",
  //     409
  //   );
  // }

  // if (
  //   order.orderCodeExpiresAt <
  //   new Date()
  // ) {
  //   throw createError(
  //     "Pickup code expired",
  //     409
  //   );
  // }

  return complete_order(
    order.id
  );
}


export async function get_all_order_svc() {
  return await fetch_all_order();
}