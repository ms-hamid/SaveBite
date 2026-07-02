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
}

export const foresightRepository = new ForesightRepository();
