"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { UploadResult } from "@/services/forecast";

type TrainingStatus = "uploading" | "done" | "error" | "idle";

export default function AiLoadingPage() {
  const router = useRouter();
  const [status, setStatus] = useState<TrainingStatus>("uploading");
  const [result, setResult] = useState<UploadResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Poll sessionStorage every 500 ms until the upload/import is done or errored
    const interval = setInterval(() => {
      const s = sessionStorage.getItem("ai_training_status") as TrainingStatus | null;

      if (s === "done") {
        clearInterval(interval);
        const raw = sessionStorage.getItem("ai_training_result");
        if (raw) {
          try { setResult(JSON.parse(raw)); } catch { /* ignore */ }
        }
        setStatus("done");
      } else if (s === "error") {
        clearInterval(interval);
        setErrorMsg(sessionStorage.getItem("ai_training_error") ?? "Unknown error");
        setStatus("error");
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  function handleFinish() {
    ["ai_training_status", "ai_training_result", "ai_training_error", "ai_upload_progress"]
      .forEach((k) => sessionStorage.removeItem(k));
    router.push("/m/ai");
  }

  // ── Result screen ───────────────────────────────────────────────────────────
  if (status === "done" && result) {
    const forecast = result.forecast?.data;
    const hasWarnings = result.validation_warnings && result.validation_warnings.length > 0;

    const confidenceColor =
      (forecast?.confidence_percentage ?? 0) >= 85 ? "text-emerald-600" :
      (forecast?.confidence_percentage ?? 0) >= 70 ? "text-amber-600" : "text-slate-500";

    return (
      <div className="bg-white text-slate-900 min-h-screen flex flex-col items-center justify-center p-5 max-w-[448px] mx-auto">
        <main className="flex-1 w-full flex flex-col items-center justify-center text-center gap-6">
          {/* Success icon */}
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center shadow-[0_4px_24px_rgba(16,183,127,0.15)]">
            <span className="material-symbols-outlined text-emerald-500 text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Data Imported!</h1>
            <p className="text-sm text-slate-500 font-medium">{result.message}</p>
          </div>

          {/* Import stats */}
          <div className="w-full grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-left">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide mb-1">Rows Imported</p>
              <p className="text-3xl font-bold text-slate-900">{result.rows_imported}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">days of history saved</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Old Rows Pruned</p>
              <p className="text-3xl font-bold text-slate-900">{result.rows_deleted}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">entries &gt; 2 years removed</p>
            </div>
          </div>

          {/* Forecast result (if available) */}
          {forecast ? (
            <div className="w-full bg-white border border-emerald-100 rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-500 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <p className="text-sm font-bold text-slate-800">Updated Forecast</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-left">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Surplus Est.</p>
                  <p className="text-2xl font-bold text-slate-900">{forecast.estimated_surplus_today ?? "—"}</p>
                  <p className="text-[11px] text-slate-400">porsi today</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Confidence</p>
                  <p className={`text-2xl font-bold ${confidenceColor}`}>
                    {forecast.confidence_percentage != null ? `${forecast.confidence_percentage}%` : "—"}
                  </p>
                  <p className="text-[11px] text-slate-400">model confidence</p>
                </div>
                {forecast.peak_demand && (
                  <div className="col-span-2 bg-slate-50 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Peak Demand</p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{forecast.peak_demand}</p>
                  </div>
                )}
                {forecast.best_publish_time && (
                  <div className="col-span-2 bg-emerald-50 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Best Publish Time</p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{forecast.best_publish_time}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-400 text-[20px]">info</span>
              <p className="text-xs text-slate-500">Forecast unavailable right now — AI service may be starting up. Your data is saved and will be used next time.</p>
            </div>
          )}

          {/* Validation warnings */}
          {hasWarnings && (
            <div className="w-full bg-amber-50 border border-amber-100 rounded-2xl p-4 text-left">
              <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wide mb-2">⚠ Skipped rows</p>
              {result.validation_warnings!.map((w, i) => (
                <p key={i} className="text-xs text-amber-700">{w}</p>
              ))}
            </div>
          )}
        </main>

        <div className="w-full pb-8 pt-4">
          <button
            onClick={handleFinish}
            className="w-full bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-bold text-base py-4 px-6 rounded-full flex justify-center items-center gap-2 shadow-[0_4px_14px_0_rgba(16,183,127,0.25)] hover:from-emerald-500 hover:to-emerald-600 active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            Back to AI Hub
          </button>
        </div>
      </div>
    );
  }

  // ── Error screen ─────────────────────────────────────────────────────────────
  if (status === "error") {
    return (
      <div className="bg-white text-slate-900 min-h-screen flex flex-col items-center justify-center p-5 max-w-[448px] mx-auto">
        <main className="flex-1 w-full flex flex-col items-center justify-center text-center gap-6">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-red-400 text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Upload Failed</h1>
            <p className="text-sm text-slate-500">Could not process the file.</p>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 w-full text-left">
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">Error details</p>
            <p className="text-sm text-red-700 break-words">{errorMsg}</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 w-full text-left">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">Common causes</p>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>• Missing columns: feature_date, sold_qty, actual_surplus, production_qty, rain_intensity, promo_active</li>
              <li>• File has fewer than 7 rows</li>
              <li>• Dates in feature_date column are not in YYYY-MM-DD format</li>
              <li>• rain_intensity must be 0, 1, or 2</li>
            </ul>
          </div>
        </main>
        <div className="w-full pb-8 pt-4">
          <button
            onClick={handleFinish}
            className="w-full bg-slate-800 text-white font-bold text-base py-4 px-6 rounded-full flex justify-center items-center gap-2 hover:bg-slate-700 active:scale-[0.98] transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ── Loading / uploading screen ────────────────────────────────────────────────
  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col items-center justify-center p-5 max-w-[448px] mx-auto overflow-hidden">
      <style>{`
        .pulse-ring { animation: pulse-ring 2s cubic-bezier(0.215,0.61,0.355,1) infinite; }
        @keyframes pulse-ring { 0% { transform: scale(0.8); opacity:0.5; } 100% { transform: scale(1.5); opacity:0; } }
        .bounce-step { animation: bounce-step 1.5s infinite; }
        .bounce-step:nth-child(2) { animation-delay: 0.2s; }
        .bounce-step:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce-step { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
      `}</style>

      <main className="flex-1 w-full flex flex-col items-center justify-center text-center">
        <div className="mb-12">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Saving your data...</h1>
          <p className="text-base font-medium text-slate-500">Importing history into the database</p>
        </div>

        <div className="relative w-48 h-48 flex items-center justify-center mb-16">
          <div className="absolute inset-0 bg-[#E8F3EE] rounded-full pulse-ring" />
          <div className="absolute inset-4 bg-[#D1E8DD] rounded-full pulse-ring" style={{ animationDelay: "0.5s" }} />
          <div className="relative z-10 w-24 h-24 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center justify-center border border-gray-100">
            <span className="material-symbols-outlined text-emerald-600 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_graph</span>
          </div>
          <div className="absolute top-0 right-4 w-6 h-6 bg-red-100 rounded-full shadow-sm flex items-center justify-center bounce-step">
            <span className="material-symbols-outlined text-red-500 text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
          </div>
          <div className="absolute bottom-4 left-0 w-8 h-8 bg-emerald-100 rounded-full shadow-sm flex items-center justify-center bounce-step">
            <span className="material-symbols-outlined text-emerald-600 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
          </div>
          <div className="absolute bottom-8 right-0 w-5 h-5 bg-emerald-200 rounded-full shadow-sm flex items-center justify-center bounce-step">
            <span className="material-symbols-outlined text-emerald-700 text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>timeline</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: "0.2s" }} />
            <div className="w-2 h-2 rounded-full bg-emerald-200 animate-pulse" style={{ animationDelay: "0.4s" }} />
          </div>
          <p className="text-sm font-medium text-slate-500">Please don't close this page</p>
        </div>
      </main>

      <footer className="mt-auto w-full text-center pb-8 pt-4">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200">
          <span className="material-symbols-outlined text-emerald-600 text-[16px]">psychology</span>
          <span className="text-xs font-semibold text-slate-500">More data = smarter predictions</span>
        </div>
      </footer>
    </div>
  );
}
