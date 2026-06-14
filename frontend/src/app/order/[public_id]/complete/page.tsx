'use client';

import Link from 'next/link';
import { PageHeader, MerchantCard, OrderSummary, OrderDetailsInfo } from '../../../../components/shared';
import { useOrder } from '../../../../components/providers/OrderProvider';
import { useParams } from 'next/navigation';

interface CompletedOrderData {
  id: string;
  storeName: string;
  address: string;
  distance: string;
  imageUrl: string;
  completedTime: string;
  items: Array<{
    quantity: number;
    name: string;
    description: string;
    price: number;
  }>;
  totalPrice: number;
  amountSaved: number;
  orderId: string;
  paymentMethod: string;
  impact: {
    foodSaved: number;
    co2Avoided: number;
  };
}

export default function CompletedOrderPage() {
  const {order} = useOrder();
  const params = useParams();
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col max-w-md mx-auto">
      <PageHeader
        title="Order Details"
        showBack={true}
        onBackClick={() => window.history.back()}
      />

      <main className="flex-1 overflow-y-auto pb-24">
        {/* Completed Status Card */}
        <div className="p-4">
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center gap-3 border border-gray-100 dark:border-gray-800">
            <div className="relative mb-1 group">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl transform scale-110 group-hover:scale-125 transition-transform duration-700"></div>
              <div className="relative w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-soft">
                <span className="material-symbols-outlined text-white text-[40px] font-bold">
                  check
                </span>
              </div>
            </div>
            <h2 className="text-xl font-bold text-text-main-light dark:text-text-main-dark">
              Order Completed
            </h2>
            <p className="text-text-sub-light dark:text-text-sub-dark font-medium">
              {"///completed time"}
            </p>
          </div>
        </div>

        {/* Impact Card */}
        <div className="px-4 pb-4">
          <div className="relative overflow-hidden bg-primary/5 dark:bg-primary/10 border border-primary/10 rounded-xl p-5">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary filled text-[20px]">
                  eco
                </span>
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">
                  Your Impact
                </h4>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between border-b border-primary/10 pb-3 last:border-0 last:pb-0 border-dashed">
                  <span className="text-sm font-medium text-text-sub-light dark:text-text-sub-dark">
                    Food saved
                  </span>
                  <span className="text-lg font-extrabold text-text-main-light dark:text-text-main-dark text-right">
                    {"//order.impact.foodSaved"} kg
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-medium text-text-sub-light dark:text-text-sub-dark">
                    CO₂ avoided
                  </span>
                  <span className="text-lg font-extrabold text-text-main-light dark:text-text-main-dark text-right">
                    {"//order.impact.co2Avoided"} kg
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Merchant Card */}
        <div className="px-4 mb-6 mt-4">
          <MerchantCard
            storeName={order?.listings.merchants.merchant_name}
            address={order?.listings.merchants.address}
            distance={"distance"}
            imageUrl={'merchant_image_url'}
          />
        </div>

        {/* Order Summary */}
        <div className="px-4 mb-6">
          <h3 className="text-base font-bold text-text-main-light dark:text-text-main-dark mb-4 px-1">
            Order Summary
          </h3>
          <OrderSummary
            item={order}
            amountSaved={order?.formatted.saved_price}
          />
        </div>

        {/* Order Details */}
        <div className="px-4 mb-6">
          <OrderDetailsInfo
            orderId={order?.public_id}
            paymentMethod={'///payment method'}
          />
        </div>

        {/* Action Buttons */}
        <div className="px-4 pb-8 space-y-3">
          <Link
            href={`/order/${params.id}/rate`}
            className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-slate-900 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              star
            </span>
            Rate Store
          </Link>
          <Link
            href={`/order/${params.id}/review`}
            className="w-full py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-800 text-text-main-light dark:text-text-main-dark font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              rate_review
            </span>
            Write Review
          </Link>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-surface-light dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800 px-2 pb-6 pt-2 z-40">
        <div className="flex justify-between items-end">
          <Link
            href="/"
            className="flex flex-1 flex-col items-center justify-end gap-1 group text-text-sub-light dark:text-text-sub-dark group-hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">home</span>
            <p className="text-[10px] font-medium">Home</p>
          </Link>
          <Link
            href="/search"
            className="flex flex-1 flex-col items-center justify-end gap-1 group text-text-sub-light dark:text-text-sub-dark group-hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">
              search
            </span>
            <p className="text-[10px] font-medium">Search</p>
          </Link>
          <Link
            href="/history"
            className="flex flex-1 flex-col items-center justify-end gap-1"
          >
            <div className="flex h-8 w-14 rounded-full bg-primary/20 items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[24px]">
                receipt_long
              </span>
            </div>
            <p className="text-[10px] font-bold text-primary">Orders</p>
          </Link>
          <Link
            href="/saved"
            className="flex flex-1 flex-col items-center justify-end gap-1 group text-text-sub-light dark:text-text-sub-dark group-hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">
              bookmark
            </span>
            <p className="text-[10px] font-medium">Saved</p>
          </Link>
          <Link
            href="/profile"
            className="flex flex-1 flex-col items-center justify-end gap-1 group text-text-sub-light dark:text-text-sub-dark group-hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">
              person
            </span>
            <p className="text-[10px] font-medium">Profile</p>
          </Link>
        </div>
      </nav>
    </div>
  );
}
