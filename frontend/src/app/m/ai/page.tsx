"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardBottomNav from "../../../components/m/DashboardBottomNav";
import { getMyProfile } from "@/services/user";
import { retrainFromExcel, getAiErrorMessage, type UploadResult } from "@/services/forecast";
import api from "@/lib/api";

const ALLOWED_EXTS = [".xlsx", ".xls", ".csv"];

export default function MerchantAiHubPolishedLayoutPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth / enable_ai check
  const [isChecking, setIsChecking] = useState(true);

  // Foresight data
  const [foresight, setForesight] = useState<any>(null);
  const [foresightLoading, setForesightLoading] = useState(true);

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    async function checkAiEnabled() {
      try {
        const profile = await getMyProfile();
        const merchant = profile?.data?.merchant;
        console.log(merchant.enable_ai)
        if (!merchant?.enable_ai) {
          router.replace("/m/ai/intro");
          return;
        }
      } catch {
        // If auth fails let the page render (middleware will handle)
      } finally {
        setIsChecking(false);
      }
    }
    
    async function fetchForesight() {
      try {
        setForesightLoading(true);
        const res = await api.get('/api/merchant/foresight?bypass=dev_secret');
        setForesight(res.data.data);
      } catch (err) {
        console.error("Foresight fetch error:", err);
      } finally {
        setForesightLoading(false);
      }
    }

    checkAiEnabled();
    fetchForesight();
  }, [router]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValid = ALLOWED_EXTS.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );
    if (!isValid) {
      setUploadError("Only .xlsx, .xls, or .csv files are accepted.");
      setSelectedFile(null);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File must be under 10 MB.");
      setSelectedFile(null);
      return;
    }

    setUploadError("");
    setSelectedFile(file);
  }

  async function handleStartTraining() {
    if (!selectedFile) return;

    setIsTraining(true);
    setUploadError("");
    setUploadProgress(0);

    try {
      // Store training state in sessionStorage so loading page can poll
      sessionStorage.setItem("ai_training_status", "uploading");
      sessionStorage.removeItem("ai_training_result");
      sessionStorage.removeItem("ai_training_error");

      // Navigate to loading page FIRST — the actual training runs here
      // but we pass a flag so the loading page handles the result display
      sessionStorage.setItem("ai_training_status", "training");
      router.push("/m/ai/loading");

      // Run import in background (will complete even after navigation)
      const result = await retrainFromExcel(selectedFile, (pct) => {
        setUploadProgress(pct);
        sessionStorage.setItem("ai_upload_progress", String(pct));
      });

      sessionStorage.setItem("ai_training_status", "done");
      sessionStorage.setItem("ai_training_result", JSON.stringify(result));
    } catch (err) {
      const msg = getAiErrorMessage(err);
      sessionStorage.setItem("ai_training_status", "error");
      sessionStorage.setItem("ai_training_error", msg);
      setUploadError(msg);
      setIsTraining(false);
    }
  }

  if (isChecking) {
    return (
      <div className="bg-slate-50 text-slate-900 min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className={"bg-slate-50 text-slate-900 min-h-screen flex justify-center antialiased"}>
        {/* Mobile Container (Max 448px) */}
        <div className="w-full max-w-[448px] bg-white relative flex flex-col min-h-screen shadow-xl pb-[80px]">
          {/* TopAppBar */}
          <header className="bg-white/95 fixed top-0 w-full max-w-[448px] z-50 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-5 h-16">
            <button className="text-slate-600 hover:bg-slate-50 transition-colors p-2 rounded-full active:scale-95 transition-transform duration-200">
              <span className="material-symbols-outlined">person</span>
            </button>
            <div className="font-bold text-lg text-slate-900 tracking-tight">AI Hub</div>
            <button className="text-slate-600 hover:bg-slate-50 transition-colors p-2 rounded-full active:scale-95 transition-transform duration-200 relative">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </header>

          {/* Main Content Canvas */}
          <main className="flex-1 px-5 py-6 overflow-y-auto no-scrollbar flex flex-col space-y-6 mt-16">
            {/* Page Header */}
            <section className="flex flex-col gap-1">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">AI Hub</h1>
              <p className="text-sm font-medium text-slate-500">Insights &amp; predictions for your store</p>
            </section>

            {/* Status Card */}
            <section className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100/80 flex items-center justify-center text-emerald-600">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">AI is active</h3>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">Analyzing store patterns</p>
                </div>
              </div>
              <div className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                SYSTEM OPTIMIZED
              </div>
            </section>

            {/* Surplus Estimate Card - Using real foresight data */}
            <section className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col relative">
              {/* AI Confidence Badge */}
              {foresight?.confidence_percentage && (
                <div className="absolute bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100 flex items-center gap-1 top-5 right-5">
                  <span className="material-symbols-outlined text-[12px]">check_circle</span>
                  {foresight.confidence_percentage}% CONFIDENCE
                </div>
              )}
              
              <div className="p-5 flex flex-col gap-4 pt-5">
                <div className="flex items-center gap-2 text-slate-900">
                  <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                  <h2 className="text-sm font-bold">Today's Surplus Estimate</h2>
                </div>
                
                {foresightLoading ? (
                  <div className="flex flex-col gap-3 animate-pulse">
                    <div className="h-12 bg-slate-100 rounded w-32" />
                    <div className="h-16 bg-slate-50 rounded-xl" />
                  </div>
                ) : foresight ? (
                  <>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[48px] font-bold text-slate-900 leading-none">
                        {foresight.estimated_surplus_today ?? "—"}
                      </span>
                      <span className="text-sm font-medium text-slate-500">items predicted</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-3 mt-2">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">PEAK DEMAND TIME</p>
                        <p className="text-sm font-bold text-slate-900 mt-0.5">
                          {foresight.peak_demand ?? "Unknown"}
                        </p>
                      </div>
                    </div>
                    {foresight.best_publish_time && (
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[16px]">alarm</span>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">BEST PUBLISH TIME</p>
                          <p className="text-sm font-bold text-slate-900 mt-0.5">
                            {foresight.best_publish_time}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-slate-400">cloud_off</span>
                    </div>
                    <p className="text-sm font-medium text-slate-500">No forecast data available</p>
                    <p className="text-xs text-slate-400 mt-1">Upload training data to get started</p>
                  </div>
                )}
                
                <button 
                  onClick={() => router.push('/m/listing/create')}
                  className="w-full mt-2 bg-emerald-500 text-white text-sm font-bold py-3 rounded-xl hover:bg-emerald-600 active:scale-95 transition-all flex justify-center items-center gap-2 shadow-sm"
                  disabled={!foresight}
                >
                  <span>Prepare Listing</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </section>

            {/* Training Data / Upload Section */}
            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Training Data</h2>
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                    <span className="material-symbols-outlined">upload_file</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Retrain with your own data</h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Upload an Excel or CSV file with your historical sales data to improve prediction accuracy.</p>
                  </div>
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {/* File selected preview */}
                {selectedFile && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-600 text-[20px]">description</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{selectedFile.name}</p>
                      <p className="text-[11px] text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setUploadError("");
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                )}

                {/* Upload progress bar */}
                {isTraining && uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full">
                    <div className="flex justify-between mb-1">
                      <span className="text-[11px] text-slate-500 font-medium">Uploading...</span>
                      <span className="text-[11px] text-emerald-600 font-semibold">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Error */}
                {uploadError && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                    {uploadError}
                  </p>
                )}

                {/* Required columns info */}
                <div className="bg-slate-50 rounded-xl p-3 flex flex-col gap-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Required Excel columns</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {["feature_date", "sold_qty", "actual_surplus", "production_qty", "rain_intensity", "promo_active"].map((col) => (
                      <span key={col} className="text-[10px] font-mono bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md">
                        {col}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Minimum 7 rows. rain_intensity: 0=sunny 1=drizzle 2=heavy. promo_active: 0 or 1.</p>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isTraining}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-full border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[16px]">upload</span>
                    {selectedFile ? "Change file" : "Choose file"}
                  </button>

                  <button
                    type="button"
                    onClick={handleStartTraining}
                    disabled={!selectedFile || isTraining}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-full bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isTraining ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Training...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[16px]">model_training</span>
                        Start Training
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Download template link */}
              <a
                href="/ai_training_template.xlsx"
                download
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 text-slate-500 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                Download Sample Template (.xlsx)
              </a>
            </section>
          </main>

          {/* BottomNavBar */}
          <DashboardBottomNav page="ai" />
        </div>
      </div>
    </>
  );
}
