"use client";

import type React from "react";
import { useOrder } from "../../../../components/providers/OrderProvider";

const orderStatePages: Record<string, () => React.ReactElement> = {
  accepted: OrderDetailAcceptedStandardizedPage,
  preparing: OrderDetailPreparingStandardizedPage,
  ready: OrderDetailReadyStandardizedPage,
  ready_for_pickup: OrderDetailReadyStandardizedPage,
  completed: OrderCompletedDetailStandardizedPage,
};

export default function OrderDetailPage() {
  const { order } = useOrder();

  const status = String(order?.status ?? "accepted");
  const StatePage = orderStatePages[status] ?? orderStatePages.accepted;

  return <StatePage />;
}

function OrderDetailAcceptedStandardizedPage() {
  return (
    <div className="bg-background text-on-surface antialiased pb-24">

            <style>{`body { font-family: 'Plus Jakarta Sans', sans-serif; min-height: max(884px, 100dvh); }`}</style>

      {/* TopAppBar Component */}
      <header className="bg-surface fixed top-0 w-full z-50 border-b border-outline-variant shadow-sm">
      <div className="flex items-center justify-between px-container-padding h-16 max-w-[448px] mx-auto">
      <button className="flex items-center justify-center p-2 -ml-2 rounded-full hover:bg-background transition-colors">
      <span className="material-symbols-outlined text-on-surface" data-icon="arrow_back">arrow_back</span>
      </button>
      <h1 className="text-[18px] font-semibold text-on-surface">Order #SB-9021</h1>
      <div className="flex items-center">
      <span className="text-[11px] font-semibold tracking-wider bg-secondary-container text-secondary px-2.5 py-1 rounded-full uppercase">Accepted</span>
      </div>
      </div>
      </header>
      {/* Main Content Canvas */}
      <main className="pt-24 px-container-padding max-w-[448px] mx-auto flex flex-col gap-section-gap">{/* Success Banner */}
      <section className="bg-secondary-container/30 border border-secondary-container rounded-xl p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
      <span className="material-symbols-outlined text-secondary" data-icon="receipt" style={{fontVariationSettings: "'FILL' 1"}}>receipt</span>
      </div>
      <div>
      <p className="text-[15px] font-semibold text-on-surface">Order accepted successfully.</p>
      <p className="text-[13px] text-on-surface-variant mt-0.5">Customer order has been accepted and is now waiting for preparation.</p>
      </div>
      </section>
      {/* Customer Info */}
      <section className="flex flex-col gap-2">
      <h2 className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">CUSTOMER</h2>
      <div className="bg-surface border border-outline-variant rounded-xl p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center overflow-hidden shrink-0">
      <img alt="Sarah Jenkins" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoECNzhgIr0tVEQDfXysMc4GBrjXt2Qvg_BTbQGljO-uMlxe44yD9UrjGUl1-Wa_zpcioLtUvKjPhF11VwAf9B_N95pr6gAKRUEbtqVXlzr797RmP7hPQIizZp8PFGFirmF4IkJPB1HYHD5gvyHibJMbu0krTSJufymBoUfxnUu3Po294M20dCSRwAg31MA77hdR2IG7N86PaIS1UPe62B2UAeLYXX-ZrpYBW0TqzVZ8IyWR1c0AZmN2k99zW4nR1M4xLEfCBMexRe" />
      </div>
      <div>
      <h3 className="text-[15px] font-semibold text-on-surface">Sarah Jenkins</h3>
      <p className="text-[13px] text-on-surface-variant flex items-center gap-1 mt-0.5">Customer</p>
      </div>
      </div>
      </div>
      </section>
      {/* Order Items */}
      <section className="flex flex-col gap-2">
      <h2 className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">ORDER ITEMS</h2>
      <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden divide-y divide-outline-variant">
      <div className="p-4 flex justify-between items-start">
      <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded bg-background border border-outline-variant flex items-center justify-center shrink-0 mt-0.5">
      <span className="text-[12px] font-semibold text-on-surface">2x</span>
      </div>
      <div>
      <p className="text-[15px] font-medium text-on-surface">Surplus Pastry Box</p>
      <p className="text-[13px] text-on-surface-variant mt-0.5">Contains assorted daily pastries.</p>
      </div>
      </div>
      <p className="text-[15px] font-semibold text-on-surface">Rp 45.000</p>
      </div>
      <div className="p-4 flex justify-between items-start">
      <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded bg-background border border-outline-variant flex items-center justify-center shrink-0 mt-0.5">
      <span className="text-[12px] font-semibold text-on-surface">1x</span>
      </div>
      <div>
      <p className="text-[15px] font-medium text-on-surface">Large Iced Latte</p>
      <p className="text-[13px] text-on-surface-variant mt-0.5">Oat milk, sugar-free vanilla.</p>
      </div>
      </div>
      <p className="text-[15px] font-semibold text-on-surface">Rp 15.000</p>
      </div>
      </div>
      </section>
      {/* Summary */}
      <div className="flex flex-col gap-2">
      <h2 className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">PAYMENT SUMMARY</h2>
      <div className="bg-surface border border-outline-variant rounded-xl p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center">
      <span className="text-[14px] text-on-surface-variant">Subtotal</span>
      <span className="text-[14px] text-on-surface">Rp 40.000</span>
      </div>
      <div className="flex justify-between items-center">
      <span className="text-[14px] text-on-surface-variant">Platform Fee (5%)</span>
      <span className="text-[14px] text-on-surface">-Rp 2.000</span>
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-outline-variant">
      <span className="text-[15px] font-semibold text-on-surface">Total Payout</span>
      <span className="text-[18px] font-bold text-primary">Rp 38.000</span>
      </div>
      </div>
      </div>
      {/* Timeline */}
      <div className="flex flex-col gap-2">
      <h2 className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">ORDER TIMELINE</h2>
      <div className="bg-surface border border-outline-variant rounded-xl p-5"><div className="relative pl-6 flex flex-col gap-5 before:content-[''] before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant"><div className="relative"><div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-surface z-10"></div><p className="text-[14px] font-medium text-on-surface-variant line-through">Order Placed</p><p className="text-[12px] text-on-surface-variant mt-0.5">17:45</p></div><div className="relative"><div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-surface z-10"></div><p className="text-[14px] font-medium text-on-surface-variant line-through">Order Accepted</p><p className="text-[12px] text-on-surface-variant mt-0.5">18:15</p></div><div className="relative"><div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-outline-variant ring-4 ring-surface z-10"></div><p className="text-[14px] font-medium text-on-surface-variant">Preparing Order</p></div><div className="relative"><div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-outline-variant ring-4 ring-surface z-10"></div><p className="text-[14px] font-medium text-on-surface-variant">Ready for Pickup</p></div><div className="relative"><div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-outline-variant ring-4 ring-surface z-10"></div><p className="text-[14px] font-medium text-on-surface-variant">Picked Up</p></div></div></div>
      </div></main>
      {/* Bottom Sticky Action */}
      <div className="fixed bottom-0 w-full z-50 bg-surface border-t border-outline-variant p-container-padding pb-8">
      <div className="max-w-[448px] mx-auto">
      <button className="w-full bg-primary text-on-primary text-[15px] font-semibold py-3.5 rounded-xl hover:opacity-90 transition-colors flex justify-center items-center gap-2">
                  Start Preparing
              </button>
      </div>
      </div>
    </div>
  );
}

