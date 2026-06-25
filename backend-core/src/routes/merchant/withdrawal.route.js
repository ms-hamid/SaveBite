/**
 * @file src/routes/merchant/withdrawal.route.js
 * @description REST routes for merchant withdrawals and admin payout review.
 *
 * Merchant:
 *   GET    /withdrawal/my           → list own withdrawals
 *   GET    /withdrawal/balance      → virtual balance + bank info
 *   POST   /withdrawal              → request withdrawal
 *   PATCH  /withdrawal/:id          → update pending amount
 *   PATCH  /withdrawal/:id/cancel   → cancel pending withdrawal
 *
 * Admin:
 *   GET    /withdrawal/admin/list   → list all withdrawals
 *   PATCH  /withdrawal/:id/review   → approve or decline
 *
 * Shared:
 *   GET    /withdrawal/:id          → withdrawal detail
 */

import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/rbac.middleware.js";
import { asyncHandler } from "../../middlewares/error.middleware.js";
import {
  cancel_withdrawal_handler,
  create_withdrawal_handler,
  get_admin_withdrawals_handler,
  get_merchant_balance_handler,
  get_my_withdrawals_handler,
  get_withdrawal_handler,
  review_withdrawal_handler,
  update_withdrawal_handler,
} from "../../controllers/withdrawal.controller.js";

const withdrawal_route = express.Router();

withdrawal_route.get(
  "/my",
  authenticate,
  authorize("MERCHANT"),
  asyncHandler(get_my_withdrawals_handler)
);

withdrawal_route.get(
  "/balance",
  authenticate,
  authorize("MERCHANT"),
  asyncHandler(get_merchant_balance_handler)
);

withdrawal_route.get(
  "/admin/list",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(get_admin_withdrawals_handler)
);

withdrawal_route.post(
  "/",
  authenticate,
  authorize("MERCHANT"),
  asyncHandler(create_withdrawal_handler)
);

withdrawal_route.patch(
  "/:id/cancel",
  authenticate,
  authorize("MERCHANT"),
  asyncHandler(cancel_withdrawal_handler)
);

withdrawal_route.patch(
  "/:id/review",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(review_withdrawal_handler)
);

withdrawal_route.patch(
  "/:id",
  authenticate,
  authorize("MERCHANT"),
  asyncHandler(update_withdrawal_handler)
);

withdrawal_route.get(
  "/:id",
  authenticate,
  asyncHandler(get_withdrawal_handler)
);

export default withdrawal_route;
