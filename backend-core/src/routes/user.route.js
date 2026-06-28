/**
 * @file src/routes/user.route.js
 * @description User management routes.
 */

import express from "express";
import {
  getUser,
  getMerchants,
  getUsers,
  confirmKyc,
  suspendUserHandler,
  unsuspendUserHandler,
  suspendMerchantHandler,
  unsuspendMerchantHandler,
  suspendCustomerHandler,
  unsuspendCustomerHandler,
  getMerchantsPending,
  getMyProfileHandler,
  updateCustomerProfileHandler,
  updateMerchantProfileHandler,
  getMerchantDetailHandler,
} from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/rbac.middleware.js";

const user_route = express.Router();

/**
 * GET /api/users/me
 * Fetch logged-in user profile details
 */
user_route.get("/me", (req, res) => {
  getMyProfileHandler(req, res);
});

/**
 * GET /api/users/merchants/:id/detail
 * Fetch merchant details by ID
 */
user_route.get("/merchants/:id/detail", authenticate, (req, res) => {
  getMerchantDetailHandler(req, res);
});


/**
 * PATCH /api/users/profile/customer
 * Update customer profile details
 */
user_route.patch("/profile/customer", authenticate, authorize("CUSTOMER"), (req, res) => {
  updateCustomerProfileHandler(req, res);
});

/**
 * PATCH /api/users/profile/merchant
 * Update merchant profile details
 */
user_route.patch("/profile/merchant", authenticate, authorize("MERCHANT"), (req, res) => {
  updateMerchantProfileHandler(req, res);
});

/**
 * GET /api/users/:id
 * Get user profile by ID
 */
user_route.get("/:id", (req, res) => {
  getUser(req, res);
});


/**
 * GET /api/merchants
 * Get all merchants with pagination
 * Query: ?skip=0&take=10
 */
user_route.get("/merchants/list", (req, res) => {
  getMerchants(req, res);
});

user_route.get("/merchants/list/pending", (req, res) => {
  getMerchantsPending(req, res);
});

/**
 * GET /api/users
 * Get all users with pagination (admin only)
 * Query: ?skip=0&take=10
 */
user_route.get("/", (req, res) => {
  getUsers(req, res);
});

/**
 * PATCH /api/merchants/:id/kyc
 * Confirm merchant KYC status
 * Body: { status: 'approved' | 'rejected' | 'pending' }
 */
user_route.patch("/merchants/:id/kyc", (req, res) => {
  confirmKyc(req, res);
});

/**
 * PATCH /api/users/:id/suspend
 * Suspend user (merchant or customer)
 * Body: { suspendUntil?: Date }
 */
user_route.patch("/:id/suspend", (req, res) => {
  suspendUserHandler(req, res);
});

/**
 * PATCH /api/users/:id/unsuspend
 * Unsuspend user (merchant or customer)
 */
user_route.patch("/:id/unsuspend", (req, res) => {
  unsuspendUserHandler(req, res);
});

/**
 * PATCH /api/merchants/:id/suspend
 * Suspend merchant specifically
 * Body: { suspendUntil?: Date }
 */
user_route.patch("/merchants/:id/suspend", (req, res) => {
  suspendMerchantHandler(req, res);
});

/**
 * PATCH /api/merchants/:id/unsuspend
 * Unsuspend merchant specifically
 */
user_route.patch("/merchants/:id/unsuspend", (req, res) => {
  unsuspendMerchantHandler(req, res);
});

/**
 * PATCH /api/customers/:id/suspend
 * Suspend customer specifically
 * Body: { suspendUntil?: Date }
 */
user_route.patch("/customers/:id/suspend", (req, res) => {
  suspendCustomerHandler(req, res);
});

/**
 * PATCH /api/customers/:id/unsuspend
 * Unsuspend customer specifically
 */
user_route.patch("/customers/:id/unsuspend", (req, res) => {
  unsuspendCustomerHandler(req, res);
});

export default user_route;
