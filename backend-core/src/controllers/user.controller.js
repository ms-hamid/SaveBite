/**
 * @file src/controllers/user.controller.js
 * @description User HTTP request handlers.
 */

import {
  getUserProfileService,
  getMerchantsListService,
  getUsersListService,
  confirmMerchantKycService,
  suspendUserService,
  unsuspendUserService,
  suspendMerchantService,
  unsuspendMerchantService,
  suspendCustomerService,
  unsuspendCustomerService,
  getMerchantsPendingListService,
  updateCustomerProfileService,
  updateMerchantProfileService,
  getMerchantDetailService,
} from "../services/user.service.js";
import { serializeBigInt } from "../utils/json.js";

/**
 * GET /api/users/:id
 * Get user profile by ID
 */
export async function getUser(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID tidak ditemukan dalam parameter",
      });
    }

    const user = await getUserProfileService(id);

    return res.status(200).json({
      success: true,
      data: serializeBigInt(user),
    });
  } catch (error) {
    console.error("Error in getUser:", error);
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * GET /api/merchants
 * Get all merchants with pagination
 * Query params: ?skip=0&take=10
 */
export async function getMerchants(req, res) {
  try {
    const { skip = 0, take = 10 } = req.query;

    const result = await getMerchantsListService(parseInt(skip), parseInt(take));

    return res.status(200).json({
      success: true,
      data: serializeBigInt(result),
    });
  } catch (error) {
    console.error("Error in getMerchants:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getMerchantsPending(req, res) {
  try {
    const { skip = 0, take = 10 } = req.query;

    const result = await getMerchantsPendingListService(parseInt(skip), parseInt(take));

    return res.status(200).json({
      success: true,
      data: serializeBigInt(result),
    });
  } catch (error) {
    console.error("Error in getMerchants:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * GET /api/users
 * Get all users with pagination (admin only)
 * Query params: ?skip=0&take=10
 */
export async function getUsers(req, res) {
  try {
    const { skip = 0, take = 10 } = req.query;

    // Note: In production, verify req.user.role === 'ADMIN'
    // This requires auth middleware to be implemented

    const result = await getUsersListService(parseInt(skip), parseInt(take));

    return res.status(200).json({
      success: true,
      data: serializeBigInt(result),
    });
  } catch (error) {
    console.error("Error in getUsers:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * PATCH /api/merchants/:id/kyc
 * Confirm merchant KYC status
 * Body: { status: 'approved' | 'rejected' | 'pending' }
 */
export async function confirmKyc(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Merchant ID tidak ditemukan dalam parameter",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status KYC harus disediakan",
      });
    }

    // Optional: Extract admin ID from req.user (requires auth middleware)
    const adminId = req.user?.id || "system";

    const updated = await confirmMerchantKycService(id, status, adminId);

    return res.status(200).json({
      success: true,
      message: `KYC status berhasil diperbarui menjadi ${status}`,
      data: serializeBigInt(updated),
    });
  } catch (error) {
    console.error("Error in confirmKyc:", error);
    return res.status(error.message.includes("tidak ditemukan") ? 404 : 400).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * PATCH /api/users/:id/suspend
 * Suspend user (merchant or customer)
 * Body: { suspendUntil?: Date }
 */
export async function suspendUserHandler(req, res) {
  try {
    const { id } = req.params;
    const { suspendUntil } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID tidak ditemukan dalam parameter",
      });
    }

    // Optional: Extract admin ID from req.user
    const adminId = req.user?.id || "system";

    // Parse suspendUntil if provided
    let suspendDate = null;
    if (suspendUntil) {
      suspendDate = new Date(suspendUntil);
      if (isNaN(suspendDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Format tanggal suspendUntil tidak valid",
        });
      }
    }

    const updated = await suspendUserService(id, suspendDate, adminId);

    return res.status(200).json({
      success: true,
      message: "User berhasil di-suspend",
      data: serializeBigInt(updated),
    });
  } catch (error) {
    console.error("Error in suspendUserHandler:", error);
    return res.status(error.message.includes("tidak ditemukan") ? 404 : 400).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * PATCH /api/users/:id/unsuspend
 * Unsuspend user (merchant or customer)
 */
export async function unsuspendUserHandler(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID tidak ditemukan dalam parameter",
      });
    }

    // Optional: Extract admin ID from req.user
    const adminId = req.user?.id || "system";

    const updated = await unsuspendUserService(id, adminId);

    return res.status(200).json({
      success: true,
      message: "User berhasil di-unsuspend",
      data: serializeBigInt(updated),
    });
  } catch (error) {
    console.error("Error in unsuspendUserHandler:", error);
    return res.status(error.message.includes("tidak ditemukan") ? 404 : 400).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * PATCH /api/merchants/:id/suspend
 * Suspend merchant specifically
 * Body: { suspendUntil?: Date }
 */
export async function suspendMerchantHandler(req, res) {
  try {
    const { id } = req.params;
    const { suspendUntil } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Merchant ID tidak ditemukan dalam parameter",
      });
    }

    const adminId = req.user?.id || "system";

    let suspendDate = null;
    if (suspendUntil) {
      suspendDate = new Date(suspendUntil);
      if (isNaN(suspendDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Format tanggal suspendUntil tidak valid",
        });
      }
    }

    const updated = await suspendMerchantService(id, suspendDate, adminId);

    return res.status(200).json({
      success: true,
      message: "Merchant berhasil di-suspend",
      data: serializeBigInt(updated),
    });
  } catch (error) {
    console.error("Error in suspendMerchantHandler:", error);
    return res.status(error.message.includes("tidak ditemukan") ? 404 : 400).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * PATCH /api/merchants/:id/unsuspend
 * Unsuspend merchant specifically
 */
export async function unsuspendMerchantHandler(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Merchant ID tidak ditemukan dalam parameter",
      });
    }

    const adminId = req.user?.id || "system";
    const updated = await unsuspendMerchantService(id, adminId);

    return res.status(200).json({
      success: true,
      message: "Merchant berhasil di-unsuspend",
      data: serializeBigInt(updated),
    });
  } catch (error) {
    console.error("Error in unsuspendMerchantHandler:", error);
    return res.status(error.message.includes("tidak ditemukan") ? 404 : 400).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * PATCH /api/customers/:id/suspend
 * Suspend customer specifically
 * Body: { suspendUntil?: Date }
 */
export async function suspendCustomerHandler(req, res) {
  try {
    const { id } = req.params;
    const { suspendUntil } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Customer ID tidak ditemukan dalam parameter",
      });
    }

    const adminId = req.user?.id || "system";

    let suspendDate = null;
    if (suspendUntil) {
      suspendDate = new Date(suspendUntil);
      if (isNaN(suspendDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Format tanggal suspendUntil tidak valid",
        });
      }
    }

    const updated = await suspendCustomerService(id, suspendDate, adminId);

    return res.status(200).json({
      success: true,
      message: "Customer berhasil di-suspend",
      data: serializeBigInt(updated),
    });
  } catch (error) {
    console.error("Error in suspendCustomerHandler:", error);
    return res.status(error.message.includes("tidak ditemukan") ? 404 : 400).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * PATCH /api/customers/:id/unsuspend
 * Unsuspend customer specifically
 */
export async function unsuspendCustomerHandler(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Customer ID tidak ditemukan dalam parameter",
      });
    }

    const adminId = req.user?.id || "system";
    const updated = await unsuspendCustomerService(id, adminId);

    return res.status(200).json({
      success: true,
      message: "Customer berhasil di-unsuspend",
      data: serializeBigInt(updated),
    });
  } catch (error) {
    console.error("Error in unsuspendCustomerHandler:", error);
    return res.status(error.message.includes("tidak ditemukan") ? 404 : 400).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * GET /api/users/me
 * Fetch the currently authenticated user's profile
 */
export async function getMyProfileHandler(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const user = await getUserProfileService(userId);
    return res.status(200).json({
      success: true,
      data: serializeBigInt(user),
    });
  } catch (error) {
    console.error("Error in getMyProfileHandler:", error);
    return res.status(error.message.includes("tidak ditemukan") ? 404 : 500).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * PATCH /api/users/profile/customer
 * Update authenticated customer profile details
 */
export async function updateCustomerProfileHandler(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const result = await updateCustomerProfileService(userId, req.body);
    return res.status(200).json({
      success: true,
      message: "Profil customer berhasil diperbarui",
      data: serializeBigInt(result),
    });
  } catch (error) {
    console.error("Error in updateCustomerProfileHandler:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * PATCH /api/users/profile/merchant
 * Update authenticated merchant profile details
 */
export async function updateMerchantProfileHandler(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const result = await updateMerchantProfileService(userId, req.body);
    return res.status(200).json({
      success: true,
      message: "Profil merchant berhasil diperbarui",
      data: serializeBigInt(result),
    });
  } catch (error) {
    console.error("Error in updateMerchantProfileHandler:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * GET /api/users/merchants/:id/detail
 * Fetch details of a merchant by their ID (user_id)
 */
export async function getMerchantDetailHandler(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Merchant ID tidak ditemukan dalam parameter",
      });
    }

    const merchant = await getMerchantDetailService(id);
    return res.status(200).json({
      success: true,
      data: serializeBigInt(merchant),
    });
  } catch (error) {
    console.error("Error in getMerchantDetailHandler:", error);
    return res.status(error.message.includes("tidak ditemukan") ? 404 : 500).json({
      success: false,
      message: error.message,
    });
  }
}


