import express from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/rbac.middleware.js';
import { getForesight } from '../../controllers/foresight.controller.js';

const router = express.Router();

const DEV_BYPASS_SECRET = 'dev_secret';

// ── Dev bypass middleware ──────────────────────────────────────────────────────
function devBypassOrAuthenticate(req, res, next) {
  const isDevBypass =
    process.env.NODE_ENV === 'development' &&
    req.query.bypass === DEV_BYPASS_SECRET;

  if (isDevBypass) {
    req.user = {
      id:    req.query.merchant_id || '895188d4-19de-41ec-8a63-f77a5b1378a3',
      role:  'MERCHANT',
      email: 'dev@bypass.local',
    };
    console.warn(
      `[ForesightRoute] ⚠️  DEV BYPASS — skipping auth for merchant: ${req.user.id}`
    );
    return next();
  }

  authenticate(req, res, () => authorize('MERCHANT')(req, res, next));
}

// ── Route Handler ──────────────────────────────────────────────────────────────
router.get('/', authenticate, getForesight);

export default router;
