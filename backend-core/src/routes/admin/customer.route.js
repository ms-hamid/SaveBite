/**
 * @file src/routes/admin/customer.route.js
 * @description Admin customer management routes
 */

import { Router } from "express";
import {
  getCustomersListHandler,
  getCustomerDetailHandler,
  suspendCustomerHandler,
  unsuspendCustomerHandler,
  getCustomerStatsHandler,
  exportCustomersHandler,
} from "../../controllers/customer.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/rbac.middleware.js";

const router = Router();

// All routes require admin authentication
router.use(authenticate);
router.use(authorize("ADMIN"));

/**
 * GET /api/admin/customers
 * Get paginated customers list
 */
router.get("/", getCustomersListHandler);

/**
 * GET /api/admin/customers/stats
 * Get customer statistics
 */
router.get("/stats", getCustomerStatsHandler);

/**
 * GET /api/admin/customers/export
 * Export customers to CSV
 */
router.get("/export", exportCustomersHandler);

/**
 * GET /api/admin/customers/:userId
 * Get customer detail with orders
 */
router.get("/:userId", getCustomerDetailHandler);

/**
 * PATCH /api/admin/customers/:userId/suspend
 * Suspend customer account
 */
router.patch("/:userId/suspend", suspendCustomerHandler);

/**
 * PATCH /api/admin/customers/:userId/unsuspend
 * Unsuspend customer account
 */
router.patch("/:userId/unsuspend", unsuspendCustomerHandler);

export default router;
