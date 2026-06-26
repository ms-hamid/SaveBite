"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import CustomerNavbar from "../../components/navbar/customer_navbar";
import FoodCard from "@/components/FoodListCard";
import {
  getFavorites,
  toggleFavorite as apiFavorite,
  type FavoriteListingItem,
  type FavoriteFilters,
} from "@/services/favorite";
import { Listing } from "@/types";

// ─── Price presets ────────────────────────────────────────────────────────────
const PRICE_PRESETS = [
  { label: "Under 10k", min: "0",     max: "10000"  },
  { label: "Under 20k", min: "0",     max: "20000"  },
  { label: "Under 50k", min: "0",     max: "50000"  },
  { label: "50k+",      min: "50000", max: ""       },
];

const CATEGORIES = ["Bakery", "Meals", "Groceries", "Desserts", "Vegan", "Beverages"];

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 pt-4 pb-24">
      <div className="mb-6">
        <div className="relative bg-white dark:bg-slate-800 rounded-full p-6 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
          <span className="material-symbols-outlined text-primary text-[64px]" aria-hidden="true">
            bookmark
          </span>
          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-1">
            <span className="material-symbols-outlined text-slate-900 dark:text-white text-[24px]" aria-hidden="true">
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
          Tap the heart icon on any listing to save it here.
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
  const [listings, setListings]     = useState<FavoriteListingItem[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // Search & filter state
  const [search, setSearch]           = useState("");
  const [debouncedSearch, setDebounced] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterMin, setFilterMin]     = useState("");
  const [filterMax, setFilterMax]     = useState("");

  // Debounce search
  const debRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debRef.current) clearTimeout(debRef.current);
    debRef.current = setTimeout(() => setDebounced(search), 350);
    return () => { if (debRef.current) clearTimeout(debRef.current); };
  }, [search]);

  // Load saved listings whenever filters change
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      try {
        const filters: FavoriteFilters = {};
        if (debouncedSearch.trim()) filters.q = debouncedSearch.trim();
        if (filterCategory)          filters.category = filterCategory;
        if (filterMin)               filters.min_price = Number(filterMin);
        if (filterMax)               filters.max_price = Number(filterMax);

        const res = await getFavorites(filters);
        if (cancelled) return;

        const data: FavoriteListingItem[] = res.data ?? [];
        setListings(data);
        // Build initial favoriteIds from the loaded listings (all are favorites)
        setFavoriteIds(new Set(data.map((l) => l.public_id)));
      } catch (err) {
        console.error("Failed to load saved listings:", err);
        if (!cancelled) setListings([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [debouncedSearch, filterCategory, filterMin, filterMax]);

  // Toggle favorite: optimistic + API call
  const handleToggleFavorite = useCallback(async (publicId: string) => {
    // Optimistic: remove from local list immediately
    setListings((prev) => prev.filter((l) => l.public_id !== publicId));
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      next.delete(publicId);
      return next;
    });
    try {
      await apiFavorite(publicId);
    } catch {
      // On error: reload to get the real state
      const res = await getFavorites().catch(() => ({ data: [] }));
      const data: FavoriteListingItem[] = res.data ?? [];
      setListings(data);
      setFavoriteIds(new Set(data.map((l) => l.public_id)));
    }
  }, []);

  const activePricePreset = PRICE_PRESETS.find(
    (p) => p.min === filterMin && p.max === filterMax
  );
  const hasFilterBadge = !!filterCategory || !!filterMin || !!filterMax;

  function clearFilters() {
    setFilterCategory("");
    setFilterMin("");
    setFilterMax("");
  }

  // Cast FavoriteListingItem → Listing shape expected by FoodCard
  function toListingItem(item: FavoriteListingItem): Listing & { distance_km?: number } {
    return {
      id: Number(item.id),
      public_id: item.public_id,
      name: item.name,
      open_time: item.open_time,
      close_time: item.close_time,
      sold_total: item.sold_total,
      stock_total: item.stock_total,
      description: item.description ?? null,
      is_open: null,
      original_price: item.original_price !== null ? Number(item.original_price) : null,
      discount_price: item.discount_price !== null ? Number(item.discount_price) : null,
      discount_percentage: item.discount_percentage !== null ? Number(item.discount_percentage) : null,
      deleted_at: null,
      merchant_id: item.merchant_id,
      img_url: item.img_url,
      status: item.status as Listing["status"],
      merchant: item.merchant
        ? {
            merchant_name: item.merchant.merchant_name,
            user_id: "",
            latitude: null,
            longitude: null,
            kyc_status: null,
            google_map_url: null,
            virtual_balance: null,
            address: item.merchant.address,
            bank_name: null,
            bank_account: null,
            category: item.merchant.category,
            desc: null,
            pickup_instruction: null,
            contactless_pickup: false,
            notify_staff_upon_arrival: false,
            pickup_open: item.merchant.pickup_open,
            pickup_close: item.merchant.pickup_close,
            same_day_pickup: false,
            max_prep_time: null,
            rating: null,
            rating_times: 0,
            profile_pic: null,
          }
        : null,
      formatted: null,
      distance_km: item.distance_km,
    };
  }

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden max-w-md mx-auto bg-white dark:bg-surface-dark shadow-2xl">
      {/* ── Header ── */}
      <header className="sticky top-0 z-10 bg-white/95 dark:bg-surface-dark/95 px-4 pt-5 pb-3 backdrop-blur-md border-b border-slate-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="w-8" aria-hidden="true" />
          <h1 className="text-base font-bold text-center text-slate-900 dark:text-white">Saved</h1>
          <div className="w-8" aria-hidden="true" />
        </div>

        {/* Search + filter toggle */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
            </span>
            <input
              className="block h-11 w-full pl-10 pr-3 border-none rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium transition-all shadow-sm"
              placeholder="Search saved food..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className={`relative h-11 w-11 flex items-center justify-center rounded-xl transition-colors shadow-sm ${
              showFilters || hasFilterBadge
                ? "bg-primary/10 text-primary"
                : "bg-primary text-white"
            }`}
          >
            <span className="material-symbols-outlined">tune</span>
            {hasFilterBadge && !showFilters && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white dark:border-surface-dark" />
            )}
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="mt-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-lg space-y-4">
            {/* Category chips */}
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Category
              </p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFilterCategory((c) => (c === cat ? "" : cat))}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      filterCategory === cat
                        ? "bg-primary text-white border-primary"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price presets */}
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Price Range
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {PRICE_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setFilterMin(p.min);
                      setFilterMax(p.max);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      activePricePreset?.label === p.label
                        ? "bg-primary text-white border-primary"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Min (Rp)
                  <input
                    type="number"
                    inputMode="numeric"
                    value={filterMin}
                    onChange={(e) => setFilterMin(e.target.value)}
                    placeholder="0"
                    className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-primary"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Max (Rp)
                  <input
                    type="number"
                    inputMode="numeric"
                    value={filterMax}
                    onChange={(e) => setFilterMax(e.target.value)}
                    placeholder="Tanpa batas"
                    className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-primary"
                  />
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={clearFilters}
                className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="flex-1 py-2 rounded-xl bg-primary text-white text-sm font-semibold transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {/* Active filter chips (collapsed) */}
        {hasFilterBadge && !showFilters && (
          <div className="flex flex-wrap gap-2 mt-2">
            {filterCategory && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {filterCategory}
                <button type="button" onClick={() => setFilterCategory("")}>
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </span>
            )}
            {(filterMin || filterMax) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                Rp {filterMin ? Number(filterMin).toLocaleString("id-ID") : "0"} –{" "}
                {filterMax ? `Rp ${Number(filterMax).toLocaleString("id-ID")}` : "∞"}
                <button type="button" onClick={() => { setFilterMin(""); setFilterMax(""); }}>
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </span>
            )}
          </div>
        )}
      </header>

      {/* ── Content ── */}
      {isLoading ? (
        <main className="flex-1 overflow-y-auto scrollbar-hide pb-24 px-4 pt-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-card-dark rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-800 animate-pulse"
            >
              <div className="h-40 w-full mb-3 rounded-lg bg-slate-200 dark:bg-slate-700" />
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col gap-2 flex-1 mr-4">
                  <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
                  <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="h-7 w-28 bg-slate-100 dark:bg-slate-800 rounded" />
                <div className="h-4 w-14 bg-slate-100 dark:bg-slate-800 rounded" />
              </div>
            </div>
          ))}
        </main>
      ) : listings.length === 0 ? (
        <EmptyState />
      ) : (
        <main className="flex-1 overflow-y-auto scrollbar-hide pb-24 px-4 pt-4 space-y-4">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 pb-1">
            {listings.length} saved item{listings.length !== 1 ? "s" : ""}
          </p>
          {listings.map((item) => (
            <FoodCard
              key={item.public_id}
              item={toListingItem(item)}
              is_favorite={favoriteIds.has(item.public_id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </main>
      )}

      <CustomerNavbar active_tab="saved" />
    </div>
  );
}
