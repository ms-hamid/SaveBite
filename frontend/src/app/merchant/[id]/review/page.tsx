"use client";

import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  checkMerchantReviewed,
  getMerchantReviews,
  submitMerchantReview,
  type ReviewItem,
} from "@/services/review";
import { getMerchantDetail } from "@/services/user";

// ── Star row ──────────────────────────────────────────────────────────────────
function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className="material-symbols-outlined text-yellow-400"
          style={{
            fontSize: size,
            fontVariationSettings: s <= rating ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          star
        </span>
      ))}
    </div>
  );
}

// ── Reviewer initials avatar ──────────────────────────────────────────────────
const AVATAR_COLORS = [
  "bg-purple-100 text-purple-600",
  "bg-blue-100 text-blue-600",
  "bg-emerald-100 text-emerald-600",
  "bg-orange-100 text-orange-600",
  "bg-pink-100 text-pink-600",
];

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const color = AVATAR_COLORS[initials.charCodeAt(0) % AVATAR_COLORS.length];
  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border border-current/20 shrink-0 ${color}`}
    >
      {initials || "?"}
    </div>
  );
}

// ── Relative time ─────────────────────────────────────────────────────────────
function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
}

// ── Rating distribution ───────────────────────────────────────────────────────
function ratingDistribution(reviews: ReviewItem[]) {
  const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => { dist[r.rating] = (dist[r.rating] ?? 0) + 1; });
  return dist;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function ReviewSkeleton() {
  return (
    <div className="min-w-[280px] bg-white dark:bg-[#162b25] p-4 rounded-xl border border-slate-100 dark:border-slate-800 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
        <div className="h-3 w-14 bg-slate-100 dark:bg-slate-800 rounded" />
      </div>
      <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded mb-3" />
      <div className="h-px bg-slate-100 dark:bg-slate-700/50 mb-3" />
      <div className="space-y-1.5">
        <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded w-full" />
        <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded w-4/5" />
      </div>
    </div>
  );
}

// ── Page content ──────────────────────────────────────────────────────────────
function MerchantReviewContent({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isWritingReview = searchParams.get("action") === "write";

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [merchantName, setMerchantName] = useState<string>("");

  // Write form state
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Already-reviewed state
  const [hasReviewed, setHasReviewed] = useState(false);
  const [existingReview, setExistingReview] = useState<ReviewItem | null>(null);
  const [checkingReview, setCheckingReview] = useState(true);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load reviews + merchant name
  useEffect(() => {
    async function load() {
      setIsLoadingReviews(true);
      try {
        const [reviewsRes, merchantRes] = await Promise.all([
          getMerchantReviews(id, { take: 20 }),
          getMerchantDetail(id).catch(() => null),
        ]);
        setReviews(reviewsRes.reviews);
        setTotal(reviewsRes.total);
        if (merchantRes?.data?.merchant_name) {
          setMerchantName(merchantRes.data.merchant_name);
        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        setIsLoadingReviews(false);
      }
    }
    load();
  }, [id]);

  // Check if already reviewed (only when on write action)
  useEffect(() => {
    if (!isWritingReview) { setCheckingReview(false); return; }
    checkMerchantReviewed(id)
      .then((res) => {
        setHasReviewed(res.has_reviewed);
        setExistingReview(res.review);
      })
      .catch(() => {})
      .finally(() => setCheckingReview(false));
  }, [id, isWritingReview]);

  // Safecritic UUID helper
  function safeUUID() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  async function uploadPhoto(file: File): Promise<string> {
    const ext = file.name.split(".").pop();
    const path = `reviews/${safeUUID()}.${ext}`;
    const { error } = await supabase.storage.from("review-pics").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });
    if (error) throw error;
    const { data } = supabase.storage.from("review-pics").getPublicUrl(path);
    return data.publicUrl;
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError("");

    try {
      let img_url: string | null = null;
      if (selectedFile) img_url = await uploadPhoto(selectedFile);

      await submitMerchantReview(id, {
        rating,
        review_text: reviewText.trim() || undefined,
        img_url,
      });

      setSubmitted(true);
      setTimeout(() => router.back(), 1500);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Gagal mengirim ulasan";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Write review view ────────────────────────────────────────────────────────
  if (isWritingReview) {
    if (checkingReview) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
          <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-primary animate-spin" />
        </div>
      );
    }

    if (hasReviewed && existingReview) {
      return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col max-w-md mx-auto">
          <header className="sticky top-0 z-10 flex items-center justify-between bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-4 border-b border-slate-100 dark:border-slate-800">
            <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined text-slate-700 dark:text-slate-200">arrow_back</span>
            </button>
            <h1 className="text-base font-bold text-center text-slate-900 dark:text-white">Ulasan Kamu</h1>
            <div className="w-10" />
          </header>

          <main className="flex-1 px-4 pt-6 pb-10">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                Kamu sudah pernah memberikan ulasan untuk merchant ini.
              </p>
            </div>

            <div className="bg-white dark:bg-[#162b25] p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <Stars rating={existingReview.rating} size={18} />
              {existingReview.img_url && (
                <img src={existingReview.img_url} alt="Review" className="w-full rounded-lg mt-3 object-cover max-h-48" />
              )}
              {/* review field stores a date; display created_at for the text context */}
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                {new Date(existingReview.created_at).toLocaleDateString("id-ID", { dateStyle: "long" })}
              </p>
            </div>

            <button onClick={() => router.back()} className="w-full mt-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300">
              Kembali
            </button>
          </main>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col max-w-md mx-auto">
        <header className="sticky top-0 z-10 flex items-center justify-between bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-4 border-b border-slate-100 dark:border-slate-800">
          <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-slate-700 dark:text-slate-200">arrow_back</span>
          </button>
          <h1 className="text-base font-bold text-center text-slate-900 dark:text-white">Tulis Ulasan</h1>
          <div className="w-10" />
        </header>

        <main className="flex-1 overflow-y-auto px-4 pt-6 pb-32">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{merchantName || "Merchant"}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Bagikan pengalamanmu</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star rating */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Rating</label>
              <div className="flex gap-3 justify-center py-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setRating(s)} className="transition-transform active:scale-90">
                    <span
                      className={`material-symbols-outlined text-[36px] transition-colors ${s <= rating ? "text-primary" : "text-slate-200 dark:text-slate-700"}`}
                      style={{ fontVariationSettings: s <= rating ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      star
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Review text */}
            <div>
              <label htmlFor="reviewText" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Ulasan (opsional)
              </label>
              <textarea
                id="reviewText"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Ceritakan pengalamanmu..."
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
              />
              <p className="text-[11px] text-slate-400 text-right mt-1">{reviewText.length}/500</p>
            </div>

            {/* Photo */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Foto (opsional)</label>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handlePhotoChange} />
              {imgPreview ? (
                <div className="relative">
                  <img src={imgPreview} alt="Preview" className="w-full rounded-xl max-h-48 object-cover" />
                  <button type="button" onClick={() => { setSelectedFile(null); setImgPreview(""); }} className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-3 w-full p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
                  </div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Tambah foto</span>
                </button>
              )}
            </div>

            {submitError && (
              <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                {submitError}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => router.back()} className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Batal
              </button>
              <button type="submit" disabled={isSubmitting || submitted} className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
                {submitted ? (
                  <><span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Terkirim!</>
                ) : isSubmitting ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mengirim...</>
                ) : "Kirim Ulasan"}
              </button>
            </div>
          </form>
        </main>
      </div>
    );
  }

  // ── View all reviews ──────────────────────────────────────────────────────────
  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;
  const dist = ratingDistribution(reviews);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col max-w-md mx-auto">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-4 border-b border-slate-100 dark:border-slate-800">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined text-slate-700 dark:text-slate-200">arrow_back</span>
        </button>
        <h1 className="text-base font-bold text-center text-slate-900 dark:text-white">Ulasan Pelanggan</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 overflow-y-auto pb-28">
        {/* Stats */}
        <div className="px-4 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          {isLoadingReviews ? (
            <div className="flex items-center gap-4 animate-pulse">
              <div className="flex flex-col items-center w-24">
                <div className="h-8 w-12 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded mb-1" />
                <div className="h-2.5 w-14 bg-slate-100 dark:bg-slate-800 rounded" />
              </div>
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((r) => (
                  <div key={r} className="flex items-center gap-2">
                    <div className="h-2 w-3 bg-slate-100 rounded" />
                    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full" />
                    <div className="h-2 w-6 bg-slate-100 rounded" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-slate-900 dark:text-white">{avgRating.toFixed(1)}</div>
                <Stars rating={Math.round(avgRating)} size={14} />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{total} ulasan</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {[5, 4, 3, 2, 1].map((r) => {
                  const pct = total > 0 ? ((dist[r] ?? 0) / total) * 100 : 0;
                  return (
                    <div key={r} className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-slate-400 w-3">{r}</span>
                      <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[11px] text-slate-400 w-7 text-right">{Math.round(pct)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Review cards */}
        <div className="px-4 pt-4 space-y-3 pb-4">
          {isLoadingReviews ? (
            [1, 2, 3].map((i) => <ReviewSkeleton key={i} />)
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px] text-slate-400">rate_review</span>
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Belum ada ulasan</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Jadilah yang pertama memberi ulasan</p>
            </div>
          ) : (
            reviews.map((r) => {
              const name = r.profile?.full_name ?? "Customer";
              return (
                <div key={r.id} className="bg-white dark:bg-[#162b25] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={name} />
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      {relativeTime(r.created_at)}
                    </span>
                  </div>
                  <Stars rating={r.rating} size={14} />
                  {r.img_url && (
                    <img src={r.img_url} alt="Review" className="w-full rounded-lg mt-3 object-cover max-h-40" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Write review CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 py-4 bg-background-light dark:bg-background-dark border-t border-slate-100 dark:border-slate-800 z-10">
        <Link
          href={`/merchant/${id}/review?action=write`}
          className="w-full py-3 px-4 rounded-xl bg-primary text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors hover:bg-primary/90"
        >
          <span className="material-symbols-outlined text-[18px]">rate_review</span>
          Tulis Ulasan
        </Link>
      </div>
    </div>
  );
}

export default function MerchantReviewPage() {
  const params = useParams();
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-primary animate-spin" />
      </div>
    }>
      <MerchantReviewContent id={String(params.id)} />
    </Suspense>
  );
}
