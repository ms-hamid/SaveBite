import fetch from 'node-fetch'; // or use native fetch if Node 18+
import { foresightRepository } from '../repositories/foresight.repository.js';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
const DEFAULT_PROD_QTY = 150;

export class ForesightService {
  /**
   * Convert ai_feature_history DB rows to the DailySalesPoint format
   * expected by the Python AI service.
   */
  mapHistoryToPayload(rows) {
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
   * Build a synthetic demo history when no real data exists.
   */
  buildDemoHistory() {
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
   * Orchestrate the data fetching and AI service call.
   */
  async getForecast(merchantId) {
    // 1. Fetch from DB
    const { merchantProfile, aiHistory } = await foresightRepository.fetchMerchantData(merchantId);

    // 2. Map history
    let history = this.mapHistoryToPayload(aiHistory);
    if (history.length < 7) {
      console.warn(
        `[ForesightService] Only ${history.length} ai_feature_history rows for merchant ${merchantId} — using synthetic demo data.`
      );
      history = this.buildDemoHistory();
    }

    // 3. Resolve operating hours
    const pickup_open  = merchantProfile ? foresightRepository.formatTimeColumn(merchantProfile.pickup_open)  : null;
    const pickup_close = merchantProfile ? foresightRepository.formatTimeColumn(merchantProfile.pickup_close) : null;

    if (!pickup_open || !pickup_close) {
      console.warn(
        `[ForesightService] Merchant ${merchantId} has no pickup_open/close set. ` +
        'Python service will fall back to day-of-week heuristics for peak_demand.'
      );
    }

    // 4. Call Python API
    const target_date = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
    const aiPayload = {
      merchant_id:    merchantId,
      target_date:    target_date,
      history,
      production_qty: DEFAULT_PROD_QTY,
      pickup_open,
      pickup_close,
    };

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
      throw new Error(`AI service returned HTTP ${pyRes.status}: ${errBody}`);
    }

    return await pyRes.json();
  }

  /**
   * Trigger model retraining on the backend-ai service with fresh data.
   * This is called after new training data is uploaded.
   *
   * @param {Buffer} fileBuffer - The Excel/CSV file buffer
   * @param {string} fileName   - Original filename (e.g., "data.xlsx")
   * @returns {object} Retraining metrics (mae, rmse, wape, rows_used, etc.)
   */
  async triggerRetraining(fileBuffer, fileName) {
    const FormData = (await import('form-data')).default;
    const form = new FormData();
    form.append('file', fileBuffer, fileName);

    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 120_000); // 2-minute timeout for training

    const pyRes = await fetch(`${AI_SERVICE_URL}/api/v1/forecast/retrain`, {
      method:  'POST',
      body:    form,
      signal:  controller.signal,
    });
    clearTimeout(timeoutId);

    if (!pyRes.ok) {
      const errBody = await pyRes.text();
      throw new Error(`Retraining service returned HTTP ${pyRes.status}: ${errBody}`);
    }

    return await pyRes.json();
  }

  /**
   * Trigger database-driven retraining pipeline.
   * This uses ALL data from ai_feature_history (2-year window) to retrain models,
   * compares with current production models, and promotes if better.
   * 
   * This is the RECOMMENDED method after uploading new training data, as it:
   * - Uses complete historical data from database
   * - Automatic model comparison & promotion
   * - Better model selection based on WAPE
   *
   * @returns {object} Retraining pipeline result with model comparison
   */
  async triggerRetrainingPipeline() {
    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 180_000); // 3-minute timeout

    const pyRes = await fetch(`${AI_SERVICE_URL}/api/v1/forecast/retrain-pipeline`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      signal:  controller.signal,
    });
    clearTimeout(timeoutId);

    if (!pyRes.ok) {
      const errBody = await pyRes.text();
      throw new Error(`Retraining pipeline returned HTTP ${pyRes.status}: ${errBody}`);
    }

    return await pyRes.json();
  }

  buildFallbackResponse(reason) {
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
}

export const foresightService = new ForesightService();
