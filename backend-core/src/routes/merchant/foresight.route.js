/**
 * @file src/routes/merchant/foresight.route.js
 * @description Routes for the AI Foresight feature.
 *
 * Routes:
 *   GET  /api/merchant/foresight         → fetch 30-day history from DB, call AI predict
 *   POST /api/merchant/foresight/upload  → proxy Excel/CSV file to AI retrain endpoint
 */

import express from 'express';
import multer from 'multer';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/rbac.middleware.js';
import { getForesight, uploadAndRetrain } from '../../controllers/foresight.controller.js';

const router = express.Router();

// ── Multer: store file in memory (no disk writes needed — we stream to AI) ────
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max
  },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel',                                           // .xls
      'text/csv',                                                            // .csv
      'application/octet-stream',                                           // generic binary (some browsers)
    ];
    const extOk = /\.(xlsx|xls|csv)$/i.test(file.originalname);
    if (allowed.includes(file.mimetype) || extOk) {
      cb(null, true);
    } else {
      cb(new Error('Only .xlsx, .xls, or .csv files are accepted.'));
    }
  },
});

// ── GET /api/merchant/foresight ───────────────────────────────────────────────
router.get('/', authenticate, authorize('MERCHANT'), getForesight);

// ── POST /api/merchant/foresight/upload ──────────────────────────────────────
router.post(
  '/upload',
  authenticate,
  authorize('MERCHANT'),
  upload.single('file'),
  uploadAndRetrain
);

export default router;
