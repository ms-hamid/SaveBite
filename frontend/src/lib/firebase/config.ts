import { initializeApp, getApp, getApps } from "firebase/app";
import type { Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDG0dbM3yjSrlx5Q-qfH3jRjPqnWfJaPNg",
  authDomain: "savebite-57268.firebaseapp.com",
  projectId: "savebite-57268",
  storageBucket: "savebite-57268.firebasestorage.app",
  messagingSenderId: "184485874423",
  appId: "1:184485874423:web:4295c2e1eb12ab0c5ca1f2",
  measurementId: "G-ZR9NNFMYDB"
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

/**
 * Lazily loads Firebase Messaging and returns the instance if supported.
 * Guards against SSR crashes and unsupported browser runtimes.
 */
export async function getMessagingInstance(): Promise<Messaging | null> {
  if (typeof window === "undefined") return null;

  try {
    const { getMessaging, isSupported } = await import("firebase/messaging");
    const supported = await isSupported();
    if (supported) {
      return getMessaging(app);
    }
  } catch (error) {
    console.error("Firebase Messaging is not supported on this device/browser:", error);
  }
  return null;
}