const preparingPageStyle = {
  "--color-background": "255 255 255",
  "--color-border": "229 231 235",
  "--color-border-light": "229 231 235",
  "--color-brand-purple": "139 92 246",
  "--color-brand-purple-light": "245 243 255",
  "--color-custom-bg": "255 255 255",
  "--color-custom-card-border": "229 231 235",
  "--color-custom-primary": "16 185 129",
  "--color-custom-text-primary": "17 24 39",
  "--color-custom-text-secondary": "107 114 128",
  "--color-error": "186 26 26",
  "--color-error-container": "255 218 214",
  "--color-gray-50": "249 250 251",
  "--color-inverse-on-surface": "235 243 235",
  "--color-inverse-primary": "80 222 163",
  "--color-inverse-surface": "43 50 45",
  "--color-on-background": "22 29 25",
  "--color-on-error": "255 255 255",
  "--color-on-error-container": "147 0 10",
  "--color-on-primary": "255 255 255",
  "--color-on-primary-container": "0 64 42",
  "--color-on-primary-fixed": "0 33 19",
  "--color-on-primary-fixed-variant": "0 82 54",
  "--color-on-secondary": "255 255 255",
  "--color-on-secondary-container": "87 101 123",
  "--color-on-secondary-fixed": "13 28 47",
  "--color-on-secondary-fixed-variant": "58 72 92",
  "--color-on-surface": "22 29 25",
  "--color-on-surface-variant": "60 74 66",
  "--color-on-tertiary": "255 255 255",
  "--color-on-tertiary-container": "111 18 24",
  "--color-on-tertiary-fixed": "65 0 6",
  "--color-on-tertiary-fixed-variant": "132 35 37",
  "--color-outline": "108 122 113",
  "--color-outline-variant": "187 202 191",
  "--color-primary": "16 185 129",
  "--color-primary-container": "16 183 127",
  "--color-primary-emerald": "22 196 127",
  "--color-primary-fixed": "112 251 189",
  "--color-primary-fixed-dim": "80 222 163",
  "--color-sb-bg": "247 250 248",
  "--color-sb-border": "234 234 234",
  "--color-sb-primary-text": "17 24 39",
  "--color-sb-secondary-text": "107 114 128",
  "--color-secondary": "81 95 116",
  "--color-secondary-container": "213 227 253",
  "--color-secondary-fixed": "213 227 253",
  "--color-secondary-fixed-dim": "185 199 224",
  "--color-success-green": "16 185 129",
  "--color-success-light": "236 253 245",
  "--color-surface": "255 255 255",
  "--color-surface-bright": "244 251 244",
  "--color-surface-container": "232 240 233",
  "--color-surface-container-high": "227 234 227",
  "--color-surface-container-highest": "221 228 221",
  "--color-surface-container-low": "238 246 238",
  "--color-surface-container-lowest": "255 255 255",
  "--color-surface-dim": "212 220 213",
  "--color-surface-tint": "0 108 73",
  "--color-surface-variant": "221 228 221",
  "--color-tertiary": "164 58 59",
  "--color-tertiary-container": "249 122 119",
  "--color-tertiary-fixed": "255 218 215",
  "--color-tertiary-fixed-dim": "255 179 175",
  "--color-text-primary": "17 24 39",
  "--color-text-secondary": "107 114 128",
  "--font-sans": "Plus Jakarta Sans",
  "--radius-2xl": "1rem",
  "--radius-3xl": "1.5rem",
  "--radius-DEFAULT": "0.25rem",
  "--radius-full": "9999px",
  "--radius-lg": "0.5rem",
  "--radius-xl": "16px",
  "--spacing-card-gap": "16px",
  "--spacing-container-padding": "1.25rem",
  "--spacing-inline-gap": "0.5rem",
  "--spacing-screen-px": "24px",
  "--spacing-section-gap": "24px",
  "--spacing-stack-gap-md": "1rem",
  "--spacing-stack-gap-sm": "0.5rem",
} as React.CSSProperties;

