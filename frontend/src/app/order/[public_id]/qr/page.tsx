'use client';

import { useParams } from 'next/navigation';
import { PageHeader } from '../../../../components/shared';
import { useEffect, useState } from 'react';
import { useOrder } from '../../../../components/providers/OrderProvider';

export default function OrderQRPage() {
  // Generate a simple QR code using a QR code API
  const {order} = useOrder()
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${order?.public_id}`;
  
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col max-w-md mx-auto">
      <PageHeader
        title="Pickup Code"
        showBack={true}
        onBackClick={() => window.history.back()}
      />

      <main className="flex-1 flex flex-col items-center justify-center pb-24 px-4">
        {/* QR Code Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 w-full max-w-xs">
          <div className="space-y-6">
            {/* QR Code Image */}
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  width={256}
                  height={256}
                  className="w-70 h-70"
                />
              </div>
            </div>

            {/* Pickup Code */}
            <div className="text-center">
              <p className="text-xs uppercase tracking-widest text-text-sub-light dark:text-text-sub-dark font-medium mb-2">
                Your Pickup Code
              </p>
              <div className="bg-primary/10 dark:bg-primary/20 rounded-lg py-3 px-4 border border-primary/30">
                <p className="text-2xl font-bold text-primary font-mono">
                  {order?.order_code}
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
                <span className="font-semibold">Show this code to the staff</span> at the pickup counter to collect your order. You can show either the QR code above or your pickup code.
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'SaveBite Pickup Code',
                    text: 'Here is my SaveBite pickup code',
                  });
                } else {
                  alert('Share functionality not supported');
                }
              }}
              className="w-full py-3 px-4 rounded-lg bg-primary hover:bg-primary/90 text-slate-900 font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">
                share
              </span>
              Share Pickup Code
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
