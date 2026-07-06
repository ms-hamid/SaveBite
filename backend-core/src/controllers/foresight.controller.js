/**
 * @file src/controllers/foresight.controller.js
 * @description HTTP handlers for the AI Foresight feature.
 *
 * GET  /api/merchant/foresight         — fetch DB history, call AI predict, return forecast
 * POST /api/merchant/foresight/upload  — parse Excel/CSV → upsert ai_feature_history
 *                                        (rolling 2-year window) → trigger predict → return result
 */

import { foresightService } from '../services/foresight.service.js';
import { foresightRepository } from '../repositories/foresight.repository.js';
import xlsx from 'xlsx';

// ── GET /api/merchant/foresight ───────────────────────────────────────────────

export const getForesight = async (req, res) => {
  const merchantId = req.user.id;
  console.log("dapat");

  try {
    const aiResponse = await foresightService.getForecast(merchantId);
    return res.status(200).json(aiResponse);
  } catch (err) {
    const isTimeout = err.name === 'AbortError' || err.message.includes('timeout');
    const reason = isTimeout
      ? 'AI service timed out after 5000 ms'
      : `AI service unreachable: ${err.message}`;

    console.error(`[ForesightController] ❌ ${reason}`);
    return res.status(502).json(foresightService.buildFallbackResponse(reason));
  }
};

// ── POST /api/merchant/foresight/upload ──────────────────────────────────────

/**
 * Required Excel columns (case-insensitive, trimmed):
 *   feature_date    — date string YYYY-MM-DD
 *   actual_surplus  — int ≥ 0
 *   sold_qty        — int ≥ 0
 *   production_qty  — int > 0
 *   rain_intensity  — 0 | 1 | 2
 *   promo_active    — 0 | 1 | true | false
 *
 * Optional columns (auto-derived if absent):
 *   day_of_week    — derived from feature_date
 *   is_weekend     — derived from feature_date
 *   sell_through_rate — sold_qty / production_qty
 *   surplus_rate      — actual_surplus / production_qty
 */

const REQUIRED_COLS = [
  'feature_date',
  'actual_surplus',
  'sold_qty',
  'production_qty',
  'rain_intensity',
  'promo_active',
];

const TWO_YEARS_MS = 2 * 365 * 24 * 60 * 60 * 1000;

function normaliseHeaders(row) {
  const out = {};
  for (const [k, v] of Object.entries(row)) {
    out[k.trim().toLowerCase()] = v;
  }
  return out;
}

function parseBool(val) {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'number') return val !== 0;
  const s = String(val).trim().toLowerCase();
  return s === '1' || s === 'true' || s === 'yes';
}

function parseDate(val) {
  if (!val) return null;
  // xlsx may give a JS Date object for date cells
  if (val instanceof Date) return val;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}

