import { prisma } from "../lib/prisma.js";

export async function expirePendingPayments() {
    try {
        const now = new Date();

        const result = await prisma.payment.updateMany({
            where: {
                pg_status: "pending",
                expired_at: {
                    lt: now
                }
            },
            data: {
                pg_status: "cancel"
            }
        });

        console.log(`[CRON] expirePendingPayments successfully cancelled ${result.count} payments.`);

    } catch (error) {
        console.error(
            "[CRON] expirePendingPayments error:",
            error
        );
    }
}