"use client";

import DashboardBottomNav from "../../../components/m/DashboardBottomNav";

export default function MerchantAiHubPolishedLayoutPage() {
  return (
    <>
      <div className={"bg-slate-50 text-slate-900 min-h-screen flex justify-center antialiased"}>
        {/* Mobile Container (Max 448px) */}
        <div className="w-full max-w-[448px] bg-white relative flex flex-col min-h-screen shadow-xl pb-[80px]">
        {/* TopAppBar */}
        <header className="bg-white/95 fixed top-0 w-full max-w-[448px] z-50 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-5 h-16 relative">
        <button className="text-slate-600 hover:bg-slate-50 transition-colors p-2 rounded-full active:scale-95 transition-transform duration-200"><span className="material-symbols-outlined">person</span></button>
        <div className="absolute left-1/2 -translate-x-1/2 font-bold text-lg text-slate-900 tracking-tight">AI Hub</div>
        <button className="text-slate-600 hover:bg-slate-50 transition-colors p-2 rounded-full active:scale-95 transition-transform duration-200 relative">
        <span className="material-symbols-outlined">notifications</span>
        </button>
        </header>
        {/* Main Content Canvas */}
        <main className="flex-1 px-5 py-6 overflow-y-auto no-scrollbar flex flex-col space-y-6">
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
        {/* Surplus Estimate Card */}
        <section className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col relative">
        {/* AI Confidence Badge */}
        <div className="absolute bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100 flex items-center gap-1 top-5 right-5">
        <span className="material-symbols-outlined text-[12px]">check_circle</span>
                            94% CONFIDENCE
                        </div>
        <div className="p-5 flex flex-col gap-4 pt-5">
        <div className="flex items-center gap-2 text-slate-900">
        <span className="material-symbols-outlined text-[18px]">inventory_2</span>
        <h2 className="text-sm font-bold">Today's Surplus Estimate</h2>
        </div>
        <div className="flex items-baseline gap-1.5">
        <span className="text-[48px] font-bold text-slate-900 leading-none">36</span>
        <span className="text-sm font-medium text-slate-500">items predicted</span>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-3 mt-2">
        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
        <span className="material-symbols-outlined text-[16px]">schedule</span>
        </div>
        <div>
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">PEAK DEMAND TIME</p>
        <p className="text-sm font-bold text-slate-900 mt-0.5">19:00 - 20:30</p>
        </div>
        </div>
        <button className="w-full mt-2 bg-primary-emerald text-white text-sm font-bold py-3 rounded-xl hover:bg-emerald-600 active:scale-95 transition-all flex justify-center items-center gap-2 shadow-sm">
        <span className="">Prepare Listing</span>
        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
        </div>
        </section>
        {/* Manual Data Section */}
        <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Training Data</h2>
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col gap-4 text-center items-center py-8">
        <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 mb-1">
        <span className="material-symbols-outlined">upload_file</span>
        </div>
        <div>
        <h3 className="text-sm font-bold text-slate-900">Help the AI learn faster</h3>
        <p className="text-sm font-medium text-slate-500 mt-1">Upload historical sales data to improve prediction accuracy for your specific store.</p>
        </div>
        <button className="w-full border border-primary-emerald text-primary-emerald text-sm font-bold py-3 rounded-xl hover:bg-emerald-50 active:scale-95 transition-all mt-2">
                                Upload Historical Sales Data
                            </button>
        </div>
        </section>
        </main>
        {/* BottomNavBar */}
        <DashboardBottomNav page="ai"/>
        </div>
      </div>
    </>
  );
}
