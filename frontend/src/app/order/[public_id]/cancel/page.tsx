'use client';

import Link from 'next/link';
import { PageHeader, MerchantCard, OrderSummary, OrderDetailsInfo } from '../../../../components/shared';
import { useOrder } from '../../../../components/providers/OrderProvider';
import CustomerNavbar from '../../../../components/navbar/customer_navbar';

export default function CancelledOrderPage() {
  const { order, isLoading } = useOrder();
  // Payment method is embedded in the order response from GET /order/:id
  const payment_method = order?.payment?.[0]?.payment_type ?? undefined;



  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col max-w-md mx-auto">
      <PageHeader
        title="Order Details"
        showBack={true}
        // onBackClick={() => window.history.back()}
      />

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
              {order?.status}
            </p>
          </div>
          {/* {!order.chargeApplied && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/10 mt-4">
              <span className="material-symbols-outlined text-slate-500 text-sm">
                credit_card_off
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
                No charge applied
              </span>
            </div>
          )} */}
        </div>

        {/* Merchant Card */}
        <div className="px-6 mb-6 mt-6">
          <MerchantCard
            storeName={order?.listing.merchants.merchant_name}
            address={order?.listing.merchants.address}
            distance={"123km"}
            imageUrl={order?.listing.img_url}
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
            amountSaved={order?.formatted.saved_price}
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
      /<CustomerNavbar active_tab='order' />
    </div>
  );
}

