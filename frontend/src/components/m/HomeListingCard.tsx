type ListingStatus = "selling" | "ended";

export type ActiveListingData = {
  id: number;
  name: string;
  imageUrl: string;
  imageAlt: string;
  price: number;
  status: ListingStatus;
  timeLabel: string;
  soldTotal: number;
  stockTotal: number;
};

type ActiveListingCardProps = {
  listing: ActiveListingData;
  // onPrimaryAction?: (listing: ActiveListingData) => void;
  // onViewDetails?: (listing: ActiveListingData) => void;
};

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ActiveListingCard({
  listing,
  // onPrimaryAction,
  // onViewDetails,
}: ActiveListingCardProps) {
  const isSelling = listing.status === "selling";

  const stockLeft = listing.stockTotal - listing.soldTotal;

  const progressPercentage =
    listing.stockTotal > 0
      ? Math.min((listing.soldTotal / listing.stockTotal) * 100, 100)
      : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] p-4 flex flex-col gap-3">
      <div className="flex gap-4 items-center">
        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-100">
          <img
            alt={listing.imageAlt}
            className="w-full h-full object-cover"
            data-alt={listing.imageAlt}
            src={listing.imageUrl}
          />
        </div>

        <div className="flex-1 flex flex-col justify-between py-1 h-20">
          <div>
            <div className="flex items-center justify-between">
              <h3
                className={`font-semibold text-slate-900 truncate ${
                  isSelling ? "" : "text-base"
                }`}
              >
                {listing.name}
              </h3>

              <span
                className={
                  isSelling
                    ? "bg-emerald-50 text-emerald-700 font-bold text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap border border-emerald-100"
                    : "bg-slate-100 text-slate-500 font-bold text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap border border-slate-200 uppercase tracking-tight"
                }
              >
                {isSelling ? "Selling Fast" : "Ended"}
              </span>
            </div>

            <p
              className={
                isSelling
                  ? "text-xs font-medium text-red-500 mt-1"
                  : "text-xs font-medium text-slate-500 mt-1"
              }
            >
              {listing.timeLabel}
            </p>
          </div>

          <div className="flex justify-between items-end mt-auto">
            <span className="text-lg leading-none font-bold text-slate-900">
              {formatRupiah(listing.price)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress and actions */}
      <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
          <span>Stock Progress</span>

          <span className="font-semibold">
            {isSelling
              ? `${stockLeft} left (of ${listing.stockTotal})`
              : `${listing.soldTotal} sold (of ${listing.stockTotal})`}
          </span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className={
              isSelling
                ? "bg-emerald-500 h-1.5 rounded-full"
                : "bg-slate-400 h-1.5 rounded-full"
            }
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <div className="flex gap-2 mt-2">
          <button
            // onClick={() => onPrimaryAction?.(listing)}
            className="flex-1 py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {isSelling ? "Edit" : "Re-list"}
          </button>

          <button
            // onClick={() => onViewDetails?.(listing)}
            className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
          >
            View details
          </button>
        </div>
      </div>
    </div>
  );
}