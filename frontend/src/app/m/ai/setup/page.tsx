"use client";

import DashboardBottomNav from "@/components/m/DashboardBottomNav";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import api, { getApiErrorMessage } from "@/lib/api";

export default function SmartSellingWithAiSetupRefinedPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  // UI state
  const [surplusTime, setSurplusTime] = useState<"afternoon" | "evening" | "late_night">("evening");
  const [frequency, setFrequency] = useState("Daily");
  const [autoLearn, setAutoLearn] = useState(true);

  const ALLOWED_TYPES = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "text/csv",
  ];

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
      setUploadError("Only Excel (.xlsx, .xls) or CSV files are allowed.");
      setSelectedFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size must be under 10MB.");
      setSelectedFile(null);
      return;
    }

    setUploadError("");
    setSelectedFile(file);
  }

  async function handleUpload() {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      await api.post("/api/merchant/foresight/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadSuccess("Data uploaded successfully! The AI will learn from it.");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setUploadError(getApiErrorMessage(err));
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <>
      <title>AI Data Setup - SaveBite</title>
      <div className={"bg-white text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900"}>
        <div className="max-w-[448px] mx-auto min-h-[884px] bg-white relative flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.05)] overflow-hidden">

          {/* TopAppBar */}
          <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm flex justify-between items-center h-16 px-5 max-w-[448px] mx-auto">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-50 transition-colors active:scale-95 duration-150 ease-in-out text-slate-700"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="font-bold text-lg tracking-tight text-slate-900">AI Forecast</h1>
            <div className="w-10" />
          </header>

          {/* Main Content */}
          <main className="flex-1 px-5 pt-24 pb-44 flex flex-col gap-8">
            {/* Page Header */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="material-symbols-outlined text-emerald-500" style={{ fontSize: "16px" }}>psychology</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600/80">Powered by AI</span>
              </div>
              <h2 className="font-bold text-2xl text-slate-900">Help us understand your store</h2>
              <p className="text-sm text-slate-500 mt-1">Collect basic signals for prediction.</p>
            </div>

            {/* Content Area (Cards) */}
            <div className="flex flex-col gap-4">
              {/* Section 1: Upload Data */}
              <section className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-lg text-slate-800">
                      <span className="material-symbols-outlined text-[18px] text-emerald-500 align-middle mr-1">auto_awesome</span>
                      Past sales data{" "}
                      <span className="text-slate-400 font-normal text-sm">(optional)</span>
                    </h3>
                    <p className="text-sm text-slate-500">Upload historical data for faster AI learning.</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <span className="material-symbols-outlined">upload_file</span>
                  </div>
                </div>

                {/* File input (hidden) */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {/* Selected file preview */}
                {selectedFile && (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex items-center gap-3">
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
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                )}

                {/* Error / success messages */}
                {uploadError && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{uploadError}</p>
                )}
                {uploadSuccess && (
                  <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">{uploadSuccess}</p>
                )}

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors active:scale-[0.99]"
                  >
                    <span className="material-symbols-outlined text-[18px]">upload</span>
                    {selectedFile ? "Change file" : "Choose file (.xlsx/.csv)"}
                  </button>
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors disabled:opacity-60"
                    >
                      {isUploading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                      )}
                      {isUploading ? "Uploading..." : "Upload"}
                    </button>
                  )}
                </div>
              </section>

              {/* Section 2: Store Behavior Inputs */}
              <section className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col gap-4">
                <h3 className="font-bold text-lg text-slate-800">
                  <span className="material-symbols-outlined text-[18px] text-emerald-500 align-middle mr-1">auto_awesome</span>
                  When do you usually have unsold food?
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(["afternoon", "evening", "late_night"] as const).map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSurplusTime(slot)}
                      className={`px-4 py-2 rounded-full border text-xs font-semibold transition-colors ${
                        surplusTime === slot
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {slot === "afternoon" ? "Afternoon" : slot === "evening" ? "Evening" : "Late night"}
                    </button>
                  ))}
                </div>
              </section>

              {/* Section 3: Frequency Dropdown */}
              <section className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col gap-4">
                <h3 className="font-bold text-lg text-slate-800">
                  <span className="material-symbols-outlined text-[18px] text-emerald-500 align-middle mr-1">auto_awesome</span>
                  How often do you have surplus?
                </h3>
                <div className="relative">
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full appearance-none px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  >
                    <option>Daily</option>
                    <option>A few times a week</option>
                    <option>Weekly</option>
                    <option>Occasionally</option>
                  </select>
                  <span className="material-symbols-outlined text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">keyboard_arrow_down</span>
                </div>
              </section>

              {/* Section 4: Toggle */}
              <section className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center justify-between">
                <div className="flex flex-col gap-0.5 pr-4">
                  <span className="text-sm text-slate-800 font-semibold">Allow automatic learning from orders</span>
                  <span className="text-[10px] text-slate-500">Improves prediction accuracy over time.</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={autoLearn}
                  onClick={() => setAutoLearn(!autoLearn)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none flex-shrink-0 ${autoLearn ? "bg-emerald-400" : "bg-slate-200"}`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${autoLearn ? "translate-x-5" : "translate-x-1"}`}
                  />
                </button>
              </section>
            </div>
          </main>

          {/* Fixed Bottom CTA */}
          <div className="fixed bottom-0 left-0 right-0 max-w-[448px] mx-auto p-5 bg-gradient-to-t from-white via-white to-transparent pt-10 z-40 pb-20">
            <button
              type="button"
              onClick={() => router.push("/m/ai")}
              className="w-full bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-medium text-base py-4 px-6 rounded-full flex justify-center items-center gap-2 shadow-[0_4px_14px_0_rgba(16,183,127,0.25)] hover:from-emerald-500 hover:to-emerald-600 active:scale-[0.98] transition-all"
            >
              Continue
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>

          <DashboardBottomNav page="ai" />
        </div>
      </div>
    </>
  );
}
