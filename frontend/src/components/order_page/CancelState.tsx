'use client';

import Link from 'next/link';
// import { PageHeader, MerchantCard, OrderSummary, OrderDetailsInfo } from '../../../../components/shared';
import { MerchantCard, OrderDetailsInfo, OrderSummary } from '../shared';
import { Order } from '@/types';

export default function CancelledOrderPage({order}: {order: Order | undefined | null}) {
  // Payment data is included in the order response from GET /order/:id
  console.log(order)
  const payment_method = order?.payment?.payment_method ?? undefined;


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
              {order?.status}asdasdasdasd
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

        {/* Action Button */}
        <div className="px-6 pb-8">
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

