import { format_price, get_close_text, set_to_hour } from "@/lib/format";
import { Listing } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default function FoodCard({
  item,
  is_favorite = false,
  onToggleFavorite,
}: {
  item: Listing & { distance_km?: number };
  /** Whether this listing is currently saved by the user */
  is_favorite?: boolean;
  /** Called when the heart button is clicked — parent handles the API call */
  onToggleFavorite?: (publicId: string) => void;
}) {
  return (
    <Link
      href={`/product/${item.public_id}`}
      className="bg-white dark:bg-card-dark rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-800 active:scale-[0.99] transition-transform cursor-pointer block"
    >
      <div className="relative h-40 w-full mb-3 overflow-hidden rounded-lg">
        <Image
          src={
            item.img_url && item.img_url.trim() !== ""
              ? item.img_url
              : "https://upload.wikimedia.org/wikipedia/commons/6/60/No-Image-Placeholder-banner.svg"
          }
          alt={item.name ?? ""}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
          Save {item.discount_percentage}%
        </div>

        {/* Heart / favorite button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite?.(item.public_id);
          }}
          className="absolute top-2 right-2 p-1.5 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-white hover:text-red-500 transition-colors"
          aria-label={is_favorite ? "Remove from saved" : "Save listing"}
        >
          <span
            className={`material-symbols-outlined text-[20px] transition-colors ${
              is_favorite ? "text-red-500" : "text-white"
            }`}
            style={{
              fontVariationSettings: is_favorite ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            favorite
          </span>
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">
              {item.name}
            </h3>

            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
              {item.merchant?.merchant_name}
            </p>
          </div>

          <div className="text-right flex flex-col items-end">
            <span className="block text-xs text-slate-400 line-through font-medium mb-0.5">
              {format_price(item.original_price)}
            </span>

            <span className="block text-primary font-bold text-xl leading-none">
              {format_price(item.discount_price)}
            </span>

            <span className="block text-[10px] text-green-600 dark:text-green-400 font-semibold mt-0.5 bg-green-50 dark:bg-green-900/30 px-1.5 rounded-sm">
              Save {format_price((item.original_price ?? 0) - (item.discount_price ?? 0))}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-300 text-xs font-medium">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              {set_to_hour(item.open_time ?? "")} - {set_to_hour(item.close_time ?? "")}
            </div>

            <div className="flex items-center gap-2 text-[10px] pl-1 font-medium">
              <span className="text-orange-400/90 dark:text-orange-300">
                {get_close_text(item.close_time ?? "")}
              </span>

              <span className="text-slate-400">•</span>

              <span className="text-slate-500 dark:text-slate-400">
                {item.stock_total - item.sold_total} left
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium self-start mt-1">
            <span className="material-symbols-outlined text-[16px]">distance</span>
            {item.distance_km != null
              ? `${Number(item.distance_km).toFixed(1)} km`
              : "tidak dapat lokasi"}
          </div>
        </div>
      </div>
    </Link>
  );
}
