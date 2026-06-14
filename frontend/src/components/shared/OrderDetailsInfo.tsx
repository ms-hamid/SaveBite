'use client';

interface OrderDetailsInfoProps {
  orderId: string | undefined;
  paymentMethod: string | undefined;
  paymentIcon?: string | undefined;
}

export function OrderDetailsInfo({
  orderId,
  paymentMethod,
  paymentIcon = 'credit_card',
}: OrderDetailsInfoProps) {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-0 shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-800/50">
        <span className="text-sm text-text-sub-light dark:text-text-sub-dark">
          Order ID
        </span>
        <span className="text-sm font-medium text-text-main-light dark:text-text-main-dark">
          {orderId}
        </span>
      </div>
      <div className="p-4 flex justify-between items-center">
        <span className="text-sm text-text-sub-light dark:text-text-sub-dark">
          Payment Method
        </span>
        <span className="text-sm font-medium text-text-main-light dark:text-text-main-dark flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">
            {paymentIcon}
          </span>
          {paymentMethod}
        </span>
      </div>
    </div>
  );
}
