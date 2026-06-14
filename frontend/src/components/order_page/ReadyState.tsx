'use client';

import { useState } from 'react';
import { PageHeader, MerchantCard, OrderSummary, OrderDetailsInfo } from '../shared';
import { Merchant, Order } from '../providers/OrderProvider';


export default function  ReadyOrderPage({order_data, merchant_data, listing_data} : {order_data: Order | undefined, merchant_data: Merchant | undefined, listing_data: Listing | undefined}) {
  const [order] = useState<Order | undefined>(order_data);
// console.log(order_data)

  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order?.order_code ?? "");
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleShowQR = () => {
    // Navigate to QR code page
    window.location.href = `/order/${order?.public_id}/qr`;
  };

  return (
    <>

        {/* Ready Status Card */}
        <div className="mb-6 overflow-hidden rounded-xl bg-primary shadow-lg relative group">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(#004d36 2px, transparent 2px)',
              backgroundSize: '20px 20px',
            }}
          ></div>
          <div className="relative p-6 flex flex-col items-center text-center ">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-surface-light/30 backdrop-blur-sm shadow-sm">
              <span className="material-symbols-outlined text-3xl">
                shopping_bag
              </span>
            </div>
            <h2 className="mb-1 text-2xl font-bold tracking-tight">
              Ready for Pickup
            </h2>
            <p className="mb-4 text-sm font-medium opacity-90">
              Your order is prepared and waiting.
            </p>

            {/* Pickup Code Display */}
            <div className="w-full border-t border-primary-content/20 my-2"></div>
            <div className="mt-4 flex flex-col items-center w-full bg-white p-6 rounded-lg shadow-inner">
              <p className="mb-4 text-sm text-slate-500 font-medium">
                Show this code to staff upon arrival.
              </p>
              <p className="text-3xl font-extrabold tracking-wider text-slate-900 mb-6">
                {order?.order_code}
              </p>
              <button
                onClick={handleShowQR}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-900 py-3 px-4 text-sm font-bold text-white shadow-md hover:bg-slate-800 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">
                  qr_code_2
                </span>
                Show QR Code
              </button>
            </div>
          </div>
        </div>

        {/* Merchant Card */}
        <div className="mt-6">
          <MerchantCard
            storeName={merchant_data?.merchant_name ?? ""}
            address={merchant_data?.address}
            distance={"order.distance"}
            imageUrl={merchant_data?.profile_pic ?? ""}
          />
        </div>

        {/* Order Summary */}
        <div className="mt-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 px-1">
            Order Summary
          </h3>
          <OrderSummary
            item={order}
            amountSaved={order?.formatted.saved_price}
          />
        </div>

        {/* Order Details */}
        <div className="mt-6 mb-6">
          <OrderDetailsInfo
            orderId={order?.order_code}
            paymentMethod={"order.paymentMethod"}
          />
        </div>
      </>
  );
}
