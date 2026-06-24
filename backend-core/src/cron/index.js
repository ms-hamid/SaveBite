import cron from "node-cron";
import { expirePendingPayments } from "./payment-expiry.cron.js";
import { expirePendingOrder } from "./order-expiry.cron.js";

export function startCronJobs() {

    console.log("[CRON] Starting jobs...");

    // setiap 1 menit
    cron.schedule("* * * * *", async () => {
        await expirePendingPayments();
    });

    console.log(
        "[CRON] Payment expiry job registered"
    );

    cron.schedule("* * * * *", async () => {
        await expirePendingOrder();
    });

    console.log(
        "[CRON] Order expiry job registered"
    );
}
