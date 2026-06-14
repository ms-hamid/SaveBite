import React from "react";

export default function PaymentSettingsRefinedStylePage() {
  return (
    <>
      <title>Payment Settings</title>
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
                                  "background": "#ffffff",
                                  "surface-variant": "#dde4dd",
                                  "outline-variant": "#e5e7eb",
                                  "tertiary-container": "#f97a77",
                                  "secondary-container": "#d5e3fd",
                                  "surface": "#ffffff",
                                  "on-surface-variant": "#4b5563",
                                  "secondary-fixed-dim": "#b9c7e0",
                                  "on-tertiary-container": "#6f1218",
                                  "primary": "#10b77f",
                                  "tertiary": "#a43a3b",
                                  "on-tertiary": "#ffffff",
                                  "on-primary-fixed": "#002113",
                                  "surface-container-low": "#ffffff",
                                  "error": "#ba1a1a",
                                  "surface-dim": "#d4dcd5",
                                  "tertiary-fixed-dim": "#ffb3af",
                                  "on-surface": "#171717",
                                  "error-container": "#ffdad6",
                                  "on-secondary-container": "#57657b",
                                  "surface-container": "#f9fafb",
                                  "on-error-container": "#93000a",
                                  "surface-tint": "#10b77f",
                                  "surface-container-high": "#e3eae3",
                                  "surface-bright": "#ffffff",
                                  "primary-fixed": "#70fbbd",
                                  "on-secondary-fixed": "#0d1c2f",
                                  "on-tertiary-fixed": "#410006",
                                  "secondary": "#515f74",
                                  "on-tertiary-fixed-variant": "#842325",
                                  "primary-fixed-dim": "#50dea3",
                                  "primary-container": "#f0fdf4",
                                  "tertiary-fixed": "#ffdad7",
                                  "inverse-on-surface": "#ebf3eb",
                                  "on-error": "#ffffff",
                                  "outline": "#d1d5db",
                                  "surface-container-lowest": "#ffffff",
                                  "inverse-surface": "#2b322d",
                                  "on-primary": "#ffffff",
                                  "on-secondary": "#ffffff",
                                  "on-background": "#171717"
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
                                  "headline-section": ["Plus Jakarta Sans"],
                                  "body-base": ["Plus Jakarta Sans"],
                                  "display-metric": ["Plus Jakarta Sans"],
                                  "label-small": ["Plus Jakarta Sans"],
                                  "label-caps": ["Plus Jakarta Sans"]
                          },
                          "fontSize": {
                                  "headline-section": ["18px", {"lineHeight": "1.4", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                                  "body-base": ["14px", {"lineHeight": "1.5", "fontWeight": "400"}],
                                  "display-metric": ["20px", {"lineHeight": "1.2", "fontWeight": "700"}],
                                  "label-small": ["10px", {"lineHeight": "1", "fontWeight": "500"}],
                                  "label-caps": ["11px", {"lineHeight": "1", "letterSpacing": "0.05em", "fontWeight": "600"}]
                          }
                      }
                  }
              }` }} />
      <style dangerouslySetInnerHTML={{ __html: `body { font-family: 'Plus Jakarta Sans', sans-serif; }
              .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
              .material-symbols-outlined.fill { font-variation-settings: 'FILL' 1; }
              
              /* Custom Checkbox/Radio Styles */
              .form-radio:checked {
                  background-color: #10b77f;
                  border-color: #10b77f;
              }` }} />
      <style dangerouslySetInnerHTML={{ __html: `body {
            min-height: max(884px, 100dvh);
          }` }} />
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&amp;display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet" />
      <div className={"bg-surface text-on-surface min-h-screen w-full max-w-[448px] mx-auto relative overflow-x-hidden antialiased flex flex-col"}>
        {/* TopAppBar JSON Exec */}
        <header className="fixed top-0 left-0 w-full z-50 flex items-center px-container-padding h-16 bg-surface border-b border-outline-variant shadow-none transition-all duration-200">
        <div className="max-w-[448px] mx-auto w-full flex items-center">
        <button aria-label="Go back" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface -ml-2">
        <span className="material-symbols-outlined" data-icon="arrow_back">arrow_back</span>
        </button>
        <h1 className="ml-2 font-headline-section text-headline-section font-bold text-on-surface">Payment Settings</h1>
        </div>
        </header>
        {/* Main Content Canvas */}
        <main className="flex-grow pt-[88px] pb-[100px] px-container-padding flex flex-col gap-section-gap">
        {/* Bank Information Card */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-outline-variant flex items-center gap-2 bg-surface-container">
        <span className="material-symbols-outlined text-on-surface text-[20px]" data-icon="account_balance">account_balance</span>
        <h2 className="font-headline-section text-headline-section text-on-surface">Bank Information</h2>
        </div>
        <div className="p-4 flex flex-col gap-4 bg-surface">
        {/* Dropdown */}
        <div className="flex flex-col gap-1.5">
        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider" htmlFor="bankName">Bank Name</label>
        <div className="relative">
        <select className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 font-body-base text-body-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none transition-colors" id="bankName">
        <option value="">Select a Bank</option>
        <option value="chase">Chase Bank</option>
        <option value="bofa">Bank of America</option>
        <option value="wells">Wells Fargo</option>
        <option value="citi">Citibank</option>
        </select>
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" data-icon="expand_more">expand_more</span>
        </div>
        </div>
        {/* Account Number */}
        <div className="flex flex-col gap-1.5">
        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider" htmlFor="accountNumber">Account Number</label>
        <input className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 font-body-base text-body-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-mono" id="accountNumber" placeholder="Enter Account Number" type="text" defaultValue="**** **** **** 8492" />
        </div>
        {/* Account Holder */}
        <div className="flex flex-col gap-1.5">
        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider" htmlFor="accountHolder">Account Holder Name</label>
        <input className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 font-body-base text-body-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" id="accountHolder" placeholder="Full Name" type="text" defaultValue="SaveBite LLC" />
        </div>
        </div>
        </section>
        {/* Payout Schedule Section */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-outline-variant flex items-center gap-2 bg-surface-container">
        <span className="material-symbols-outlined text-on-surface text-[20px]" data-icon="calendar_month">calendar_month</span>
        <h2 className="font-headline-section text-headline-section text-on-surface">Payout Schedule</h2>
        </div>
        <div className="p-4 flex flex-col gap-3 bg-surface"><label className="flex items-start gap-3 py-2 cursor-pointer transition-colors">
          <input defaultChecked className="form-radio mt-1 h-5 w-5 text-primary border-outline-variant focus:ring-primary" name="payoutSchedule" type="radio" defaultValue="daily" />
          <div className="flex flex-col">
            <span className="font-body-base text-body-base font-semibold text-on-surface">Daily</span>
            <span className="font-label-small text-label-small text-on-surface-variant">Funds arrive in 1-2 business days</span>
          </div>
        </label>
        <div className="h-px bg-outline-variant"></div>
        <label className="flex items-start gap-3 py-2 cursor-pointer transition-colors">
          <input className="form-radio mt-1 h-5 w-5 text-primary border-outline-variant focus:ring-primary" name="payoutSchedule" type="radio" defaultValue="weekly" />
          <div className="flex flex-col">
            <span className="font-body-base text-body-base font-semibold text-on-surface">Weekly</span>
            <span className="font-label-small text-label-small text-on-surface-variant">Every Monday morning</span>
          </div>
        </label>
        <div className="h-px bg-outline-variant"></div>
        <label className="flex items-start gap-3 py-2 cursor-pointer transition-colors">
          <input className="form-radio mt-1 h-5 w-5 text-primary border-outline-variant focus:ring-primary" name="payoutSchedule" type="radio" defaultValue="monthly" />
          <div className="flex flex-col">
            <span className="font-body-base text-body-base font-semibold text-on-surface">Monthly</span>
            <span className="font-label-small text-label-small text-on-surface-variant">1st of every month</span>
          </div>
        </label></div>
        </section>
        {/* Info Box */}
        <div className="bg-primary-container border border-primary/20 rounded-lg p-4 flex gap-3 items-start">
        <span className="material-symbols-outlined text-primary mt-0.5" data-icon="info">info</span>
        <p className="font-body-base text-body-base text-on-surface-variant">Payouts are transferred automatically to your registered bank account.</p>
        </div>
        </main>
        {/* Bottom Action Area (Sticky) */}
        <div className="fixed bottom-0 left-0 w-full bg-surface border-t border-outline-variant p-container-padding z-40">
        <div className="max-w-[448px] mx-auto w-full">
        <button className="w-full bg-primary hover:bg-primary/90 text-on-primary font-headline-section text-headline-section py-3.5 rounded-lg shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2">
        <span className="material-symbols-outlined text-[20px]" data-icon="save">save</span>
                        Save Settings
                    </button>
        </div>
        </div>
      </div>
    </>
  );
}
