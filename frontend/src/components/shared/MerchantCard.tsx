'use client';

interface MerchantCardProps {
  storeName: string | undefined;
  address: string | undefined | null;
  distance: string | undefined | null;
  imageUrl: string | undefined;
  onGetDirections?: () => void;
}

export function MerchantCard({
  storeName,
  address,
  distance,
  imageUrl,
  onGetDirections,
}: MerchantCardProps) {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex gap-4">
        <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-200">
          <img
            alt={storeName}
            className="w-full h-full object-cover"
            src={imageUrl}
          />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-lg font-bold text-text-main-light dark:text-text-main-dark mb-1">
            {storeName}
          </h3>
          <p className="text-sm text-text-sub-light dark:text-text-sub-dark mb-3">
            {address} • {distance}
          </p>
          <button
            onClick={onGetDirections}
            className="self-start text-sm font-semibold text-emerald-700 dark:text-primary flex items-center gap-1 hover:underline"
          >
            <span className="material-symbols-outlined text-[18px]">
              directions
            </span>
            Get Directions
          </button>
        </div>
      </div>
    </div>
  );
}
