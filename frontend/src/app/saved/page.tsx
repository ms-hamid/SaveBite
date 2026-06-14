"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import CustomerNavbar from "../../components/navbar/customer_navbar";

// ─── Types ────────────────────────────────────────────────────────────────────

type TimerColor = "orange" | "red";

type SavedDeal = {
  id: number;
  title: string;
  discount: string;
  itemsLeft: string;
  originalPrice: string;
  salePrice: string;
  merchant: string;
  distance: string;
  endsIn: string;
  pickupTime: string;
  image: string;
  icon: string;
  timerColor: TimerColor;
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_DEALS: SavedDeal[] = [
  {
    id: 1,
    title: "Surprise Bag - Bakery",
    discount: "Save 60%",
    itemsLeft: "3 left",
    originalPrice: "$15.00",
    salePrice: "$5.99",
    merchant: "Golden Crust Bakery",
    distance: "1.2 km",
    endsIn: "Ends in 45 min",
    pickupTime: "Pickup 4:30 PM - 5:30 PM",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAMMffwUlXgIkSwtlpH4O6QI1arOLB9l2ShPzr0T0tjbZCx6VFxL0Xp-m3fe8m3gZlRyLDrr0F2U9-DMjDKHfJtYslUtDex3tV5kLBX5EsKmgtXeS8v3pxgTlTlIR5Pxw7p0HwNITzefmmGTChP_fVKrimylK5TbIU-_CtUqVxAR7kzVTaiXIjiQzWaB45Jm46XlFFVkJc5NMZFHRx_cz-bhPKIL1Du1SebnIIRS8lyp_WPN9cnhClRNqYj5a63eA1eBWRIwG-8XCiw",
    icon: "storefront",
    timerColor: "orange",
  },
  {
    id: 2,
    title: "Dinner Box",
    discount: "Save 50%",
    itemsLeft: "1 left",
    originalPrice: "$22.00",
    salePrice: "$11.00",
    merchant: "Sushi Zen",
    distance: "0.8 km",
    endsIn: "Ends in 20 min",
    pickupTime: "Pickup 5:00 PM - 6:00 PM",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBuTYeUsGff3ih2EUVzKkojvbmWnp__cRf7wA6U5TeNyC_iAB-CbS8ZS54voiL-S7oUSOwqTd3RXoIvrVeO5v2ivQFJ7bZpqL2NKCNZjxCMPACUS6Ux-DVqe0g9Tcu6bBnbs0XpF2W3nJ9RkL_6WmQEV8SUwbYDXo-_VfMPcCOiApH8xQubUR3PaSk80u1g5QoVC8cv-mAi7wxKrK6i8ZPphnhqSVy16ZLDWpGj1Zr2oV_O6gsvwcZCbu8Tv6565RDc6qjDpIw24Fl5",
    icon: "restaurant",
    timerColor: "red",
  },
  {
    id: 3,
    title: "Fresh Vegetarian Pizza",
    discount: "Save 40%",
    itemsLeft: "5 left",
    originalPrice: "$18.00",
    salePrice: "$10.80",
    merchant: "Pizza Corner",
    distance: "0.5 km",
    endsIn: "Ends in 15 min",
    pickupTime: "Pickup 5:30 PM - 6:30 PM",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAWhWH_1Rbcdl0JnnLyw-1QiAHXD-ZKjvtNRbuDu2LuF9Lgto0KLZhI54xQ2OCo1nW3-tYx59Sejci7XuF12tELYPHuRgiT0dACdlr52TK0rlZ7BEjoCfOppRw4FQBEKytXvzYnA8p-tVhe17Ad67wHY3v5qK4VVo2ytc4xxchRuiKIhtsTVI0HOGU2Aw3mLzRa-8xHER8p7BbC2HCw6zGWOWaQusbtjAXLL6i7liiMWyrTbCdwyO26mBIjqTSPuBmddgHNVb-uByB8c",
    icon: "local_pizza",
    timerColor: "red",
  },
];

// ─── Timer badge ──────────────────────────────────────────────────────────────

const timerVariants: Record<TimerColor, string> = {
  orange:
    "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-100 dark:border-orange-800/30",
  red: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-100 dark:border-red-800/30",
};

// ─── Deal card ────────────────────────────────────────────────────────────────

function DealCard({
  deal,
  onUnsave,
}: {
  deal: SavedDeal;
  onUnsave: (id: number) => void;
}) {
  return (
    <article className="group relative flex flex-col gap-2">
      {/* Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800 shadow-sm">
        <img
          src={deal.image}
          alt={deal.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top-left badges */}
        <div className="absolute left-2 top-2 flex gap-1.5" aria-hidden="true">
          <span className="inline-flex items-center rounded bg-primary/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm">
            {deal.discount}
          </span>
          <span className="inline-flex items-center rounded bg-white/70 dark:bg-black/50 px-2 py-0.5 text-[10px] font-bold text-slate-800 dark:text-white shadow-sm backdrop-blur-sm">
            {deal.itemsLeft}
          </span>
        </div>

        {/* Unsave button */}
        <button
          type="button"
          onClick={() => onUnsave(deal.id)}
          aria-label={`Remove ${deal.title} from saved`}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm transition active:scale-90 hover:bg-white dark:hover:bg-slate-700"
        >
          <span
            className="material-symbols-outlined text-[18px] text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
            aria-hidden="true"
          >
            favorite
          </span>
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-baseline">
          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight truncate pr-2">
            {deal.title}
          </h3>
          <div className="flex items-baseline gap-1.5 shrink-0">
            <span className="text-xs text-slate-400 line-through decoration-slate-400">
              {deal.originalPrice}
            </span>
            <span className="text-base font-extrabold text-primary">{deal.salePrice}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
            {deal.icon}
          </span>
          <span className="truncate">{deal.merchant}</span>
          <span className="mx-0.5 text-slate-300" aria-hidden="true">•</span>
          <span>{deal.distance}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-0.5">
          <span
            className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold border ${timerVariants[deal.timerColor]}`}
          >
            <span className="material-symbols-outlined mr-0.5 text-[12px]" aria-hidden="true">
              timer
            </span>
            {deal.endsIn}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            {deal.pickupTime}
          </span>
        </div>
      </div>
    </article>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 pt-4 pb-24">
      <div className="mb-6">
        <div className="relative bg-white dark:bg-slate-800 rounded-full p-6 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
          <span
            className="material-symbols-outlined text-primary text-[64px]"
            aria-hidden="true"
          >
            bookmark
          </span>
          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-1">
            <span
              className="material-symbols-outlined text-slate-900 dark:text-white text-[24px]"
              aria-hidden="true"
            >
              favorite
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 mb-8 max-w-[280px]">
        <h2 className="text-slate-900 dark:text-white text-2xl font-extrabold leading-tight text-center">
          No saved deals yet
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-tight text-center opacity-80">
          Tap the heart icon to save your favourite food and help reduce waste.
        </p>
      </div>

      <Link
        href="/search"
        className="w-[85%] bg-primary hover:bg-primary/90 text-white text-base font-bold h-12 rounded-lg flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
      >
        Browse Deals
      </Link>
    </main>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SavedPage() {
  const [savedDeals, setSavedDeals] = useState<SavedDeal[]>(MOCK_DEALS);

  const handleUnsave = useCallback((id: number) => {
    setSavedDeals((prev) => prev.filter((deal) => deal.id !== id));
  }, []);

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden max-w-md mx-auto bg-white dark:bg-surface-dark shadow-2xl">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between bg-white/95 dark:bg-surface-dark/95 px-4 py-4 backdrop-blur-md border-b border-slate-100 dark:border-gray-800">
        {/* Spacer keeps title centred */}
        <div className="w-8" aria-hidden="true" />
        <h1 className="text-base font-bold text-center text-slate-900 dark:text-white">
          Saved
          
        </h1>
        <div className="w-8" aria-hidden="true" />
      </header>

      {savedDeals.length === 0 ? (
        <EmptyState />
      ) : (
        <main className="flex-1 overflow-y-auto scrollbar-hide pb-24 px-4 pt-4 space-y-4">
          {savedDeals.map((deal) => (
            <DealCard key={deal.id} deal={deal} onUnsave={handleUnsave} />
          ))}
        </main>
      )}

      <CustomerNavbar active_tab="saved" />
    </div>
  );
}