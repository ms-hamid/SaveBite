// "use client";

import { Listing } from "@/types";


function formatPrice(price?: number) {
  if (!price) return "";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ListingCard({
    listing,
    onDelete,
    onEdit,
}: {listing: Listing, onDelete: () => void, onEdit: () => void}) {
    const status = listing.status;
  const isActive = status === "open";
  const isEnded = status === "close";
  const isDraft = status === "draft";

//   const progress = stock > 0 ? Math.min((sold / stock) * 100, 100) : 0;

  return (
    <div
      className={`
        bg-white rounded-2xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]
        flex flex-col gap-3
        ${isDraft ? "border border-dashed border-slate-300" : "border border-slate-100"}
      `}
    >
      <div className="flex gap-4 items-center">
        {/* Image */}
        {isDraft && !listing.img_url ? (
          <div className="w-20 h-20 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-200 border-dashed shrink-0">
            <span className="material-symbols-outlined text-[28px]">image</span>
          </div>
        ) : (
          <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-100 relative">
            <img
              className={`
                w-full h-full object-cover
                ${isEnded ? "grayscale-[40%]" : ""}
              `}
              src={listing.img_url ?? "https://upload.wikimedia.org/wikipedia/commons/6/60/No-Image-Placeholder-banner.svg"}
              alt={listing.name ?? ""}
            />

            {isEnded && <div className="absolute inset-0 bg-white/20" />}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between py-1 h-20">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h3
                className={`
                  font-bold truncate text-base
                  ${isEnded ? "text-slate-500" : "text-slate-900"}
                `}
              >
                {listing.name}
              </h3>

              {/* Badge */}
              {isActive && true && (
                <span className="bg-red-50 text-red-600 font-bold text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap border border-red-100 uppercase tracking-tight flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">
                    local_fire_department
                  </span>
                  Fast
                </span>
              )}

              {isEnded && (
                <span className="bg-slate-100 text-slate-500 font-bold text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap border border-slate-200 uppercase tracking-tight">
                  Ended
                </span>
              )}

              {isDraft && (
                <span className="bg-blue-50 text-blue-600 font-bold text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap border border-blue-100 uppercase tracking-tight flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">
                    edit_note
                  </span>
                  Draft
                </span>
              )}
            </div>

            {isDraft ? (
              <p className="text-xs font-bold text-amber-600 mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                  info
                </span>
                Incomplete details
              </p>
            ) : (
              <p
                className={`
                  text-xs font-medium mt-1
                  ${isEnded ? "text-slate-400" : "text-slate-500"}
                `}
              >
                {listing.close_time}
              </p>
            )}
          </div>

          {!isDraft && (
            <div className="flex justify-between items-end mt-auto">
              <span
                className={`
                  text-lg leading-none font-bold
                  ${isEnded ? "text-slate-500" : "text-slate-900"}
                `}
              >
                {formatPrice(listing.discount_price ?? 0)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Progress */}
      {!isDraft && (
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
          <div
            className={`
              flex items-center justify-between text-xs mb-1
              ${isEnded ? "text-slate-400" : "text-slate-600"}
            `}
          >
            <span>Stock Progress</span>
            <span
              className={`
                font-bold
                ${isActive ? "text-primary-emerald" : ""}
              `}
            >
              {listing.sold_total} sold (of {listing.stock_total})
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`
                h-1.5 rounded-full
                ${isEnded ? "bg-slate-400" : "bg-primary-emerald"}
              `}
              style={{ width: `${listing.stock_total / listing.sold_total}%` }}
            />
          </div>

          {/* Actions */}
          {isActive && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={onEdit}
                className="flex-1 py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">
                  edit
                </span>
                Edit
              </button>

              <button
                onClick={onDelete}
                className="flex-1 py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-bold text-red-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">
                  delete
                </span>
                Delete
              </button>
            </div>
          )}

          {isEnded && (
            <div className="flex gap-2 mt-2">
              <button
                // onClick={onRelist}
                className="flex-1 py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Re-list
              </button>

              <button
                // onClick={onViewDetails}
                className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
              >
                View details
              </button>
            </div>
          )}
        </div>
      )}

      {/* Draft Actions */}
      {isDraft && (
        <div className="flex gap-2 pt-2 border-t border-slate-100">
          <button
            // onClick={onContinueEditing}
            className="w-full py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">edit</span>
            Continue Editing
          </button>
        </div>
      )}
    </div>
  );
}