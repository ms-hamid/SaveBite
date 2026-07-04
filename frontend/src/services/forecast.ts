/**
 * @file src/services/forecast.ts
 * @description AI forecasting service — proxied through backend-core.
 *
 * Flow:
 *   Frontend (JWT) → POST /api/merchant/foresight/upload (backend-core)
 *     → parse Excel/CSV
 *     → upsert rows into ai_feature_history (rolling 2-year window)
 *     → call backend-ai /predict with fresh DB data
 *     → return { rows_imported, rows_deleted, forecast }
 */

import api, { getApiErrorMessage } from "@/lib/api";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ForecastData = {
  estimated_surplus_today: number | null;
  peak_demand: string | null;
  best_publish_time: string | null;
  confidence_percentage: number | null;
};

export type UploadResult = {
  success: boolean;
  message: string;
  rows_imported: number;
  rows_deleted: number;
  validation_warnings?: string[];
  forecast: {
    status: string;
    data: ForecastData;
  } | null;
};

// ── API calls ─────────────────────────────────────────────────────────────────

/**
 * Upload an Excel or CSV file through backend-core.
 * backend-core parses the file, upserts rows into ai_feature_history,
 * prunes data older than 2 years, then triggers a fresh /predict call.
 *
 * Calls: POST /api/merchant/foresight/upload
 *
 * @param file       - Excel (.xlsx / .xls) or CSV file
 * @param onProgress - optional upload progress callback (0–100)
 */
export async function uploadTrainingData(
  file: File,
  onProgress?: (pct: number) => void
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<UploadResult>(
    "/api/merchant/foresight/upload",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          const pct = Math.round((event.loaded / event.total) * 100);
          onProgress(pct);
        }
      },
      timeout: 120_000, // 2-minute timeout (DB insert + predict)
    }
  );

  return response.data;
}

// Keep backward compat alias
export const retrainFromExcel = uploadTrainingData;

// Re-export error helper for convenience
export { getApiErrorMessage as getAiErrorMessage };