export const uploadAndRetrain = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const merchantId = req.user.id;

    // ── 1. Parse Excel / CSV from memory buffer ────────────────────────────
    let rows;
    try {
      const workbook = xlsx.read(req.file.buffer, { type: 'buffer', cellDates: true });
      const sheet    = workbook.Sheets[workbook.SheetNames[0]];
      rows           = xlsx.utils.sheet_to_json(sheet, { defval: null });
    } catch (parseErr) {
      return res.status(422).json({
        success: false,
        message: `Could not parse file: ${parseErr.message}`,
      });
    }

    if (!rows || rows.length === 0) {
      return res.status(422).json({ success: false, message: 'File is empty.' });
    }

    // Normalise header casing
    rows = rows.map(normaliseHeaders);

    // ── 2. Validate required columns ──────────────────────────────────────
    const firstRow = rows[0];
    const missing  = REQUIRED_COLS.filter((c) => !(c in firstRow));
    if (missing.length > 0) {
      return res.status(422).json({
        success: false,
        message: `Missing required columns: ${missing.join(', ')}. ` +
          `Required: feature_date, actual_surplus, sold_qty, production_qty, rain_intensity, promo_active`,
      });
    }

    if (rows.length < 7) {
      return res.status(422).json({
        success: false,
        message: `At least 7 rows are required. Got ${rows.length}.`,
      });
    }

    // ── 3. Build validated record array ───────────────────────────────────
    const records = [];
    const errors  = [];

    for (let i = 0; i < rows.length; i++) {
      const r   = rows[i];
      const num = i + 2; // 1-indexed, header is row 1

      const feature_date = parseDate(r['feature_date']);
      if (!feature_date) {
        errors.push(`Row ${num}: invalid feature_date "${r['feature_date']}"`);
        continue;
      }

      const sold_qty       = parseInt(r['sold_qty'],      10);
      const actual_surplus = parseInt(r['actual_surplus'], 10);
      const production_qty = parseInt(r['production_qty'], 10);
      const rain_intensity = parseInt(r['rain_intensity'], 10);
      const promo_active   = parseBool(r['promo_active']);

      if (isNaN(sold_qty) || sold_qty < 0) {
        errors.push(`Row ${num}: sold_qty must be an integer ≥ 0`);
        continue;
      }
      if (isNaN(actual_surplus) || actual_surplus < 0) {
        errors.push(`Row ${num}: actual_surplus must be an integer ≥ 0`);
        continue;
      }
      if (isNaN(production_qty) || production_qty <= 0) {
        errors.push(`Row ${num}: production_qty must be > 0`);
        continue;
      }
      if (![0, 1, 2].includes(rain_intensity)) {
        errors.push(`Row ${num}: rain_intensity must be 0, 1, or 2`);
        continue;
      }

      // Derive optional computed fields
      const dow            = feature_date.getDay(); // 0=Sun…6=Sat → convert to Mon=0 format
      // JS: 0=Sun,1=Mon…6=Sat  →  Python/pandas: Mon=0…Sun=6
      const day_of_week    = dow === 0 ? 6 : dow - 1;
      const is_weekend     = day_of_week >= 5; // Sat=5, Sun=6
      const sell_through   = production_qty > 0 ? parseFloat((sold_qty / production_qty).toFixed(4)) : 0;
      const surplus_rate   = production_qty > 0 ? parseFloat((actual_surplus / production_qty).toFixed(4)) : 0;

      records.push({
        merchant_id:       merchantId,
        feature_date,
        actual_surplus,
        sold_qty,
        production_qty,
        day_of_week,
        is_weekend,
        rain_intensity,
        promo_active,
        sell_through_rate: sell_through,
        surplus_rate,
        updated_at:        new Date(),
      });
    }

    if (errors.length > 0 && records.length === 0) {
      return res.status(422).json({
        success: false,
        message: 'All rows failed validation.',
        errors:  errors.slice(0, 10),
      });
    }

    // ── 4. Upsert into ai_feature_history ─────────────────────────────────
    // Use createMany with skipDuplicates — the unique constraint on
    // (merchant_id, listing_id, feature_date) will skip exact duplicates.
    // For updates (same date, new data) we upsert via updateMany pattern.
    const upsertResults = await foresightRepository.upsertHistoryRows(merchantId, records);

    // ── 5. Rolling 2-year window: delete rows older than 2 years ──────────
    const cutoff = new Date(Date.now() - TWO_YEARS_MS);
    const deleted = await foresightRepository.deleteOldHistory(merchantId, cutoff);

    console.log(
      `[ForesightController] ✅ Upserted ${upsertResults} rows, deleted ${deleted} old rows for merchant ${merchantId}`
    );

    // ── 6. Trigger database-driven retraining pipeline ────────────────────
    // After data is stored in DB, trigger retrain-pipeline which:
    // - Fetches ALL data from ai_feature_history (2-year window)
    // - Trains new models with complete historical data
    // - Compares with current models (WAPE-based)
    // - Promotes new model if better
    let pipelineResult = null;
    let pipelineError = null;
    try {
      pipelineResult = await foresightService.triggerRetrainingPipeline();
      console.log(
        `[ForesightController] ✅ Retraining pipeline completed for merchant ${merchantId}. ` +
        `Model ${pipelineResult.data?.model_promoted ? 'PROMOTED' : 'RETAINED'}. ` +
        `WAPE: ${pipelineResult.data?.new_wape ?? 'N/A'}%`
      );
    } catch (pipelineErr) {
      // Non-fatal — data was saved successfully
      pipelineError = pipelineErr.message;
      console.warn(`[ForesightController] ⚠️  Retraining pipeline failed: ${pipelineErr.message}`);
    }

    // ── 7. Get fresh forecast with potentially updated models ──────────────
    let forecastResult = null;
    try {
      forecastResult = await foresightService.getForecast(merchantId);
    } catch (forecastErr) {
      // Non-fatal — data was saved successfully; forecast just couldn't run
      console.warn(`[ForesightController] ⚠️  Forecast after upload failed: ${forecastErr.message}`);
    }

    return res.status(200).json({
      success:         true,
      message:         `Successfully imported ${upsertResults} row(s). Old data pruned: ${deleted} row(s).`,
      rows_imported:   upsertResults,
      rows_deleted:    deleted,
      validation_warnings: errors.length > 0 ? errors.slice(0, 5) : undefined,
      retraining:      pipelineResult ? {
        status:   'success',
        message:  pipelineResult.message,
        model_promoted: pipelineResult.data?.model_promoted ?? false,
        metrics:  {
          rows_used:    pipelineResult.data?.rows_used,
          current_wape: pipelineResult.data?.current_wape,
          new_wape:     pipelineResult.data?.new_wape,
          improvement:  pipelineResult.data?.comparison?.improvement ?? 0,
        },
      } : pipelineError ? {
        status:   'failed',
        message:  pipelineError,
        note:     'Data was imported successfully but model retraining failed. Forecasts will use previous models.',
      } : {
        status: 'skipped',
        message: 'Retraining was not triggered',
      },
      forecast:        forecastResult ?? null,
    });

  } catch (err) {
    console.error('[ForesightController] ❌ uploadAndRetrain error:', err);
    return res.status(500).json({
      success: false,
      message: err.message ?? 'Internal server error',
    });
  }
};
