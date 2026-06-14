"use client";

import Head from "next/head";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useListing } from "../../../../components/providers/ListingProvider";

type PaymentMethod = "apple" | "visa";

export default function ConfirmReservationPage() {
  const router = useRouter();
  const params = useParams();
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentMethod>("apple");

  const [isProcessing, setIsProcessing] = useState(false);

  const [showError, setShowError] = useState(false);

  // Auto hide error snackbar
  useEffect(() => {
    if (showError) {
      const timeout = setTimeout(() => {
        setShowError(false);
      }, 4000);

      return () => clearTimeout(timeout);
    }
  }, [showError]);

  async function handlePayment() {
    if (isProcessing) return;

    setIsProcessing(true);

    // Simulasi loading payment
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Simulasi random payment success/fail
    const success = Math.random() > 0.3;

    setIsProcessing(false);

    if (success) {
      router.push(`/order/${params.id}/ready`);
    } else {
      setShowError(true);
    }
  }

  const {listing, is_loading } = useListing();

  return (
    <>
      <Head>
        <title>SaveBite Confirm Reservation</title>

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className="bg-[#f6f8f7] dark:bg-[#10221c] font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500/30 relative">
        {/* Error Snackbar */}
        <div
          className={`fixed top-4 left-5 right-5 z-[60] transition-all duration-300 ${
            showError
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-5 pointer-events-none"
          }`}
        >
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-3 flex items-center justify-between shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center text-red-600 dark:text-red-200">
                <span className="material-symbols-outlined text-[18px]">
                  error
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-bold text-red-800 dark:text-red-200">
                  Payment failed
                </span>

                <span className="text-xs text-red-600 dark:text-red-300">
                  Please try a different card
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowError(false)}
              className="px-3 py-1.5 bg-white dark:bg-red-950 text-xs font-semibold text-red-700 dark:text-red-200 rounded-lg border border-red-100 dark:border-red-800 shadow-sm hover:bg-red-50 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col w-full max-w-md mx-auto bg-[#f6f8f7] dark:bg-[#10221c] pb-[180px]">
          {/* Header */}
          <header className="flex items-center justify-between px-5 py-4 bg-[#f6f8f7]/95 dark:bg-[#10221c]/95 backdrop-blur-sm sticky top-0 z-40 border-b border-transparent transition-all duration-200">
            <button
              onClick={() => router.back()}
              className="h-10 w-10 bg-white dark:bg-[#1a2c26] border border-slate-100 dark:border-slate-800 rounded-full flex items-center justify-center shadow-sm text-slate-800 dark:text-white hover:bg-slate-50 transition-colors z-20"
            >
              <span className="material-symbols-outlined text-[20px]">
                arrow_back
              </span>
            </button>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white absolute left-1/2 -translate-x-1/2 w-full text-center pointer-events-none">
              Confirm Reservation
            </h2>

            <div className="w-10"></div>
          </header>

          {/* Body */}
          <div className="px-5 flex flex-col gap-6 mt-2">
            {/* Product Card */}
            <div className="bg-white dark:bg-[#1a2c26] rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex gap-4">
                <div className="relative h-20 w-20 shrink-0">
                  <img
                    alt={listing?.name}
                    className="h-full w-full object-cover rounded-xl bg-slate-100"
                    src={listing?.img_url}
                  />

                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm border border-white dark:border-[#1a2c26]">
                    -{listing?.discount_percentage}%
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">
                    {listing?.name}
                  </h3>

                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                    {listing?.merchants.merchant_name}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">
                      schedule
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Pickup Window
                    </p>

                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      18:00–19:30
                    </p>

                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 px-2 py-0.5 rounded-full">
                        <span className="material-symbols-outlined text-[12px] fill-1">
                          bolt
                        </span>

                        3 bags left
                      </span>

                      <span className="inline-flex items-center gap-1 text-[11px] text-orange-600 dark:text-orange-400 font-medium bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-full">
                        <span className="material-symbols-outlined text-[12px]">
                          schedule
                        </span>

                        Ends in 45 min
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                    <span className="material-symbols-outlined text-[18px]">
                      location_on
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Location
                    </p>

                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      123 Baker Street
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white dark:bg-[#1a2c26] rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">
                Payment Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Original Price
                  </span>

                  <span className="text-slate-900 dark:text-white font-medium line-through decoration-slate-400 text-right w-20">
                    $
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-emerald-500 font-medium">
                    Discount
                  </span>

                  <span className="text-emerald-500 font-medium text-right w-20">
                    -$7.01
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Subtotal
                  </span>

                  <span className="text-slate-900 dark:text-white font-medium text-right w-20">
                    $4.99
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1 text-xs">
                    Service Fee

                    <span className="material-symbols-outlined text-[14px] text-slate-300 dark:text-slate-600">
                      info
                    </span>
                  </span>

                  <span className="text-slate-400 dark:text-slate-500 font-medium text-xs text-right w-20">
                    $0.00
                  </span>
                </div>
              </div>

              <div className="my-4 border-t border-slate-100 dark:border-slate-700/50"></div>

              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  Total
                </span>

                <span className="text-xl font-extrabold text-slate-900 dark:text-white text-right w-24">
                  $4.99
                </span>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-3 ml-1">
                Payment Method
              </h3>

              <div className="flex flex-col gap-0 bg-white dark:bg-[#1a2c26] rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                {/* Apple Pay */}
                <button
                  onClick={() => setSelectedPayment("apple")}
                  className={`w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:bg-slate-100 dark:active:bg-slate-700 relative border-l-4 ${
                    selectedPayment === "apple"
                      ? "border-emerald-500"
                      : "border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-7 bg-black text-white rounded flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">
                        ios
                      </span>
                    </div>

                    <div className="flex flex-col items-start">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        Apple Pay
                      </span>

                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        Default method
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center bg-white dark:bg-[#1a2c26] ${
                      selectedPayment === "apple"
                        ? "border-[5px] border-emerald-500"
                        : "border border-slate-300 dark:border-slate-600"
                    }`}
                  ></div>
                </button>

                <div className="h-px bg-slate-100 dark:bg-slate-800 mx-4"></div>

                {/* Visa */}
                <button
                  onClick={() => setSelectedPayment("visa")}
                  className={`w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:bg-slate-100 dark:active:bg-slate-700 relative border-l-4 ${
                    selectedPayment === "visa"
                      ? "border-emerald-500"
                      : "border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-7 bg-slate-100 dark:bg-slate-200 rounded flex items-center justify-center shrink-0">
                      <img
                        alt="Visa"
                        className="h-3.5 object-contain opacity-80"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1kVLh8KW7vEZ4yEFV0Fos-lKwCxr1IP0aF07k2sMKI1DLuYLS26Oefhk-bBnETo3_37-xs-yZ5ZLwoGzWKdaPB2LcOEPbogTfumuTtuSI6GfYsBrt7o5GOium5V4se-CmE83Q51tEC4FuSs9LNdzRll7-km4Bluv0oR8wHmCEmnIQCv6GLfW2A3Nng-o78CP0JJWGaC_yWnRKMjYuIhDiRfRaPdgmiuABr5RfJBHDir4bOiB7_BJJ2LvPGuwi5glrOuWMO45tekYJ"
                      />
                    </div>

                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      Visa •••• 1234
                    </span>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center bg-white dark:bg-[#1a2c26] ${
                      selectedPayment === "visa"
                        ? "border-[5px] border-emerald-500"
                        : "border border-slate-300 dark:border-slate-600"
                    }`}
                  ></div>
                </button>

                <div className="h-px bg-slate-100 dark:bg-slate-800 mx-4"></div>

                {/* Add Card */}
                <button className="w-full p-4 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:bg-slate-100 dark:active:bg-slate-700 border-l-4 border-transparent text-emerald-500">
                  <div className="w-10 h-7 rounded border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0 text-slate-400">
                    <span className="material-symbols-outlined text-[16px]">
                      add
                    </span>
                  </div>

                  <span className="text-sm font-medium">
                    Add new card
                  </span>
                </button>
              </div>
            </div>

            {/* Footer Features */}
            <div className="px-2 py-2 flex justify-center items-center gap-4 text-[10px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-emerald-500">
                  lock
                </span>

                <span className="font-medium">
                  Secure payment
                </span>
              </div>

              <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></div>

              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-emerald-500">
                  block
                </span>

                <span className="font-medium">
                  No refunds
                </span>
              </div>

              <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></div>

              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-emerald-500">
                  qr_code
                </span>

                <span className="font-medium">
                  QR code instantly
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1a2c26] px-5 pt-4 pb-[calc(env(safe-area-inset-bottom)+20px)] z-50 shadow-[0_-8px_30px_-5px_rgba(0,0,0,0.1)]">
          <div className="max-w-md mx-auto flex items-center justify-between gap-4 h-14 mb-2">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-0.5">
                Total to pay
              </span>

              <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                $4.99
              </span>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="relative overflow-hidden flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-14 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98] flex items-center justify-center px-6 group disabled:opacity-80 disabled:cursor-not-allowed"
            >
              {!isProcessing ? (
                <div className="flex items-center justify-between w-full">
                  <span>Pay $4.99</span>

                  <div className="bg-white/20 rounded-full p-1 group-hover:bg-white/30 transition-colors">
                    <span className="material-symbols-outlined text-[20px] font-bold">
                      arrow_forward
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>

                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 
                      0 0 5.373 0 12h4zm2 5.291A7.962 
                      7.962 0 014 12H0c0 3.042 1.135 
                      5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>

                  <span>Processing...</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Global Styles */}
        <style jsx global>{`
          body {
            min-height: max(884px, 100dvh);
            font-family: "Plus Jakarta Sans", sans-serif;
          }
        `}</style>
      </main>
    </>
  );
}