/**
 * @file src/services/ai.ts
 * @description AI-related API service for frontend.
 */

import api from "@/lib/api";

/** Enable AI forecasting for the authenticated merchant */
export async function enableAi(): Promise<void> {
  const result = await api.patch("/api/users/merchant/enable-ai");
  console.log(result)
}

/** Upload historical sales data (Excel/CSV) for AI training */
export async function uploadAiTrainingData(file: File): Promise<{ success: boolean; message: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/api/merchant/foresight/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}
