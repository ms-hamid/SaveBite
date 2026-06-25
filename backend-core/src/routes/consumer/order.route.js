/**
 * @file src/routes/consumer/order.route.js
 * @description REST routes for the consumer-facing Order domain.
 *
 * All routes require authentication (JWT).
 * Status-mutating routes use PATCH (partial update of a resource state).
 *
 * Route Map:
 *   POST   /api/orders              → create order (locks stock atomically)
 *   GET    /api/orders              → list CUSTOMER's orders
 *   GET    /api/orders/:id          → single order detail (+ payment + listing)
 *   PATCH  /api/orders/:id/confirm-transfer → mark as PAID_RESERVED, gen QR code
 *   PATCH  /api/orders/:id/cancel   → cancel order (releases stock)
 */

import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/rbac.middleware.js";
import { asyncHandler } from "../../middlewares/error.middleware.js";
import {
  cancel_order_handler,
  change_order_status_handler,
  confirm_transfer_handler,
  create_order_handler,
  get_all_order_handler,
  get_customer_orders_handler,
  get_merchant_orders_handler,
  get_order_handler,
  pickup_order_handler,
} from "../../controllers/order.controller.js";

const order_route = express.Router();

// All routes below require a valid JWT
order_route.use(authenticate);

order_route.get(
  "/admin",
  authorize("ADMIN"),
  asyncHandler(get_all_order_handler)
);

order_route.get(
  "/merchant",
  authorize("MERCHANT"),
  asyncHandler(get_merchant_orders_handler)
);


order_route.post(
  "/",
  authorize("CUSTOMER"),
  asyncHandler(create_order_handler)
);

order_route.get(
  "/",
  authorize("CUSTOMER"),
  asyncHandler(get_customer_orders_handler)
);

order_route.get(
  "/:public_id",
  // authenticate,
  asyncHandler(get_order_handler) // ADMIN + CUSTOMER — role check in service
);

order_route.patch(
  "/:public_id/confirm-transfer",
  authorize("CUSTOMER"),
  asyncHandler(confirm_transfer_handler)
);

order_route.patch(
  "/:public_id/cancel",
  asyncHandler(cancel_order_handler) // Both CUSTOMER (self) + ADMIN — auth in svc
);

order_route.patch(
  "/:id/status",
  authorize("MERCHANT"),
  asyncHandler(change_order_status_handler)
);

order_route.post(
  "/pickup",
  authorize("MERCHANT"),
  asyncHandler(pickup_order_handler)
);

export default order_route;
