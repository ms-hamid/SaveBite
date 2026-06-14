/**
 * @file src/routes/consumer/order.route.js
 * @description REST routes for the consumer-facing Order domain.
 *
 * All routes require authentication (JWT).
 * Status-mutating routes use PATCH (partial update of a resource state).
 *
 * Route Map:
 *   POST   /api/orders              → create order (locks stock atomically)
 *   GET    /api/orders              → list customer's orders
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
  confirm_transfer_handler,
  create_order_handler,
  get_customer_orders_handler,
  get_order_handler,
} from "../../controllers/order.controller.js";

const order_route = express.Router();

// All routes below require a valid JWT
order_route.use(authenticate);

order_route.post(
  "/",
  authorize("CONSUMER"),
  asyncHandler(create_order_handler)
);

order_route.get(
  "/",
  authorize("CONSUMER"),
  asyncHandler(get_customer_orders_handler)
);

order_route.get(
  "/:id",
  asyncHandler(get_order_handler) // ADMIN + CONSUMER — role check in service
);

order_route.patch(
  "/:id/confirm-transfer",
  authorize("CONSUMER"),
  asyncHandler(confirm_transfer_handler)
);

order_route.patch(
  "/:id/cancel",
  asyncHandler(cancel_order_handler) // Both CONSUMER (self) + ADMIN — auth in svc
);

export default order_route;
