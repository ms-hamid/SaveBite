"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useOrder } from "../../../../components/providers/OrderProvider";
import { supabase } from "../../../../lib/supabase";
import { checkListingReviewed, submitListingReview } from "@/services/review";

export default function RateStorePage() {
  const router = useRouter();
  const { order, isLoading } = useOrder();

  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Already-reviewed check
  const [hasReviewed, setHasReviewed] = useState(false);
  const [checkingReview, setCheckingReview] = useState(true);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const maxReviewLength = 500;

  const listingPublicId = order?.listing?.public_id ?? null;
  const merchantId = order?.merchant_id ?? null;
  const merchantName = order?.merchant?.merchant_name ?? "Merchant";
  const listingName = order?.listing?.name ?? "Pesanan";
  const listingImg = order?.listing?.img_url;

  // Check if already reviewed once order is loaded
  useEffect(() => {
    if (isLoading || !listingPublicId || !merchantId) return;
    checkListingReviewed(listingPublicId, merchantId)
      .then((res) => setHasReviewed(res.has_reviewed))
      .catch(() => {})
      .finally(() => setCheckingReview(false));
  }, [isLoading, listingPublicId, merchantId]);

  const ratingText =
    rating === 5 ? "Sangat Bagus!" :
    rating === 4 ? "Bagus!" :
    rating === 3 ? "Cukup" :
    rating === 2 ? "Kurang" :
    "Buruk";

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
    console.log(error)
    if (error) throw error;
    const { data } = supabase.storage.from("review-pics").getPublicUrl(path);
    return data.publicUrl;
  }

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Validate size < 2MB (FR-I-02)
    if (file.size > 2 * 1024 * 1024) {
      setSubmitError("Ukuran foto maksimal 2MB");
      return;
    }
    setSelectedFile(file);
    setImgPreview(URL.createObjectURL(file));
    setSubmitError("");
  };

  const handleSubmit = async () => {
    if (!listingPublicId || !merchantId) {
      setSubmitError("Data pesanan tidak lengkap");
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      let img_url: string | null = null;
      if (selectedFile) img_url = await uploadPhoto(selectedFile);

      // listing_id dari listing.id (per spec: listing route)
      await submitListingReview(listingPublicId, {
        merchant_id: merchantId,
        rating,
        review_text: review.trim() || undefined,
        img_url,
      });

      setSubmitted(true);
      setTimeout(() => router.push("/order"), 1500);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Gagal mengirim ulasan";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading || checkingReview) {
    return (
      <div className="min-h-screen bg-[#f6f8f7] dark:bg-[#10221c] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-primary animate-spin" />
      </div>
    );
  }

  // ── Already reviewed ───────────────────────────────────────────────────────
  if (hasReviewed) {
    return (
      <div className="min-h-screen bg-[#f6f8f7] dark:bg-[#10221c] flex flex-col items-center justify-center px-6 text-center gap-5">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-emerald-600 text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sudah Diulas</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Kamu sudah pernah memberikan ulasan untuk pesanan ini.</p>
        <button onClick={() => router.push("/order")} className="w-full max-w-xs bg-primary text-white font-bold py-3.5 rounded-xl">
          Kembali ke Pesanan
        </button>
      </div>
    );
  }

  // ── Main form ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f6f8f7] dark:bg-[#10221c] font-sans text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center antialiased">
      <div className="w-full max-w-md bg-white dark:bg-[#10221c] h-full min-h-screen flex flex-col relative overflow-hidden shadow-2xl mx-auto">
        <header className="flex items-center justify-between px-4 py-4 pt-12 sticky top-0 z-10 bg-white/90 dark:bg-[#10221c]/90 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold tracking-tight text-center flex-1 pr-10">
            Nilai Pesanan
          </h1>
        </header>

        <main className="flex-1 overflow-y-auto px-6 pb-32 no-scrollbar">
          {/* Order summary — dari Order data (schema: Listing.name, Merchant.merchant_name) */}
          <div className="mt-4 bg-white dark:bg-[#152a23] border border-slate-100 dark:border-slate-800 rounded-xl p-2.5 shadow-sm flex items-center gap-4">
            <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700">
              {listingImg ? (
                <img src={listingImg} alt={listingName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-400 text-[28px]">lunch_dining</span>
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center min-w-0">
              {/* Listing.name dari schema */}
              <h3 className="text-slate-900 dark:text-slate-100 font-bold text-base truncate">
                {merchantName}
              </h3>
              {/* Listing.name */}
              <p className="text-primary text-sm font-medium mt-0.5 truncate">
                {listingName}
              </p>
              {/* Order.created_at dari schema */}
              {order?.created_at && (
                <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">
                  {new Date(order.created_at).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              )}
            </div>
          </div>

          {/* Star rating */}
          <div className="mt-8 flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Bagaimana pengalamanmu?
            </h2>
            <div className="flex items-center gap-3 mt-6">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className="transition-transform active:scale-95"
                >
                  <span
                    className={`material-symbols-outlined text-[40px] transition-colors ${
                      s <= rating ? "text-primary" : "text-slate-200 dark:text-slate-700"
                    }`}
                    style={{ fontVariationSettings: s <= rating ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    star
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-4 text-primary font-medium text-sm">{ratingText}</p>
          </div>

          <div className="h-6" />

          {/* Review text */}
          <div className="relative">
            <textarea
              value={review}
              onChange={(e) => {
                if (e.target.value.length <= maxReviewLength) setReview(e.target.value);
              }}
              placeholder="Ceritakan pengalamanmu (opsional)..."
              rows={4}
              className="w-full bg-slate-50 dark:bg-[#152a23] border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-4 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-primary resize-none text-sm leading-relaxed"
            />
            <div className="absolute bottom-3 right-4 text-[10px] text-slate-300 dark:text-slate-600">
              {review.length}/{maxReviewLength}
            </div>
          </div>

          {/* Photo upload */}
          <div className="mt-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={handlePhotoChange}
            />
            {imgPreview ? (
              <div className="relative">
                <img src={imgPreview} alt="Preview" className="w-full rounded-xl max-h-48 object-cover" />
                <button
                  type="button"
                  onClick={() => { setSelectedFile(null); setImgPreview(""); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 w-full p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                  <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
                </div>
                <div className="text-left">
                  <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Tambah foto (opsional)
                  </span>
                  <span className="block text-xs text-slate-500">Maks. 2MB · JPG / PNG</span>
                </div>
              </button>
            )}
          </div>

          {submitError && (
            <div className="mt-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
              {submitError}
            </div>
          )}
        </main>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white dark:bg-[#10221c] border-t border-slate-100 dark:border-slate-800 z-20">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || submitted}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-md shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 mb-4"
          >
            {submitted ? (
              <><span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Terkirim!</>
            ) : isSubmitting ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mengirim...</>
            ) : "Kirim Ulasan"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/order")}
            className="w-full text-slate-500 dark:text-slate-400 font-medium text-sm hover:text-slate-800 dark:hover:text-slate-200 transition-colors py-2"
          >
            Lewati
          </button>
        </div>
      </div>
    </div>
  );
}
