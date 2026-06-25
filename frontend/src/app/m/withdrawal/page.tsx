"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopNavBack from "../../../components/m/TopNavArrow";
import {
  cancelWithdrawal,
  getMerchantBalance,
  getMyWithdrawals,
} from "@/services/withdrawal";
import type { Withdrawal } from "@/types";
import { getApiErrorMessage } from "@/lib/api";

const MIN_WITHDRAWAL = 50_000;

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function statusStyle(status: Withdrawal["status"]) {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "declinec":
      return "bg-red-50 text-red-700 border-red-100";
    case "cancelled":
      return "bg-slate-100 text-slate-600 border-slate-200";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

function statusLabel(status: Withdrawal["status"]) {
  switch (status) {
    case "pending":
      return "Pending";
    case "completed":
      return "Completed";
    case "declinec":
      return "Declined";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

export default function MerchantWithdrawalListPage() {
  const router = useRouter();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState<Withdrawal | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadData() {
    try {
      setIsLoading(true);
      const [list, balanceData] = await Promise.all([
        getMyWithdrawals(),
        getMerchantBalance(),
      ]);
      setWithdrawals(list);
      setBalance(balanceData.virtual_balance);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function confirmCancel() {
    if (!cancelTarget) return;
    setIsCancelling(true);
    setErrorMessage("");
    try {
      await cancelWithdrawal(cancelTarget.id);
      setCancelTarget(null);
      await loadData();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <>
      <div className="bg-white text-slate-900 min-h-screen pb-32 antialiased w-full max-w-[448px] mx-auto relative">
        <TopNavBack title="Withdrawals" />

        <main className="pt-24 px-5 space-y-6">
          <section className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
            <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">
              Available Balance
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {formatRupiah(balance)}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Minimum withdrawal {formatRupiah(MIN_WITHDRAWAL)}
            </p>
            <button
              type="button"
              onClick={() => router.push("/m/withdrawal/create")}
              disabled={balance < MIN_WITHDRAWAL}
              className="mt-4 w-full bg-primary-emerald text-white text-sm font-bold rounded-2xl py-3 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">payments</span>
              Request Withdrawal
            </button>
          </section>

          {errorMessage && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              {errorMessage}
            </p>
          )}

          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-700">History</h2>

            {isLoading && (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
              </div>
            )}

            {!isLoading && withdrawals.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px] text-slate-400">
                    account_balance_wallet
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-700">Belum ada withdrawal</p>
                <p className="text-xs text-slate-500">Ajukan penarikan dana pertamamu</p>
              </div>
            )}

            {withdrawals.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-100 rounded-2xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]"
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      {formatRupiah(Number(item.amount))}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatDate(item.created_at)}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase ${statusStyle(item.status)}`}
                  >
                    {statusLabel(item.status)}
                  </span>
                </div>

                {item.status === "pending" && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() =>
                        router.push(`/m/withdrawal/edit?id=${item.id}`)
                      }
                      className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setCancelTarget(item)}
                      className="flex-1 py-2 rounded-xl border border-red-100 text-xs font-bold text-red-600 hover:bg-red-50"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>

      {cancelTarget && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => !isCancelling && setCancelTarget(null)}
        >
          <div
            className="w-full max-w-[448px] bg-white rounded-t-3xl p-6 pb-10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-6" />
            <h3 className="text-lg font-bold text-slate-900 text-center">
              Batalkan Withdrawal?
            </h3>
            <p className="text-sm text-slate-500 text-center mt-2">
              Saldo {formatRupiah(Number(cancelTarget.amount))} akan dikembalikan
              ke virtual balance kamu.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={confirmCancel}
                disabled={isCancelling}
                className="w-full bg-red-500 text-white text-sm font-bold rounded-2xl py-3.5 disabled:opacity-60"
              >
                {isCancelling ? "Membatalkan..." : "Ya, Batalkan"}
              </button>
              <button
                onClick={() => setCancelTarget(null)}
                disabled={isCancelling}
                className="w-full bg-white text-slate-700 text-sm font-semibold rounded-2xl py-3.5 border border-slate-200"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
