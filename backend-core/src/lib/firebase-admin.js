// src/lib/firebase-admin.js

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";


const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)

const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount),
      })
    : getApps()[0];


const messaging =
  getMessaging(app);


export { app, messaging };