function OrderDetailPreparingStandardizedPage() {
  return (
    <div style={preparingPageStyle} className="bg-gray-50 text-text-primary antialiased pb-28">

      <header className="bg-background fixed top-0 w-full z-50 border-b border-border-light shadow-sm">
        <div className="flex items-center justify-between px-screen-px h-16 max-w-[448px] mx-auto">
          <button className="flex items-center justify-center p-2 -ml-2 rounded-full hover:bg-gray-50 transition-colors">
            <span className="material-symbols-outlined text-text-primary" data-icon="arrow_back">arrow_back</span>
          </button>
          <h1 className="text-[18px] font-semibold text-text-primary">Order #8492</h1>
          <div className="flex items-center">
            <span className="text-[11px] font-semibold tracking-wider bg-amber-100 text-amber-500 px-2.5 py-1 rounded-full uppercase">Preparing</span>
          </div>
        </div>
      </header>
      <main className="pt-24 px-screen-px max-w-[448px] mx-auto flex flex-col gap-section-gap">
        <section className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-amber-500" data-icon="restaurant" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
          </div>
          <div>
            <p className="text-[15px] font-semibold text-text-primary">Preparing order</p>
            <p className="text-[13px] text-text-secondary mt-0.5">Prepare the order before the pickup window begins.</p>
          </div>
        </section>
        <section className="flex flex-col gap-2">
          <h2 className="text-[12px] font-semibold text-text-secondary uppercase tracking-wider">CUSTOMER</h2>
          <div className="bg-background border border-border-light rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-purple-light flex items-center justify-center overflow-hidden shrink-0">
              <img alt="Sarah Jenkins" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoECNzhgIr0tVEQDfXysMc4GBrjXt2Qvg_BTbQGljO-uMlxe44yD9UrjGUl1-Wa_zpcioLtUvKjPhF11VwAf9B_N95pr6gAKRUEbtqVXlzr797RmP7hPQIizZp8PFGFirmF4IkJPB1HYHD5gvyHibJMbu0krTSJufymBoUfxnUu3Po294M20dCSRwAg31MA77hdR2IG7N86PaIS1UPe62B2UAeLYXX-ZrpYBW0TqzVZ8IyWR1c0AZmN2k99zW4nR1M4xLEfCBMexRe" />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-text-primary">Sarah Jenkins</h3>
              <p className="text-[13px] text-text-secondary mt-0.5">Customer</p>
            </div>
          </div>
        </section>
        <section className="flex flex-col gap-2">
          <h2 className="text-[12px] font-semibold text-text-secondary uppercase tracking-wider">ITEMS</h2>
          <div className="bg-background border border-border-light rounded-xl overflow-hidden divide-y divide-border-light">
            <div className="p-4 flex justify-between items-start">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-gray-50 border border-border-light flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[12px] font-semibold text-text-primary">2×</span>
                </div>
                <div>
                  <p className="text-[15px] font-medium text-text-primary">Surplus Pastry Box</p>
                  <p className="text-[13px] text-text-secondary mt-0.5">Assorted day-old pastries.</p>
                </div>
              </div>
              <p className="text-[15px] font-semibold text-text-primary">Rp 30.000</p>
            </div>
            <div className="p-4 flex justify-between items-start">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-gray-50 border border-border-light flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[12px] font-semibold text-text-primary">1×</span>
                </div>
                <div>
                  <p className="text-[15px] font-medium text-text-primary">Large Iced Latte</p>
                  <p className="text-[13px] text-text-secondary mt-0.5">Less sugar.</p>
                </div>
              </div>
              <p className="text-[15px] font-semibold text-text-primary">Rp 10.000</p>
            </div>
          </div>
        </section>
        <section className="flex flex-col gap-2">
          <h2 className="text-[12px] font-semibold text-text-secondary uppercase tracking-wider">PAYMENT SUMMARY</h2>
          <div className="bg-background border border-border-light rounded-xl p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-[14px] text-text-secondary">Subtotal</span>
              <span className="text-[14px] text-text-primary">Rp 40.000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[14px] text-text-secondary">Platform Fee (5%)</span>
              <span className="text-[14px] text-text-primary">-Rp 2.000</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-dashed border-border-light">
              <span className="text-[15px] font-semibold text-text-primary">Total Payout</span>
              <span className="text-[18px] font-bold text-success-green">Rp 38.000</span>
            </div>
          </div>
        </section>
        <section className="flex flex-col gap-2 pb-24">
          <h2 className="text-[12px] font-semibold text-text-secondary uppercase tracking-wider">ORDER TIMELINE</h2>
          <div className="bg-background border border-border-light rounded-xl p-5 overflow-hidden max-h-[280px]">
            <div className="relative pl-6 flex flex-col gap-5 before:content-[''] before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border-light">
              <div className="relative">
                <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-success-green ring-4 ring-background z-10"></div>
                <p className="text-[14px] font-medium text-text-secondary line-through">Order Placed</p>
                <p className="text-[12px] text-text-secondary mt-0.5">18:05</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-success-green ring-4 ring-background z-10"></div>
                <p className="text-[14px] font-medium text-text-secondary line-through">Order Accepted</p>
                <p className="text-[12px] text-text-secondary mt-0.5">18:08</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-background z-10"></div>
                <p className="text-[14px] font-semibold text-text-primary">Preparing Order</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-50 border-2 border-border-light ring-4 ring-background z-10"></div>
                <p className="text-[14px] font-medium text-text-secondary">Ready for Pickup</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-50 border-2 border-border-light ring-4 ring-background z-10"></div>
                <p className="text-[14px] font-medium text-text-secondary">Picked Up</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <div className="fixed bottom-0 w-full z-50 bg-background border-t border-border-light p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-[448px] mx-auto">
          <button className="w-full bg-primary text-on-primary py-3.5 rounded-xl font-semibold text-[16px] hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">inventory_2</span>
            Mark Ready for Pickup
          </button>
        </div>
      </div>

    </div>
  );
}

