"use client";

import Link from "next/link";
// import React from "react";
import OrdersBottomNav from "../../../components/m/OrdersBottomNav";
import DashboardBottomNav from "../../../components/m/DashboardBottomNav";

export default function MerchantStoreRefinedPolishedLayoutPage() {
  return (
    <>
      <title>Store Management - SaveBite Merchant</title>
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
                      }
                  }
              }` }} />
      <style dangerouslySetInnerHTML={{ __html: `body { 
              font-family: 'Plus Jakarta Sans', sans-serif; 
              -webkit-tap-highlight-color: transparent;
          }
          .material-symbols-outlined {
              font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
          .no-scrollbar::-webkit-scrollbar {
              display: none;
          }
          .no-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
          }
          body {
            min-height: max(884px, 100dvh);
          }` }} />
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport" />
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&amp;display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet" />
      <div className={"text-sb-primary-text min-h-screen flex justify-center antialiased bg-white"}>
          <div
              className="w-full max-w-[448px] bg-[#F7FAF8] relative flex flex-col min-h-screen shadow-xl pb-[80px] bg-white">
              {/* TopAppBar */}
              <header
                  className="bg-white/95 sticky top-0 w-full max-w-[448px] z-50 backdrop-blur-md border-b border-sb-border flex flex-col">
                  <div className="flex items-center justify-between px-6 h-16 w-full mx-auto">
                      <div className="flex items-center gap-3">
                          <div
                              className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border border-sb-border">
                              <img alt="Store Avatar" className="w-full h-full object-cover"
                                  data-alt="close up of artisan rustic bread loaves stacked in a warm softly lit bakery setting with subtle flour dusting"
                                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVUkkkyRiAOhDWSemjS0rV5WKI5F98W39ho3l5ocRpya2QIzDOo4FaWmPADHgk9thDIl3nTjsVVcHhy_xRocu9BrRM5mdZTZYZz3Ulc89lrCkBAh3gsZhRIXavUQX9Cd4CUVN1Yg3Yese9KdGehNpX7ftgVoiI5O3bvWwnPb-SIWRE3egRYjYvnX7aSd4-ihqNPbcIWcPvcSljgqyGY3b_yxTKf76LEfA5UHxfPoaEZ89FzDY8PO3YJB76zGAGL1uGpxf9PFgsHxkl" />
                          </div>
                          <div className="flex flex-col">
                              <h1 className="font-bold text-[20px] text-sb-primary-text tracking-tight leading-tight">
                                  Store</h1>

                          </div>
                      </div>
                      <button
                          className="text-sb-secondary-text hover:bg-slate-50 transition-colors p-2 -mr-2 rounded-full active:scale-95 transition-transform duration-200 relative shrink-0">
                          <span className="material-symbols-outlined">settings</span>
                      </button>
                  </div>
              </header>
              <main className="flex-1 px-6 py-4 overflow-y-auto no-scrollbar flex flex-col space-y-6 bg-white">
                  {/* Section 1: Store Profile Card */}
                  <section
                      className="border border-sb-border rounded-3xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col gap-3 bg-white">
                      <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-sb-border">
                              <img alt="Store Avatar" className="w-full h-full object-cover"
                                  data-alt="close up of artisan rustic bread loaves stacked in a warm softly lit bakery setting with subtle flour dusting"
                                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVUkkkyRiAOhDWSemjS0rV5WKI5F98W39ho3l5ocRpya2QIzDOo4FaWmPADHgk9thDIl3nTjsVVcHhy_xRocu9BrRM5mdZTZYZz3Ulc89lrCkBAh3gsZhRIXavUQX9Cd4CUVN1Yg3Yese9KdGehNpX7ftgVoiI5O3bvWwnPb-SIWRE3egRYjYvnX7aSd4-ihqNPbcIWcPvcSljgqyGY3b_yxTKf76LEfA5UHxfPoaEZ89FzDY8PO3YJB76zGAGL1uGpxf9PFgsHxkl" />
                          </div>
                          <div className="flex flex-col flex-1">
                              <h2 className="text-[16px] font-bold text-sb-primary-text tracking-tight">Green Harvest
                                  Co.</h2>
                              <span className="text-[13px] font-medium text-sb-secondary-text">Bakery &amp; Cafe</span>
                              <p className="text-[11px] text-sb-secondary-text mt-0.5">Fresh bread and pastries made
                                  daily</p>
                          </div>
                      </div>
                      <button
                          className="w-full bg-transparent border border-sb-border text-sb-secondary-text hover:text-sb-primary-text text-[13px] font-bold py-2 rounded-xl hover:bg-slate-50 transition-colors active:scale-[0.98]">
                          Edit Profile
                      </button>
                  </section>
                  <section
                      className="border border-sb-border rounded-3xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col gap-3 bg-white">
                      <div>
                          <div className="flex justify-between items-center mb-1.5">
                              <h3 className="text-[13px] font-bold text-sb-primary-text">Store Setup Status</h3>
                              <span className="text-[11px] font-bold text-primary-emerald">75% Complete</span>
                          </div>
                          <div className="flex flex-col gap-1.5">
                              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-primary-emerald h-full w-3/4"></div>
                              </div>
                              <p className="text-[11px] text-sb-secondary-text font-medium">Complete your setup to start
                                  receiving orders smoothly.</p>
                          </div>
                      </div>
                      <div className="flex flex-col gap-2 mt-1">
                          <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-primary-emerald text-[16px]"
                                  style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                              <span className="text-[13px] text-sb-primary-text font-medium">Store details</span>
                          </div>
                          <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-primary-emerald text-[16px]"
                                  style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                              <span className="text-[13px] text-sb-primary-text font-medium">Pickup schedule</span>
                          </div>
                          <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-amber-500 text-[16px]">info</span>
                              <span className="text-[13px] text-sb-primary-text font-medium">Payment setup
                                  required</span>
                          </div>
                          <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-amber-500 text-[16px]">info</span>
                              <span className="text-[13px] text-sb-primary-text font-medium">Pickup instructions
                                  required</span>
                          </div>
                      </div>
                      <button
                          className="w-auto self-start mt-1 bg-primary-emerald/10 text-primary-emerald text-[13px] font-bold py-1.5 px-4 rounded-lg shadow-sm hover:bg-primary-emerald/20 transition-colors active:scale-[0.98]">
                          Complete Setup
                      </button>
                  </section>
                  {/* Section 2: Store Status Card */}
                  <section
                      className="border border-sb-border rounded-3xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col gap-3 bg-white">
                      <div className="flex justify-between items-start">
                          <div className="flex flex-col gap-1">
                              <h3 className="text-[15px] font-bold text-sb-primary-text tracking-tight">Store Status
                              </h3>
                              <p className="text-[12px] text-sb-secondary-text font-medium">Today's Hours: 8:00 AM -
                                  7:00 PM</p>
                          </div>
                          <span
                              className="bg-[#E8F8F2] text-primary-emerald px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 border border-primary-emerald/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-emerald"></span> Open
                          </span>
                      </div>
                      <p className="text-[11px] text-sb-secondary-text italic -mt-1">Customers can only place orders
                          while your store is open</p>
                      <div className="flex flex-col gap-2 mt-1">
                          <div className="flex items-center justify-between py-1">
                              <div className="flex flex-col">
                                  <span className="text-[13px] font-bold text-sb-primary-text">Open / Close Store</span>
                                  <span className="text-[11px] text-sb-secondary-text font-medium">Currently accepting
                                      walk-ins</span>
                              </div>
                              <div
                                  className="w-10 h-5 bg-primary-emerald rounded-full relative cursor-pointer shadow-inner">
                                  <div
                                      className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm transition-transform">
                                  </div>
                              </div>
                          </div>
                          <div className="h-px bg-slate-100 w-full"></div>
                          <div className="flex items-center justify-between py-1">
                              <div className="flex flex-col">
                                  <span className="text-[13px] font-bold text-sb-primary-text">Pause Orders</span>
                                  <span className="text-[11px] text-sb-secondary-text font-medium">Temporarily stop new
                                      requests</span>
                              </div>
                              <div className="w-10 h-5 bg-slate-200 rounded-full relative cursor-pointer shadow-inner">
                                  <div
                                      className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm transition-transform">
                                  </div>
                              </div>
                          </div>
                      </div>
                  </section>
                  {/* Section 4: Performance */}
                  <section className="grid gap-3 grid-cols-2">
                      <div
                          className="bg-white border border-sb-border rounded-3xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center gap-1 text-center">
                          <p className="text-[18px] font-bold text-sb-primary-text leading-tight">12</p>
                          <p className="text-[11px] font-semibold text-sb-secondary-text">Orders Today</p>
                      </div>
                      <div
                          className="bg-white border border-sb-border rounded-3xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center gap-1 text-center">
                          <div className="flex items-center gap-1 text-primary-emerald">
                              <p className="text-[18px] font-bold leading-tight">4.8</p>
                              <span className="material-symbols-outlined text-[14px]"
                                  style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          </div>
                          <p className="text-[11px] font-semibold text-sb-secondary-text">Rating</p>
                      </div>

                  </section>
                  {/* Section 3: Business Settings */}
                  <section className="flex flex-col gap-3">
                      <h3 className="text-[14px] font-bold text-sb-primary-text px-1">Business Settings</h3>
                      <div
                          className="border border-sb-border rounded-3xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col bg-white">
                          <Link
                            href={'/m/store/operating_hours'}
                              className="flex items-center justify-between p-4 border-b border-sb-border hover:bg-slate-50 transition-colors active:bg-slate-100">
                              <div className="flex items-center gap-3">
                                  <div
                                      className="w-8 h-8 rounded-xl bg-primary-emerald/10 flex items-center justify-center text-primary-emerald">
                                      <span className="material-symbols-outlined text-[18px]">schedule</span>
                                  </div>
                                  <div className="flex flex-col items-start">
                                      <span className="text-[13px] font-semibold text-sb-primary-text">Operating
                                          hours</span>
                                      <span className="text-[11px] text-sb-secondary-text">Set your daily open
                                          hours</span>
                                  </div>
                              </div>
                              <span
                                  className="material-symbols-outlined text-sb-secondary-text text-[20px]">chevron_right</span>
                          </Link>
                          <Link
                            href={'/m/store/schedule'}
                              className="flex items-center justify-between p-4 border-b border-sb-border hover:bg-slate-50 transition-colors active:bg-slate-100">
                              <div className="flex items-center gap-3">
                                  <div
                                      className="w-8 h-8 rounded-xl bg-primary-emerald/10 flex items-center justify-center text-primary-emerald">
                                      <span className="material-symbols-outlined text-[18px]">local_mall</span>
                                  </div>
                                  <div className="flex flex-col items-start">
                                      <span className="text-[13px] font-semibold text-sb-primary-text">Pickup
                                          schedule</span>
                                      <span className="text-[11px] text-sb-secondary-text">Manage collection
                                          times</span>
                                  </div>
                              </div>
                              <span
                                  className="material-symbols-outlined text-sb-secondary-text text-[20px]">chevron_right</span>
                          </Link><Link
                            href={'/m/store/instruction'}
                              className="flex items-center justify-between p-4 border-b border-sb-border hover:bg-slate-50 transition-colors active:bg-slate-100">
                              <div className="flex items-center gap-3">
                                  <div
                                      className="w-8 h-8 rounded-xl bg-primary-emerald/10 flex items-center justify-center text-primary-emerald">
                                      <span className="material-symbols-outlined text-[18px]">hail</span>
                                  </div>
                                  <div className="flex flex-col items-start">
                                      <span className="text-[13px] font-semibold text-sb-primary-text">Pickup
                                          Instructions</span>
                                      <span className="text-[11px] text-sb-secondary-text">Guide customers to your
                                          store</span>
                                  </div>
                              </div>
                              <span
                                  className="material-symbols-outlined text-sb-secondary-text text-[20px]">chevron_right</span>
                          </Link>
                          <Link
                            href={'/m/store/location'}
                              className="flex items-center justify-between p-4 border-b border-sb-border hover:bg-slate-50 transition-colors active:bg-slate-100">
                              <div className="flex items-center gap-3">
                                  <div
                                      className="w-8 h-8 rounded-xl bg-primary-emerald/10 flex items-center justify-center text-primary-emerald">
                                      <span className="material-symbols-outlined text-[18px]">location_on</span>
                                  </div>
                                  <div className="flex flex-col items-start">
                                      <span className="text-[13px] font-semibold text-sb-primary-text">Store
                                          location</span>
                                      <span className="text-[11px] text-sb-secondary-text">Update your physical
                                          address</span>
                                  </div>
                              </div>
                              <span
                                  className="material-symbols-outlined text-sb-secondary-text text-[20px]">chevron_right</span>
                          </Link>
                          <Link
                            href={'/m/store/payment'}
                              className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors active:bg-slate-100">
                              <div className="flex items-center gap-3">
                                  <div
                                      className="w-8 h-8 rounded-xl bg-primary-emerald/10 flex items-center justify-center text-primary-emerald">
                                      <span className="material-symbols-outlined text-[18px]">payments</span>
                                  </div>
                                  <div className="flex flex-col items-start">
                                      <span className="text-[13px] font-semibold text-sb-primary-text">Payment
                                          settings</span>
                                      <span className="text-[11px] text-sb-secondary-text">Manage bank accounts and
                                          payouts</span>
                                  </div>
                              </div>
                              <span
                                  className="material-symbols-outlined text-sb-secondary-text text-[20px]">chevron_right</span>
                          </Link>
                      </div>
                  </section>
                  {/* Section 5: AI Settings */}
                  <section
                      className="border border-sb-border rounded-3xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col gap-3 bg-white">
                      <div className="flex flex-col">
                          <h3 className="text-[15px] font-bold text-sb-primary-text flex items-center gap-1.5">
                              AI Settings
                              <span className="material-symbols-outlined text-primary-emerald text-[16px]"
                                  style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                          </h3>
                          <p className="text-[11px] font-semibold text-primary-emerald mt-0.5">Connected to AI Hub</p>
                      </div>
                      <div
                          className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-sb-border shadow-sm">
                          <div className="flex flex-col">
                              <span className="text-[13px] font-bold text-sb-primary-text">Auto-learn from orders</span>
                              <span className="text-[11px] text-sb-secondary-text font-medium">Improve surplus
                                  predictions</span>
                          </div>
                          <div
                              className="w-10 h-5 bg-primary-emerald rounded-full relative cursor-pointer shadow-inner">
                              <div
                                  className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm transition-transform">
                              </div>
                          </div>
                      </div>
                      <p className="text-[10px] text-sb-secondary-text text-center mt-1">AI uses store activity to
                          improve predictions</p>
                  </section>
                  {/* Section 6: Support */}
                  <section className="flex flex-col gap-3 pb-4">
                      <h3 className="text-[14px] font-bold text-sb-primary-text px-1">Support &amp; Account</h3>
                      <div
                          className="border border-sb-border rounded-3xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col bg-white">
                          <button
                              className="flex items-center justify-between p-4 border-b border-sb-border hover:bg-slate-50 transition-colors active:bg-slate-100">
                              <span className="text-[13px] font-semibold text-sb-primary-text">Help center</span>
                              <span
                                  className="material-symbols-outlined text-sb-secondary-text text-[18px]">open_in_new</span>
                          </button>
                          <button
                              className="flex items-center justify-between p-4 border-b border-sb-border hover:bg-slate-50 transition-colors active:bg-slate-100">
                              <span className="text-[13px] font-semibold text-sb-primary-text">Contact support</span>
                              <span className="material-symbols-outlined text-sb-secondary-text text-[18px]">chat</span>
                          </button>
                          <button
                              className="flex items-center justify-between p-4 hover:bg-red-50 transition-colors text-red-600 active:bg-red-100">
                              <span className="text-[13px] font-semibold">Logout</span>
                              <span className="material-symbols-outlined text-[18px]">logout</span>
                          </button>
                      </div>
                  </section>
                    <DashboardBottomNav page="store"/>
              </main>
          </div>
      </div>
    </>
  );
}
