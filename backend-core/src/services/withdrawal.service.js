/**
 * @file src/services/withdrawal.service.js
 * @description Business logic for merchant withdrawals and admin payout review.
 */

import { prisma } from "../lib/prisma.js";
import { createError } from "../middlewares/error.middleware.js";
import {
  create_withdrawal_record,
  find_all_withdrawals,
  find_merchant_balance,
  find_placeholder_admin_id,
  find_withdrawal_by_id,
  find_withdrawals_by_merchant,
  update_merchant_virtual_balance,
  update_withdrawal_record,
} from "../repositories/withdrawal.repository.js";

const MIN_WITHDRAWAL_AMOUNT = 50_000;

function to_number(value) {
  return Number(value ?? 0);
}

function assert_pending(withdrawal) {
  if (withdrawal.status !== "pending") {
    throw createError("Only pending withdrawals can be modified", 422);
  }
}

function validate_bank_details(merchant) {
  if (!merchant.bank_name || !merchant.bank_account) {
    throw createError(
      "Bank name and account number must be set before requesting withdrawal",
      422
    );
  }
}

function validate_amount(amount) {
  const parsed = Number(amount);
  if (!parsed || parsed < MIN_WITHDRAWAL_AMOUNT) {
    throw createError(
      `Minimum withdrawal amount is Rp${MIN_WITHDRAWAL_AMOUNT.toLocaleString("id-ID")}`,
      422
    );
  }
  return parsed;
}

export async function get_merchant_virtual_balance_svc(merchant_id) {
  const merchant = await find_merchant_balance(merchant_id);
  if (!merchant) throw createError("Merchant not found", 404);

  return {
    virtual_balance: to_number(merchant.virtual_balance),
    bank_name: merchant.bank_name,
    bank_account: merchant.bank_account,
    merchant_name: merchant.merchant_name,
  };
}

export async function get_my_withdrawals_svc(merchant_id) {
  return find_withdrawals_by_merchant(merchant_id);
}

export async function get_withdrawal_svc(id, user) {
  const withdrawal = await find_withdrawal_by_id(id);
  if (!withdrawal) throw createError("Withdrawal not found", 404);

  if (user.role === "MERCHANT" && withdrawal.merchant_id !== user.id) {
    throw createError("You do not own this withdrawal", 403);
  }

  if (user.role !== "MERCHANT" && user.role !== "ADMIN") {
    throw createError("Access denied", 403);
  }

  return withdrawal;
}

export async function get_admin_withdrawals_svc({ status } = {}) {
  return find_all_withdrawals({ status });
}

export async function create_withdrawal_svc(merchant_id, body) {
  const amount = validate_amount(body.amount);
  const merchant = await find_merchant_balance(merchant_id);

  if (!merchant) throw createError("Merchant not found", 404);
  validate_bank_details(merchant);

  const balance = to_number(merchant.virtual_balance);
  if (balance < amount) {
    throw createError("Insufficient virtual balance", 422);
  }

  return prisma.$transaction(async (tx) => {


    await update_merchant_virtual_balance(
      merchant_id,
      balance - amount,
      tx
    );

    return create_withdrawal_record(
      {
        merchant_id,
        amount,
        qty: BigInt(body.qty ?? 0),
        status: "pending",
      },
      tx
    );
  });
}

export async function update_withdrawal_svc(id, merchant_id, body) {
  const withdrawal = await find_withdrawal_by_id(id);
  if (!withdrawal) throw createError("Withdrawal not found", 404);
  if (withdrawal.merchant_id !== merchant_id) {
    throw createError("You do not own this withdrawal", 403);
  }
  assert_pending(withdrawal);

  if (body.amount === undefined) {
    throw createError("amount is required", 400);
  }

  const new_amount = validate_amount(body.amount);
  const old_amount = to_number(withdrawal.amount);
  const diff = new_amount - old_amount;

  if (diff === 0) {
    return withdrawal;
  }

  const merchant = await find_merchant_balance(merchant_id);
  const balance = to_number(merchant.virtual_balance);

  if (diff > 0 && balance < diff) {
    throw createError("Insufficient virtual balance", 422);
  }

  return prisma.$transaction(async (tx) => {
    await update_merchant_virtual_balance(merchant_id, balance - diff, tx);

    return update_withdrawal_record(
      id,
      { amount: new_amount },
      tx
    );
  });
}

export async function cancel_withdrawal_svc(id, merchant_id) {
  const withdrawal = await find_withdrawal_by_id(id);
  if (!withdrawal) throw createError("Withdrawal not found", 404);
  if (withdrawal.merchant_id !== merchant_id) {
    throw createError("You do not own this withdrawal", 403);
  }
  assert_pending(withdrawal);

  const merchant = await find_merchant_balance(merchant_id);
  const balance = to_number(merchant.virtual_balance);
  const refund_amount = to_number(withdrawal.amount);

  return prisma.$transaction(async (tx) => {
    await update_merchant_virtual_balance(
      merchant_id,
      balance + refund_amount,
      tx
    );

    return update_withdrawal_record(
      id,
      { status: "cancelled" },
      tx
    );
  });
}

export async function review_withdrawal_svc(id, admin_id, body) {
  const { status } = body;

  if (!["completed", "declinec"].includes(status)) {
    throw createError("status must be completed or declinec", 400);
  }

  const withdrawal = await find_withdrawal_by_id(id);
  if (!withdrawal) throw createError("Withdrawal not found", 404);
  assert_pending(withdrawal);

  if (status === "completed") {
    return update_withdrawal_record(id, {
      status: "completed",
      admin_id,
    });
  }

  const merchant = await find_merchant_balance(withdrawal.merchant_id);
  const balance = to_number(merchant.virtual_balance);
  const refund_amount = to_number(withdrawal.amount);

  return prisma.$transaction(async (tx) => {
    await update_merchant_virtual_balance(
      withdrawal.merchant_id,
      balance + refund_amount,
      tx
    );

    return update_withdrawal_record(
      id,
      {
        status: "declinec",
        admin_id,
      },
      tx
    );
  });
}
