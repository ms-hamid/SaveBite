/**
 * @file src/repositories/order.repository.js
 * @description Data access layer for the Order domain.
 *
 * All database calls go through Prisma. Raw SQL is used ONLY for the
 * pessimistic lock (SELECT ... FOR UPDATE) which Prisma does not support
 * natively in interactive transactions.
 *
 * Pessimistic Locking Strategy (NFR-8 / FR-K-02):
 *   - Use $queryRaw for SELECT FOR UPDATE on listings.stock
 *   - Wrapped in prisma.$transaction to guarantee atomicity
 *   - Prevents race conditions on the last item (concurrent buyers)
 */

import { prisma } from "../lib/prisma.js";
import { createError } from "../middlewares/error.middleware.js";
import crypto from "crypto";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Generate a cryptographically secure, unique order QR token */
function generate_qr_token() {
  return crypto.randomBytes(32).toString("hex");
}

/** Generate a human-readable 6-char pickup order code */
function generate_order_code() {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const bytes = crypto.randomBytes(6);
  return Array.from(bytes)
    .map((b) => chars[b % chars.length])
    .join("");
}

// ── Queries ───────────────────────────────────────────────────────────────────

/**
 * Atomically create an order:
 *  1. Lock the listing row (SELECT FOR UPDATE — pessimistic lock)
 *  2. Validate stock availability
 *  3. Decrement stock
 *  4. Insert order record
 *
 * The entire operation runs inside a serializable transaction.
 * Any failure rolls back all changes.
 *
 * @param {string} userId
 * @param {string} listingId
 * @param {number} qty
 * @returns {Promise<Order>}
 */
export async function create_order_atomic(userId, listingId, qty) {
  return prisma.$transaction(
    async (tx) => {
      // 1. Acquire pessimistic row-level lock on the listing
      const [listing] = await tx.$queryRaw`
        SELECT id, stock, status, discount_price, expired_at
        FROM "Listing"
        WHERE id = ${listingId}::uuid
        FOR UPDATE
      `;

      if (!listing) {
        throw createError("Listing not found", 404);
      }

      if (listing.status !== "PUBLISHED") {
        throw createError("This listing is no longer available", 409);
      }

      if (new Date(listing.expired_at) < new Date()) {
        throw createError("This listing has expired", 409);
      }

      if (listing.stock < qty) {
        throw createError(
          `Only ${listing.stock} item(s) remaining — cannot reserve ${qty}`,
          409
        );
      }

      // 2. Decrement stock
      await tx.$executeRaw`
        UPDATE "Listing"
        SET stock = stock - ${qty},
            status = CASE WHEN stock - ${qty} = 0 THEN 'EXPIRED'::"List_Status" ELSE status END
        WHERE id = ${listingId}::uuid
      `;

      // 3. Create the order record
      const total_amount =
        Number(listing.discount_price) * qty;

      const order = await tx.order.create({
        data: {
          user_id: userId,
          listing_id: listingId,
          qty,
          total_amount,
          qr_token: generate_qr_token(),
          status: "PENDING_PAYMENT",
        },
      });

      return order;
    },
    {
      // Serializable isolation prevents phantom reads on concurrent stock checks
      isolationLevel: "Serializable",
      maxWait: 5000,  // ms to wait for lock acquisition
      timeout: 10000, // ms before transaction is aborted
    }
  );
}

/**
 * Update order status + generate order code on payment confirmation.
 * @param {string} orderId
 * @param {string} paymentMethod - e.g. 'bank_transfer', 'qris'
 * @returns {Promise<Order>}
 */
export async function confirm_order_payment(orderId, paymentMethod) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId } });

    if (!order) throw createError("Order not found", 404);
    if (order.status !== "PENDING_PAYMENT") {
      throw createError(
        `Cannot confirm payment — order status is '${order.status}'`,
        409
      );
    }

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 2);

    // Retry up to 10 times to avoid order_code uniqueness collisions
    for (let attempt = 0; attempt < 10; attempt++) {
      try {
        const updated = await tx.order.update({
          where: { id: orderId },
          data: {
            status: "PAID_RESERVED",
            order_code: generate_order_code(),
            order_code_active: true,
            order_code_expires_at: expiresAt,
            payment_method: paymentMethod,
          },
          include: { list: { include: { merchant: true } } },
        });
        return updated;
      } catch (e) {
        if (e.code === "P2002" && attempt < 9) continue; // unique collision, retry
        throw e;
      }
    }
  });
}

/**
 * Cancel an order and release the reserved stock back to the listing.
 * @param {string} orderId
 * @param {string} cancelledBy - userId initiating the cancellation
 * @returns {Promise<Order>}
 */
export async function cancel_order(orderId, cancelledBy) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId } });

    if (!order) throw createError("Order not found", 404);

    const cancellable = ["PENDING_PAYMENT", "PAID_RESERVED"];
    if (!cancellable.includes(order.status)) {
      throw createError(
        `Cannot cancel — order is already '${order.status}'`,
        409
      );
    }

    // Release stock back to the listing
    await tx.$executeRaw`
      UPDATE "Listing"
      SET stock = stock + ${order.qty},
          status = 'PUBLISHED'::"List_Status"
      WHERE id = ${order.listing_id}::uuid
    `;

    return tx.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
    });
  });
}

/**
 * Find a single order by its UUID, including listing + payment details.
 * @param {string} orderId
 * @returns {Promise<Order|null>}
 */
export async function find_order_by_id(orderId) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      list: {
        include: { merchant: true },
      },
      payment: true,
    },
  });
}

/**
 * List all orders for a given user (customer), newest first.
 * @param {string} userId
 * @returns {Promise<Order[]>}
 */
export async function find_orders_by_user(userId) {
  return prisma.order.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
    include: {
      list: { select: { title: true, discount_price: true } },
      payment: { select: { pg_status: true } },
    },
  });
}
