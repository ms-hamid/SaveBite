'use client';

interface DealCardProps {
  storeName: string;
  discount: number;
  price: number;
  originalPrice: number;
  category: string;
  imageUrl: string;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

export function DealCard({
  storeName,
  discount,
  price,
  originalPrice,
  category,
  imageUrl,
  isSaved = false,
  onToggleSave,
}: DealCardProps) {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="relative h-40 bg-gray-200 overflow-hidden">
        <img
          src={imageUrl ?? "https://upload.wikimedia.org/wikipedia/commons/6/60/No-Image-Placeholder-banner.svg"}
          alt={storeName}
          className="w-full h-full object-cover"
        />
        {/* Discount Badge */}
        <div className="absolute top-3 right-3 bg-primary text-slate-900 px-2 py-1 rounded-md text-sm font-bold">
          -{discount}%
        </div>
        {/* Save Button */}
        <button
          onClick={onToggleSave}
          className="absolute top-3 left-3 bg-white/90 dark:bg-slate-800/90 p-2 rounded-full hover:bg-white dark:hover:bg-slate-700 transition-colors"
        >
          <span className={`material-symbols-outlined ${isSaved ? 'text-red-500 fill-1' : 'text-gray-600'}`}>
            favorite
          </span>
        </button>
      </div>

      <div className="p-3">
        <p className="text-xs text-text-sub-light dark:text-text-sub-dark font-medium mb-1">
          {category}
        </p>
        <h3 className="text-sm font-bold text-text-main-light dark:text-text-main-dark mb-2">
          {storeName}
        </h3>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-primary">
            ${price.toFixed(2)}
          </span>
          <span className="text-xs text-text-sub-light dark:text-text-sub-dark line-through">
            ${originalPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
