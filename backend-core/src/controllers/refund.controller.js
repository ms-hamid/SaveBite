/**
 * @file src/controllers/refund.controller.js
 * @description HTTP handlers for the Refund domain.
 */

import {
  get_admin_refunds_svc,
  get_customer_refunds_svc,
  get_refund_svc,
  request_refund_svc,
  review_refund_svc,
} from "../services/refund.service.js";
import { serializeBigInt } from "../utils/json.js";

/** POST /refund — customer requests a refund */
export async function request_refund_handler(req, res) {
  const refund = await request_refund_svc(req.user.id, req.body);
  return res.status(201).json({
    success: true,
    message: "Refund request submitted",
    data: serializeBigInt(refund),
  });
}

/** GET /refund/my — customer lists their own refund requests */
export async function get_my_refunds_handler(req, res) {
  const refunds = await get_customer_refunds_svc(req.user.id);
  return res.status(200).json({
    success: true,
    data: serializeBigInt(refunds),
  });
}

/** GET /refund/admin/list — admin lists all refund requests */
export async function get_admin_refunds_handler(req, res) {
  const { status } = req.query;
  const refunds = await get_admin_refunds_svc({ status });
  return res.status(200).json({
    success: true,
    data: serializeBigInt(refunds),
  });
}

/** GET /refund/:id — get single refund detail */
export async function get_refund_handler(req, res) {
  const refund = await get_refund_svc(req.params.public_id, req.user);
  return res.status(200).json({
    success: true,
    data: serializeBigInt(refund),
  });
}

/** PATCH /refund/:id/review — admin approves or rejects refund */
export async function review_refund_handler(req, res) {
  const refund = await review_refund_svc(req.params.id, req.body);
  return res.status(200).json({
    success: true,
    message: "Refund status updated",
    data: serializeBigInt(refund),
  });
}
