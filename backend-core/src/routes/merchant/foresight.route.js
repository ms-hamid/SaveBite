/**
 * @file src/routes/merchant/foresight.route.js
 * @description AI Foresight proxy route for the Merchant dashboard.
 *
 * GET /api/merchant/foresight
 *   - Authenticated route (JWT + MERCHANT role required in production)
 *   - Dev bypass: append ?bypass=dev_secret to skip auth in development
 *   - Queries Merchant.pickup_open / pickup_close (Postgres Time columns)
 *     → these are the data source for peak_demand and best_publish_time
 *   - Queries last 30 days of ai_feature_history for the merchant
 *     → enriched fields (sell_through_rate, rain_intensity, etc.) are forwarded
 *       to the Python AI service to enable data-driven confidence scoring
 *   - Forwards everything as POST to the Python FastAPI /api/v1/forecast/predict
 *   - Returns the AI JSON verbatim on success, or a structured fallback on error
 *
 * FR-AI-02 / FR-AI-03 (PRD)
 */

import express from 'express';
import prisma from '../../lib/prisma.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/rbac.middleware.js';

const router = express.Router();

// ── Constants ──────────────────────────────────────────────────────────────────
const AI_SERVICE_URL    = process.env.AI_SERVICE_URL || 'http://localhost:8000';
const DEV_BYPASS_SECRET = 'dev_secret';
const HISTORY_DAYS      = 30;
const DEFAULT_PROD_QTY  = 150;

