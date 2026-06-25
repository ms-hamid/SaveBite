'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  PageHeader,
  StatusBadge,
  MerchantCard,
  OrderSummary,
  OrderDetailsInfo,
} from '../../../../components/shared';
import { useOrder } from '../../../../components/providers/OrderProvider';
import { useParams } from 'next/navigation';

export default function UpcomingOrderPage() {
  const params = useParams();
  const {order, setOrder} = useOrder();
  const [timeRemaining, setTimeRemaining] = useState('1h 24m');
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    // Mock order data - in real app, fetch from API
    // const order: OrderData = {
    //   id: params.id,
    //   storeName: 'Green Leaf Bakery',
    //   address: '123 Market Street, Downtown',
    //   distance: '0.8 mi',
    //   imageUrl:
    //     'https://lh3.googleusercontent.com/aida-public/AB6AXuAtO-sj3nO3ygiNwD6L5vxQ0qfa43NlEHE4FZpw8m2JnBd8UJQwXLH5xgG1J0ZxoIU7ZEg8DjrJc8foFhjCMMVMEQC1h8oNLN4kDv4h36eP47ITTZJ2kimC5WvJLdoNXhR7rpd8Z2CfhLTn-TC58kUgmrTvXRSCpeZ8IgOsBVM075iT7PdlAhnIeStNIvj5aGR24Z6GMHpxZI9N8WHyvvdgsc6x-3vDEdIyuEwvKQlac2l_mv74KPcPAZU7rUqEO3UV4LOj9rLiUpeH',
    //   pickupTime: 'Pickup in 1h 24m',
    //   pickupWindow: 'Today, 5:30 PM – 6:00 PM',
    //   timeRemaining: '1h 24m',
    //   items: [
    //     {
    //       quantity: 1,
    //       name: 'Surprise Bag (Large)',
    //       description: 'Assorted Pastries & Bread',
    //       price: 5.99,
    //     },
    //   ],
    //   totalPrice: 5.99,
    //   amountSaved: 12.0,
    //   orderId: '#ORD-9283-KA',
    //   paymentMethod: 'Apple Pay',
    //   paymentIcon: 'credit_card',
    //   isCancellable: true,
    // };

    // setOrder(order);

    // Start countdown timer
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        // Simple time update (in real app, would calculate from actual time)
        return prev;
      });
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [params.id]);

  const handleGetDirections = () => {
    // In real app, open maps
    console.log('Get directions for:', "order?.address");
  };

  const handleCancelOrder = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    // In real app, make API call to cancel
    console.log('Order cancelled');
    setShowCancelModal(false);
  };

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-sub-light dark:text-text-sub-dark">
            Loading order...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col max-w-md mx-auto">
      <PageHeader
        title="Order Details"
        showBack={true}
        onBackClick={() => window.history.back()}
      />

      <main className="flex-1 overflow-y-auto pb-24">
        {/* Status Section */}
        <div className="px-4 py-8 flex flex-col items-center justify-center bg-surface-light dark:bg-surface-dark shadow-sm">
          <StatusBadge
            status="upcoming"
            label="Upcoming Pickup"
            className="mb-3"
          />
          <h1 className="text-3xl font-bold text-text-main-light dark:text-text-main-dark text-center mb-2">
            Pickup in {timeRemaining}
          </h1>
          <p className="text-text-sub-light dark:text-text-sub-dark font-medium text-center">
            {"order.pickupWindow"}
          </p>
        </div>

        {/* Merchant Card */}
        <div className="px-4 mt-6">
          <MerchantCard
            storeName={order.listing?.merchant?.merchant_name ?? ""}
            address={order.listing?.merchant?.address}
            distance={"order.distance"}
            imageUrl={order.listing?.img_url ?? ""}
            onGetDirections={handleGetDirections}
          />
        </div>

        {/* Order Summary */}
        <div className="px-4 mt-6">
          <h3 className="text-base font-bold text-text-main-light dark:text-text-main-dark mb-4 px-1">
            Order Summary
          </h3>
          <OrderSummary
            item={order}
            amountSaved={order.formatted?.saved_price ?? ""}
          />
        </div>

        {/* Order Details */}
        <div className="px-4 mt-6 mb-6">
          <OrderDetailsInfo
            orderId={order.public_id}
            paymentMethod={"order.paymentMethod"}
            paymentIcon={"credit_card"}
          />
        </div>

        {/* Cancel Button */}
        <div className="px-4 mt-8 pb-8">
          <button
            onClick={handleCancelOrder}
            className="w-full py-3.5 px-4 rounded-xl border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 font-semibold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">
              cancel
            </span>
            Cancel Order
          </button>
          {"order.isCancellable" === "order.isCancellable"  && (
            <p className="text-xs text-center text-text-sub-light dark:text-text-sub-dark mt-4 px-8">
              Cancellations are only available up to 2 hours before the pickup
              window starts.
            </p>
          )}
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

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 dark:bg-black/70">
          <div className="w-full max-w-md bg-surface-light dark:bg-surface-dark rounded-t-2xl p-6 animate-in slide-in-from-bottom">
            <h3 className="text-lg font-bold text-text-main-light dark:text-text-main-dark mb-2">
              Cancel Order?
            </h3>
            <p className="text-sm text-text-sub-light dark:text-text-sub-dark mb-6">
              Are you sure you want to cancel this order? You will not be
              charged.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-800 text-text-main-light dark:text-text-main-dark font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Keep Order
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
