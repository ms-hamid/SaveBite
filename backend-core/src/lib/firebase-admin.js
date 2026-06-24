// src/lib/firebase-admin.js

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const serviceAccount =
  require("../../serviceAccountKey.json");


const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount),
      })
    : getApps()[0];


const messaging =
  getMessaging(app);


export { app, messaging };