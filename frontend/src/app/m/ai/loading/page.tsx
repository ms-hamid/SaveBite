import React from "react";

export default function SmartSellingWithAiAnalyzingRefinedPage() {
  return (
    <>
      <title>AI Forecast - Analyzing</title>
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script id="tailwind-config" dangerouslySetInnerHTML={{ __html: `tailwind.config = {
                  darkMode: "class",
                  theme: {
                      extend: {
                          colors: {
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
                          borderRadius: {
                              "DEFAULT": "0.25rem",
                              "lg": "0.5rem",
                              "xl": "0.75rem",
                              "full": "9999px"
                          },
                          spacing: {
                              "stack-gap-md": "1rem",
                              "stack-gap-sm": "0.5rem",
                              "item-gap-lg": "1.5rem",
                              "section-margin": "2rem",
                              "container-padding": "1.25rem"
                          },
                          fontFamily: {
                              "label-sm": ["Plus Jakarta Sans"],
                              "h2": ["Plus Jakarta Sans"],
                              "caption": ["Plus Jakarta Sans"],
                              "body-lg": ["Plus Jakarta Sans"],
                              "price-display": ["Plus Jakarta Sans"],
                              "h1": ["Plus Jakarta Sans"],
                              "body-md": ["Plus Jakarta Sans"]
                          },
                          fontSize: {
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
      <style dangerouslySetInnerHTML={{ __html: `.pulse-ring {
                  animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
              }
              @keyframes pulse-ring {
                  0% { transform: scale(0.8); opacity: 0.5; }
                  100% { transform: scale(1.5); opacity: 0; }
              }
              .bounce-step {
                  animation: bounce-step 1.5s infinite;
              }
              .bounce-step:nth-child(2) { animation-delay: 0.2s; }
              .bounce-step:nth-child(3) { animation-delay: 0.4s; }
              @keyframes bounce-step {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-4px); }
              }` }} />
      <style dangerouslySetInnerHTML={{ __html: `body {
            min-height: max(884px, 100dvh);
          }` }} />
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport" />
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet" />
      <div className={"bg-white text-on-surface font-body-md min-h-screen flex flex-col items-center justify-center p-container-padding max-w-[448px] mx-auto overflow-hidden"}>
        <main className="flex-1 w-full flex flex-col items-center justify-center text-center">
        {/* Header Text */}
        <div className="mb-12">
        <h1 className="font-h1 text-h1 text-on-surface mb-2">Analyzing your store...</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">We're building your first prediction</p>
        </div>
        {/* Central Animation */}
        <div className="relative w-48 h-48 flex items-center justify-center mb-16">
        {/* Pulsing background circles */}
        <div className="absolute inset-0 bg-[#E8F3EE] rounded-full pulse-ring"></div>
        <div className="absolute inset-4 bg-[#D1E8DD] rounded-full pulse-ring" style={{ animationDelay: "0.5s" }}></div>
        {/* Central Icon Container */}
        <div className="relative z-10 w-24 h-24 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center justify-center border border-gray-100">
        <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            auto_graph
                        </span>
        </div>
        {/* Floating Data Points */}
        <div className="absolute top-0 right-4 w-6 h-6 bg-tertiary-container rounded-full shadow-sm flex items-center justify-center bounce-step">
        <span className="material-symbols-outlined text-on-tertiary-container text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
        </div>
        <div className="absolute bottom-4 left-0 w-8 h-8 bg-secondary-fixed rounded-full shadow-sm flex items-center justify-center bounce-step">
        <span className="material-symbols-outlined text-on-secondary-fixed text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
        </div>
        <div className="absolute bottom-8 right-0 w-5 h-5 bg-primary-fixed-dim rounded-full shadow-sm flex items-center justify-center bounce-step">
        <span className="material-symbols-outlined text-on-primary-fixed text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>timeline</span>
        </div>
        </div>
        {/* Progress Indicator & Subtext */}
        <div className="flex flex-col items-center gap-stack-gap-md">
        <div className="flex gap-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
        <div className="w-2 h-2 rounded-full bg-primary/50 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
        <div className="w-2 h-2 rounded-full bg-primary/20 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant font-medium">This may take a few seconds</p>
        </div>
        </main>
        {/* Bottom Footer Note */}
        <footer className="mt-auto w-full text-center pb-8 pt-4">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200">
        <span className="material-symbols-outlined text-primary text-[16px]">psychology</span>
        <span className="font-label-sm text-label-sm text-on-surface-variant">You'll get smarter predictions over time</span>
        </div>
        </footer>
      </div>
    </>
  );
}
