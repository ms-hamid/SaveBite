/**
 * @file src/routes/refund.route.js
 * @description REST routes for the Refund domain.
 *
 * Customer:
 *   POST   /refund            → request a refund for a cancelled order
 *   GET    /refund/my         → list own refund requests
 *
 * Admin:
 *   GET    /refund/admin/list → list all refund requests (filterable by status)
 *   PATCH  /refund/:id/review → approve (done) or reject a refund
 *
 * Shared:
 *   GET    /refund/:id        → get single refund detail
 */

import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/rbac.middleware.js";
import { asyncHandler } from "../middlewares/error.middleware.js";
import {
  get_admin_refunds_handler,
  get_my_refunds_handler,
  get_refund_handler,
  request_refund_handler,
  review_refund_handler,
} from "../controllers/refund.controller.js";

const refund_route = express.Router();

refund_route.post(
  "/",
  authenticate,
  authorize("CUSTOMER"),
  asyncHandler(request_refund_handler)
);

refund_route.get(
  "/my",
  authenticate,
  authorize("CUSTOMER"),
  asyncHandler(get_my_refunds_handler)
);

refund_route.get(
  "/admin/list",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(get_admin_refunds_handler)
);

refund_route.patch(
  "/:id/review",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(review_refund_handler)
);

refund_route.get(
  "/:public_id",
  authenticate,
  asyncHandler(get_refund_handler)
);

export default refund_route;
