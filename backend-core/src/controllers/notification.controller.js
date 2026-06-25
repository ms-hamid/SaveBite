import { save_token, remove_token } from "../services/notification.service.js";

/**
 * Handle POST /api/notifications/device-token
 * Registers or updates a user's device token.
 */
export async function save_token_handler(req, res) {
  const { token, platform } = req.body;
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Device token is required",
    });
  }

  await save_token(req.user.id, token, platform);
  
  return res.status(200).json({
    success: true,
    message: "Device token registered successfully",
  });
}

/**
 * Handle DELETE /api/notifications/device-token/:token
 * Unregisters/removes a user's device token.
 */
export async function delete_token_handler(req, res) {
  const { token } = req.params;
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token parameter is required",
    });
  }

  await remove_token(req.user.id, token);

  return res.status(200).json({
    success: true,
    message: "Device token deleted successfully",
  });
}
