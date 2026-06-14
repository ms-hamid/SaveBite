import React from "react";

export default function StoreLocationRefinedFocusedPage() {
  return (
    <>
      <title>Store Location</title>
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script id="tailwind-config" dangerouslySetInnerHTML={{ __html: `tailwind.config = {
                darkMode: "class",
                theme: {
                  extend: {
                    "colors": {
                            "secondary-fixed": "#d5e3fd",
                            "inverse-primary": "#50dea3",
                            "surface-container-highest": "#dde4dd",
                            "on-primary-container": "#00402a",
                            "on-secondary-fixed-variant": "#3a485c",
                            "on-primary-fixed-variant": "#005236",
                            "background": "#f4fbf4",
                            "surface-variant": "#dde4dd",
                            "outline-variant": "#bbcabf",
                            "tertiary-container": "#f97a77",
                            "secondary-container": "#d5e3fd",
                            "surface": "#f4fbf4",
                            "on-surface-variant": "#3c4a42",
                            "secondary-fixed-dim": "#b9c7e0",
                            "on-tertiary-container": "#6f1218",
                            "primary": "#006c49",
                            "tertiary": "#a43a3b",
                            "on-tertiary": "#ffffff",
                            "on-primary-fixed": "#002113",
                            "surface-container-low": "#eef6ee",
                            "error": "#ba1a1a",
                            "surface-dim": "#d4dcd5",
                            "tertiary-fixed-dim": "#ffb3af",
                            "on-surface": "#161d19",
                            "error-container": "#ffdad6",
                            "on-secondary-container": "#57657b",
                            "surface-container": "#e8f0e9",
                            "on-error-container": "#93000a",
                            "surface-tint": "#006c49",
                            "surface-container-high": "#e3eae3",
                            "surface-bright": "#f4fbf4",
                            "primary-fixed": "#70fbbd",
                            "on-secondary-fixed": "#0d1c2f",
                            "on-tertiary-fixed": "#410006",
                            "secondary": "#515f74",
                            "on-tertiary-fixed-variant": "#842325",
                            "primary-fixed-dim": "#50dea3",
                            "primary-container": "#10b77f",
                            "tertiary-fixed": "#ffdad7",
                            "inverse-on-surface": "#ebf3eb",
                            "on-error": "#ffffff",
                            "outline": "#6c7a71",
                            "surface-container-lowest": "#ffffff",
                            "inverse-surface": "#2b322d",
                            "on-primary": "#ffffff",
                            "on-secondary": "#ffffff",
                            "on-background": "#161d19"
                    },
                    "borderRadius": {
                            "DEFAULT": "0.25rem",
                            "lg": "0.5rem",
                            "xl": "0.75rem",
                            "full": "9999px"
                    },
                    "spacing": {
                            "stack-gap-sm": "0.5rem",
                            "section-gap": "2rem",
                            "stack-gap-md": "1rem",
                            "container-padding": "1.25rem",
                            "card-gap": "0.75rem",
                            "inline-gap": "0.5rem"
                    },
                    "fontFamily": {
                            "headline-section": [
                                    "Plus Jakarta Sans"
                            ],
                            "body-base": [
                                    "Plus Jakarta Sans"
                            ],
                            "display-metric": [
                                    "Plus Jakarta Sans"
                            ],
                            "label-small": [
                                    "Plus Jakarta Sans"
                            ],
                            "label-caps": [
                                    "Plus Jakarta Sans"
                            ]
                    },
                    "fontSize": {
                            "headline-section": [
                                    "18px",
                                    {
                                            "lineHeight": "1.4",
                                            "letterSpacing": "-0.02em",
                                            "fontWeight": "700"
                                    }
                            ],
                            "body-base": [
                                    "14px",
                                    {
                                            "lineHeight": "1.5",
                                            "fontWeight": "400"
                                    }
                            ],
                            "display-metric": [
                                    "20px",
                                    {
                                            "lineHeight": "1.2",
                                            "fontWeight": "700"
                                    }
                            ],
                            "label-small": [
                                    "10px",
                                    {
                                            "lineHeight": "1",
                                            "fontWeight": "500"
                                    }
                            ],
                            "label-caps": [
                                    "11px",
                                    {
                                            "lineHeight": "1",
                                            "letterSpacing": "0.05em",
                                            "fontWeight": "600"
                                    }
                            ]
                    }
            },
                },
              }` }} />
      <style dangerouslySetInnerHTML={{ __html: `body {
                  -webkit-tap-highlight-color: transparent;
              }
              /* Custom scrollbar to match aesthetic */
              ::-webkit-scrollbar {
                  width: 4px;
              }
              ::-webkit-scrollbar-track {
                  background: transparent;
              }
              ::-webkit-scrollbar-thumb {
                  background: #dde4dd;
                  border-radius: 4px;
              }` }} />
      <style dangerouslySetInnerHTML={{ __html: `body {
            min-height: max(884px, 100dvh);
          }` }} />
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport" />
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&amp;display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet" />
      <div className={"text-on-background font-body-base antialiased max-w-[448px] mx-auto min-h-screen relative flex flex-col bg-white"}>
        {/* TopAppBar */}
        <header className="dark:bg-surface-dim/95 dark:text-primary-fixed-dim font-headline-section text-headline-section font-bold docked full-width top-0 backdrop-blur-xl border-b border-outline-variant dark:border-outline transition-all duration-200 fixed top-0 left-0 w-full z-50 flex items-center px-container-padding h-16 max-w-[448px] mx-auto right-0 bg-white/95 text-neutral-900">
        <button aria-label="Go back" className="mr-4 hover:bg-surface-container-highest/50 dark:hover:bg-surface-container-highest/20 rounded-full p-2 -ml-2 flex items-center justify-center transition-colors">
        <span className="material-symbols-outlined" data-icon="arrow_back">arrow_back</span>
        </button>
        <h1 className="font-headline-section text-headline-section dark:text-primary-fixed-dim m-0 text-neutral-900">Business Settings</h1>
        </header>
        {/* Main Content Canvas */}
        <main className="flex-grow pt-[80px] pb-[100px] px-container-padding flex flex-col gap-section-gap">
        {/* Header Text */}
        <div>
        <h2 className="font-display-metric text-display-metric mb-2 text-neutral-900">Store Location</h2>
        <p className="font-body-base text-body-base text-on-surface-variant">Update where customers can find your surplus inventory.</p>
        </div>
        {/* Map Preview Card */}
        <div className="relative w-full rounded-xl border shadow-sm overflow-hidden group bg-white border-white h-[130px]">
        {/* Map Placeholder Image */}
        <img alt="Map" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="A clean, modern top-down street map view showing city blocks and a prominent emerald green location pin marker. The map uses a light, minimal color palette with soft gray roads and subtle green park areas, perfectly matching a corporate modern, eco-friendly app aesthetic." data-location="New York" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDY7cXcgoTAozhHQlXaQ-9S9NKCFwEeg0sN49Qi-2rv-MdIdV7Itb50OX8HtMnIwIG_2RTA8N20-kWMbNoiJ_NxbIydVKBQKJlRUwEA3CzhIdbFArD8gRTUL6uWjZ5uMAx4obX4uBkFnay8o0F2UoP7Pv--zHJB9vQAqIVHq8l2CvZGvTJw3hZa65e60wKk5kgsc1f3mujanysqT9sWbWd4q1DkTYT8Xb-jHfwddN4B-aQ4tdQ_uJSDhR2bi9WYAY2Wb3XkDq0SKb9B" />
        {/* Map Pin Overlay (Simulated) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative -mt-6">
        <span className="material-symbols-outlined text-[40px]" data-icon="location_on" style={{ fontVariationSettings: "'FILL' 1", color: "#10b77f" }}>location_on</span>
        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-full animate-ping scale-150" style={{ backgroundColor: "rgba(16, 183, 127, 0.2)" }}></div>
        </div>
        </div>
        {/* Floating action button on map */}
        </div><button className="mt-4 flex items-center gap-2 text-body-base font-body-base font-semibold transition-colors active:scale-95" style={{ color: "#10b77f" }}><span className="material-symbols-outlined text-[18px]" data-icon="my_location" style={{ fontVariationSettings: "'FILL' 1", color: "#10b77f" }}>my_location</span>Use current location</button>
        {/* Form Fields */}
        <div className="bg-surface-container-low border border-outline-variant rounded-lg p-4 flex gap-4"><div className="flex-shrink-0 bg-primary-container/20 w-10 h-10 rounded-full flex items-center justify-center"><span className="material-symbols-outlined text-primary" data-icon="location_on">location_on</span></div><div className="flex flex-col"><span className="font-bold text-on-surface">GreenHarvest Co.</span><span className="text-body-base text-on-surface-variant">123 Eco-Market Blvd</span><span className="text-body-base text-on-surface-variant">Metropolis, 10001</span></div></div><form className="flex flex-col gap-stack-gap-md">
        <div className="flex flex-col gap-1">
        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider" htmlFor="address">Store Address</label>
        <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className="material-symbols-outlined text-outline" data-icon="storefront">storefront</span>
        </div>
        <input className="w-full pl-10 pr-4 py-3 border rounded-lg font-body-base text-body-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow placeholder:text-outline/50 bg-white border-neutral-200 text-neutral-900" id="address" name="address" placeholder="e.g. 123 Main St" type="text" defaultValue="123 Eco-Market Blvd" />
        </div>
        </div>
        <div className="grid grid-cols-2 gap-stack-gap-md">
        <div className="flex flex-col gap-1">
        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider" htmlFor="city">City</label>
        <input className="w-full px-4 py-3 border rounded-lg font-body-base text-body-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow placeholder:text-outline/50 bg-white border-neutral-200 text-neutral-900" id="city" name="city" type="text" defaultValue="Metropolis" />
        </div>
        <div className="flex flex-col gap-1">
        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider" htmlFor="postal">Postal Code</label>
        <input className="w-full px-4 py-3 border rounded-lg font-body-base text-body-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow placeholder:text-outline/50 bg-white border-neutral-200 text-neutral-900" id="postal" name="postal" type="text" defaultValue="10001" />
        </div>
        </div>
        {/* Additional Details */}
        </form>
        </main>
        {/* Fixed Footer Action */}
        <div className="fixed bottom-0 left-0 w-full z-40 backdrop-blur-xl border-t border-outline-variant max-w-[448px] mx-auto right-0 px-container-padding py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] bg-white/95">
        <button className="w-full text-on-primary font-headline-section text-headline-section font-bold py-4 rounded-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-sm" style={{ backgroundColor: "#10b77f" }}>
                    Save Location
                </button>
        </div>
      </div>
    </>
  );
}
