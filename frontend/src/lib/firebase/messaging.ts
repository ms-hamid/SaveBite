import { getToken } from "firebase/messaging";
import { getMessagingInstance } from "./config";
import { saveDeviceToken } from "../../services/notification";

/**
 * Request notification permissions and register device token.
 */
export async function enablePushNotification() {
  if (typeof window === "undefined") return;

  try {
    const messaging = await getMessagingInstance();
    if (!messaging) {
      console.warn("Firebase Messaging not initialized or unsupported.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission denied");
      return;
    }

    const vapidKey = process.env.NEXT_PUBLIC_VAPID_KEY || "BD1S7MuGP-FRF2Ix_Ig7F5ycIcFLR-nAjcpJNhS_flgqZibdQg6KNXkXXEhqh0LqYLfBhyQhNPjolNDo2-33df8";
    const token = await getToken(messaging, { vapidKey });

    if (token) {
      console.log("FCM TOKEN:", token);
      localStorage.setItem("fcm_token", token);

      // Save to backend if authenticated
      const hasToken = localStorage.getItem("sb_access_token");
      if (hasToken) {
        await saveDeviceToken(token, "web");
        console.log("FCM Token successfully synced with backend.");
      } else {
        console.log("User not logged in; token saved locally and will be synced upon login.");
      }
    } else {
      console.warn("No registration token available. Request permission to generate one.");
    }
  } catch (error) {
    console.error("An error occurred while enabling push notifications:", error);
  }
}
