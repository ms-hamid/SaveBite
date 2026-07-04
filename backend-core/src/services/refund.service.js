/**
 * @file src/services/refund.service.js
 * @description Business logic for the Refund domain.
 *
 * Customers can request a refund on a cancelled order that has a payment.
 * Admins can view all refund requests, approve (done) or reject them,
 * and add details (desc).
 */

import { prisma } from "../lib/prisma.js";
import { createError } from "../middlewares/error.middleware.js";
import {
  create_refund_record,
  find_all_refunds,
  find_refund_by_id,
  find_refund_by_public_id,
  find_refunds_by_customer,
  update_refund_record,
} from "../repositories/refund.repository.js";
import { find_order_by_id } from "../repositories/order.repository.js";

/**
 * Customer requests a refund for a cancelled order.
 * @param {string} customer_id
 * @param {{ order_id: string, desc?: string }} body
 */
export async function request_refund_svc(customer_id, body) {
  const { order_id, desc } = body;

  if (!order_id) throw createError("order_id is required", 400);

  const order = await find_order_by_id(order_id);
  if (!order) throw createError("Order not found", 404);

  if (order.customer_id !== customer_id) {
    throw createError("You do not own this order", 403);
  }

  if (order.status !== "cancelled") {
    throw createError(
      "Refunds can only be requested for cancelled orders",
      422
    );
  }

  // Find the latest payment for this order
  const payment = await prisma.payment.findFirst({
    where: { order_id: order.id },
    orderBy: { created_at: "desc" },
  });

  if (!payment) {
    throw createError(
      "No payment found for this order — nothing to refund",
      422
    );
  }

  // Check if a refund has already been requested
  const existing = await prisma.refunds.findFirst({
    where: { order_id: order.id },
  });
  if (existing) {
    throw createError("A refund has already been requested for this order", 409);
  }

  return create_refund_record({
    customer_id,
    order_id: order.id,
    payments_id: payment.id,
    amount: BigInt(Math.round(Number(payment.amount ?? order.total_amount))),
    desc: desc ?? null,
    status: "pending",
  });
}

/**
 * List refund requests for the authenticated customer.
 * @param {string} customer_id
 */
export async function get_customer_refunds_svc(customer_id) {
  return find_refunds_by_customer(customer_id);
}

/**
 * Admin: list all refund requests, optionally filtered by status.
 * @param {{ status?: string }} options
 */
export async function get_admin_refunds_svc({ status } = {}) {
  return find_all_refunds({ status });
}

/**
 * Get a single refund by ID.
 * @param {string} id
 * @param {{ id: string, role: string }} user
 */
export async function get_refund_svc(public_id, user) {
  
  const refund = await find_refund_by_public_id(public_id);
  if (!refund) throw createError("Refund not found", 404);

  if (
    user.role === "CUSTOMER" &&
    refund.customer_id !== user.id
  ) {
    throw createError("Access denied", 403);
  }

  return refund;
}

/**
 * Admin: review a refund — approve (done) or reject, and optionally add desc.
 * @param {string} id
 * @param {{ status: string, desc?: string }} body
 */
export async function review_refund_svc(id, body) {
  const { status, desc } = body;

  const allowed = ["done", "rejected", "cancel"];
  if (!allowed.includes(status)) {
    throw createError(`status must be one of: ${allowed.join(", ")}`, 400);
  }

  const refund = await find_refund_by_id(id);
  if (!refund) throw createError("Refund not found", 404);

  if (refund.status !== "pending") {
    throw createError("Only pending refunds can be reviewed", 422);
  }

  const updateData = { status };
  if (desc !== undefined) updateData.desc = desc;

  return update_refund_record(id, updateData);
}
