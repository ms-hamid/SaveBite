import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../middlewares/error.middleware.js";
import {
  save_token_handler,
  delete_token_handler,
} from "../controllers/notification.controller.js";

const notification_route = express.Router();

// All notification token endpoints require authentication
notification_route.use(authenticate);

notification_route.post("/device-token", asyncHandler(save_token_handler));
notification_route.delete("/device-token/:token", asyncHandler(delete_token_handler));

export default notification_route;
