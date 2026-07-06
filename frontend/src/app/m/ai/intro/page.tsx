"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { enableAi } from "@/services/ai";
import { getApiErrorMessage } from "@/lib/api";

export default function SmartSellingWithAiIntroRefinedPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleEnableAi() {
    setIsLoading(true);
    setError("");
    try {
      await enableAi();
      router.push("/m/ai/setup");
    } catch (err) {
      setError(getApiErrorMessage(err));
      setIsLoading(false);
    }
  }

  return (
    <>
      <title>Smart Selling with AI</title>
      <div className={"bg-white text-on-background antialiased selection:bg-primary-container selection:text-on-primary-container"}>
        <div className="max-w-[448px] mx-auto min-h-screen bg-white relative flex flex-col">
          {/* TopAppBar */}
          <header className="fixed m top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
            <div className="flex justify-between items-center h-16 px-5 max-w-[448px]">
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-50 transition-colors active:scale-95 duration-150 ease-in-out"
              >
                <span className="material-symbols-outlined text-slate-800">arrow_back</span>
              </button>
              <h1 className="font-bold text-lg tracking-tight text-black text-center">AI Forecast</h1>
              <div className="w-10"></div>
            </div>
          </header>

          {/* Main Content Canvas */}
          <main className="flex-1 px-5 flex flex-col mt-20 mb-8 overflow-y-auto">
            {/* Hero Illustration */}
            <div className="w-full aspect-[4/3] rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden shadow-sm relative mb-8">
              <img
                alt="Smart Selling with AI Illustration"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgmu7txU6ruFZ3atWaPf7u3w_82Z7Lg-J56yi1sSLRFz8fNZMN7_If3h_6pjeVbft9Wx1CB-FBafUEwC6UQglyf-8ykUsFqnXCyZeWDNQPtGI8znWa5q39vNPzS2w_FxXr_y1WUqcyQ-VACfPv0DzHvbBhGHapOD6tjlVKP0Yc5g1O6zszF2x-dHvCtoV_G6-v1EKzmesMoACSEbNC43P80GgJyPFBDj2w_QqqSTuDT5MVFBEMwxWu6JpYLO0LldgsSgmJ0bV2to7e"
              />
              {/* Floating Icon Badge */}
              <div className="absolute bottom-4 right-4 bg-white rounded-xl p-3 shadow-md flex items-center gap-2">
                <span className="material-symbols-outlined text-[#10b77f]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <span className="font-bold text-lg text-slate-800">94%</span>
              </div>
            </div>

            {/* Header Text */}
            <div className="flex items-center gap-1.5 mb-2">
              <span className="material-symbols-outlined text-emerald-600" style={{ fontSize: "14px", fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <span className="text-[10px] font-bold tracking-[0.1em] text-emerald-600 uppercase">Powered by AI</span>
            </div>
            <h2 className="font-bold text-2xl text-slate-900 mb-2">Let AI predict your surplus</h2>
            <p className="text-base font-medium text-slate-600 mb-8">We analyze your sales patterns to predict when you'll have unsold food — so you can prepare and sell it in advance.</p>

            {/* Benefits List */}
            <div className="flex flex-col gap-6 mb-8">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                  <span className="material-symbols-outlined text-slate-600">auto_graph</span>
                </div>
                <div className="pt-2">
                  <span className="material-symbols-outlined text-emerald-600 mr-1 inline-block align-middle" style={{ fontSize: "16px" }}>auto_awesome</span>
                  <span className="text-sm text-slate-700 font-medium">Know when surplus will happen</span>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                  <span className="material-symbols-outlined text-slate-600">task_alt</span>
                </div>
                <div className="pt-2">
                  <span className="material-symbols-outlined text-emerald-600 mr-1 inline-block align-middle" style={{ fontSize: "16px" }}>auto_awesome</span>
                  <span className="text-sm text-slate-700 font-medium">Increase chances of selling out</span>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                  <span className="material-symbols-outlined text-slate-600">energy_savings_leaf</span>
                </div>
                <div className="pt-2">
                  <span className="material-symbols-outlined text-emerald-600 mr-1 inline-block align-middle" style={{ fontSize: "16px" }}>auto_awesome</span>
                  <span className="text-sm text-slate-700 font-medium">Reduce food waste automatically</span>
                </div>
              </div>
            </div>

            {/* Subtle Info Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex gap-2 items-start mb-8 shadow-sm">
              <span className="material-symbols-outlined text-slate-400 mt-0.5" style={{ fontSize: "18px" }}>insights</span>
              <p className="text-[10px] font-medium text-slate-600 leading-relaxed">Predictions improve as we learn from your store activity</p>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
                {error}
              </p>
            )}

            <div className="flex-1" />
          </main>

          {/* Fixed Action Area */}
          <div className="p-5 pt-4 bg-gradient-to-t from-white via-white to-white/0 mt-auto sticky bottom-0 z-40">
            <button
              onClick={handleEnableAi}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-medium text-base py-4 px-6 rounded-full flex justify-center items-center gap-2 shadow-[0_4px_14px_0_rgba(16,183,127,0.25)] hover:from-emerald-500 hover:to-emerald-600 active:scale-[0.98] transition-all mb-2 disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined" style={{ fontSize: "20px", fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              )}
              {isLoading ? "Enabling..." : "Enable AI Forecasting"}
            </button>
            <button
              onClick={() => router.back()}
              className="w-full text-slate-500 text-xs font-semibold py-4 rounded-full text-center active:bg-slate-50 transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