const readyPageStyle = {
  "--color-background": "255 255 255",
  "--color-border": "229 231 235",
  "--color-border-light": "229 231 235",
  "--color-brand-purple": "139 92 246",
  "--color-brand-purple-light": "245 243 255",
  "--color-custom-bg": "255 255 255",
  "--color-custom-card-border": "229 231 235",
  "--color-custom-primary": "16 185 129",
  "--color-custom-text-primary": "17 24 39",
  "--color-custom-text-secondary": "107 114 128",
  "--color-error": "186 26 26",
  "--color-error-container": "255 218 214",
  "--color-gray-50": "249 250 251",
  "--color-inverse-on-surface": "235 243 235",
  "--color-inverse-primary": "80 222 163",
  "--color-inverse-surface": "43 50 45",
  "--color-on-background": "22 29 25",
  "--color-on-error": "255 255 255",
  "--color-on-error-container": "147 0 10",
  "--color-on-primary": "255 255 255",
  "--color-on-primary-container": "0 64 42",
  "--color-on-primary-fixed": "0 33 19",
  "--color-on-primary-fixed-variant": "0 82 54",
  "--color-on-secondary": "255 255 255",
  "--color-on-secondary-container": "87 101 123",
  "--color-on-secondary-fixed": "13 28 47",
  "--color-on-secondary-fixed-variant": "58 72 92",
  "--color-on-surface": "22 29 25",
  "--color-on-surface-variant": "60 74 66",
  "--color-on-tertiary": "255 255 255",
  "--color-on-tertiary-container": "111 18 24",
  "--color-on-tertiary-fixed": "65 0 6",
  "--color-on-tertiary-fixed-variant": "132 35 37",
  "--color-outline": "108 122 113",
  "--color-outline-variant": "187 202 191",
  "--color-primary": "16 185 129",
  "--color-primary-container": "16 183 127",
  "--color-primary-emerald": "22 196 127",
  "--color-primary-fixed": "112 251 189",
  "--color-primary-fixed-dim": "80 222 163",
  "--color-sb-bg": "247 250 248",
  "--color-sb-border": "234 234 234",
  "--color-sb-primary-text": "17 24 39",
  "--color-sb-secondary-text": "107 114 128",
  "--color-secondary": "81 95 116",
  "--color-secondary-container": "213 227 253",
  "--color-secondary-fixed": "213 227 253",
  "--color-secondary-fixed-dim": "185 199 224",
  "--color-success-green": "16 185 129",
  "--color-success-light": "236 253 245",
  "--color-surface": "255 255 255",
  "--color-surface-bright": "244 251 244",
  "--color-surface-container": "232 240 233",
  "--color-surface-container-high": "227 234 227",
  "--color-surface-container-highest": "221 228 221",
  "--color-surface-container-low": "238 246 238",
  "--color-surface-container-lowest": "255 255 255",
  "--color-surface-dim": "212 220 213",
  "--color-surface-tint": "0 108 73",
  "--color-surface-variant": "221 228 221",
  "--color-tertiary": "164 58 59",
  "--color-tertiary-container": "249 122 119",
  "--color-tertiary-fixed": "255 218 215",
  "--color-tertiary-fixed-dim": "255 179 175",
  "--color-text-primary": "17 24 39",
  "--color-text-secondary": "107 114 128",
  "--font-sans": "Plus Jakarta Sans",
  "--radius-2xl": "1rem",
  "--radius-3xl": "1.5rem",
  "--radius-DEFAULT": "0.25rem",
  "--radius-full": "9999px",
  "--radius-lg": "0.5rem",
  "--radius-xl": "16px",
  "--spacing-card-gap": "16px",
  "--spacing-container-padding": "1.25rem",
  "--spacing-inline-gap": "0.5rem",
  "--spacing-screen-px": "24px",
  "--spacing-section-gap": "24px",
  "--spacing-stack-gap-md": "1rem",
  "--spacing-stack-gap-sm": "0.5rem",
} as React.CSSProperties;

