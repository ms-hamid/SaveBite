'use client';

import { Order } from "@/types";


interface OrderSummaryProps {
  item: Order | undefined;
  amountSaved?: string | undefined;
}

export function OrderSummary({
  item,
  amountSaved,
}: OrderSummaryProps) {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
      {/* {items?.map((item, idx) => ( */}
        <div
          // key={idx}
          className={`flex justify-between items-start mb-4 pb-4 border-b border-gray-100 dark:border-gray-800/50`}
        >
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded flex items-center justify-center bg-background-light dark:bg-background-dark text-xs font-bold text-text-sub-light dark:text-text-sub-dark">
              {item?.qty}x
            </div>
            <div>
              <p className="text-sm font-semibold text-text-main-light dark:text-text-main-dark">
                {item?.listing?.name}
              </p>
              <p className="text-xs text-text-sub-light dark:text-text-sub-dark mt-0.5">
                {item?.listing?.description}
              </p>
            </div>
          </div>
          <p className="text-sm font-medium text-text-main-light dark:text-text-main-dark">
            {item?.formatted?.dis_price}
          </p>
        </div>

      {/* Total Row */}
      <div className="flex justify-between items-center pt-2">
        <p className="text-base font-bold text-text-main-light dark:text-text-main-dark">
          Total Paid
        </p>
        <p className="text-lg font-bold text-text-main-light dark:text-text-main-dark">
          {item?.formatted?.total_amount}
        </p>
      </div>

      {/* Savings */}
      {amountSaved && (
        <div className="mt-3 text-xs text-text-sub-light dark:text-text-sub-dark flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">
            savings
          </span>
          You saved {amountSaved} on this order!
        </div>
      )}
    </div>
  );
}
