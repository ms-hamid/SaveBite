import api from "../lib/api";

/**
 * Register the client FCM device token with the backend.
 * 
 * @param token The FCM device token
 * @param platform Platform identifier, defaults to 'web'
 */
export async function saveDeviceToken(token: string, platform: string = "web") {
  const { data } = await api.post("/api/notifications/device-token", { token, platform });
  return data;
}

/**
 * Remove the client FCM device token from the backend.
 * 
 * @param token The FCM device token to remove
 */
export async function deleteDeviceToken(token: string) {
  const { data } = await api.delete(`/api/notifications/device-token/${token}`);
  return data;
}
