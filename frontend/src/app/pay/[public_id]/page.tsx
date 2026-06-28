"use client";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { usePayment } from "../../../components/providers/PaymentProvider";
import { check_payment_status, create_payment } from "../../../services/payment";
import { useState, useEffect, useCallback } from "react";
import { format_price } from "@/lib/format";

const VA_BANK_META: Record<string, { label: string; bg: string; textColor: string }> = {
  va_bca:     { label: "BCA",     bg: "bg-blue-600",   textColor: "text-white" },
  va_mandiri: { label: "MANDIRI", bg: "bg-yellow-500", textColor: "text-white" },
  va_bri:     { label: "BRI",     bg: "bg-blue-800",   textColor: "text-white" },
  va_bni:     { label: "BNI",     bg: "bg-orange-500", textColor: "text-white" },
};

export default function PaymentOrderPage() {
  const { order, payment, refetchPayment } = usePayment();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const [isChecking, setIsChecking] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [vaNumber, setVaNumber] = useState<string | null>(null);
  const [expiredAt, setExpiredAt] = useState<string | null>(null);

  const paymentMethod = searchParams.get("method") ?? payment?.payment_method ?? "va_bca";
  const bankMeta = VA_BANK_META[paymentMethod] ?? VA_BANK_META["va_bca"];
  const totalToPay = format_price((order?.total_amount ?? 0) + 2000);

  // Initialize: create or reuse payment
  useEffect(() => {
    async function initPayment() {
      if (!order?.public_id) return;
      try {
        // If existing pending payment with va_number
        if (payment && payment.pg_status === "pending" && payment.midtrans_trx_id && payment.expired_at) {
          const now = Date.now();
          const exp = new Date(payment.expired_at).getTime();
          if (exp > now) {
            setVaNumber(payment.midtrans_trx_id);
            setExpiredAt(payment.expired_at);
            setIsInitializing(false);
            return;
          }
        }
        // Create new payment
        const response = await create_payment(order.public_id, paymentMethod);
        const data = response.data;
        setVaNumber(data?.va_number ?? data?.token ?? null);
        setExpiredAt(data?.expired_at ?? null);
        await refetchPayment();
      } catch (err) {
        console.error("Init VA payment failed:", err);
      } finally {
        setIsInitializing(false);
      }
    }
    initPayment();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.public_id]);

  // Countdown timer
  const calculateTimeLeft = useCallback(() => {
    if (!expiredAt) return "";
    const diff = new Date(expiredAt).getTime() - Date.now();
    if (diff <= 0) {
      setIsExpired(true);
      return "00:00";
    }
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, [expiredAt]);

  useEffect(() => {
    if (!expiredAt) return;
    setTimeLeft(calculateTimeLeft());
    const iv = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(iv);
  }, [expiredAt, calculateTimeLeft]);

  // Polling payment status
  useEffect(() => {
    if (!order?.public_id || isExpired || isInitializing) return;
    const iv = setInterval(async () => {
      try {
        const res = await check_payment_status(params.public_id as string);
        if (res.success && res.data) {
          if (res.data.pg_status === "settlement" || res.data.order_status === "paid_reserved") {
            clearInterval(iv);
            router.push(`/pay/${params.public_id}/processing`);
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 5000);
    return () => clearInterval(iv);
  }, [order?.public_id, isExpired, isInitializing, params.public_id, router]);

  async function handle_confirm_transfer() {
    if (isChecking) return;
    setIsChecking(true);
    try {
      const response = await check_payment_status(params.public_id as string);
      if (response.success && response.data) {
        const { pg_status, order_status } = response.data;
        if (pg_status === "settlement" || order_status === "paid_reserved") {
          router.push(`/pay/${params.public_id}/processing`);
          return;
        }
      }
      // Not settled yet — go to processing anyway (bank transfer may take time)
      router.push(`/pay/${params.public_id}/processing`);
    } catch (err) {
      console.error("Confirm transfer failed:", err);
    } finally {
      setIsChecking(false);
    }
  }

  async function handle_cancel() {
    if (isCancelling) return;
    setIsCancelling(true);
    try {
      const api = (await import("../../../lib/api")).default;
      await api.patch(`/order/${order?.public_id}/cancel`);
      router.push(`/order/${params.public_id}/cancel`);
    } catch (err) {
      console.error("Cancel order failed:", err);
    } finally {
      setIsCancelling(false);
    }
  }

  function handle_copy() {
    if (!vaNumber) return;
    navigator.clipboard.writeText(vaNumber.replace(/\s/g, "")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  const formattedVA = vaNumber
    ? vaNumber.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim()
    : "—";

  const isUrgent = timeLeft !== "" && !isExpired
    ? parseInt(timeLeft.split(":")[0]) < 5
    : false;

  return (
    <div className="relative mx-auto flex h-full min-h-screen w-full max-w-md flex-col overflow-hidden bg-[#f6f8f7] dark:bg-[#10221c] font-display text-slate-900 dark:text-slate-100 antialiased">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-[#f6f8f7]/95 dark:bg-[#10221c]/95 px-4 py-3 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-[#1a2c26] border border-slate-100 dark:border-slate-800 shadow-sm text-slate-800 dark:text-white hover:bg-slate-50 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Virtual Account</h1>
        <div className="w-10" />
      </header>

      {isInitializing ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
          <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-emerald-500 animate-spin" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Generating virtual account...</p>
        </div>
      ) : (
        <main className="flex-1 overflow-y-auto pb-40">
          {/* Timer */}
          <div className="px-5 py-4">
            <div className={`flex flex-col items-center justify-center rounded-2xl px-4 py-5 border shadow-sm relative overflow-hidden ${
              isExpired
                ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                : isUrgent
                ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                : "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 border-orange-100 dark:border-orange-800/50"
            }`}>
              <div className="flex items-center gap-2 mb-2 relative z-10">
                <span className={`material-symbols-outlined text-xl ${isExpired ? "text-red-500" : "text-orange-500"}`}>
                  {isExpired ? "timer_off" : "timer"}
                </span>
                <span className={`text-xs font-bold uppercase tracking-wider ${isExpired ? "text-red-600 dark:text-red-400" : "text-orange-700/80 dark:text-orange-400/80"}`}>
                  {isExpired ? "Payment expired" : "Complete payment before"}
                </span>
              </div>
              <span className={`font-mono text-4xl font-extrabold tracking-tight relative z-10 ${isExpired ? "text-red-600 dark:text-red-400" : "text-orange-600 dark:text-orange-400"}`}>
                {isExpired ? "00:00" : timeLeft || "15:00"}
              </span>
              {!isExpired && (
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-200/50 blur-2xl dark:bg-orange-600/10" />
              )}
            </div>
          </div>

          {/* VA Card */}
          <div className="px-5">
            <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#1a2c26] shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10">
              {/* Bank header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 p-5">
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-14 rounded-lg ${bankMeta.bg} flex items-center justify-center shadow-sm`}>
                    <span className={`text-[10px] font-extrabold tracking-wider ${bankMeta.textColor}`}>
                      {bankMeta.label}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Bank {bankMeta.label}</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">SaveBite Official</span>
                  </div>
                </div>
                <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-500 text-lg">verified</span>
                </div>
              </div>

              {/* VA Number */}
              <button
                onClick={handle_copy}
                className="w-full group active:bg-slate-50 dark:active:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-700/50"
              >
                <div className="flex flex-col gap-1 p-5">
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Virtual Account Number
                  </span>
                  <div className="flex items-center justify-between gap-3 mt-1">
                    <div className="font-mono text-2xl font-black tracking-widest text-slate-900 dark:text-white group-active:scale-[0.99] transition-transform">
                      {formattedVA}
                    </div>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                      copied
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-emerald-100 group-hover:text-emerald-600"
                    }`}>
                      <span className="material-symbols-outlined text-xl">
                        {copied ? "check" : "content_copy"}
                      </span>
                    </div>
                  </div>
                  {copied && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                      ✓ Copied to clipboard
                    </span>
                  )}
                </div>
              </button>

              {/* Amount */}
              <div className="px-5 py-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Total Payment</span>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalToPay}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">Include service fee</span>
                  </div>
                </div>
                <div className="mt-2 flex justify-end">
                  <span className="text-[11px] font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded border border-amber-100 dark:border-amber-800/30">
                    Do not round the amount
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="px-5 py-5">
            <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2c26] p-4 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/30" />
              <div className="flex items-center gap-2 mb-2 text-slate-700 dark:text-slate-200 pt-1">
                <span className="material-symbols-outlined text-emerald-500 text-lg">info</span>
                <h3 className="text-sm font-bold">Important Notes</h3>
              </div>
              <ul className="list-inside list-disc space-y-1 text-xs text-slate-600 dark:text-slate-400 pl-1">
                <li className="pl-2 -indent-2">Transfer the <strong>exact amount</strong> (up to the last digit).</li>
                <li className="pl-2 -indent-2">Payment confirmed automatically within 10 minutes.</li>
                <li className="pl-2 -indent-2">Order cancelled if unpaid within 15 minutes.</li>
              </ul>
            </div>
          </div>

          {/* How to Pay */}
          <div className="px-5 pb-8">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Payment Instructions</h3>
            <div className="flex flex-col gap-3">
              {[
                {
                  title: "ATM Transfer",
                  steps: [
                    "Insert card, enter PIN.",
                    "Select Other Transactions > Transfer.",
                    `Select To ${bankMeta.label} Virtual Account.`,
                    `Enter VA number: ${formattedVA}.`,
                    `Enter exact amount: ${totalToPay}.`,
                    "Confirm and finish.",
                  ],
                },
                {
                  title: "Mobile Banking",
                  steps: [
                    `Log in to ${bankMeta.label} mobile app.`,
                    "Select Transfer > Virtual Account.",
                    `Enter VA number: ${formattedVA}.`,
                    "Check details and enter PIN.",
                    "Wait for confirmation.",
                  ],
                },
                {
                  title: "Internet Banking",
                  steps: [
                    `Log in to ${bankMeta.label} internet banking.`,
                    "Select Fund Transfer > Virtual Account.",
                    `Enter VA number: ${formattedVA}.`,
                    `Confirm amount: ${totalToPay}.`,
                    "Authorize transaction.",
                  ],
                },
              ].map((item, i) => (
                <details
                  key={i}
                  className="group rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2c26] open:ring-1 open:ring-emerald-500/20 transition-all"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between p-4 font-medium text-slate-700 dark:text-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 group-open:bg-emerald-500 group-open:text-white transition-colors">
                        {i + 1}
                      </div>
                      <span className="text-sm">{item.title}</span>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 transition-transform group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <div className="border-t border-slate-100 dark:border-slate-700 px-4 py-4 text-sm text-slate-600 dark:text-slate-400">
                    <ol className="list-decimal space-y-2 pl-4 marker:text-slate-400 marker:font-medium">
                      {item.steps.map((step, j) => (
                        <li key={j}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      {!isInitializing && (
        <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1a2c26] p-4 pb-[calc(env(safe-area-inset-bottom)+16px)] z-20 shadow-[0_-8px_30px_-5px_rgba(0,0,0,0.08)]">
          {isExpired ? (
            <div className="flex flex-col gap-3">
              <div className="w-full rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-center text-sm text-red-600 dark:text-red-400 font-medium">
                Payment window expired. Please create a new order.
              </div>
              <button
                onClick={() => router.push("/home")}
                className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 transition-all active:scale-[0.98]"
              >
                Back to Home
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                onClick={handle_confirm_transfer}
                disabled={isChecking}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98] disabled:opacity-80 disabled:cursor-not-allowed"
              >
                {isChecking ? (
                  <>
                    <span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>
                    <span>Checking payment...</span>
                  </>
                ) : (
                  <span>I have transferred</span>
                )}
              </button>
              <button
                onClick={handle_cancel}
                disabled={isCancelling}
                className="w-full flex items-center justify-center rounded-xl px-6 py-2.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-colors disabled:opacity-60"
              >
                {isCancelling ? "Cancelling..." : "Cancel Order"}
              </button>
            </div>
          )}
        </footer>
      )}
    </div>
  );
}
