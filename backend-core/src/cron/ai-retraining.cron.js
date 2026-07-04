import fetch from "node-fetch";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

export async function triggerDailyAiRetraining() {
    try {
        console.log("[CRON] Initiating daily AI retraining pipeline...");
        
        const controller = new AbortController();
        // Retraining Prophet/XGBoost is fast but we set a 2-minute timeout just in case
        const timeoutId = setTimeout(() => controller.abort(), 120000);

        const response = await fetch(`${AI_SERVICE_URL}/api/v1/forecast/retrain-pipeline`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`AI service returned status ${response.status}: ${errText}`);
        }

        const data = await response.json();
        console.log("[CRON] Daily AI retraining completed successfully:", JSON.stringify(data));
    } catch (error) {
        console.error("[CRON] Daily AI retraining error:", error);
    }
}
