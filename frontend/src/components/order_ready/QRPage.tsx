"use client";

import { useEffect, useState } from "react";
import Head from "next/head";

export default function PaymentConfirmedPage() {
  const [timeLeft, setTimeLeft] = useState(2 * 60 * 60 + 14 * 60 + 35);

  // Countdown Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // QR Auto Refresh Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("QR Refreshed");
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");

    return `${hrs}:${mins}:${secs}`;
  };

  const handleSave = () => {
    alert("QR Saved!");
  };

  const handleDetails = () => {
    alert("Open order details");
  };

  const handleViewOrders = () => {
    alert("Navigate to orders page");
  };

  return (
    <>


        <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-white dark:bg-[#10221c] shadow-xl overflow-hidden">
          {/* Scroll Content */}
          <div className="flex-1 pb-32 pt-12">
            {/* Header */}
            <div className="flex flex-col items-center justify-center pt-6 pb-6 px-4 text-center">
              <div className="relative flex items-center justify-center mb-6">
                <div className="absolute w-24 h-24 rounded-full bg-emerald-500/10 animate-ping"></div>

                <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 animate-scaleIn">
                  <span className="material-symbols-outlined text-[40px] font-bold">
                    check
                  </span>
                </div>
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
                Payment Confirmed!
              </h1>

              <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold tracking-wide uppercase mb-2">
                Ready for Pickup
              </div>

              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                Your order is now reserved.
              </p>
            </div>

            {/* Order Card */}
            <div className="px-4 mb-6">
              <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-5 border border-slate-100 dark:border-white/10 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500 mb-1">
                      Order #SB-1042
                    </p>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Artisan Pastry Bag
                    </h3>
                  </div>

                  <div
                    className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-lg bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCq48ESxPWP6UKYKU68nYg6VmlTmj3TfaLaRusMnORN-mFBJ_74DBgwiviyEC5_UmyGg5IECYOQaWdDZvJcqIgzij3RUkC5aKUlc3kCQiZExTgmTqJpDt5wCBoY9Gio5obIY2ftR14vl1Y3uI6264gvsGw0IXdc9wW3thzy47oC-qgKXhQCWT87U-7-FQMEqTAZkYECYZFXyS6_eLJFvH5cB4KUvxHQDvMcHfoNnBvF8Sn5WTSohzxY08dAnUsZkeSBC1XRgGJMw1Yx')",
                    }}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <span className="material-symbols-outlined text-emerald-500 text-[20px]">
                      schedule
                    </span>

                    <div className="flex flex-col">
                      <span className="font-medium">
                        Pickup: 18:00 – 19:30
                      </span>

                      <span className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                        Reserved until 19:30 today
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <span className="material-symbols-outlined text-emerald-500 text-[20px]">
                      storefront
                    </span>

                    <span className="font-medium">
                      123 Baker Street
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Card */}
            <div className="px-4">
              <div className="flex flex-col items-center bg-white dark:bg-white/5 rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] dark:shadow-none border border-slate-100 dark:border-white/10">
                <p className="text-slate-900 dark:text-white font-bold mb-2 text-center">
                  Show this QR code at pickup
                </p>

                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-4 bg-slate-100 dark:bg-white/10 px-3 py-1 rounded-full">
                  Valid for pickup in{" "}
                  <span className="text-emerald-500 font-bold tabular-nums">
                    {formatTime(timeLeft)}
                  </span>
                </p>

                <div className="bg-white p-3 rounded-xl border border-slate-100 mb-2 w-full max-w-[276px] aspect-square flex items-center justify-center">
                  <img
                    alt="Order QR Code"
                    className="w-full h-full object-contain mix-blend-multiply opacity-90"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcGAbDPFEHYNYspVge9L1Lzuzvm0rbfFS_AO6FTTZMo09qkPv-9kGFbnY2a18S_K9AwwWNw6ZDV75_U8GQUHAi_pfPxHr-wuFt7a7HIf2Ud5J7UkyjI0sTMXRSDgeTOCluvPszBMF74Tiz3euJCDkLCx89tMNyIhWiE9Gci9B4Kxgy399nhIWFXDSMfUZ8FLs1r4SuC3auAHQGtkSC7h_hqoxiu7Mjll0OMbreqBNHxpCIshAyjb9wp3PHPpPYuLBcWosFEtqSdni8"
                  />
                </div>

                <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-6 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">
                    refresh
                  </span>

                  QR refreshes automatically every 30 seconds.
                </p>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors text-sm font-semibold text-slate-700 dark:text-slate-200"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      download
                    </span>

                    Save
                  </button>

                  <button
                    onClick={handleDetails}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors text-sm font-semibold text-slate-700 dark:text-slate-200"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      receipt_long
                    </span>

                    Details
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Info */}
            <div className="px-6 py-6 text-center">
              <div className="inline-flex flex-col gap-1 text-xs text-slate-400 dark:text-slate-500">
                <p className="flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    info
                  </span>

                  No refunds after pickup window ends.
                </p>

                <p>
                  Please arrive within the designated time slot.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="fixed bottom-0 left-0 right-0 p-4 max-w-md mx-auto pointer-events-none bg-white/80 dark:bg-[#10221c]/80 backdrop-blur-md pb-8">
            <button
              onClick={handleViewOrders}
              className="pointer-events-auto w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>View Orders</span>

              <span className="material-symbols-outlined text-[20px]">
                arrow_forward
              </span>
            </button>
          </div>
        </div>

        {/* Tailwind Animation */}
        <style jsx global>{`
          body {
            font-family: "Plus Jakarta Sans", sans-serif;
            min-height: max(884px, 100dvh);
          }

          @keyframes scaleIn {
            0% {
              transform: scale(0);
              opacity: 0;
            }

            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          .animate-scaleIn {
            animation: scaleIn 0.5s ease-out forwards;
          }
        `}</style>
    </>
  );
}