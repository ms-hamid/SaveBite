"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { check_payment_status } from "@/services/payment";

type QrisPaymentPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  qrisUrl: string | null;
  expiredAt: string | null;
  amount?: string;
  onExpired?: () => void;
  orderPublicId?: string;
};

export default function QrisPaymentPopup({
  isOpen,
  onClose,
  qrisUrl,
  expiredAt,
  amount,
  onExpired,
  orderPublicId,
}: QrisPaymentPopupProps) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Calculate remaining time
  const calculateTimeLeft = useCallback(() => {
    if (!expiredAt) return "";

    const now = new Date().getTime();
    const expiry = new Date(expiredAt).getTime();
    const diff = expiry - now;

    if (diff <= 0) {
      setIsExpired(true);
      onExpired?.();
      return "00:00";
    }

    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, [expiredAt, onExpired]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || !expiredAt) return;

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, expiredAt, calculateTimeLeft]);

  // Reset expired state when popup opens with new data
  useEffect(() => {
    if (isOpen && expiredAt) {
      const now = new Date().getTime();
      const expiry = new Date(expiredAt).getTime();
      setIsExpired(expiry - now <= 0);
    }
  }, [isOpen, expiredAt]);

  // Polling for payment status
  useEffect(() => {
    if (!isOpen || !orderPublicId || isExpired) return;

    const interval = setInterval(async () => {
      try {
        const response = await check_payment_status(orderPublicId);
        if (response.success && response.data) {
          const pgStatus = response.data.pg_status;
          const orderStatus = response.data.order_status;
          if (pgStatus === "settlement" || orderStatus === "paid_reserved") {
            clearInterval(interval);
            router.push(`/pay/${orderPublicId}/done`);
          }
        }
      } catch (err) {
        console.error("Error checking payment status:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen, orderPublicId, isExpired, router]);

  function handleClose() {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 250);
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-md transition-opacity duration-300 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 z-[101] flex items-end sm:items-center justify-center p-4 pointer-events-none`}
      >
        <div
          className={`pointer-events-auto w-full max-w-md bg-white dark:bg-[#1a2c26] rounded-t-3xl sm:rounded-3xl shadow-2xl transition-all duration-300 ${
            isClosing
              ? "opacity-0 translate-y-8 scale-95"
              : "opacity-100 translate-y-0 scale-100"
          }`}
        >
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4">
            {/* Drag handle */}
            <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-5 sm:hidden" />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">
                close
              </span>
            </button>

            {/* Title area */}
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="material-symbols-outlined text-[20px] text-white font-bold">
                  qr_code_scanner
                </span>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Scan to Pay
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  QRIS • All e-wallets accepted
                </p>
              </div>
            </div>
          </div>

          {/* QR Code area */}
          <div className="px-6 pb-4">
            <div className="relative bg-white rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50 shadow-inner">
              {/* Scanning animation corners */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-[3px] border-l-[3px] border-emerald-500 rounded-tl-lg" />
              <div className="absolute top-2 right-2 w-6 h-6 border-t-[3px] border-r-[3px] border-emerald-500 rounded-tr-lg" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-[3px] border-l-[3px] border-emerald-500 rounded-bl-lg" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-[3px] border-r-[3px] border-emerald-500 rounded-br-lg" />

              {/* QR Image */}
              {qrisUrl ? (
                <div className="flex items-center justify-center">
                  <img
                    src={qrisUrl ?? "https://upload.wikimedia.org/wikipedia/commons/6/60/No-Image-Placeholder-banner.svg"}
                    alt="QRIS Payment QR Code"
                    className={`w-56 h-56 object-contain ${
                      isExpired ? "opacity-30 grayscale blur-[2px]" : ""
                    }`}
                  />

                  {/* Expired overlay */}
                  {isExpired && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="bg-red-500/90 backdrop-blur-sm rounded-xl px-5 py-3 shadow-xl">
                        <span className="material-symbols-outlined text-white text-[28px] block text-center mb-1">
                          timer_off
                        </span>

                        <p className="text-white font-bold text-sm">
                          Payment Expired
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-56 h-56 mx-auto flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 border-3 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />

                  <p className="text-xs text-slate-400 font-medium">
                    Generating QR...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Timer & Amount */}
          <div className="px-6 pb-4">
            <div className="flex items-center justify-between bg-slate-50 dark:bg-[#0f1d17] rounded-xl p-3.5">
              {/* Timer */}
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isExpired
                      ? "bg-red-100 dark:bg-red-900/30"
                      : "bg-amber-100 dark:bg-amber-900/30"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[18px] ${
                      isExpired
                        ? "text-red-500"
                        : "text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {isExpired ? "timer_off" : "timer"}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
                    {isExpired ? "Expired" : "Time Remaining"}
                  </span>

                  <span
                    className={`text-lg font-extrabold tabular-nums tracking-tight ${
                      isExpired
                        ? "text-red-500"
                        : "text-slate-900 dark:text-white"
                    }`}
                  >
                    {timeLeft || "--:--"}
                  </span>
                </div>
              </div>

              {/* Amount */}
              {amount && (
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
                    Total
                  </span>

                  <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                    {amount}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Payment methods badge */}
          <div className="px-6 pb-4">
            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              <span className="material-symbols-outlined text-[14px] text-emerald-500">
                verified
              </span>
              Supports GoPay, OVO, DANA, ShopeePay, LinkAja & more
            </div>
          </div>

          {/* Bottom action */}
          <div className="px-6 pb-6">
            {isExpired ? (
              <button
                onClick={handleClose}
                className="w-full h-13 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg"
              >
                <span className="material-symbols-outlined text-[18px]">
                  refresh
                </span>
                Try Again
              </button>
            ) : (
              <button
                onClick={handleClose}
                className="w-full h-13 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-2xl transition-all active:scale-[0.98]"
              >
                Cancel Payment
              </button>
            )}
          </div>

          {/* Pulse animation for active payment */}
          {!isExpired && qrisUrl && (
            <div className="absolute -top-1 -right-1 w-3 h-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes scanline {
          0% {
            top: 0;
          }
          100% {
            top: calc(100% - 2px);
          }
        }
      `}</style>
    </>
  );
}
