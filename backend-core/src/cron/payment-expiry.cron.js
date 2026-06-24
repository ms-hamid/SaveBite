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

        if (result.count > 0) {
            console.log(
                `[CRON] ${result.count} payment(s) expired`
            );
        }

    } catch (error) {
        console.error(
            "[CRON] expirePendingPayments error:",
            error
        );
    }
}