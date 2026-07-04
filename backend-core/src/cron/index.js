import cron from "node-cron";
import { expirePendingPayments } from "./payment-expiry.cron.js";
import { expirePendingOrder } from "./order-expiry.cron.js";
import { generateDailyAiFeature } from "./daily-history-generate.cron.js";
import { triggerDailyAiRetraining } from "./ai-retraining.cron.js";

export function startCronJobs() {

    console.log("[CRON] Starting jobs...");

    // setiap 1 menit
    cron.schedule("* * * * *", async () => {
        await expirePendingPayments();
    });

    cron.schedule("* * * * *", async () => {
        await expirePendingOrder();
    });

    cron.schedule("5 0 * * *", async () => {
        await generateDailyAiFeature();
    });

    // Setiap hari jam 00:00:00
    cron.schedule("0 0 * * *", async () => {
        await triggerDailyAiRetraining();
    });
}
