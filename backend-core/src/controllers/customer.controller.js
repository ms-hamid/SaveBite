/**
 * @file src/controllers/customer.controller.js
 * @description Customer admin HTTP request handlers
 */

import {
  getCustomersListService,
  getCustomerDetailService,
  suspendCustomerAccountService,
  unsuspendCustomerAccountService,
  getCustomerStatsService,
  exportCustomersService,
} from "../services/customer.service.js";
import { serializeBigInt } from "../utils/json.js";

/**
 * GET /api/admin/customers
 * Get paginated customers list (admin only)
 * Query params: ?skip=0&take=10
 */
export async function getCustomersListHandler(req, res) {
  try {
    const { skip = 0, take = 10 } = req.query;

    const result = await getCustomersListService(parseInt(skip), parseInt(take));

    return res.status(200).json({
      success: true,
      data: serializeBigInt(result),
    });
  } catch (error) {
    console.error("Error in getCustomersListHandler:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * GET /api/admin/customers/:userId
 * Get customer detail with orders (admin only)
 */
export async function getCustomerDetailHandler(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID tidak ditemukan dalam parameter",
      });
    }

    const customer = await getCustomerDetailService(userId);

    return res.status(200).json({
      success: true,
      data: serializeBigInt(customer),
    });
  } catch (error) {
    console.error("Error in getCustomerDetailHandler:", error);
    return res.status(error.message.includes("tidak ditemukan") ? 404 : 500).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * PATCH /api/admin/customers/:userId/suspend
 * Suspend customer account (admin only)
 * Body: { suspendUntil?: Date }
 */
export async function suspendCustomerHandler(req, res) {
  try {
    const { userId } = req.params;
    const { suspendUntil } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID tidak ditemukan dalam parameter",
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

    const updated = await suspendCustomerAccountService(userId, suspendDate, adminId);

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
 * PATCH /api/admin/customers/:userId/unsuspend
 * Unsuspend (reactivate) customer account (admin only)
 */
export async function unsuspendCustomerHandler(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID tidak ditemukan dalam parameter",
      });
    }

    const adminId = req.user?.id || "system";
    const updated = await unsuspendCustomerAccountService(userId, adminId);

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
 * GET /api/admin/customers/stats
 * Get customer statistics (admin only)
 */
export async function getCustomerStatsHandler(req, res) {
  try {
    const stats = await getCustomerStatsService();

    return res.status(200).json({
      success: true,
      data: serializeBigInt(stats),
    });
  } catch (error) {
    console.error("Error in getCustomerStatsHandler:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * GET /api/admin/customers/export
 * Export customers data to CSV (admin only)
 */
export async function exportCustomersHandler(req, res) {
  try {
    const customers = await exportCustomersService();

    // Generate CSV
    const headers = [
      "User ID",
      "Full Name",
      "Email",
      "Phone",
      "Experience Points",
      "Strike Count",
      "Total Orders",
      "Joined Date",
      "Status",
    ];

    const csvRows = [
      headers.join(","),
      ...customers.map((customer) =>
        [
          customer.user_id,
          `"${customer.full_name}"`,
          customer.email,
          customer.phone,
          customer.exp,
          customer.strike_count,
          customer.total_orders,
          customer.joined_date ? new Date(customer.joined_date).toISOString() : "-",
          customer.status,
        ].join(",")
      ),
    ];

    const csv = csvRows.join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=customers_export.csv");
    return res.status(200).send(csv);
  } catch (error) {
    console.error("Error in exportCustomersHandler:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
