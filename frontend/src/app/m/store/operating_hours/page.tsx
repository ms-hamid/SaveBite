import React from "react";

export default function OperatingHoursPolishedStylePage() {
  return (
    <>
      <title>Operating Hours - SaveBite Merchant</title>
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script id="tailwind-config" dangerouslySetInnerHTML={{ __html: `tailwind.config = {
                darkMode: "class",
                theme: {
                  extend: {
                    "colors": {
                      "primary-emerald": "#16C47F",
                      "sb-bg": "#F7FAF8",
                      "sb-primary-text": "#111827",
                      "sb-secondary-text": "#6B7280",
                      "sb-border": "#EAEAEA"
                    },
                    "borderRadius": {
                            "DEFAULT": "0.25rem",
                            "lg": "0.5rem",
                            "xl": "0.75rem",
                            "2xl": "1rem",
                            "3xl": "1.5rem",
                            "full": "9999px"
                    },
                    "fontFamily": {
                            "sans": ["Plus Jakarta Sans", "sans-serif"]
                    }
                  },
                }
              }` }} />
      <style dangerouslySetInnerHTML={{ __html: `body {
                  font-family: 'Plus Jakarta Sans', sans-serif; 
                  -webkit-tap-highlight-color: transparent;
              }
              /* Custom Toggle Switch Styles */
              .toggle-checkbox:checked {
                  right: 0;
                  border-color: #16C47F;
              }
              .toggle-checkbox:checked + .toggle-label {
                  background-color: #16C47F;
              }
              .toggle-checkbox:checked + .toggle-label:after {
                  transform: translateX(100%);
                  border-color: white;
              }` }} />
      <style dangerouslySetInnerHTML={{ __html: `body {
            min-height: max(884px, 100dvh);
          }` }} />
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&amp;display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet" />
      <div className={"text-sb-primary-text antialiased min-h-screen flex justify-center bg-white"}>
        <div className="w-full max-w-[448px] min-h-screen flex flex-col relative pb-32 bg-white">
        {/* TopAppBar */}
        <header className="fixed top-0 left-0 w-full z-50 flex items-center px-6 h-16 backdrop-blur-xl border-b border-sb-border transition-all duration-200 bg-white/95" style={{ maxWidth: "inherit", left: "inherit" }}>
        <button className="mr-4 p-2 -ml-2 rounded-full hover:bg-slate-50 active:scale-95 transition-all duration-200 text-sb-secondary-text flex items-center justify-center">
        <span className="material-symbols-outlined" data-icon="arrow_back">arrow_back</span>
        </button>
        <h1 className="text-[20px] font-bold text-sb-primary-text tracking-tight">Operating Hours</h1>
        </header>
        {/* Main Content */}
        <main className="flex-1 mt-16 px-6 pt-6 flex flex-col gap-6">
        {/* Business Hours Settings */}
        <section className="flex flex-col gap-4">
        <div>
        <h2 className="text-[16px] font-bold flex items-center gap-2 text-sb-primary-text">
        <span className="material-symbols-outlined text-[18px] text-primary-emerald" data-icon="schedule" data-weight="fill">schedule</span>
                                Business Hours
                            </h2>
        <p className="text-[13px] text-sb-secondary-text font-medium mt-1">Set the times your store is open for SaveBite pickups.</p>
        </div>
        {/* Weekday Schedule Matcher */}
        <label className="flex items-start gap-3 p-4 rounded-2xl border border-sb-border cursor-pointer hover:bg-slate-50 transition-colors bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
        <input defaultChecked className="mt-0.5 rounded text-primary-emerald focus:ring-primary-emerald h-4 w-4 border-sb-border bg-white" style={{ color: "#16C47F", "--tw-ring-color": "#16C47F" } as React.CSSProperties} type="checkbox" />
        <div className="flex flex-col">
        <span className="text-[13px] font-bold text-sb-primary-text">Apply Monday schedule to all weekdays</span>
        <span className="text-[11px] text-sb-secondary-text mt-0.5">Tuesday to Friday will automatically match Monday.</span>
        </div>
        </label>
        {/* Days List */}
        <div className="flex flex-col gap-3">
        {/* Monday (Expanded) */}
        <div className="rounded-3xl border border-primary-emerald/30 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] overflow-hidden bg-white">
        <div className="p-4 flex items-center justify-between border-b border-sb-border bg-slate-50">
        <div className="text-[13px] font-bold text-primary-emerald">Monday</div>
        <div className="flex items-center gap-3">
        <span className="text-[13px] font-bold text-primary-emerald">08:00 AM - 07:00 PM</span>
        <span className="material-symbols-outlined text-primary-emerald text-xl transition-transform rotate-180">expand_more</span>
        </div>
        </div>
        <div className="p-4 flex flex-col gap-4 bg-white">
        <div className="flex items-center justify-between">
        <span className="text-[13px] font-bold text-sb-primary-text">Status</span>
        <div className="flex items-center gap-2">
        <span className="text-[13px] font-bold text-primary-emerald">Open</span>
        <label className="relative inline-flex items-center cursor-pointer">
        <input defaultChecked className="sr-only peer" style={{ color: "#16C47F", "--tw-ring-color": "#16C47F" } as React.CSSProperties} type="checkbox" />
        <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-emerald shadow-inner after:shadow-sm"></div>
        </label>
        </div>
        </div>
        <div className="flex items-center gap-3">
        <div className="flex-1">
        <label className="block text-[11px] font-semibold text-sb-secondary-text mb-1">Start Time</label>
        <input className="w-full bg-slate-50 rounded-xl border border-sb-border px-3 py-2 text-[13px] font-medium text-sb-primary-text focus:ring-1 focus:ring-primary-emerald focus:border-primary-emerald outline-none transition-all" type="time" defaultValue="08:00" />
        </div>
        <span className="text-sb-secondary-text mt-5">-</span>
        <div className="flex-1">
        <label className="block text-[11px] font-semibold text-sb-secondary-text mb-1">End Time</label>
        <input className="w-full bg-slate-50 rounded-xl border border-sb-border px-3 py-2 text-[13px] font-medium text-sb-primary-text focus:ring-1 focus:ring-primary-emerald focus:border-primary-emerald outline-none transition-all" type="time" defaultValue="19:00" />
        </div>
        </div>
        </div>
        </div>
        {/* Tuesday-Friday (Grouped/Matched) */}
        <div className="rounded-2xl border border-sb-border overflow-hidden bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
        <div className="p-4 flex items-center justify-between">
        <div className="text-[13px] font-bold text-sb-primary-text">Tue - Fri</div>
        <div className="flex items-center gap-3">
        <span className="text-[11px] font-bold text-sb-secondary-text bg-slate-50 px-2.5 py-1 rounded-lg border border-sb-border">Matches Monday</span>
        </div>
        </div>
        </div>
        {/* Saturday (Collapsed) */}
        <div className="rounded-2xl border border-sb-border overflow-hidden bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] cursor-pointer hover:bg-slate-50 transition-colors">
        <div className="p-4 flex items-center justify-between">
        <div className="text-[13px] font-bold text-sb-primary-text">Saturday</div>
        <div className="flex items-center gap-3">
        <span className="text-[13px] font-medium text-sb-secondary-text">09:00 AM - 05:00 PM</span>
        <span className="material-symbols-outlined text-sb-secondary-text text-xl">expand_more</span>
        </div>
        </div>
        </div>
        {/* Sunday (Collapsed/Closed) */}
        <div className="rounded-2xl border border-sb-border overflow-hidden bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] cursor-pointer hover:bg-slate-50 transition-colors">
        <div className="p-4 flex items-center justify-between">
        <div className="text-[13px] font-bold text-sb-secondary-text">Sunday</div>
        <div className="flex items-center gap-3">
        <span className="text-[11px] font-bold text-sb-secondary-text uppercase bg-slate-50 px-2.5 py-1 rounded-lg border border-sb-border border-dashed">Closed</span>
        <span className="material-symbols-outlined text-sb-secondary-text text-xl">expand_more</span>
        </div>
        </div>
        </div>
        </div>
        </section>
        </main>
        {/* Fixed Bottom Actions */}
        <div className="fixed bottom-0 left-0 w-full z-40 bg-white border-t border-sb-border p-4 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.02)]" style={{ maxWidth: "inherit", left: "inherit" }}>
        <div className="flex flex-col gap-3">
        <button className="w-full bg-primary-emerald hover:bg-primary-emerald/90 text-white text-[13px] font-bold py-3 px-4 rounded-xl shadow-sm transition-colors active:scale-[0.98]">
                            Save Changes
                        </button>
        <button className="w-full bg-transparent border border-sb-border text-sb-secondary-text hover:text-sb-primary-text text-[13px] font-bold py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors active:scale-[0.98]">
                            Cancel
                        </button>
        </div>
        </div>
        </div>
      </div>
    </>
  );
}
