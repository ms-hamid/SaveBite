"use client";
import { useRouter } from "next/navigation";
import api, { getApiErrorMessage } from "../../../lib/api";
import { useParams } from "next/navigation";
import { usePayment } from "../../../components/providers/PaymentProvider";
import { check_payment_status } from "../../../services/payment";
import { useState } from "react";


export default function PaymentOrderPage() {
  const {order} = usePayment();
  const router = useRouter();
  const params = useParams();
  const [isChecking, setIsChecking] = useState(false);

  async function handle_tranfer() {
    if (isChecking) return;
    setIsChecking(true);
    try {
      // First confirm transfer on backend
      await api.patch(`/order/${order?.public_id}/confirm-transfer`, { payment_method: "bank_transfer" });
      
      // Check status
      const response = await check_payment_status(params.public_id as string);
      if (response.success && response.data) {
        const pgStatus = response.data.pg_status;
        const orderStatus = response.data.order_status;
        if (pgStatus === "settlement" || orderStatus === "paid_reserved") {
          router.push(`/pay/${params.public_id}/done`);
          return;
        }
      }
      
      // If not settled yet, redirect anyway since bank_transfer might take time, or alert user
      router.push(`/pay/${params.public_id}/done`);
    } catch (err) {
      console.error("Confirm transfer failed:", getApiErrorMessage(err));
    } finally {
      setIsChecking(false);
    }
  }

  async function handle_cancel() {
    try {
      await api.patch(`/order/${order?.public_id}/cancel`);
      router.push(`/order/${params.public_id}/cancel`);
    } catch (err) {
      console.error("Cancel order failed:", getApiErrorMessage(err));
    }
  }
  
  return (
    <>
      <div>
        <input className="hidden" id="copy-trigger" type="checkbox" />
        <input className="hidden" id="loading-trigger" type="checkbox" />
        <div className="relative mx-auto flex h-full min-h-screen w-full max-w-md flex-col overflow-hidden bg-white dark:bg-slate-900 shadow-xl">
          <header className="sticky top-0 z-30 flex items-center justify-between bg-white/90 px-4 py-3 backdrop-blur-md dark:bg-slate-900/90 border-b border-slate-50 dark:border-slate-800">
            <button className="flex h-10 w-10 items-center justify-center rounded-full text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Payment</h1>
            <button className="flex h-10 w-10 items-center justify-center rounded-full text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined text-2xl">help</span>
            </button>
          </header>
          <main className="flex-1 overflow-y-auto no-scrollbar pb-40">
            <div className="px-5 pt-6 pb-2">
              <h2 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white">Complete Your Payment</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Transfer to the virtual account below before the time runs out.</p>
            </div>
            <div className="px-5 py-4">
              <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-5 border border-orange-100 dark:from-amber-900/20 dark:to-orange-900/10 dark:border-orange-800/50 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-2 mb-2 relative z-10">
                  <span className="material-symbols-outlined text-orange-500 text-xl">timer</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-700/80 dark:text-orange-400/80">Complete payment before</span>
                </div>
                <span className="font-mono text-4xl font-extrabold text-orange-600 dark:text-orange-400 tracking-tight relative z-10">23:59:45</span>
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-200/50 blur-2xl dark:bg-orange-600/10" />
              </div>
            </div>
            <div className="px-5">
              <div className="relative overflow-hidden rounded-xl bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10">
                <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div aria-label="BCA Bank Logo" className="h-9 w-14 rounded bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold tracking-wider shadow-sm">BCA</div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Bank BCA</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">SaveBite Official</span>
                    </div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-lg">verified</span>
                  </div>
                </div>
                <label className="va-container group relative block cursor-pointer active:bg-slate-50 dark:active:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-700/50" htmlFor="copy-trigger">
                  <div className="flex flex-col gap-1 p-5 pb-5">
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Virtual Account Number</span>
                    <div className="flex items-center justify-between gap-3 mt-1">
                      <div className="font-mono text-2xl font-black tracking-widest text-slate-900 dark:text-white group-active:scale-[0.99] transition-transform">8800 1234 5678 9012</div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors dark:bg-slate-700 dark:text-slate-300">
                        <span className="material-symbols-outlined text-xl copy-icon">content_copy</span>
                        <span className="material-symbols-outlined text-xl check-icon text-green-600 dark:text-green-400 hidden">check</span>
                      </div>
                    </div>
                  </div>
                </label>
                <div className="px-5 py-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Total Payment</span>
                    <div className="flex flex-col items-end">
                      <span className="text-2xl font-extrabold text-slate-900 dark:text-white">Rp49.900</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">Include unique code if any</span>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/30">
                      Do not round the amount
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 py-6">
              <div className="relative rounded-lg border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-700 dark:bg-slate-800/30 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/30" />
                <div className="flex items-center gap-2 mb-2 text-slate-700 dark:text-slate-200 pt-1">
                  <span className="material-symbols-outlined text-primary text-lg">info</span>
                  <h3 className="text-sm font-bold">Important Notes</h3>
                </div>
                <ul className="list-inside list-disc space-y-1 text-xs text-slate-600 dark:text-slate-400 pl-1">
                  <li className="pl-2 -indent-2 marker:text-primary">Transfer the <strong>exact amount</strong> required (up to the last 3 digits).</li>
                  <li className="pl-2 -indent-2 marker:text-primary">Payment will be confirmed automatically within 10 minutes.</li>
                  <li className="pl-2 -indent-2 marker:text-primary">Order will be cancelled if unpaid by deadline.</li>
                </ul>
              </div>
            </div>
            <div className="px-5 pb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Payment Instructions</h3>
                <a className="text-sm font-medium text-primary hover:text-green-400" href="#">Need help?</a>
              </div>
              <div className="flex flex-col gap-3">
                <details className="group rounded-lg border border-slate-200 bg-white open:ring-1 open:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 transition-all duration-300 ease-in-out">
                  <summary className="flex cursor-pointer list-none items-center justify-between p-4 font-medium text-slate-700 dark:text-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-400 group-open:bg-primary group-open:text-slate-900 transition-colors">1</div>
                      <span>ATM Transfer</span>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="border-t border-slate-100 px-4 py-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400 animate-slideDown">
                    <ol className="list-decimal space-y-3 pl-4 marker:text-slate-400 marker:font-medium">
                      <li>Insert your ATM card and enter your PIN.</li>
                      <li>Select <strong>Other Transactions</strong> &gt; <strong>Transfer</strong>.</li>
                      <li>Select <strong>To BCA Virtual Account</strong>.</li>
                      <li>Enter the Virtual Account number: <strong className="text-slate-900 dark:text-slate-200 select-all">8800 1234 5678 9012</strong>.</li>
                      <li>Enter the exact amount: <strong>Rp49.900</strong>.</li>
                      <li>Confirm payment details and finish transaction.</li>
                    </ol>
                  </div>
                </details>
                <details className="group rounded-lg border border-slate-200 bg-white open:ring-1 open:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 transition-all duration-300 ease-in-out">
                  <summary className="flex cursor-pointer list-none items-center justify-between p-4 font-medium text-slate-700 dark:text-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-400 group-open:bg-primary group-open:text-slate-900 transition-colors">2</div>
                      <span>Mobile Banking (m-BCA)</span>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="border-t border-slate-100 px-4 py-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400 animate-slideDown">
                    <ol className="list-decimal space-y-3 pl-4 marker:text-slate-400 marker:font-medium">
                      <li>Log in to your m-BCA application.</li>
                      <li>Select <strong>m-Transfer</strong> &gt; <strong>BCA Virtual Account</strong>.</li>
                      <li>Input Virtual Account number: <strong className="text-slate-900 dark:text-slate-200 select-all">8800 1234 5678 9012</strong>.</li>
                      <li>Check details and enter your m-PIN.</li>
                      <li>Wait for successful transaction confirmation.</li>
                    </ol>
                  </div>
                </details>
                <details className="group rounded-lg border border-slate-200 bg-white open:ring-1 open:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 transition-all duration-300 ease-in-out">
                  <summary className="flex cursor-pointer list-none items-center justify-between p-4 font-medium text-slate-700 dark:text-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-400 group-open:bg-primary group-open:text-slate-900 transition-colors">3</div>
                      <span>Internet Banking (KlikBCA)</span>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="border-t border-slate-100 px-4 py-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400 animate-slideDown">
                    <ol className="list-decimal space-y-3 pl-4 marker:text-slate-400 marker:font-medium">
                      <li>Log in to KlikBCA Individual.</li>
                      <li>Select <strong>Fund Transfer</strong> &gt; <strong>Transfer to BCA Virtual Account</strong>.</li>
                      <li>Enter the Virtual Account number.</li>
                      <li>Confirm the payment amount matches <strong>Rp49.900</strong>.</li>
                      <li>Authorize with KeyBCA.</li>
                    </ol>
                  </div>
                </details>
              </div>
            </div>
          </main>
          <footer className="absolute bottom-0 left-0 w-full border-t border-slate-100 bg-white p-4 pb-8 dark:border-slate-800 dark:bg-slate-900 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)] z-20">
            <div className="flex flex-col gap-3">
              <div className="block">
                <button
                 onClick={handle_tranfer}
                 disabled={isChecking}
                 className="main-cta relative flex w-full cursor-pointer select-none items-center justify-center rounded-lg bg-primary px-6 py-3.5 text-base font-bold text-slate-900 shadow-sm transition-all hover:bg-green-400 hover:shadow-md active:scale-[0.98] disabled:opacity-80 disabled:cursor-not-allowed" 
                >
                  {!isChecking ? (
                    <span className="default-text">I have transferred</span>
                  ) : (
                    <div className="loading-text flex items-center gap-2">
                      <span className="animate-spin material-symbols-outlined text-xl">progress_activity</span>
                      <span>Checking payment...</span>
                    </div>
                  )}
                </button>
                <button 
                  onClick={handle_cancel}
                className="mt-3 flex w-full items-center justify-center rounded-lg px-6 py-2 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-300">
                  Cancel Order
                </button>
              </div>
            </div>
          </footer>
          <div className="copy-toast hidden fixed bottom-28 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-slate-900/90 backdrop-blur text-white text-sm font-medium py-2 px-4 rounded-full shadow-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-primary">check_circle</span>
              Virtual account copied
            </div>
          </div>
          {/* <div className="modal-backdrop fixed inset-0 z-50 items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200" id="cancel-modal">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-800 scale-100 transition-all">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                <span className="material-symbols-outlined text-2xl">warning</span>
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Cancel Order?</h3>
              <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Are you sure you want to cancel this order? This action cannot be undone.</p>
              <div className="flex gap-3">
                <a className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700" href="#">Go Back</a>
                <button className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-red-700">Yes, Cancel</button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
}
