/**
 * @file src/repositories/withdrawal.repository.js
 * @description Data access layer for the Withdrawal domain.
 */

import { prisma } from "../lib/prisma.js";

export async function find_placeholder_admin_id(tx = prisma) {
  const admin = await tx.admin.findFirst({
    select: { user_id: true },
    orderBy: { user_id: "asc" },
  });
  return admin?.user_id ?? null;
}

export async function find_merchant_balance(merchant_id, tx = prisma) {
  return tx.merchant.findUnique({
    where: { user_id: merchant_id },
    select: {
      user_id: true,
      merchant_name: true,
      virtual_balance: true,
      bank_name: true,
      bank_account: true,
      address: true,
    },
  });
}

export async function update_merchant_virtual_balance(merchant_id, virtual_balance, tx = prisma) {
  return tx.merchant.update({
    where: { user_id: merchant_id },
    data: { virtual_balance },
  });
}

export async function find_withdrawal_by_id(id, tx = prisma) {
  return tx.withdrawal.findUnique({
    where: { id: BigInt(id) },
    include: {
      merchant: {
        select: {
          merchant_name: true,
          bank_name: true,
          bank_account: true,
          address: true,
          virtual_balance: true,
        },
      },
      admin: {
        include: {
          auth_user: {
            select: { email: true },
          },
        },
      },
    },
  });
}

export async function find_withdrawals_by_merchant(merchant_id) {
  return prisma.withdrawal.findMany({
    where: { merchant_id },
    orderBy: { created_at: "desc" },
    include: {
      merchant: {
        select: {
          merchant_name: true,
          bank_name: true,
          bank_account: true,
        },
      },
    },
  });
}

export async function find_all_withdrawals({ status } = {}) {
  const where = status ? { status } : {};

  return prisma.withdrawal.findMany({
    where,
    orderBy: { created_at: "desc" },
    include: {
      merchant: {
        select: {
          merchant_name: true,
          bank_name: true,
          bank_account: true,
          address: true,
        },
      },
    },
  });
}

export async function create_withdrawal_record(data, tx = prisma) {
  return tx.withdrawal.create({
    data,
    include: {
      merchant: {
        select: {
          merchant_name: true,
          bank_name: true,
          bank_account: true,
        },
      },
    },
  });
}

export async function update_withdrawal_record(id, data, tx = prisma) {
  return tx.withdrawal.update({
    where: { id: BigInt(id) },
    data: {
      ...data,
      updated_at: new Date(),
    },
    include: {
      merchant: {
        select: {
          merchant_name: true,
          bank_name: true,
          bank_account: true,
          address: true,
        },
      },
    },
  });
}
