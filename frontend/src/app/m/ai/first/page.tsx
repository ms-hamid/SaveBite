import React from "react";

export default function SmartSellingWithAiSetupRefinedPage() {
  return (
    <>
      <title>AI Data Setup - SaveBite</title>
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script id="tailwind-config" dangerouslySetInnerHTML={{ __html: `tailwind.config = {
                  darkMode: "class",
                  theme: {
                      extend: {
                          "colors": {
                              "primary-fixed-dim": "#50dea3",
                              "tertiary-fixed": "#ffdad7",
                              "surface-container-highest": "#dde4dd",
                              "secondary": "#386850",
                              "primary-fixed": "#70fbbd",
                              "on-surface-variant": "#3c4a42",
                              "surface-variant": "#dde4dd",
                              "inverse-on-surface": "#ebf3eb",
                              "surface-container-low": "#eef6ee",
                              "surface-container": "#e8f0e9",
                              "on-tertiary-fixed-variant": "#842325",
                              "on-error": "#ffffff",
                              "primary": "#006c49",
                              "surface-container-lowest": "#ffffff",
                              "secondary-container": "#b7ebcd",
                              "outline-variant": "#bbcabf",
                              "on-tertiary-container": "#6f1218",
                              "on-surface": "#161d19",
                              "on-tertiary": "#ffffff",
                              "on-secondary": "#ffffff",
                              "tertiary-fixed-dim": "#ffb3af",
                              "secondary-fixed-dim": "#9fd2b4",
                              "on-background": "#161d19",
                              "outline": "#6c7a71",
                              "on-tertiary-fixed": "#410006",
                              "on-primary": "#ffffff",
                              "error-container": "#ffdad6",
                              "inverse-primary": "#50dea3",
                              "surface-tint": "#006c49",
                              "on-secondary-fixed": "#002113",
                              "error": "#ba1a1a",
                              "on-primary-fixed-variant": "#005236",
                              "inverse-surface": "#2b322d",
                              "tertiary-container": "#f97a77",
                              "primary-container": "#10b77f",
                              "on-primary-container": "#00402a",
                              "surface-bright": "#f4fbf4",
                              "background": "#f4fbf4",
                              "surface": "#f4fbf4",
                              "secondary-fixed": "#baeed0",
                              "on-secondary-fixed-variant": "#1f4f39",
                              "on-error-container": "#93000a",
                              "on-primary-fixed": "#002113",
                              "tertiary": "#a43a3b",
                              "surface-dim": "#d4dcd5",
                              "on-secondary-container": "#3c6c54",
                              "surface-container-high": "#e3eae3"
                          },
                          "borderRadius": {
                              "DEFAULT": "0.25rem",
                              "lg": "0.5rem",
                              "xl": "0.75rem",
                              "full": "9999px"
                          },
                          "spacing": {
                              "stack-gap-md": "1rem",
                              "stack-gap-sm": "0.5rem",
                              "item-gap-lg": "1.5rem",
                              "section-margin": "2rem",
                              "container-padding": "1.25rem"
                          },
                          "fontFamily": {
                              "label-sm": ["Plus Jakarta Sans"],
                              "h2": ["Plus Jakarta Sans"],
                              "caption": ["Plus Jakarta Sans"],
                              "body-lg": ["Plus Jakarta Sans"],
                              "price-display": ["Plus Jakarta Sans"],
                              "h1": ["Plus Jakarta Sans"],
                              "body-md": ["Plus Jakarta Sans"]
                          },
                          "fontSize": {
                              "label-sm": ["12px", { "lineHeight": "16px", "fontWeight": "600" }],
                              "h2": ["18px", { "lineHeight": "24px", "fontWeight": "700" }],
                              "caption": ["10px", { "lineHeight": "14px", "fontWeight": "500" }],
                              "body-lg": ["16px", { "lineHeight": "22px", "fontWeight": "500" }],
                              "price-display": ["20px", { "lineHeight": "1", "fontWeight": "700" }],
                              "h1": ["24px", { "lineHeight": "32px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
                              "body-md": ["14px", { "lineHeight": "20px", "fontWeight": "400" }]
                          }
                      }
                  }
              }` }} />
      <style dangerouslySetInnerHTML={{ __html: `.material-symbols-outlined {
                  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
              }
              /* Custom scrollbar for horizontal lists */
              .hide-scrollbar::-webkit-scrollbar {
                  display: none;
              }
              .hide-scrollbar {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
              }` }} />
      <style dangerouslySetInnerHTML={{ __html: `body {
            min-height: max(884px, 100dvh);
          }` }} />
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet" />
      <div className={"bg-white text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900"}>
        <div className="max-w-[448px] mx-auto min-h-[884px] bg-white relative flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* TopAppBar (From JSON, adapted for contextual back action) */}
        <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm flex justify-between items-center h-16 px-5 max-w-[448px] mx-auto">
        <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-50 transition-colors active:scale-95 duration-150 ease-in-out text-slate-700">
        <span className="material-symbols-outlined" data-icon="arrow_back">arrow_back</span>
        </button>
        <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-lg tracking-tight text-slate-900">AI Forecast</h1><div className="w-10"></div>
        </header>
        {/* Main Content */}
        <main className="flex-1 px-container-padding pt-24 pb-32 flex flex-col gap-section-margin pb-44">
        {/* Page Header */}
        <div className="flex items-center gap-1.5 mb-2">
        <span className="material-symbols-outlined text-[16px] text-emerald-500" data-icon="psychology">psychology</span>
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600/80">Powered by AI</span>
        </div><div className="flex flex-col gap-2">
        <h2 className="font-h1 text-h1 text-slate-900">Help us understand your store</h2>
        <p className="font-body-md text-body-md text-slate-500">Collect basic signals for prediction.</p>
        </div>
        {/* Content Area (Cards) */}
        <div className="flex flex-col gap-stack-md">
        {/* Section 1: Upload Data */}
        <section className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col gap-4">
        <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
        <h3 className="font-h2 text-h2 text-slate-800"><span className="material-symbols-outlined text-[18px] text-emerald-500 align-middle mr-1" data-icon="auto_awesome">auto_awesome</span>Past sales data <span className="text-slate-400 font-normal text-sm">(optional)</span></h3>
        <p className="font-body-md text-body-md text-slate-500">Upload historical data for faster AI learning.</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
        <span className="material-symbols-outlined" data-icon="upload_file">upload_file</span>
        </div>
        </div>
        <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full border border-slate-200 text-slate-700 font-label-sm text-label-sm hover:bg-slate-50 transition-colors active:scale-[0.99]">
        <span className="material-symbols-outlined text-[18px]" data-icon="upload">upload</span>
                                Upload data
                            </button>
        </section>
        {/* Section 2: Store Behavior Inputs */}
        <section className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col gap-4">
        <h3 className="font-h2 text-h2 text-slate-800"><span className="material-symbols-outlined text-[18px] text-emerald-500 align-middle mr-1" data-icon="auto_awesome">auto_awesome</span>When do you usually have unsold food?</h3>
        <div className="flex flex-wrap gap-2">
        <button className="px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-600 font-label-sm text-label-sm hover:bg-slate-50 transition-colors">
                                    Afternoon
                                </button>
        <button className="px-4 py-2 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 font-label-sm text-label-sm shadow-sm">
                                    Evening
                                </button>
        <button className="px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-600 font-label-sm text-label-sm hover:bg-slate-50 transition-colors">
                                    Late night
                                </button>
        </div>
        </section>
        {/* Section 3: Frequency Dropdown */}
        <section className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col gap-4">
        <h3 className="font-h2 text-h2 text-slate-800"><span className="material-symbols-outlined text-[18px] text-emerald-500 align-middle mr-1" data-icon="auto_awesome">auto_awesome</span>How often do you have surplus?</h3>
        <div className="relative">
        <button className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 font-body-md text-body-md hover:border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-100">
        <span>Daily</span>
        <span className="material-symbols-outlined text-slate-400" data-icon="keyboard_arrow_down">keyboard_arrow_down</span>
        </button>
        </div>
        </section>
        {/* Section 4: Toggle */}
        <section className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center justify-between">
        <div className="flex flex-col gap-0.5 pr-4">
        <span className="font-body-md text-body-md text-slate-800 font-semibold">Allow automatic learning from orders</span>
        <span className="font-caption text-caption text-slate-500">Improves prediction accuracy over time.</span>
        </div>
        {/* Toggle Switch (ON state) */}
        <button aria-checked="true" className="relative inline-flex h-6 w-11 items-center rounded-full bg-emerald-400 transition-colors focus:outline-none flex-shrink-0" role="switch">
        <span className="inline-block h-5 w-5 translate-x-5 transform rounded-full bg-white shadow-sm transition-transform"></span>
        </button>
        </section>
        </div>
        </main>
        {/* Fixed Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 max-w-[448px] mx-auto p-container-padding bg-gradient-to-t from-white via-white to-transparent pt-10 z-40 pb-20">
        <button className="w-full bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-body-lg text-body-lg py-4 px-6 rounded-full flex justify-center items-center gap-2 shadow-[0_4px_14px_0_rgba(16,183,127,0.25)] hover:from-emerald-500 hover:to-emerald-600 active:scale-[0.98] transition-all">
                        Continue
                        <span className="material-symbols-outlined text-[20px]" data-icon="arrow_forward">arrow_forward</span>
        </button>
        </div><nav className="fixed bottom-0 w-full z-50 border-t rounded-t-xl border-t border-slate-100 bg-white/95 backdrop-blur-sm shadow-[0_-4px_12px_0_rgba(0,0,0,0.03)]">
        <div className="fixed bottom-0 left-0 right-0 h-16 flex justify-around items-center px-2 max-w-[448px] mx-auto">
        {/* Home */}
        <button className="flex flex-col items-center justify-center w-16 group text-slate-400">
        <span className="material-symbols-outlined mb-1 active:scale-90 transition-transform duration-200 group-hover:text-[#10b77f]">dashboard</span>
        <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase tracking-wider">Home</span>
        </button>
        {/* Stock */}
        <button className="flex flex-col items-center justify-center text-slate-400 w-16 group hover:text-[#10b77f] transition-all">
        <span className="material-symbols-outlined mb-1 active:scale-90 transition-transform duration-200">inventory_2</span>
        <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase tracking-wider">Listings</span>
        </button>
        {/* AI Hub (Active) */}
        <button className="flex flex-col items-center justify-center w-16 group hover:text-[#10b77f] transition-all text-[#10b77f]">
        <span className="material-symbols-outlined mb-1 active:scale-90 transition-transform duration-200" style={{ fontVariationSettings: "'FILL' 1" }}>auto_graph</span>
        <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase tracking-wider">AI Hub</span>
        </button>
        {/* Orders */}
        <button className="flex flex-col items-center justify-center text-slate-400 w-16 group hover:text-[#10b77f] transition-all">
        <span className="material-symbols-outlined mb-1 active:scale-90 transition-transform duration-200">receipt_long</span>
        <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase tracking-wider">Orders</span>
        </button>
        {/* Store */}
        <button className="flex flex-col items-center justify-center text-slate-400 w-16 group hover:text-[#10b77f] transition-all">
        <span className="material-symbols-outlined mb-1 active:scale-90 transition-transform duration-200">storefront</span>
        <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase tracking-wider">Store</span>
        </button>
        </div>
        </nav>
        </div>
      </div>
    </>
  );
}
