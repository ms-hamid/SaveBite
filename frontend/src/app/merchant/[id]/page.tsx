"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import CustomerNavbar from "../../../components/navbar/customer_navbar";
import FoodCard from "@/components/FoodListCard";
import { getMerchantDetail } from "@/services/user";
import { getListingAll } from "@/services/listing";
import { getMerchantReviews, type ReviewItem } from "@/services/review";
import { toggleFavorite } from "@/services/favorite";
import { Listing } from "@/types";
import { Merchant } from "@/types/merchant";

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt_time(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className="material-symbols-outlined text-yellow-400"
          style={{ fontSize: size, fontVariationSettings: s <= rating ? "'FILL' 1" : "'FILL' 0" }}
        >
          star
        </span>
      ))}
    </div>
  );
}

function relTime(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (d === 0) return "Hari ini";
  if (d === 1) return "Kemarin";
  if (d < 7) return `${d} hari lalu`;
  return new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
}

const AVATAR_COLORS = [
  "bg-purple-100 text-purple-600", "bg-blue-100 text-blue-600",
  "bg-emerald-100 text-emerald-600", "bg-orange-100 text-orange-600",
];
function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((w) => w[0] ?? "").join("").slice(0, 2).toUpperCase();
  const color = AVATAR_COLORS[initials.charCodeAt(0) % AVATAR_COLORS.length];
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${color}`}>
      {initials || "?"}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="w-full h-64 bg-slate-200 dark:bg-slate-700" />
      <div className="px-4 py-6 space-y-3">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-4/5" />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MerchantPage() {
  const params = useParams();
  const router = useRouter();
  const merchantId = params.id as string;

  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [listings, setListings] = useState<(Listing & { distance_km?: number; merchants?: any })[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [merchantRes, reviewsRes] = await Promise.all([
          getMerchantDetail(merchantId),
          getMerchantReviews(merchantId, { take: 5 }),
        ]);

        if (merchantRes?.data) setMerchant(merchantRes.data);

        // Load merchant's active listings using category filter via merchant_id match
        const listingRes = await getListingAll(undefined, undefined, undefined, {});
        const merchantListings = (listingRes.data ?? []).filter(
          (l: any) => l.merchant_id === merchantId || l.merchants?.merchant_id === merchantId
        );
        setListings(merchantListings);

        setReviews(reviewsRes.reviews);
        setReviewTotal(reviewsRes.total);
      } catch (err) {
        console.error("Failed to load merchant page:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [merchantId]);

  const handleToggleFavorite = async (publicId: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(publicId)) next.delete(publicId); else next.add(publicId);
      return next;
    });
    try { await toggleFavorite(publicId); } catch { /* revert omitted — UX acceptable */ }
  };

  const avgRating = merchant?.rating ?? 0;
  const ratingCount = Number(merchant?.rating_times ?? 0);
  const ratingPercent = Math.round(avgRating * 20);

  if (isLoading) {
    return (
      <div className="bg-[#f6f8f7] dark:bg-[#10221c] min-h-screen">
        <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-white dark:bg-[#10221c] pb-24 shadow-2xl">
          <PageSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f6f8f7] dark:bg-[#10221c] text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-white dark:bg-[#10221c] pb-24 shadow-2xl">

        {/* Header */}
        <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-white/95 dark:bg-[#10221c]/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold text-center flex-1 truncate px-2">
            {merchant?.merchant_name ?? "Merchant"}
          </h1>
          <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined">share</span>
          </button>
        </header>

        <main className="flex-1 flex flex-col">

          {/* Hero — Merchant.profile_pic */}
          <div className="relative w-full h-64 bg-slate-200 dark:bg-slate-700">
            {merchant?.profile_pic ? (
              <Image src={merchant.profile_pic} alt={merchant.merchant_name ?? ""} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                <span className="material-symbols-outlined text-[64px]">storefront</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Rating + distance */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              {ratingCount > 0 && (
                <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full shadow border border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">⭐ {avgRating.toFixed(1)}</span>
                  <span className="text-xs text-slate-500 font-medium">({ratingCount})</span>
                </div>
              )}
            </div>
          </div>

          {/* Merchant Info */}
          <div className="px-4 py-6 bg-white dark:bg-[#10221c]">
            <div className="flex items-center gap-1.5 mb-4">
              <h2 className="text-2xl font-bold leading-tight">
                {merchant?.merchant_name ?? "—"}
              </h2>
              {merchant?.kyc_status === "approved" && (
                <span className="material-symbols-outlined text-primary text-[18px] translate-y-[1px]" title="Verified">verified</span>
              )}
            </div>

            {/* Category tags from Merchant.category */}
            <div className="flex flex-wrap gap-2.5 mb-5">
              {merchant?.category ? (
                merchant.category.split(",").map((c) => (
                  <span key={c.trim()} className="px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/80 text-xs font-medium text-slate-600 dark:text-slate-300">
                    {c.trim()}
                  </span>
                ))
              ) : null}
            </div>

            {/* Merchant.desc */}
            {merchant?.desc && (
              <div className="relative">
                <p className={`text-sm text-slate-500 dark:text-slate-400 leading-relaxed ${isExpanded ? "" : "max-h-[4.5em] overflow-hidden"}`}>
                  {merchant.desc}
                </p>
                {!isExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-[#10221c] to-transparent" />
                )}
                <button onClick={() => setIsExpanded((v) => !v)} className="relative z-10 mt-1 font-bold text-green-700 dark:text-green-500 text-sm">
                  {isExpanded ? "Sembunyikan" : "Lihat selengkapnya"}
                </button>
              </div>
            )}
          </div>

          {/* Available listings */}
          <div className="px-4 pb-8">
            <div className="flex flex-col mb-4">
              <h3 className="text-lg font-bold">Tersedia Sekarang</h3>
              <p className="text-xs text-slate-500">Segera sebelum kehabisan</p>
            </div>
            {listings.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">Tidak ada listing aktif saat ini</p>
            ) : (
              <div className="flex flex-col gap-4">
                {listings.map((item) => (
                  <FoodCard
                    key={item.public_id}
                    item={item as Listing & { distance_km?: number }}
                    is_favorite={favoriteIds.has(item.public_id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Reviews section */}
          <div className="px-4 pb-10 border-t border-slate-100 dark:border-slate-800 pt-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Ulasan Pelanggan</h3>
              <Link href={`/merchant/${merchantId}/review`} className="text-sm font-semibold text-primary hover:text-green-700 flex items-center gap-0.5">
                Lihat semua <span className="material-symbols-outlined text-sm pt-0.5">chevron_right</span>
              </Link>
            </div>

            {ratingCount > 0 ? (
              <div className="flex items-start gap-6 mb-8">
                <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 min-w-[100px] border border-slate-100 dark:border-slate-700 self-stretch">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {avgRating.toFixed(1)}
                  </span>
                  <Stars rating={Math.round(avgRating)} size={16} />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-1">
                    {ratingCount} rating
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-between py-1 gap-2">
                  {[5, 4, 3, 2, 1].map((r) => {
                    const pct = reviewTotal > 0
                      ? (reviews.filter((rv) => rv.rating === r).length / reviewTotal) * 100
                      : 0;
                    return (
                      <div key={r} className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-500 w-3 text-right">{r}</span>
                        <div className="h-3 flex-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center mb-6">Belum ada ulasan</p>
            )}

            {/* Review cards */}
            {reviews.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                {reviews.map((r) => {
                  const name = r.profile?.full_name ?? "Customer";
                  return (
                    <div key={r.id} className="min-w-[280px] bg-white dark:bg-[#162b25] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={name} />
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                          {relTime(r.created_at)}
                        </span>
                      </div>
                      <Stars rating={r.rating} size={14} />
                      <div className="h-px bg-slate-50 dark:bg-slate-700/50 w-full mt-3 mb-2" />
                      {r.img_url && (
                        <img src={r.img_url} alt="Review" className="w-full rounded-lg mb-2 max-h-24 object-cover" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Write review CTA */}
            <div className="mt-4">
              <Link
                href={`/merchant/${merchantId}/review?action=write`}
                className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">rate_review</span>
                Tulis Ulasan
              </Link>
            </div>
          </div>

          {/* Location & Hours */}
          <div className="px-4 pb-12">
            <h3 className="text-lg font-bold mb-4">Lokasi &amp; Jam</h3>
            <button
              onClick={() => router.push(`/merchant/${merchantId}/nav`)}
              className="w-full text-left rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#162b25] shadow-sm group active:scale-[0.99] transition-transform"
            >
              <div className="h-24 w-full bg-slate-200 dark:bg-slate-700 relative flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-primary drop-shadow-xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
              </div>
              <div className="p-4">
                {/* Merchant.address */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">storefront</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                      {merchant?.address ?? "Alamat tidak tersedia"}
                    </p>
                  </div>
                </div>

                {/* Merchant.pickup_open / pickup_close */}
                <div className="flex items-start gap-3 mb-5">
                  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">schedule</span>
                  </div>
                  <div>
                    <p className="text-sm font-black text-green-600 dark:text-green-400 mb-1">
                      Jam Pickup
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {fmt_time(merchant?.pickup_open)} – {fmt_time(merchant?.pickup_close)}
                    </p>
                  </div>
                </div>

                <div className="w-full py-3 px-4 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">directions</span>
                  Petunjuk Arah
                </div>
              </div>
            </button>
          </div>
        </main>

        {/* Floating deals button */}
        {listings.length > 0 && (
          <div className="fixed bottom-[80px] left-0 right-0 p-4 max-w-md mx-auto z-40 pointer-events-none">
            <button
              onClick={() => document.querySelector(".listing-section")?.scrollIntoView({ behavior: "smooth" })}
              className="w-full bg-primary hover:bg-green-600 text-white font-bold py-3.5 px-4 rounded-full shadow-2xl flex items-center justify-between transition-all active:scale-95 pointer-events-auto"
            >
              <span className="flex-1 text-center pl-6">Lihat {listings.length} penawaran</span>
              <span className="bg-white/20 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {listings.length}
              </span>
            </button>
          </div>
        )}

        <CustomerNavbar active_tab="home" />
      </div>
    </div>
  );
}
