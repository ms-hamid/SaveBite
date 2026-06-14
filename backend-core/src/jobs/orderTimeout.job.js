/**
 * @file orderTimeout.job.js
 * @description Cron job: auto-cancels orders in PENDING_PAYMENT state
 *              that have exceeded the 15-minute payment window.
 *
 * Schedule: Every 1 minute  →  "* * * * *"
 */

// TODO: implement with node-cron or similar scheduler
export const orderTimeoutJob = () => {
  // 1. Query all PENDING_PAYMENT orders older than 15 minutes
  // 2. Update their status to CANCELLED
  // 3. Release any pessimistic DB locks / decrement stock back
};
