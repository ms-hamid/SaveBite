/**
 * @file src/repositories/refund.repository.js
 * @description Data access layer for the Refund domain.
 */

import { prisma } from "../lib/prisma.js";

export async function find_refund_by_id(id, tx = prisma) {
  console.log("find_refund_by_id", id);
  return tx.refunds.findUnique({
    where: { id: BigInt(id) },
    include: {
      orders: {
        include: {
          listing: {
            select: { name: true, img_url: true, discount_price: true },
          },
          merchant: {
            select: { merchant_name: true, address: true },
          },
        },
      },
      payments: {
        select: { payment_method: true, pg_status: true, amount: true },
      },
      users: {
        select: { email: true },
      },
    },
  });
}

export async function find_refund_by_public_id(public_id, tx = prisma) {
  return tx.refunds.findUnique({
    where: { public_id },
    include: {
      orders: {
        include: {
          listing: {
            select: { name: true, img_url: true, discount_price: true },
          },
          merchant: {
            select: { merchant_name: true, address: true },
          },
        },
      },
      payments: {
        select: { payment_method: true, pg_status: true, amount: true },
      },
    },
  });
}

export async function find_refunds_by_customer(customer_id) {
  return prisma.refunds.findMany({
    where: { customer_id },
    orderBy: { created_at: "desc" },
    include: {
      orders: {
        include: {
          listing: {
            select: { name: true, img_url: true, discount_price: true },
          },
          merchant: {
            select: { merchant_name: true },
          },
        },
      },
      payments: {
        select: { payment_method: true, pg_status: true },
      },
    },
  });
}

export async function find_all_refunds({ status } = {}) {
  const where = status ? { status } : {};
  return prisma.refunds.findMany({
    where,
    orderBy: { created_at: "desc" },
    include: {
      orders: {
        include: {
          listing: {
            select: { name: true, img_url: true, discount_price: true },
          },
          merchant: {
            select: { merchant_name: true },
          },
        },
      },
      payments: {
        select: { payment_method: true, pg_status: true, amount: true },
      },
      users: {
        select: { email: true },
      },
    },
  });
}

export async function create_refund_record(data, tx = prisma) {
  return tx.refunds.create({
    data,
    include: {
      orders: {
        include: {
          listing: { select: { name: true } },
          merchant: { select: { merchant_name: true } },
        },
      },
    },
  });
}

export async function update_refund_record(id, data, tx = prisma) {
  return tx.refunds.update({
    where: { id: BigInt(id) },
    data,
    include: {
      orders: {
        include: {
          listing: { select: { name: true } },
          merchant: { select: { merchant_name: true } },
        },
      },
    },
  });
}
