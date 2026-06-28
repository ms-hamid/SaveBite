/**
 * @file src/routes/consumer/favorite.route.js
 *
 * GET    /favorite                    → list saved listings (filterable)
 * POST   /favorite/:public_id/toggle  → add or remove from favorites
 * GET    /favorite/:public_id/status  → check is_favorite for a listing
 */

import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/rbac.middleware.js";
import { asyncHandler } from "../../middlewares/error.middleware.js";
import {
  get_favorites_handler,
  toggle_favorite_handler,
  check_favorite_handler,
} from "../../controllers/favorite.controller.js";

const favorite_route = express.Router();

favorite_route.get("/", asyncHandler(get_favorites_handler));
favorite_route.use(authenticate, authorize("CUSTOMER"));

favorite_route.post("/:public_id/toggle", asyncHandler(toggle_favorite_handler));
favorite_route.get("/:public_id/status", asyncHandler(check_favorite_handler));

export default favorite_route;
