import { prisma } from "../lib/prisma.js";

export async function expirePendingOrder() {
  try {
    const now = new Date();

    const expiredOrders = await prisma.order.findMany({
      where: {
        status: "pending_payment",
        order_lock_expired: {
          lt: now,
        },
      },
      select: {
        id: true,
        listing_id: true,
        qty: true,
      },
    });

    if (expiredOrders.length === 0) return;

    await prisma.$transaction(async (tx) => {
      // 1. update setiap listing sold_total
      for (const order of expiredOrders) {
        await tx.listing.update({
          where: { id: order.listing_id },
          data: {
            sold_total: {
              decrement: order.qty,
            },
          },
        });
      }

      // 2. cancel order
      await tx.order.updateMany({
        where: {
          id: {
            in: expiredOrders.map((o) => o.id),
          },
        },
        data: {
          status: "cancelled",
        },
      });
    });

    console.log(`[CRON] ${expiredOrders.length} order(s) expired`);
  } catch (error) {
    console.error("[CRON] expirePendingOrder error:", error);
  }
}