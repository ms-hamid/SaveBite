import { prisma } from '../lib/prisma.js';

export class ForesightRepository {
  /**
   * Format a Postgres Time value from Prisma to "HH:MM:SS" string.
   */
  formatTimeColumn(dateObj) {
    if (!dateObj) return null;
    try {
      const d = new Date(dateObj);
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
   */
  async fetchMerchantData(merchantId, historyDays = 30) {
    const since = new Date();
    since.setDate(since.getDate() - historyDays);

    const [merchantProfile, aiHistory] = await Promise.all([
      prisma.merchant.findUnique({
        where:  { user_id: merchantId },
        select: {
          pickup_open:   true,
          pickup_close:  true,
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
   * Upsert an array of ai_feature_history records for a merchant.
   *
   * The schema has no standalone unique constraint on (merchant_id, feature_date),
   * only a composite PK on (id, merchant_id, feature_date) where `id` is
   * auto-generated. Prisma's built-in upsert() cannot be used without a
   * unique target that we can pre-compute.
   *
   * Strategy: use raw SQL INSERT ... ON CONFLICT (merchant_id, feature_date)
   * by first creating a unique index (done via migration or existing DB state),
   * OR fall back to a manual findFirst → updateMany / create pattern.
   *
   * Since the DB index `idx_ai_history_merchant_date` covers (merchant_id, feature_date)
   * we use updateMany (which targets any matching rows) then create if none updated.
   * This is safe because there should be at most one row per (merchant_id, feature_date).
   *
   * Runs sequentially in batches of 50 to keep load manageable.
   *
   * @param {string} merchantId
   * @param {Array}  records — validated record objects
   * @returns {number} count of rows processed
   */
  async upsertHistoryRows(merchantId, records) {
    const BATCH = 50;
    let processed = 0;

    for (let i = 0; i < records.length; i += BATCH) {
      const batch = records.slice(i, i + BATCH);

      // Process each record: update existing row for that date, or insert new one
      await Promise.all(
        batch.map(async (r) => {
          // Normalise to midnight UTC so date comparisons are stable
          const dateOnly = new Date(r.feature_date);
          dateOnly.setUTCHours(0, 0, 0, 0);

          const updateData = {
            actual_surplus:    r.actual_surplus,
            sold_qty:          r.sold_qty,
            production_qty:    r.production_qty,
            day_of_week:       r.day_of_week,
            is_weekend:        r.is_weekend,
            rain_intensity:    r.rain_intensity,
            promo_active:      r.promo_active,
            sell_through_rate: r.sell_through_rate,
            surplus_rate:      r.surplus_rate,
            updated_at:        new Date(),
          };

          // Try to update any existing row for this (merchant_id, feature_date)
          const updated = await prisma.ai_feature_history.updateMany({
            where: {
              merchant_id:  r.merchant_id,
              feature_date: dateOnly,
            },
            data: updateData,
          });

          // If no row existed, create a new one
          if (updated.count === 0) {
            await prisma.ai_feature_history.create({
              data: {
                merchant_id:       r.merchant_id,
                feature_date:      dateOnly,
                actual_surplus:    r.actual_surplus,
                sold_qty:          r.sold_qty,
                production_qty:    r.production_qty,
                day_of_week:       r.day_of_week,
                is_weekend:        r.is_weekend,
                rain_intensity:    r.rain_intensity,
                promo_active:      r.promo_active,
                sell_through_rate: r.sell_through_rate,
                surplus_rate:      r.surplus_rate,
              },
            });
          }
        })
      );

      processed += batch.length;
    }

    return processed;
  }

  /**
   * Delete ai_feature_history rows for a merchant older than `cutoff`.
   * Enforces the rolling 2-year window so stale data doesn't pollute forecasts.
   *
   * @param {string} merchantId
   * @param {Date}   cutoff
   * @returns {number} count of deleted rows
   */
  async deleteOldHistory(merchantId, cutoff) {
    const result = await prisma.ai_feature_history.deleteMany({
      where: {
        merchant_id:  merchantId,
        feature_date: { lt: cutoff },
      },
    });
    return result.count;
  }
}

export const foresightRepository = new ForesightRepository();
