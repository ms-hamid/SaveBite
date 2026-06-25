'use client';

import { usePayment } from '@/components/providers/PaymentProvider';
import { check_payment_status } from '@/services/payment';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
// import { check_payment_status } from '../../../services/payment';
// import { usePayment } from '../../../components/providers/PaymentProvider';

export default function PaymentProcessingScreen() {
  const router = useRouter();
  const params = useParams();
  const { order } = usePayment();

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 10; // 10 x 2s = 20s max

    const poll = setInterval(async () => {
      attempts++;
      try {
        const res = await check_payment_status(params.public_id as string);
        if (res.success && res.data) {
          const { pg_status, order_status } = res.data;
          if (pg_status === 'settlement' || order_status === 'paid_reserved') {
            clearInterval(poll);
            router.push(`/pay/${params.public_id}/done`);
            return;
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }

      if (attempts >= maxAttempts) {
        clearInterval(poll);
        // Assume paid, move to done
        router.push(`/pay/${params.public_id}/done`);
      }
    }, 2000);

    return () => clearInterval(poll);
  }, [router, params.public_id]);
  
  return (
    <>
      <div className="relative flex min-h-screen w-full flex-col overflow-hidden items-center justify-center p-6 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display antialiased selection:bg-primary/30 selection:text-primary cursor-default select-none">
        <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background-light dark:via-background-dark to-background-light dark:to-background-dark"></div>

        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10 pointer-events-none z-0"></div>

        <div className="relative z-10 flex flex-col items-center w-full max-w-sm gap-10 -mt-20">
          <div className="relative flex items-center justify-center py-8">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse-slow"></div>

            <div className="w-24 h-24 rounded-full border-[8px] border-primary/10"></div>

            <div className="absolute w-24 h-24 rounded-full border-[8px] border-primary border-t-transparent border-r-transparent animate-spin-slow"></div>

            <div className="absolute inset-0 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-4xl animate-pulse">
                credit_card
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Processing your payment...
            </h2>

            <p className="text-slate-400 dark:text-slate-500 font-medium text-base opacity-90">
              Please do not close the app.
            </p>
          </div>
        </div>

        <div className="absolute bottom-10 left-0 w-full px-6 z-10">
          <div className="mx-auto max-w-sm w-full bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none rounded-xl border border-slate-100 dark:border-slate-800 p-6">
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-5">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined text-[20px]">
                    shopping_bag
                  </span>

                  <span className="text-sm font-medium">Total Amount</span>
                </div>

                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {order?.formatted?.total_amount ?? "—"}
                </span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined text-[20px]">
                    wallet
                  </span>

                  <span className="text-sm font-medium">Method</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white capitalize">
                    {order?.payment?.payment_method?.replace("_", " ").replace("va ", "").toUpperCase() ?? "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="material-symbols-outlined text-[14px] text-primary">
              lock
            </span>

            <span>Secure 256-bit SSL encryption</span>
          </div>
        </div>
      </div>
    </>
  );
}