function OrderDetailReadyStandardizedPage() {
  return (
    <div style={readyPageStyle} className="bg-gray-50 text-text-primary antialiased pb-28">

            <style>{`body { font-family: 'Plus Jakarta Sans', sans-serif; }`}</style>

      {/* TopAppBar Component */}
      <header className="bg-background fixed top-0 w-full z-50 border-b border-border-light shadow-sm">
      <div className="flex items-center justify-between px-screen-px h-16 max-w-[448px] mx-auto">
      <button className="flex items-center justify-center p-2 -ml-2 rounded-full hover:bg-gray-50 transition-colors">
      <span className="material-symbols-outlined text-text-primary" data-icon="arrow_back">arrow_back</span>
      </button>
      <h1 className="text-[18px] font-semibold text-text-primary">Order #9021</h1>
      <div className="flex items-center">
      <span className="text-[11px] font-semibold tracking-wider bg-success-light text-success-green px-2.5 py-1 rounded-full uppercase">Ready</span>
      </div>
      </div>
      </header>
      {/* Main Content Canvas */}
      <main className="pt-24 px-screen-px max-w-[448px] mx-auto flex flex-col gap-section-gap">
      {/* Status Banner */}
      <section className="bg-success-light border border-success-green/20 rounded-xl p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-success-green/10 flex items-center justify-center shrink-0">
      <span className="material-symbols-outlined text-success-green" data-icon="shopping_bag" style={{fontVariationSettings: "'FILL' 1"}}>shopping_bag</span>
      </div>
      <div>
      <p className="text-[15px] font-semibold text-text-primary">Ready for pickup</p>
      <p className="text-[13px] text-text-secondary mt-0.5">Customer can now collect their order using the pickup QR code or pickup code.</p>
      </div>
      </section>
      {/* Customer Info */}
      <section className="flex flex-col gap-2">
      <h2 className="text-[12px] font-semibold text-text-secondary uppercase tracking-wider">CUSTOMER</h2>
      <div className="bg-background border border-border-light rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-brand-purple-light flex items-center justify-center overflow-hidden shrink-0">
      <span className="text-[16px] font-semibold text-brand-purple">JD</span>
      </div>
      <div>
      <h3 className="text-[15px] font-semibold text-text-primary">John Doe</h3>
      <p className="text-[13px] text-text-secondary mt-0.5">First-time customer</p>
      </div>
      </div>
      <button className="w-10 h-10 rounded-full border border-border-light flex items-center justify-center text-primary hover:bg-gray-50 transition-colors">
      <span className="material-symbols-outlined">call</span>
      </button>
      </div>
      </section>
      {/* Items Section */}
      <section className="flex flex-col gap-2" id="items_section">
      <div className="flex items-center justify-between">
      <h2 className="text-[12px] font-semibold text-text-secondary uppercase tracking-wider">ORDER ITEMS</h2>
      <span className="text-[11px] bg-gray-50 border border-border-light px-2 py-0.5 rounded text-text-secondary">3 Items</span>
      </div>
      <div className="bg-background border border-border-light rounded-xl overflow-hidden">
      <div className="divide-y divide-border-light">
      <div className="p-4 flex justify-between items-start">
      <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded bg-gray-50 border border-border-light flex items-center justify-center shrink-0 mt-0.5">
      <span className="text-[12px] font-semibold text-text-primary">2x</span>
      </div>
      <div>
      <p className="text-[15px] font-medium text-text-primary">Surplus Pastry Box</p>
      <p className="text-[13px] text-text-secondary mt-0.5">Assorted items, baked today</p>
      </div>
      </div>
      <p className="text-[15px] font-medium text-text-primary">Rp 30.000</p>
      </div>
      <div className="p-4 flex justify-between items-start">
      <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded bg-gray-50 border border-border-light flex items-center justify-center shrink-0 mt-0.5">
      <span className="text-[12px] font-semibold text-text-primary">1x</span>
      </div>
      <div>
      <p className="text-[15px] font-medium text-text-primary">Large Iced Latte</p>
      </div>
      </div>
      <p className="text-[15px] font-medium text-text-primary">Rp 10.000</p>
      </div>
      </div>
      </div>
      </section>
      {/* Payment Summary */}
      <section className="flex flex-col gap-2">
      <h2 className="text-[12px] font-semibold text-text-secondary uppercase tracking-wider">PAYMENT SUMMARY</h2>
      <div className="bg-background border border-border-light rounded-xl p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center">
      <span className="text-[14px] text-text-secondary">Subtotal</span>
      <span className="text-[14px] text-text-primary">Rp 40.000</span>
      </div>
      <div className="flex justify-between items-center">
      <span className="text-[14px] text-text-secondary">Platform Fee</span>
      <span className="text-[14px] text-text-primary">-Rp 2.000</span>
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-border-light">
      <span className="text-[15px] font-semibold text-text-primary">Total Payout</span>
      <span className="text-[18px] font-bold text-success-green">Rp 38.000</span>
      </div>
      </div>
      </section>
      {/* Timeline Section */}
      <section className="flex flex-col gap-2" id="timeline_section">
      <h2 className="text-[12px] font-semibold text-text-secondary uppercase tracking-wider">ORDER TIMELINE</h2>
      <div className="bg-background border border-border-light rounded-xl p-5"><div className="relative pl-6 flex flex-col gap-5 before:content-[''] before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border-light">
      <div className="relative">
      <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-success-green ring-4 ring-background z-10"></div>
      <p className="text-[14px] font-medium text-text-secondary line-through">Order Placed</p>
      <p className="text-[12px] text-text-secondary mt-0.5">14:15</p>
      </div>
      <div className="relative">
      <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-success-green ring-4 ring-background z-10"></div>
      <p className="text-[14px] font-medium text-text-secondary line-through">Order Accepted</p>
      <p className="text-[12px] text-text-secondary mt-0.5">14:17</p>
      </div>
      <div className="relative">
      <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-success-green ring-4 ring-background z-10"></div>
      <p className="text-[14px] font-medium text-text-secondary line-through">Preparing Order</p>
      <p className="text-[12px] text-text-secondary mt-0.5">14:20</p>
      </div>
      <div className="relative">
      <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-success-green ring-4 ring-background z-10"></div>
      <p className="text-[14px] font-semibold text-text-primary">Ready for Pickup</p>
      <p className="text-[12px] text-text-secondary mt-0.5">14:45</p>
      </div>
      <div className="relative">
      <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-50 border-2 border-border-light ring-4 ring-background z-10"></div>
      <p className="text-[14px] font-medium text-text-secondary">Picked Up</p>
      </div>
      </div></div>
      </section>
      </main>
      {/* Bottom Sticky Action */}
      <div className="fixed bottom-0 w-full z-50 bg-background border-t border-border-light p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="max-w-[448px] mx-auto">
      <button className="w-full bg-primary text-on-primary py-3.5 rounded-xl font-semibold text-[16px] hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2">
      <span className="material-symbols-outlined">qr_code_scanner</span>
                      Open Pickup Verification
                  </button>
      </div>
      </div>
    </div>
  );
}

