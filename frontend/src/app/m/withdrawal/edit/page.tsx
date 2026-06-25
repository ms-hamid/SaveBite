"use client";

import { FormEvent, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TopNavBack from "../../../../components/m/TopNavArrow";
import {
  cancelWithdrawal,
  getMerchantBalance,
  getWithdrawalById,
  updateWithdrawal,
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

function EditWithdrawalForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const withdrawalId = searchParams.get("id");

  const [amount, setAmount] = useState("");
  const [virtualBalance, setVirtualBalance] = useState(0);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      if (!withdrawalId) {
        setErrorMessage("Withdrawal tidak ditemukan.");
        setIsLoading(false);
        return;
      }

      try {
        const [withdrawal, balance] = await Promise.all([
          getWithdrawalById(withdrawalId),
          getMerchantBalance(),
        ]);

        if (withdrawal.status !== "pending") {
          throw new Error("Hanya withdrawal pending yang bisa diedit.");
        }

        setAmount(String(withdrawal.amount));
        setCurrentAmount(Number(withdrawal.amount));
        setVirtualBalance(balance.virtual_balance);
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [withdrawalId]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!withdrawalId) return;

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

      const diff = parsedAmount - currentAmount;
      if (diff > virtualBalance) {
        throw new Error("Jumlah melebihi saldo tersedia");
      }

      await updateWithdrawal(withdrawalId, { amount: parsedAmount });
      setSuccessMessage("Withdrawal berhasil diperbarui.");
      setTimeout(() => router.push("/m/withdrawal"), 1200);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : getApiErrorMessage(error)
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCancel() {
    if (!withdrawalId) return;
    setIsCancelling(true);
    setErrorMessage("");

    try {
      await cancelWithdrawal(withdrawalId);
      router.push("/m/withdrawal");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsCancelling(false);
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
      <TopNavBack title="Edit Withdrawal" />

      <main className="pt-24 px-5 space-y-6">
        <section className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
          <p className="text-[11px] font-semibold text-slate-500 uppercase">
            Available Balance
          </p>
          <p className="text-xl font-bold text-slate-900">
            {formatRupiah(virtualBalance)}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Current request: {formatRupiah(currentAmount)}
          </p>
        </section>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
              New Amount
            </label>
            <div className="relative shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] rounded-xl">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-medium">
                Rp
              </span>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-emerald"
                type="number"
                min={MIN_WITHDRAWAL}
                required
              />
            </div>
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
              disabled={isSubmitting || isCancelling}
              className="w-full bg-primary-emerald text-white text-sm font-bold rounded-2xl py-3.5 disabled:opacity-60"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting || isCancelling}
              className="w-full bg-white text-red-600 text-sm font-semibold rounded-2xl py-3.5 border border-red-100 disabled:opacity-60"
            >
              {isCancelling ? "Membatalkan..." : "Batalkan Withdrawal"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function EditWithdrawalPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white min-h-screen flex items-center justify-center w-full max-w-[448px] mx-auto">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      }
    >
      <EditWithdrawalForm />
    </Suspense>
  );
}