// ── Dev bypass middleware ──────────────────────────────────────────────────────
function devBypassOrAuthenticate(req, res, next) {
  const isDevBypass =
    process.env.NODE_ENV === 'development' &&
    req.query.bypass === DEV_BYPASS_SECRET;

  if (isDevBypass) {
    req.user = {
      id:    req.query.merchant_id || 'dev-bypass-merchant-id',
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


// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Format a Postgres Time value from Prisma to "HH:MM:SS" string.
 *
 * Prisma returns @db.Time(6) columns as JavaScript Date objects (with an
 * arbitrary date of 1970-01-01). We extract only the time portion.
 * Returns null if the value is missing or unparseable.
 */
function formatTimeColumn(dateObj) {
  if (!dateObj) return null;
  try {
    const d = new Date(dateObj);
    // Pad hours/minutes/seconds to 2 digits
    const hh = String(d.getUTCHours()).padStart(2, '0');
    const mm = String(d.getUTCMinutes()).padStart(2, '0');
    const ss = String(d.getUTCSeconds()).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  } catch {
    return null;
  }
}


/**
 * Fetch merchant profile + last N days of ai_feature_history in ONE query.
 *
 * Returns:
 *   { pickup_open, pickup_close, history, production_qty }
 *
 * pickup_open / pickup_close come from Merchant.pickup_open / pickup_close
 * (@db.Time(6)) — the ONLY legitimate data source for peak_demand and
 * best_publish_time. These are set when the merchant configures their profile.
 *
 * history rows map 1-to-1 to ai_feature_history columns, including the
 * pre-computed sell_through_rate, surplus_rate, rain_intensity, promo_active
 * that the Python AI service uses for richer confidence scoring.
 */
async function fetchMerchantData(merchantId) {
  const since = new Date();
  since.setDate(since.getDate() - HISTORY_DAYS);

  // Fetch merchant profile + ai_feature_history in a single Prisma transaction
  const [merchantProfile, aiHistory] = await Promise.all([
    prisma.merchant.findUnique({
      where:  { user_id: merchantId },
      select: {
        pickup_open:   true,   // @db.Time(6) — source of peak_demand
        pickup_close:  true,   // @db.Time(6) — source of best_publish_time
      },
    }),

    prisma.ai_feature_history.findMany({
      where: {
        merchant_id:  merchantId,
        feature_date: { gte: since },
      },
      orderBy: { feature_date: 'asc' },
      select: {
        feature_date:      true,
        sold_qty:          true,
        actual_surplus:    true,
        production_qty:    true,
        rain_intensity:    true,
        promo_active:      true,
        sell_through_rate: true,
        surplus_rate:      true,
      },
    }),
  ]);

  return { merchantProfile, aiHistory };
}


/**
 * Convert ai_feature_history DB rows to the DailySalesPoint format
 * expected by the Python AI service (maps field names to schema).
 */
function mapHistoryToPayload(rows) {
  return rows.map((row) => ({
    date:              row.feature_date.toISOString().split('T')[0],
    quantity_sold:     row.sold_qty,
    actual_surplus:    row.actual_surplus    ?? null,
    production_qty:    row.production_qty   ?? null,
    rain_intensity:    row.rain_intensity    ?? 0,
    promo_active:      row.promo_active      ?? false,
    sell_through_rate: row.sell_through_rate ?? null,
    surplus_rate:      row.surplus_rate      ?? null,
  }));
}


/**
 * Build a synthetic demo history when no real data exists (new merchants).
 * Uses today as the last date and generates 14 plausible rows.
 */
function buildDemoHistory() {
  const history = [];
  for (let i = 14; i >= 1; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr       = d.toISOString().split('T')[0];
    const quantity_sold = Math.floor(Math.random() * 40) + 15;
    const production    = DEFAULT_PROD_QTY;
    history.push({
      date:              dateStr,
      quantity_sold,
      actual_surplus:    production - quantity_sold,
      production_qty:    production,
      rain_intensity:    0,
      promo_active:      false,
      sell_through_rate: parseFloat((quantity_sold / production).toFixed(4)),
      surplus_rate:      parseFloat(((production - quantity_sold) / production).toFixed(4)),
    });
  }
  return history;
}


/**
 * Structured fallback when the AI service is unreachable or returns an error.
 */
function buildFallbackResponse(reason) {
  return {
    status: 'fallback',
    fallback_reason: reason,
    data: {
      estimated_surplus_today: null,
      peak_demand:             null,
      best_publish_time:       null,
      confidence_percentage:   null,
    },
  };
}


// ── Route Handler ──────────────────────────────────────────────────────────────

/**
 * GET /api/merchant/foresight
 *
 * Flow:
 *   1. Extract merchant_id from JWT (or ?merchant_id for dev bypass)
 *   2. Fetch Merchant.pickup_open / pickup_close + ai_feature_history from DB
 *   3. POST enriched payload to Python AI service
 *   4. Return AI response verbatim (or graceful fallback if Python is down)
 */
router.get('/', devBypassOrAuthenticate, async (req, res) => {
  const merchantId = req.user.id;

  // ── Step 1: Fetch merchant data from DB ────────────────────────────────────
  let merchantProfile, aiHistory;
  try {
    ({ merchantProfile, aiHistory } = await fetchMerchantData(merchantId));
  } catch (dbErr) {
    console.error(`[ForesightRoute] DB error: ${dbErr.message}`);
    return res.status(500).json({
      error:   'Database error',
      message: 'Failed to retrieve merchant data from database.',
    });
  }

  // ── Step 2: Build history payload ──────────────────────────────────────────
  let history = mapHistoryToPayload(aiHistory);

  if (history.length < 7) {
    console.warn(
      `[ForesightRoute] Only ${history.length} ai_feature_history rows for ` +
      `merchant ${merchantId} — using synthetic demo data.`
    );
    history = buildDemoHistory();
  }

  // ── Step 3: Resolve merchant operating hours ───────────────────────────────
  // pickup_open / pickup_close are Postgres Time(6) columns returned by Prisma
  // as Date objects. formatTimeColumn() converts them to "HH:MM:SS" strings
  // that the Python schema can parse directly.
  const pickup_open  = merchantProfile ? formatTimeColumn(merchantProfile.pickup_open)  : null;
  const pickup_close = merchantProfile ? formatTimeColumn(merchantProfile.pickup_close) : null;

  if (!pickup_open || !pickup_close) {
    console.warn(
      `[ForesightRoute] Merchant ${merchantId} has no pickup_open/close set. ` +
      'Python service will fall back to day-of-week heuristics for peak_demand.'
    );
  }

  // ── Step 4: Call Python AI service ─────────────────────────────────────────
  // We explicitly specify target_date as "Today" in the merchant's local timezone (WIB)
  // so the AI does not accidentally predict tomorrow if a partial history row for today already exists.
  const target_date = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });

  const aiPayload = {
    merchant_id:    merchantId,
    target_date:    target_date,
    history,
    production_qty: DEFAULT_PROD_QTY,
    pickup_open,    // "HH:MM:SS" or null
    pickup_close,   // "HH:MM:SS" or null
  };

  let aiResponse;
  try {
    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 5000);

    const pyRes = await fetch(`${AI_SERVICE_URL}/api/v1/forecast/predict`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(aiPayload),
      signal:  controller.signal,
    });
    clearTimeout(timeoutId);

    if (!pyRes.ok) {
      const errBody = await pyRes.text();
      console.error(`[ForesightRoute] Python AI returned HTTP ${pyRes.status}: ${errBody}`);
      return res.status(502).json(
        buildFallbackResponse(`AI service returned HTTP ${pyRes.status}`)
      );
    }

    aiResponse = await pyRes.json();
  } catch (fetchErr) {
    const isTimeout = fetchErr.name === 'AbortError';
    const reason    = isTimeout
      ? 'AI service timed out after 5 000 ms'
      : `AI service unreachable: ${fetchErr.message}`;
    console.error(`[ForesightRoute] ❌ ${reason}`);
    return res.status(502).json(buildFallbackResponse(reason));
  }

  // ── Step 5: Return AI response verbatim ────────────────────────────────────
  return res.status(200).json(aiResponse);
});


export default router;
