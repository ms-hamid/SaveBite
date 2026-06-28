"use client";

import { useCallback, useEffect, useState } from "react";
import CustomerNavbar from "../../components/navbar/customer_navbar";
import { getListingAll } from "@/services/listing";
import { getMyProfile } from "@/services/user";
import FoodCard from "@/components/FoodListCard";
import { getFavorites, toggleFavorite as apiFavorite } from "@/services/favorite";
import { Listing } from "@/types";


export default function HomePage() {
  const [food_items, set_food_items] = useState<(Listing & { distance_km?: number; merchants?: { merchant_name: string; category?: string; address?: string } })[]>([]);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  // Filter state
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [filterMinPrice, setFilterMinPrice] = useState("");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  // Favorite IDs set (public_id strings)
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        const name =
          res?.data?.customer?.full_name ??
          res?.data?.profile?.full_name ??
          null;
        setUserName(name);
      })
      .catch(() => {});

    // Load saved listing IDs for favorite state on cards
    getFavorites()
      .then((res) => {
        const ids = new Set<string>((res.data ?? []).map((l: { public_id: string }) => l.public_id));
        setFavoriteIds(ids);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    // Attempt to get user GPS coordinates on mount
    if (typeof window !== "undefined" && navigator.geolocation) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setLocationLoading(false);
        },
        (error) => {
          console.error("GPS location permission or error:", error);
          setLocationLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  useEffect(() => {
    async function get_data() {
      setIsLoadingListings(true);
      try {
        const filters: Record<string, unknown> = {};
        if (filterCategory) filters.category = filterCategory;
        if (filterMinPrice) filters.min_price = Number(filterMinPrice);
        if (filterMaxPrice) filters.max_price = Number(filterMaxPrice);

        const data = await getListingAll(
          latitude || undefined,
          longitude || undefined,
          undefined,
          filters
        );
        set_food_items(data.data || []);
      } catch (err) {
        console.error("Failed to load listings:", err);
        set_food_items([]);
      } finally {
        setIsLoadingListings(false);
      }
    }

    get_data();
  }, [latitude, longitude, filterCategory, filterMinPrice, filterMaxPrice]);

  const [selectedCategory, setSelectedCategory] = useState("Nearby");
  const [search, setSearch] = useState("");

  const HOME_CATEGORIES = ["Nearby", "Under 20k", "Bakery", "Meals", "Ending soon"];
  const categories = HOME_CATEGORIES;
  const hasFilterBadge = !!filterCategory || !!filterMinPrice || !!filterMaxPrice;

  // Toggle favorite: optimistic update then API call
  const handleToggleFavorite = useCallback(async (publicId: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(publicId)) next.delete(publicId);
      else next.add(publicId);
      return next;
    });
    try {
      await apiFavorite(publicId);
    } catch (err){
      console.log(err)
      // Revert on failure
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (next.has(publicId)) next.delete(publicId);
        else next.add(publicId);
        return next;
      });
    }
  }, []);

  const filteredItems = food_items.filter((item) => {
    const keyword = search.toLowerCase();

    // 1. Search filter
    const matchesSearch = (item.name ?? "").toLowerCase().includes(keyword) ||
      (item.merchants?.merchant_name || "").toLowerCase().includes(keyword);

    if (!matchesSearch) return false;

    // 2. Category filters
    if (selectedCategory === "Under 20k") {
      return Number(item.discount_price) <= 20000;
    }
    if (selectedCategory === "Bakery") {
      const cat = (item.merchants?.category || "").toLowerCase();
      const itemName = (item.name || "").toLowerCase();
      return cat.includes("bakery") || itemName.includes("bread") || itemName.includes("cake") || itemName.includes("donut") || itemName.includes("pastry");
    }
    if (selectedCategory === "Meals") {
      const cat = (item.merchants?.category || "").toLowerCase();
      const itemName = (item.name || "").toLowerCase();
      // Simple classifier: meals are generally not bakery items
      return !cat.includes("bakery") && !itemName.includes("bread") && !itemName.includes("cake");
    }

    return true;
  });

  // Client-side sort for "Ending soon" category
  if (selectedCategory === "Ending soon") {
    filteredItems.sort((a, b) => new Date(a.close_time ?? "").getTime() - new Date(b.close_time ?? "").getTime());
  }


  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased selection:bg-primary/30">
      <div className="flex flex-col w-full max-w-md mx-auto bg-background-light dark:bg-background-dark pb-[88px]">
        {/* HEADER */}
        <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm px-5 pt-8 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {userName ? `Hi, ${userName.split(" ")[0]} 👋` : "Hi there 👋"}
              </h1>

              <button className="w-35 flex items-center gap-1.5 mt-1 bg-white dark:bg-card-dark px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm text-slate-700 dark:text-slate-200 hover:border-primary transition-colors text-sm font-semibold">
                <span className="material-symbols-outlined text-[18px] text-primary">
                  location_on
                </span>

                <span>
                  {latitude && longitude
                    ? `GPS: ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`
                    : locationLoading
                    ? "Locating..."
                    : "Batam, ID"}
                </span>

                {/* <span className="material-symbols-outlined text-[18px] text-slate-400">
                  expand_more
                </span> */}
              </button>
            </div>

            <button className="relative p-2 rounded-full bg-white dark:bg-card-dark shadow-sm border border-slate-100 dark:border-slate-700/50">
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">
                notifications
              </span>

              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-card-dark"></span>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-slate-900 dark:text-white font-bold text-lg">
              Surplus food near you
            </p>

            <div className="flex gap-3">
              <div className="relative flex-1 group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined">search</span>
                </span>

                <input
                  type="text"
                  placeholder="Search food or store"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 rounded-full bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400 text-sm shadow-sm"
                />
              </div>

              <button
                onClick={() => setShowFilterSheet((v) => !v)}
                className={`relative h-12 w-12 flex items-center justify-center rounded-full transition-colors shadow-sm shadow-primary/20 ${
                  showFilterSheet || hasFilterBadge
                    ? "bg-primary/20 text-primary"
                    : "bg-primary text-white hover:bg-primary-dark"
                }`}
              >
                <span className="material-symbols-outlined">tune</span>
                {hasFilterBadge && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-background-dark" />
                )}
              </button>
            </div>
          </div>

          {/* Active filter chips */}
          {hasFilterBadge && !showFilterSheet && (
            <div className="flex flex-wrap gap-2 mt-2">
              {filterCategory && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  {filterCategory}
                  <button type="button" onClick={() => setFilterCategory("")}>
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </span>
              )}
              {(filterMinPrice || filterMaxPrice) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  Rp {filterMinPrice ? Number(filterMinPrice).toLocaleString("id-ID") : "0"} –{" "}
                  {filterMaxPrice ? `Rp ${Number(filterMaxPrice).toLocaleString("id-ID")}` : "∞"}
                  <button type="button" onClick={() => { setFilterMinPrice(""); setFilterMaxPrice(""); }}>
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Filter sheet */}
          {showFilterSheet && (
            <div className="mt-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-card-dark p-4 shadow-lg space-y-4">
              {/* Category filter */}
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Category
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Bakery", "Meals", "Groceries", "Desserts", "Vegan", "Beverages"].map((cat) => (
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

              {/* Price range */}
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Price Range
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {[
                    { label: "Under 10k", min: "0", max: "10000" },
                    { label: "Under 20k", min: "0", max: "20000" },
                    { label: "Under 50k", min: "0", max: "50000" },
                    { label: "50k+",      min: "50000", max: "" },
                  ].map((p) => {
                    const active = filterMinPrice === p.min && filterMaxPrice === p.max;
                    return (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => { setFilterMinPrice(p.min); setFilterMaxPrice(p.max); }}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                          active
                            ? "bg-primary text-white border-primary"
                            : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary"
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Min (Rp)
                    <input
                      type="number"
                      inputMode="numeric"
                      value={filterMinPrice}
                      onChange={(e) => setFilterMinPrice(e.target.value)}
                      placeholder="0"
                      className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-primary"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Max (Rp)
                    <input
                      type="number"
                      inputMode="numeric"
                      value={filterMaxPrice}
                      onChange={(e) => setFilterMaxPrice(e.target.value)}
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
                  onClick={() => { setFilterCategory(""); setFilterMinPrice(""); setFilterMaxPrice(""); }}
                  className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Clear all
                </button>
                <button
                  type="button"
                  onClick={() => setShowFilterSheet(false)}
                  className="flex-1 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </header>

        {/* CATEGORY */}
        <section className="pl-5 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 pr-5 scrollbar-hide snap-x">
            {categories.map((category) => {

              
              const active = selectedCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`snap-start shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-transform active:scale-95 ${
                    active
                      ? "bg-primary text-white shadow-sm shadow-primary/20"
                      : "bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </section>

        {/* LIST */}
        <section className="px-5 grid gap-4 pb-4">
          {isLoadingListings ? (
            // Skeleton loading cards
            [1, 2, 3].map((i) => (
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
            ))
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px] text-slate-400">
                  search_off
                </span>
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No listings found
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Try adjusting your search or category filter
              </p>
            </div>
          ) : (
          filteredItems.map((item) => {
            return (
              <FoodCard
                key={item.public_id}
                item={item as (typeof item) & { formatted: null }}
                is_favorite={favoriteIds.has(item.public_id)}
                onToggleFavorite={handleToggleFavorite}
              />
            );
          }))}
        </section>
      </div>

      {/* BOTTOM NAV */}
      <CustomerNavbar active_tab="home"/>
    </main>
  );
}
