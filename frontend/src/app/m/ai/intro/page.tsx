import React from "react";

export default function SmartSellingWithAiIntroRefinedPage() {
  return (
    <>
      <title>Smart Selling with AI</title>
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
                              "background": "#ffffff",
                              "surface": "#ffffff",
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
      <style dangerouslySetInnerHTML={{ __html: `body { font-family: 'Plus Jakarta Sans', sans-serif; }` }} />
      <style dangerouslySetInnerHTML={{ __html: `body {
            min-height: max(884px, 100dvh);
          }` }} />
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&amp;display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet" />
      <div className={"bg-white text-on-background antialiased selection:bg-primary-container selection:text-on-primary-container"}>
        <div className="max-w-[448px] mx-auto min-h-screen bg-white relative flex flex-col">
        {/* TopAppBar */}
        <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
        <div className="flex justify-between items-center h-16 px-5 max-w-[448px] mx-auto grid grid-cols-[40px_1fr_40px]"><button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-50 transition-colors active:scale-95 duration-150 ease-in-out">
        <span className="material-symbols-outlined text-slate-800">arrow_back</span>
        </button>
        <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-lg tracking-tight text-black text-center">AI Forecast</h1>
        <div className="w-10"></div></div>
        </header>
        {/* Main Content Canvas */}
        <main className="flex-1 px-container-padding flex flex-col mt-20 mb-8 overflow-y-auto">
        {/* Hero Illustration */}
        <div className="w-full aspect-[4/3] rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden shadow-sm relative mb-section-margin">
        <img alt="Smart Selling with AI Illustration" className="w-full h-full object-cover" data-alt="minimal modern digital illustration showing an upward trending data graph with subtle abstract food icons and a glowing bright spark symbol in soft green tones on an off-white background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgmu7txU6ruFZ3atWaPf7u3w_82Z7Lg-J56yi1sSLRFz8fNZMN7_If3h_6pjeVbft9Wx1CB-FBafUEwC6UQglyf-8ykUsFqnXCyZeWDNQPtGI8znWa5q39vNPzS2w_FxXr_y1WUqcyQ-VACfPv0DzHvbBhGHapOD6tjlVKP0Yc5g1O6zszF2x-dHvCtoV_G6-v1EKzmesMoACSEbNC43P80GgJyPFBDj2w_QqqSTuDT5MVFBEMwxWu6JpYLO0LldgsSgmJ0bV2to7e" />
        {/* Floating Icon Badge */}
        <div className="absolute bottom-4 right-4 bg-white rounded-xl p-3 shadow-md flex items-center gap-2">
        <span className="material-symbols-outlined text-[#10b77f]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
        <span className="font-h2 text-h2 text-slate-800">94%</span>
        </div>
        </div>
        {/* Header Text */}
        <div className="flex items-center gap-1.5 mb-2">
        <span className="material-symbols-outlined text-primary" style={{ fontSize: "14px", fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
        <span className="text-[10px] font-bold tracking-[0.1em] text-primary uppercase">Powered by AI</span>
        </div><h2 className="font-h1 text-h1 text-slate-900 mb-stack-gap-sm">Let AI predict your surplus</h2>
        <p className="font-body-lg text-body-lg text-slate-600 mb-section-margin">We analyze your sales patterns to predict when you'll have unsold food — so you can prepare and sell it in advance.</p>
        {/* Benefits List */}
        <div className="flex flex-col gap-item-gap-lg mb-section-margin">
        <div className="flex gap-stack-gap-md items-start">
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
        <span className="material-symbols-outlined text-slate-600">auto_graph</span>
        </div>
        <div className="pt-2"><span className="material-symbols-outlined text-primary mr-1 inline-block align-middle" style={{ fontSize: "16px" }}>auto_awesome</span>
        <p className="font-body-md text-body-md text-slate-700 font-medium">Know when surplus will happen</p>
        </div>
        </div>
        <div className="flex gap-stack-gap-md items-start">
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
        <span className="material-symbols-outlined text-slate-600">task_alt</span>
        </div>
        <div className="pt-2"><span className="material-symbols-outlined text-primary mr-1 inline-block align-middle" style={{ fontSize: "16px" }}>auto_awesome</span>
        <p className="font-body-md text-body-md text-slate-700 font-medium">Increase chances of selling out</p>
        </div>
        </div>
        <div className="flex gap-stack-gap-md items-start">
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
        <span className="material-symbols-outlined text-slate-600">energy_savings_leaf</span>
        </div>
        <div className="pt-2"><span className="material-symbols-outlined text-primary mr-1 inline-block align-middle" style={{ fontSize: "16px" }}>auto_awesome</span>
        <p className="font-body-md text-body-md text-slate-700 font-medium">Reduce food waste automatically</p>
        </div>
        </div>
        </div>
        {/* Subtle Info Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex gap-stack-gap-sm items-start mb-section-margin shadow-sm">
        <span className="material-symbols-outlined text-slate-400 mt-0.5" style={{ fontSize: "18px" }}>insights</span>
        <p className="font-caption text-caption text-slate-600 leading-relaxed">Predictions improve as we learn from your store activity</p>
        </div>
        {/* Spacer to push buttons down if needed on taller screens */}
        <div className="flex-1"></div>
        </main>
        {/* Fixed Action Area */}
        <div className="p-container-padding pt-4 bg-gradient-to-t from-white via-white to-white/0 mt-auto sticky bottom-0 z-40">
        <button className="w-full bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-body-lg text-body-lg py-4 px-6 rounded-full flex justify-center items-center gap-2 shadow-[0_4px_14px_0_rgba(16,183,127,0.25)] hover:from-emerald-500 hover:to-emerald-600 active:scale-[0.98] transition-all mb-stack-gap-sm"><span className="material-symbols-outlined" style={{ fontSize: "20px", fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                        Enable AI Forecasting
                    </button>
        <button className="w-full text-slate-500 font-label-sm text-label-sm py-4 rounded-full text-center active:bg-slate-50 transition-colors">
                        Skip for now
                    </button>
        </div>
        </div>
      </div>
    </>
  );
}
