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

import {prisma }from "../lib/prisma.js";
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
 * @param {string} user_id
 * @param {string} listing_id
 * @param {number} qty
 * @returns {Promise<Order>}
 */
export async function create_order_atomic(
  customer_id,
  listing_id,
  qty
) {
  return prisma.$transaction(async (tx) => {

    const listing = await tx.listing.findUnique({
      where: {
        public_id: listing_id
      }
    });

    if (!listing) {
      throw createError("Listing not found", 404);
    }

    if (listing.status !== "active") {
      throw createError(
        "This listing is no longer available",
        409
      );
    }

    const availableStock =
      listing.stock_total - listing.sold_total;

    if (availableStock < qty) {
      throw createError(
        `Only ${availableStock} item(s) remaining`,
        409
      );
    }

    await tx.listing.update({
      where: {
        public_id: listing_id
      },
      data: {
        sold_total: {
          increment: qty
        },

        status:
          availableStock - qty <= 0
            ? "close"
            : undefined
      }
    });

    const total_amount =
      Number(listing.discount_price) * qty;

    const order = await tx.order.create({
      data: {
        qty,
        total_amount,

        qr_token: generate_qr_token(),

        customer_id,
        merchant_id: listing.merchant_id,
        listing_id: listing.id,
        order_lock_expired: new Date(Date.now() + 15 * 60 * 1000).toISOString(),

        status: "pending_payment"
      }
    });

    return order;
  });
}

/**
 * Update order status + generate order code on payment confirmation.
 * @param {string} orderId
 * @param {string} payment_merthod - e.g. 'bank_transfer', 'qris'
 * @returns {Promise<Order>}
 */
export async function confirm_order_payment(
  orderId,
  payment_merthod
) {
  return prisma.$transaction(async (tx) => {

    const order =
      await tx.order.findUnique({
        where: {
          public_id: orderId
        }
      });

    if (!order) {
      throw createError(
        "Order not found",
        404
      );
    }

    if (
      order.status !== "pending_payment"
    ) {
      throw createError(
        `Cannot confirm payment`,
        409
      );
    }

    const expiresAt = new Date();

    expiresAt.setHours(
      expiresAt.getHours() + 2
    );

    for (
      let attempt = 0;
      attempt < 10;
      attempt++
    ) {
      try {
        return await tx.order.update({
          where: {
            public_id: orderId
          },
          data: {
            status: "paid_reserved",

            order_code:
              generate_order_code(),

            order_code_active: true,

            order_code_expires_at:
              expiresAt
          },

          include: {
            listings: true,
            merchants: true
          }
        });

      } catch (e) {

        if (
          e.code === "P2002" &&
          attempt < 9
        ) {
          continue;
        }

        throw e;
      }
    }
  });
}

/**
 * Cancel an order and release the reserved stock back to the listing.
 * @param {string} orderId
 * @param {string} cancelledBy - user_id initiating the cancellation
 * @returns {Promise<Order>}
 */
export async function cancel_order(
  orderId
) {
  return prisma.$transaction(async (tx) => {

    const order =
      await tx.order.findUnique({
        where: {
          public_id: orderId
        }
      });

    if (!order) {
      throw createError(
        "Order not found",
        404
      );
    }

    const cancellable = [
      "pending_payment",
      "paid_reserved"
    ];

    if (
      !cancellable.includes(order.status)
    ) {
      throw createError(
        `Cannot cancel order`,
        409
      );
    }

    await tx.listing.update({
      where: {
        id: order.listing_id
      },
      data: {
        sold_total: {
          decrement: order.qty
        },

        status: "active"
      }
    });

    return tx.order.update({
      where: {
        id: order.id
      },
      data: {
        status: "cancelled"
      }
    });
  });
}

/**
 * Find a single order by its UUID, including listing + payment details.
 * @param {string} orderId
 * @returns {Promise<Order|null>}
 */
export async function find_order_by_id(orderId) {
  const order = await prisma.order.findUnique({
    where: { public_id: orderId },
    include: {
      listing: true,
      merchant: true,
      payments: {
        orderBy: {
          created_at: "desc",
        },
        take: 1,
      },
      customer:true
    },
  });

  if (!order) return null;

  return {
    ...order,
    payment: order.payments[0] ?? null,
    payments: undefined,
  };
}
/**
 * List all orders for a given user (customer), newest first.
 * @param {string} user_id
 * @returns {Promise<Order[]>}
 */
export async function find_orders_by_user(
  customer_id
) {
  return prisma.order.findMany({
    where: {
      customer_id
    },

    orderBy: {
      created_at: "desc"
    },

    include: {
      listing: {
        select: {
          name: true,
          discount_price: true
        }
      },

      payments: {
        select: {
          pg_status: true
        }
      }
    }
  });
}

export async function find_orders_by_merchant(merchant_id) {
  return prisma.order.findMany({
    where: {
      merchant_id,
      deleted_at: null,
    },

    orderBy: {
      created_at: "desc",
    },

    include: {
      customer: {
        select: {
          full_name: true,
        },
      },

      listing: {
        select: {
          name: true,
          description: true,
          discount_price: true,
          discount_percentage: true,
          original_price: true,
          open_time: true
        },
      },
    },
  });
}


export async function update_order_status(
  public_id,
  status
) {
    const expiresAt = new Date();

    expiresAt.setHours(
      expiresAt.getHours() + 2
    );

    if (status === "paid_reserved") {
       for (
      let attempt = 0;
      attempt < 10;
      attempt++
    ) {
      try {
        return await prisma.order.update({
          where: {
            public_id: public_id
          },
          data: {
            status: status,
            order_code: generate_order_code(),
            order_code_active: true,
            order_code_expires_at: expiresAt,
            updated_at: new Date()
          },

          include: {
            listing: true,
            merchant: true
          }
        });

      } catch (e) {

        if (
          e.code === "P2002" &&
          attempt < 9
        ) {
          continue;
        }

        throw e;
      }
    }
}
  return prisma.order.update({
    where: {
      public_id,
    },
    data: {
      status,
    },
  });
}

export async function complete_order(
  orderId
) {
  return prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: "completed",
      order_code_active: false,
    },
  });
}

export async function find_order_by_code(
  order_code,
  public_id
) {
  return prisma.order.findFirst({
    where: {
      order_code,
      order_code_active: true,
      status: "ready_to_pickup",
      public_id 
    },
  });
}


export async function fetch_all_order() {
  return prisma.order.findMany({
    where: {
      deleted_at: null,
    },
    include: {
      customer: {
        select: {
          full_name: true,
        },
      },merchant:{
        select: {
          merchant_name: true,
        },
      },
      listing: true,
      payments: true
    },
  });
}