const completedPageStyle = {
  "--color-background": "255 255 255",
  "--color-border": "229 231 235",
  "--color-border-light": "229 231 235",
  "--color-brand-purple": "139 92 246",
  "--color-brand-purple-light": "245 243 255",
  "--color-custom-bg": "255 255 255",
  "--color-custom-card-border": "229 231 235",
  "--color-custom-primary": "16 185 129",
  "--color-custom-text-primary": "17 24 39",
  "--color-custom-text-secondary": "107 114 128",
  "--color-error": "186 26 26",
  "--color-error-container": "255 218 214",
  "--color-gray-50": "249 250 251",
  "--color-inverse-on-surface": "235 243 235",
  "--color-inverse-primary": "80 222 163",
  "--color-inverse-surface": "43 50 45",
  "--color-on-background": "22 29 25",
  "--color-on-error": "255 255 255",
  "--color-on-error-container": "147 0 10",
  "--color-on-primary": "255 255 255",
  "--color-on-primary-container": "0 64 42",
  "--color-on-primary-fixed": "0 33 19",
  "--color-on-primary-fixed-variant": "0 82 54",
  "--color-on-secondary": "255 255 255",
  "--color-on-secondary-container": "87 101 123",
  "--color-on-secondary-fixed": "13 28 47",
  "--color-on-secondary-fixed-variant": "58 72 92",
  "--color-on-surface": "22 29 25",
  "--color-on-surface-variant": "60 74 66",
  "--color-on-tertiary": "255 255 255",
  "--color-on-tertiary-container": "111 18 24",
  "--color-on-tertiary-fixed": "65 0 6",
  "--color-on-tertiary-fixed-variant": "132 35 37",
  "--color-outline": "108 122 113",
  "--color-outline-variant": "187 202 191",
  "--color-primary": "16 185 129",
  "--color-primary-container": "16 183 127",
  "--color-primary-emerald": "22 196 127",
  "--color-primary-fixed": "112 251 189",
  "--color-primary-fixed-dim": "80 222 163",
  "--color-sb-bg": "247 250 248",
  "--color-sb-border": "234 234 234",
  "--color-sb-primary-text": "17 24 39",
  "--color-sb-secondary-text": "107 114 128",
  "--color-secondary": "81 95 116",
  "--color-secondary-container": "213 227 253",
  "--color-secondary-fixed": "213 227 253",
  "--color-secondary-fixed-dim": "185 199 224",
  "--color-success-green": "16 185 129",
  "--color-success-light": "236 253 245",
  "--color-surface": "255 255 255",
  "--color-surface-bright": "244 251 244",
  "--color-surface-container": "232 240 233",
  "--color-surface-container-high": "227 234 227",
  "--color-surface-container-highest": "221 228 221",
  "--color-surface-container-low": "238 246 238",
  "--color-surface-container-lowest": "255 255 255",
  "--color-surface-dim": "212 220 213",
  "--color-surface-tint": "0 108 73",
  "--color-surface-variant": "221 228 221",
  "--color-tertiary": "164 58 59",
  "--color-tertiary-container": "249 122 119",
  "--color-tertiary-fixed": "255 218 215",
  "--color-tertiary-fixed-dim": "255 179 175",
  "--color-text-primary": "17 24 39",
  "--color-text-secondary": "107 114 128",
  "--font-sans": "Inter",
  "--radius-2xl": "1rem",
  "--radius-3xl": "1.5rem",
  "--radius-DEFAULT": "0.25rem",
  "--radius-full": "9999px",
  "--radius-lg": "0.5rem",
  "--radius-xl": "12px",
  "--spacing-card-gap": "16px",
  "--spacing-container-padding": "1.25rem",
  "--spacing-inline-gap": "0.5rem",
  "--spacing-screen-px": "24px",
  "--spacing-section-gap": "24px",
  "--spacing-stack-gap-md": "1rem",
  "--spacing-stack-gap-sm": "0.5rem",
} as React.CSSProperties;

