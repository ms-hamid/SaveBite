"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopNavBack from "../../../../components/m/TopNavArrow";
import {
  createWithdrawal,
  getMerchantBalance,
  MerchantBalance,
} from "@/services/withdrawal";
import { getApiErrorMessage } from "@/lib/api";

const MIN_WITHDRAWAL = 50_000;

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CreateWithdrawalPage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [balanceInfo, setBalanceInfo] = useState<MerchantBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadBalance() {
      try {
        const data = await getMerchantBalance();
        setBalanceInfo(data);
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }
    loadBalance();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const parsedAmount = Number(amount);
    try {
      if (!parsedAmount || parsedAmount < MIN_WITHDRAWAL) {
        throw new Error(
          `Minimum withdrawal adalah ${formatRupiah(MIN_WITHDRAWAL)}`
        );
      }

      if (
        balanceInfo &&
        parsedAmount > balanceInfo.virtual_balance
      ) {
        throw new Error("Jumlah melebihi saldo tersedia");
      }

      if (!balanceInfo?.bank_name || !balanceInfo?.bank_account) {
        throw new Error(
          "Lengkapi data rekening bank di Payment settings terlebih dahulu"
        );
      }

      await createWithdrawal({ amount: parsedAmount });
      setSuccessMessage("Permintaan withdrawal berhasil diajukan.");
      setTimeout(() => router.push("/m/withdrawal"), 1200);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : getApiErrorMessage(error)
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center w-full max-w-[448px] mx-auto">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white text-slate-900 min-h-screen pb-32 antialiased w-full max-w-[448px] mx-auto relative">
      <TopNavBack title="Request Withdrawal" />

      <main className="pt-24 px-5 space-y-6">
        <section className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase">
              Available Balance
            </p>
            <p className="text-xl font-bold text-slate-900">
              {formatRupiah(balanceInfo?.virtual_balance ?? 0)}
            </p>
          </div>
          <div className="pt-3 border-t border-slate-200">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">
              Settlement Account
            </p>
            <p className="text-sm font-medium text-slate-900 mt-1">
              {balanceInfo?.bank_name ?? "—"}
            </p>
            <p className="text-sm text-slate-600 font-mono">
              {balanceInfo?.bank_account ?? "Belum diatur"}
            </p>
          </div>
        </section>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
              Withdrawal Amount
            </label>
            <div className="relative shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] rounded-xl">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-medium">
                Rp
              </span>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-emerald"
                placeholder="50000"
                type="number"
                min={MIN_WITHDRAWAL}
                required
              />
            </div>
            <p className="text-xs text-slate-500">
              Minimum {formatRupiah(MIN_WITHDRAWAL)}
            </p>
          </div>

          {errorMessage && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
              {successMessage}
            </p>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-emerald hover:bg-primary-dark text-white text-sm font-bold rounded-2xl py-3.5 disabled:opacity-60 transition-colors"
            >
              {isSubmitting ? "Mengajukan..." : "Submit Request"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/m/withdrawal")}
              disabled={isSubmitting}
              className="w-full bg-white text-slate-700 text-sm font-semibold rounded-2xl py-3.5 border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Kembali
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
