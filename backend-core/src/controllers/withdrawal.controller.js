/**
 * @file src/controllers/withdrawal.controller.js
 */

import * as withdrawalService from "../services/withdrawal.service.js";
import { serializeBigInt } from "../utils/json.js";

export async function get_merchant_balance_handler(req, res) {
  const data = await withdrawalService.get_merchant_virtual_balance_svc(req.user.id);
  return res.status(200).json({ success: true, data: serializeBigInt(data) });
}

export async function get_my_withdrawals_handler(req, res) {
  const withdrawals = await withdrawalService.get_my_withdrawals_svc(req.user.id);
  return res.status(200).json({
    success: true,
    data: serializeBigInt(withdrawals),
  });
}

export async function get_admin_withdrawals_handler(req, res) {
  const { status } = req.query;
  const withdrawals = await withdrawalService.get_admin_withdrawals_svc({ status });
  return res.status(200).json({
    success: true,
    data: serializeBigInt(withdrawals),
  });
}

export async function get_withdrawal_handler(req, res) {
  const withdrawal = await withdrawalService.get_withdrawal_svc(req.params.id, req.user);
  return res.status(200).json({
    success: true,
    data: serializeBigInt(withdrawal),
  });
}

export async function create_withdrawal_handler(req, res) {
  const withdrawal = await withdrawalService.create_withdrawal_svc(
    req.user.id,
    req.body
  );
  return res.status(201).json({
    success: true,
    message: "Withdrawal request created",
    data: serializeBigInt(withdrawal),
  });
}

export async function update_withdrawal_handler(req, res) {
  const withdrawal = await withdrawalService.update_withdrawal_svc(
    req.params.id,
    req.user.id,
    req.body
  );
  return res.status(200).json({
    success: true,
    message: "Withdrawal updated",
    data: serializeBigInt(withdrawal),
  });
}

export async function cancel_withdrawal_handler(req, res) {
  const withdrawal = await withdrawalService.cancel_withdrawal_svc(
    req.params.id,
    req.user.id
  );
  return res.status(200).json({
    success: true,
    message: "Withdrawal cancelled",
    data: serializeBigInt(withdrawal),
  });
}

export async function review_withdrawal_handler(req, res) {
  const withdrawal = await withdrawalService.review_withdrawal_svc(
    req.params.id,
    req.user.id,
    req.body
  );
  return res.status(200).json({
    success: true,
    message: "Withdrawal status updated",
    data: serializeBigInt(withdrawal),
  });
}
