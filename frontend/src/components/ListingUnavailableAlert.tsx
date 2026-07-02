"use client";

import { useEffect, useRef } from "react";

type AlertVariant = "sold_out" | "expired" | "unavailable";

type ListingUnavailableAlertProps = {
  isOpen: boolean;
  variant: AlertVariant;
  listingName?: string;
  onClose: () => void;
};

const CONFIG: Record<AlertVariant, {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  message: string;
  badge: string;
  badgeBg: string;
}> = {
  sold_out: {
    icon: "production_quantity_limits",
    iconBg: "bg-red-100 dark:bg-red-900/30",
    iconColor: "text-red-500 dark:text-red-400",
    title: "Stok Habis",
    message: "Maaf, semua stok untuk listing ini sudah habis. Coba cari listing lain yang tersedia.",
    badge: "Sold Out",
    badgeBg: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  },
  expired: {
    icon: "schedule",
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    iconColor: "text-orange-500 dark:text-orange-400",
    title: "Listing Sudah Berakhir",
    message: "Waktu pickup untuk listing ini sudah berakhir. Coba cari listing lain yang masih tersedia.",
    badge: "Ended",
    badgeBg: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
  },
  unavailable: {
    icon: "block",
    iconBg: "bg-slate-100 dark:bg-slate-800",
    iconColor: "text-slate-500 dark:text-slate-400",
    title: "Listing Tidak Tersedia",
    message: "Listing ini saat ini tidak tersedia. Silakan cari listing lain.",
    badge: "Unavailable",
    badgeBg: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
  },
};

export default function ListingUnavailableAlert({
  isOpen,
  variant,
  listingName,
  onClose,
}: ListingUnavailableAlertProps) {
  const cfg = CONFIG[variant];
  const backdropRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Bottom sheet modal */}
      <div className="fixed inset-x-0 bottom-0 z-[81] flex items-end justify-center">
        <div
          className="w-full max-w-md bg-white dark:bg-[#10221c] rounded-t-3xl px-6 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle */}
          <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6" />

          {/* Icon */}
          <div className="flex flex-col items-center text-center gap-4 mb-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${cfg.iconBg}`}>
              <span
                className={`material-symbols-outlined text-[32px] ${cfg.iconColor}`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {cfg.icon}
              </span>
            </div>

            {/* Badge */}
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${cfg.badgeBg}`}>
              {cfg.badge}
            </span>

            {/* Title */}
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                {cfg.title}
              </h2>
              {listingName && (
                <p className="text-sm font-semibold text-primary mb-1">{listingName}</p>
              )}
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {cfg.message}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                window.history.back();
              }}
              className="w-full bg-primary hover:bg-emerald-600 text-white font-bold py-3.5 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
            >
              Cari Listing Lain
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold py-3 rounded-2xl transition-all active:scale-[0.98] text-sm"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
