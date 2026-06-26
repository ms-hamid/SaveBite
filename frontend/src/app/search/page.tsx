"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import FoodCard from "@/components/FoodListCard";
import CustomerNavbar from "../../components/navbar/customer_navbar";
import { getListingAll, type ListingSearchParams } from "@/services/listing";
import { Listing } from "@/types";
import { getFavorites } from "@/services/favorite";

type ListingProps = {
  id: number;
  public_id: string;
  name: string;
  open_time: string;
  close_time: string;
  sold_total: number;
  stock_total: number;
  original_price: number | string;
  discount_price: number | string;
  discount_percentage?: number | string | null;
  img_url?: string | null;
  merchants?: { merchant_name: string; category?: string; address?: string };
  merchant?: { merchant_name: string; category?: string; address?: string };
  distance_km?: number | string;
};

function fmt_time(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const CATEGORIES = [
  { label: "Bakery",     icon: "bakery_dining", cls: "bg-orange-50  border-orange-100  text-orange-500  dark:bg-orange-900/20  dark:border-orange-800/30"  },
  { label: "Meals",      icon: "restaurant",    cls: "bg-amber-50   border-amber-100   text-amber-500   dark:bg-amber-900/20   dark:border-amber-800/30"   },
  { label: "Groceries",  icon: "shopping_basket",cls:"bg-emerald-50 border-emerald-100 text-emerald-500 dark:bg-emerald-900/20 dark:border-emerald-800/30" },
  { label: "Desserts",   icon: "icecream",      cls: "bg-pink-50    border-pink-100    text-pink-500    dark:bg-pink-900/20    dark:border-pink-800/30"    },
  { label: "Vegan",      icon: "spa",           cls: "bg-lime-50    border-lime-100    text-lime-600    dark:bg-lime-900/20    dark:border-lime-800/30"    },
  { label: "Beverages",  icon: "local_cafe",    cls: "bg-blue-50    border-blue-100    text-blue-500    dark:bg-blue-900/20    dark:border-blue-800/30"    },
];

const PRICE_PRESETS = [
  { label: "Under 10k",  min: 0,     max: 10000  },
  { label: "Under 20k",  min: 0,     max: 20000  },
  { label: "Under 50k",  min: 0,     max: 50000  },
  { label: "50k+",       min: 50000, max: undefined },
];

export default function SearchPage() {
  const [listings, setListings] = useState<(Listing & {distance_km?: number}) []>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());


  // Search & filter state
  const [search, setSearch]               = useState("");
  const [selectedCategory, setCategory]   = useState("");
  const [minPrice, setMinPrice]           = useState("");
  const [maxPrice, setMaxPrice]           = useState("");
  const [showFilters, setShowFilters]     = useState(false);

  // Debounce search input
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search]);

  useEffect(() => {
    getFavorites().then((res) => {
      const ids = new Set<string>((res.data ?? []).map((l: { public_id: string }) => l.public_id));
      setFavoriteIds(ids);
    })
    .catch(() => {});
  }, []);

  // Build filter object — only fetch when there is at least a query or filter
  const apiFilters = useMemo<Omit<ListingSearchParams, "lat" | "lng" | "radius_km">>(() => {
    const f: Omit<ListingSearchParams, "lat" | "lng" | "radius_km"> = {};
    if (debouncedSearch.trim()) f.q = debouncedSearch.trim();
    if (selectedCategory)        f.category  = selectedCategory;
    if (minPrice)                f.min_price = Number(minPrice);
    if (maxPrice)                f.max_price = Number(maxPrice);
    return f;
  }, [debouncedSearch, selectedCategory, minPrice, maxPrice]);

  const hasActiveFilter =
    !!apiFilters.q || !!apiFilters.category ||
    apiFilters.min_price != null || apiFilters.max_price != null;

  useEffect(() => {
    // Only call API if there's something to filter by
    if (!hasActiveFilter) {
      setListings([]);
      setHasSearched(false);
      return;
    }

    let cancelled = false;
    async function load() {
      setIsLoading(true);
      setHasSearched(true);
      try {
        const res = await getListingAll(undefined, undefined, undefined, apiFilters);
        if (!cancelled) setListings(res.data || []);
      } catch (err) {
        console.error("Search listings failed:", err);
        if (!cancelled) setListings([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [apiFilters, hasActiveFilter]);

  function toggleCategory(cat: string) {
    setCategory((c) => (c === cat ? "" : cat));
  }

  function clearFilters() {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
  }

  function applyPricePreset(min: number, max: number | undefined) {
    setMinPrice(String(min));
    setMaxPrice(max != null ? String(max) : "");
    setShowFilters(false);
  }

  const activePricePreset = PRICE_PRESETS.find(
    (p) =>
      String(p.min) === minPrice &&
      (p.max != null ? String(p.max) === maxPrice : maxPrice === "")
  );

  const hasFilterBadge = !!selectedCategory || !!minPrice || !!maxPrice;

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-white dark:bg-surface-dark shadow-2xl">
      {/* ── Header ── */}
      <header className="px-6 pt-6 pb-3 bg-white dark:bg-surface-dark sticky top-0 z-20">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Search
        </h1>

        {/* Search bar + filter button */}
        <div className="mt-4 flex gap-3">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
            </span>
            <input
              className="block h-12 w-full pl-10 pr-3 border-none rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium transition-all shadow-sm"
              placeholder="Search food, stores, or categories"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter toggle button — shows badge when filter active */}
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className={`relative h-12 w-12 flex items-center justify-center rounded-xl transition-colors shadow-sm ${
              showFilters
                ? "bg-primary text-white"
                : hasFilterBadge
                ? "bg-primary/10 text-primary"
                : "bg-primary text-white hover:bg-primary-dark"
            }`}
          >
            <span className="material-symbols-outlined">tune</span>
            {hasFilterBadge && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white dark:border-slate-800" />
            )}
          </button>
        </div>

        {/* ── Filter panel ── */}
        {showFilters && (
          <div className="mt-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-lg space-y-4">
            {/* Price presets */}
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Price Range
              </p>
              <div className="flex flex-wrap gap-2">
                {PRICE_PRESETS.map((p) => {
                  const isActive = activePricePreset?.label === p.label;
                  return (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => applyPricePreset(p.min, p.max)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                        isActive
                          ? "bg-primary text-white border-primary"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary"
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom price inputs */}
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                Min (Rp)
                <input
                  type="number"
                  inputMode="numeric"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                  className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-primary"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                Max (Rp)
                <input
                  type="number"
                  inputMode="numeric"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Tanpa batas"
                  className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-primary"
                />
              </label>
            </div>

            {/* Clear & apply */}
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
                className="flex-1 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {/* Active filter chips */}
        {hasFilterBadge && !showFilters && (
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {selectedCategory}
                <button type="button" onClick={() => setCategory("")}>
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </span>
            )}
            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {minPrice ? `Rp ${Number(minPrice).toLocaleString("id-ID")}` : "0"} –{" "}
                {maxPrice ? `Rp ${Number(maxPrice).toLocaleString("id-ID")}` : "∞"}
                <button type="button" onClick={() => { setMinPrice(""); setMaxPrice(""); }}>
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </span>
            )}
          </div>
        )}
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24 px-6">

        {/* Explore Categories — always visible, click sets category filter */}
        {!hasActiveFilter && (
          <section className="mt-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Explore Categories
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => toggleCategory(cat.label)}
                  className={`relative overflow-hidden rounded-xl p-4 hover:scale-[1.02] transition-transform duration-200 text-left h-24 flex flex-col justify-between border ${cat.cls}`}
                >
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900/40 flex items-center justify-center mb-2 shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Category grid also shown when only category is active (small persistent bar) */}
        {hasActiveFilter && !debouncedSearch.trim() && (
          <section className="mt-5">
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat.label;
                return (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => toggleCategory(cat.label)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      active
                        ? "bg-primary text-white border-primary"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Results section */}
        {hasActiveFilter && (
          <section className="mt-6 grid gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isLoading ? "Searching..." : `${listings.length} result${listings.length !== 1 ? "s" : ""}`}
              </h3>
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-primary hover:text-primary-dark"
              >
                Clear all
              </button>
            </div>

            {isLoading ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-44 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 animate-pulse"
                />
              ))
            ) : listings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-[32px] text-slate-400">
                    search_off
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No food found
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Try a different keyword, category, or price range
                </p>
              </div>
            ) : (
              listings.map((item) => {
                const merchant = item.merchant;
                return (
                  <FoodCard
                    key={item.public_id}
                  is_favorite={favoriteIds.has(item.public_id)}

                    item={
                      item
                    }
                  />
                );
              })
            )}
          </section>
        )}

        <div className="h-8" />
      </main>

      <CustomerNavbar active_tab="search" />
    </div>
  );
}
