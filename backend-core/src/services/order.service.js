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
  confirm_order_payment,
  create_order_atomic,
  find_order_by_id,
  find_orders_by_user,
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
 * @param {string} orderId
 * @param {string} requestingUserId
 * @param {string} paymentMethod
 * @returns {Promise<Order>}
 */
export async function confirm_payment(orderId, requestingUserId, paymentMethod) {
  // Fetch to verify ownership before mutating
  const existing = await find_order_by_id(orderId);

  if (!existing) throw createError("Order not found", 404);

  if (existing.user_id !== requestingUserId) {
    throw createError("You are not authorized to modify this order", 403);
  }

  const updated = await confirm_order_payment(orderId, paymentMethod ?? "bank_transfer");

  orderEmitter.emit("order:completed", updated);

  return updated;
}

/**
 * Cancel an order (customer self-cancel or admin force-cancel).
 *
 * Implements FR-S-02 logic (timeout-based cancellation uses the cron job).
 *
 * @param {string} orderId
 * @param {string} requestingUserId
 * @param {string} requestingRole - 'CONSUMER' | 'ADMIN'
 * @returns {Promise<Order>}
 */
export async function cancel_order_svc(orderId, requestingUserId, requestingRole) {
  const existing = await find_order_by_id(orderId);

  if (!existing) throw createError("Order not found", 404);

  // Ownership check — admins can always cancel (FR-A-03)
  if (requestingRole !== "ADMIN" && existing.user_id !== requestingUserId) {
    throw createError("You are not authorized to cancel this order", 403);
  }

  const cancelled = await cancel_order(orderId, requestingUserId);

  orderEmitter.emit("order:cancelled", cancelled);

  return cancelled;
}

/**
 * Get a single order by ID with all relations.
 * @param {string} orderId
 * @param {string} requestingUserId
 * @param {string} requestingRole
 */
export async function get_order(orderId, requestingUserId, requestingRole) {
  const order = await find_order_by_id(orderId);

  if (!order) throw createError("Order not found", 404);

  if (requestingRole !== "ADMIN" && order.user_id !== requestingUserId) {
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
