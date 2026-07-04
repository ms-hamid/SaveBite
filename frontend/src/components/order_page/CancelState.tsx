'use client';

import Link from 'next/link';
import { useState } from 'react';
// import { PageHeader, MerchantCard, OrderSummary, OrderDetailsInfo } from '../../../../components/shared';
import { MerchantCard, OrderDetailsInfo, OrderSummary } from '../shared';
import { Order } from '@/types';
import { requestRefund } from '@/services/refund';
import { getApiErrorMessage } from '@/lib/api';

export default function CancelledOrderPage({order}: {order: Order | undefined | null}) {
  // Payment data is included in the order response from GET /order/:id
  console.log(order)
  const payment_method = order?.payment?.payment_method ?? undefined;

  const [isRequestingRefund, setIsRequestingRefund] = useState(false);
  const [refundSuccess, setRefundSuccess] = useState(false);
  const [refundError, setRefundError] = useState("");

  const hasPayment = !!order?.payment;

  async function handleRequestRefund() {
    if (!order?.public_id) return;
    setIsRequestingRefund(true);
    setRefundError("");
    try {
      await requestRefund({ order_id: order.public_id });
      setRefundSuccess(true);
    } catch (err) {
      setRefundError(getApiErrorMessage(err));
    } finally {
      setIsRequestingRefund(false);
    }
  }


  return (
    <>
      <main className="flex-1 overflow-y-auto pb-24">
        {/* Cancelled Status Section */}
        <div className="p-4 pt-6 text-center">
          <div className="relative mb-3 group flex justify-center">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl transform scale-110 group-hover:scale-125 transition-transform duration-700 w-20 h-20 mx-auto"></div>
            <div className="relative w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-soft">
              <span className="material-symbols-outlined text-white text-[40px] font-bold">
                close
              </span>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Order Cancelled
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-relaxed max-w-[280px] mx-auto">
              {order?.status || "Cancelled"}
            </p>
          </div>
        </div>

        {/* Merchant Card */}
        <div className="px-6 mb-6 mt-6">
          <MerchantCard
            storeName={order?.merchant?.merchant_name ?? ""}
            address={order?.merchant?.address}
            distance={""}
            imageUrl={order?.listing?.img_url ?? "https://upload.wikimedia.org/wikipedia/commons/6/60/No-Image-Placeholder-banner.svg"}
          />
        </div>

        {/* Order Summary */}
        <div className="px-6 mb-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 px-1">
            Order Summary
          </h3>
          <OrderSummary
            item={order}
            // perlu diubah lagi ini
            amountSaved={order?.formatted?.saved_price ?? "https://upload.wikimedia.org/wikipedia/commons/6/60/No-Image-Placeholder-banner.svg"}
          />
        </div>

        {/* Order Details */}
        <div className="px-6 mb-6">
          <OrderDetailsInfo
            orderId={order?.public_id}
            paymentMethod={payment_method}
          />
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-8 flex flex-col gap-3">
          {/* Refund request — only show if there was a payment */}
          {hasPayment && !refundSuccess && (
            <div className="flex flex-col gap-2">
              {refundError && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                  {refundError}
                </p>
              )}
              <button
                type="button"
                onClick={handleRequestRefund}
                disabled={isRequestingRefund}
                className="w-full py-3 px-4 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-800 font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
              >
                {isRequestingRefund ? (
                  <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="material-symbols-outlined text-[20px]">currency_exchange</span>
                )}
                {isRequestingRefund ? "Submitting..." : "Request Refund"}
              </button>
            </div>
          )}
          {refundSuccess && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
              <p className="text-xs text-emerald-700 font-semibold">Refund requested! We'll process it soon.</p>
            </div>
          )}
          <Link
            href="/search"
            className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-slate-900 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              search
            </span>
            Browse Other Deals
          </Link>
        </div>
      </main>

      {/* Bottom Navigation */}
      {/* /<CustomerNavbar active_tab='order' /> */}
    </>
  );
}