function OrderCompletedDetailStandardizedPage() {
  return (
    <div style={completedPageStyle} className="bg-background text-text-primary antialiased pb-24">

            <style>{`body { font-family: 'Inter', sans-serif; }`}</style>

      {/* TopAppBar Component */}
      <header className="bg-background fixed top-0 w-full z-50 border-b border-border-light shadow-sm">
      <div className="flex items-center justify-between px-screen-px h-16 max-w-[448px] mx-auto">
      <button className="flex items-center justify-center p-2 -ml-2 rounded-full hover:bg-gray-50 transition-colors">
      <span className="material-symbols-outlined text-text-primary" data-icon="arrow_back">arrow_back</span>
      </button>
      <h1 className="text-[18px] font-semibold text-text-primary">Order #1042</h1>
      <div className="flex items-center">
      <span className="text-[11px] font-semibold tracking-wider bg-success-light text-success-green px-2.5 py-1 rounded-full uppercase">Completed</span>
      </div>
      </div>
      </header>
      {/* Main Content Canvas */}
      <main className="pt-24 px-screen-px max-w-[448px] mx-auto flex flex-col gap-section-gap">
      {/* Success Banner */}
      <section className="bg-success-light border border-success-green/20 rounded-xl p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-success-green/10 flex items-center justify-center shrink-0">
      <span className="material-symbols-outlined text-success-green" data-icon="check_circle" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
      </div>
      <div>
      <p className="text-[15px] font-semibold text-text-primary">Order completed successfully.</p>
      <p className="text-[13px] text-text-secondary mt-0.5">Picked up today at 18:32</p>
      </div>
      </section>
      {/* Customer Info */}
      <section className="flex flex-col gap-2">
      <h2 className="text-[12px] font-semibold text-text-secondary uppercase tracking-wider">Customer</h2>
      <div className="bg-background border border-border-light rounded-xl p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-brand-purple-light flex items-center justify-center overflow-hidden shrink-0">
      <span className="text-[16px] font-semibold text-brand-purple">SJ</span>
      </div>
      <div>
      <h3 className="text-[15px] font-semibold text-text-primary">Sarah J.</h3>
      <p className="text-[13px] text-text-secondary flex items-center gap-1 mt-0.5"><span className="material-symbols-outlined text-[14px]" data-icon="local_mall">local_mall</span> Customer</p>
      </div>
      </div>
      </section>
      {/* Order Items */}
      <section className="flex flex-col gap-2">
      <h2 className="text-[12px] font-semibold text-text-secondary uppercase tracking-wider">Items</h2>
      <div className="bg-background border border-border-light rounded-xl overflow-hidden divide-y divide-border-light">
      <div className="p-4 flex justify-between items-start">
      <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded bg-gray-50 border border-border-light flex items-center justify-center shrink-0 mt-0.5">
      <span className="text-[12px] font-semibold text-text-primary">2x</span>
      </div>
      <div>
      <p className="text-[15px] font-medium text-text-primary">Surplus Pastry Box</p>
      <p className="text-[13px] text-text-secondary mt-0.5">Assorted end-of-day pastries.</p>
      </div>
      </div>
      <p className="text-[15px] font-semibold text-text-primary">Rp 30.000</p>
      </div>
      <div className="p-4 flex justify-between items-start">
      <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded bg-gray-50 border border-border-light flex items-center justify-center shrink-0 mt-0.5">
      <span className="text-[12px] font-semibold text-text-primary">1x</span>
      </div>
      <div>
      <p className="text-[15px] font-medium text-text-primary">Large Iced Latte</p>
      <p className="text-[13px] text-text-secondary mt-0.5">Oat milk, less ice.</p>
      </div>
      </div>
      <p className="text-[15px] font-semibold text-text-primary">Rp 10.000</p>
      </div>
      </div>
      </section>
      {/* Summary & Timeline */}
      <section className="grid grid-cols-1 gap-section-gap">
      {/* Summary */}
      <div className="flex flex-col gap-2">
      <h2 className="text-[12px] font-semibold text-text-secondary uppercase tracking-wider">Payment Summary</h2>
      <div className="bg-background border border-border-light rounded-xl p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center">
      <span className="text-[14px] text-text-secondary">Subtotal</span>
      <span className="text-[14px] text-text-primary">Rp 40.000</span>
      </div>
      <div className="flex justify-between items-center">
      <span className="text-[14px] text-text-secondary">Platform Fee</span>
      <span className="text-[14px] text-text-primary">-Rp 2.000</span>
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-border-light">
      <span className="text-[15px] font-semibold text-text-primary">Total Payout</span>
      <span className="text-[18px] font-bold text-success-green">Rp 38.000</span>
      </div>
      </div>
      </div>
      {/* Timeline */}
      <div className="flex flex-col gap-2">
      <h2 className="text-[12px] font-semibold text-text-secondary uppercase tracking-wider">Order Timeline</h2>
      <div className="bg-background border border-border-light rounded-xl p-5"><div className="relative pl-6 flex flex-col gap-5 before:content-[''] before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border-light">
      <div className="relative">
      <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-success-green ring-4 ring-background z-10"></div>
      <p className="text-[14px] font-medium text-text-secondary line-through">Order Placed</p>
      <p className="text-[12px] text-text-secondary mt-0.5">17:45</p>
      </div>
      <div className="relative">
      <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-success-green ring-4 ring-background z-10"></div>
      <p className="text-[14px] font-medium text-text-secondary line-through">Order Accepted</p>
      <p className="text-[12px] text-text-secondary mt-0.5">17:50</p>
      </div>
      <div className="relative">
      <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-success-green ring-4 ring-background z-10"></div>
      <p className="text-[14px] font-medium text-text-secondary line-through">Preparing Order</p>
      <p className="text-[12px] text-text-secondary mt-0.5">18:00</p>
      </div>
      <div className="relative">
      <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-success-green ring-4 ring-background z-10"></div>
      <p className="text-[14px] font-medium text-text-secondary line-through">Ready for Pickup</p>
      <p className="text-[12px] text-text-secondary mt-0.5">18:15</p>
      </div>
      <div className="relative">
      <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-success-green ring-4 ring-background z-10"></div>
      <p className="text-[14px] font-semibold text-text-primary">Picked Up</p>
      <p className="text-[12px] text-text-secondary mt-0.5">18:32</p>
      </div>
      </div></div>
      </div>
      </section>
      {/* Actions */}
      <section className="pb-8">
      <button className="w-full bg-background border border-border-light text-text-primary text-[15px] font-semibold py-3.5 rounded-xl hover:bg-gray-50 transition-colors flex justify-center items-center gap-2">
      <span className="material-symbols-outlined" data-icon="receipt_long">receipt_long</span>
                      Back to Orders
                  </button>
      </section>
      </main>
    </div>
  );
}
