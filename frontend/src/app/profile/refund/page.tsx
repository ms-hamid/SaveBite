"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CustomerNavbar from "@/components/navbar/customer_navbar";
import { getMyRefunds, type Refund, type RefundStatus } from "@/services/refund";
import { getApiErrorMessage } from "@/lib/api";

function formatRupiah(value: number | string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function statusStyle(status: RefundStatus) {
  switch (status) {
    case "pending":
      return { badge: "bg-amber-50 text-amber-700 border-amber-100", label: "Pending" };
    case "done":
      return { badge: "bg-emerald-50 text-emerald-700 border-emerald-100", label: "Done" };
    case "rejected":
      return { badge: "bg-red-50 text-red-700 border-red-100", label: "Rejected" };
    case "cancel":
      return { badge: "bg-slate-100 text-slate-600 border-slate-200", label: "Cancelled" };
    default:
      return { badge: "bg-slate-100 text-slate-600 border-slate-200", label: status };
  }
}

export default function ProfileRefundPage() {
  const router = useRouter();
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getMyRefunds();
        setRefunds(data);
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 pt-6 pb-4 border-b border-transparent">
        <div className="flex items-center justify-between h-12">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">My Refunds</h2>
          <div className="w-10" />
        </div>
      </header>

      <main className="flex-1 px-4 pt-4 pb-32 overflow-y-auto no-scrollbar max-w-md mx-auto w-full">
        {isLoading && (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
            {error}
          </p>
        )}

        {!isLoading && refunds.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px] text-slate-400">currency_exchange</span>
            </div>
            <p className="text-base font-bold text-slate-700 dark:text-slate-300">No refund requests yet</p>
            <p className="text-sm text-slate-500">Refunds from cancelled orders will appear here.</p>
          </div>
        )}

        <div className="space-y-3">
          {refunds.map((refund) => {
            const { badge, label } = statusStyle(refund.status);
            return (
              <div
                key={refund.id}
                className="bg-white dark:bg-slate-800 rounded-[20px] border border-slate-100 dark:border-slate-700/50 p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {refund.orders?.listing?.name ?? "Order"}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {refund.orders?.merchant?.merchant_name ?? ""}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase flex-shrink-0 ${badge}`}>
                    {label}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                  <div>
                    <p className="text-[11px] text-slate-500 uppercase font-semibold tracking-wide">Refund Amount</p>
                    <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {formatRupiah(refund.amount)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-slate-500 uppercase font-semibold tracking-wide">Requested</p>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">{formatDate(refund.created_at)}</p>
                  </div>
                </div>

                {refund.desc && (
                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 rounded-xl px-3 py-2">
                    {refund.desc}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <CustomerNavbar active_tab="profile" />
    </div>
  );
}
