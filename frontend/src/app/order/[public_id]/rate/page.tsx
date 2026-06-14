"use client";

import { ChangeEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useOrder } from "../../../../components/providers/OrderProvider";
import { supabase } from "../../../../lib/supabase";

export default function RateStorePage() {
  const router = useRouter();
  const {order} = useOrder();
  const [rating, setRating] = useState(4);
  const [review, setReview] = useState("");
  const [img_url, set_img_url] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const maxReviewLength = 250;

  const ratingText =
    rating === 5
      ? "Excellent!"
      : rating === 4
      ? "Good!"
      : rating === 3
      ? "Okay"
      : rating === 2
      ? "Not great"
      : "Poor";

  const handleReviewChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;

    if (value.length <= maxReviewLength) {
      setReview(value);
    }
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
  
    if (!file) return;
  
    setSelectedFile(file);
  
    // Ini hanya untuk menampilkan nama file sementara di UI
    set_img_url(file.name);
  };

  const handleSubmitReview = async () => {
    try {
      setIsSubmitting(true);
  
      let uploadedImageUrl = "";
  
      if (selectedFile) {
        uploadedImageUrl = await uploadReviewPhoto(selectedFile);
      }
  
      const reviewData = {
        rating,
        review,
        img_url: uploadedImageUrl || null,
        merchant_id: order?.listings.merchant_id,
      };
  
      console.log("Review submitted:", reviewData);
  
      const { data, error } = await supabase
        .from("reviews")
        .insert(reviewData)
        .select()
        .single();
  
      if (error) {
        throw error;
      }
  
      console.log("Review berhasil disimpan:", data);
    } catch (error) {
      console.error("Gagal submit review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadReviewPhoto = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
  
    // Folder di dalam bucket
    const filePath = `reviews/${fileName}`;
  
    const { error: uploadError } = await supabase.storage
      .from("review-pics")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });
  
    if (uploadError) {
      throw uploadError;
    }
  
    const { data } = supabase.storage
      .from("review-pics")
      .getPublicUrl(filePath);
  
    return data.publicUrl;
  };

  return (
    <div className="min-h-screen bg-[#f6f8f7] dark:bg-[#10221c] font-sans text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center antialiased">
      <div className="w-full max-w-md bg-white dark:bg-[#10221c] h-full min-h-screen flex flex-col relative overflow-hidden shadow-2xl mx-auto">
        <header className="flex items-center justify-between px-4 py-4 pt-12 sticky top-0 z-10 bg-white/90 dark:bg-[#10221c]/90 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-800 dark:text-slate-200"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>

          <h1 className="text-lg font-bold tracking-tight text-center flex-1 pr-10">
            Rate Store
          </h1>
        </header>

        <main className="flex-1 overflow-y-auto px-6 pb-32 no-scrollbar">
          <div className="mt-4 bg-white dark:bg-[#152a23] border border-slate-100 dark:border-slate-800 rounded-xl p-2.5 shadow-sm flex items-center gap-4">
            <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAscWpzkyH--AQNqXQhCA8RaP4keRWRQBnBV4Ry5HgDH5EpVRPcxUf6Dli0Jooif6n7apoof-LTlayfhCgfq8X9zdZg_ynsCO6TaKYzKJC8qeo8LX3zNlEDVeSOFuKUqIqu2-hyWX91zFFbhz-MPiJqtGcZEveKofawGvHUh0SY6-hydJJ8Zas-gd3jybzEFjfeOHchAlL8J2UQmfyTMdCupqVKlozrXXEbC4gkaqEJTO8Rf-DLDHloQCEs5DkIW-JOcloeWMDmJoVF"
                alt="Fresh artisanal bread and pastries"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center min-w-0">
              <h3 className="text-slate-900 dark:text-slate-100 font-bold text-base truncate">
                Green Leaf Bakery
              </h3>

              <p className="text-[#10b77f] text-sm font-medium mt-0.5 truncate">
                Assorted Pastry Surprise Bag
              </p>

              <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">
                Today, 2:30 PM
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              How was your experience?
            </h2>

            <div className="flex items-center gap-3 mt-6">
              {Array.from({ length: 5 }, (_, index) => {
                const starValue = index + 1;
                const isActive = starValue <= rating;

                return (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => setRating(starValue)}
                    className="group transition-transform active:scale-95 focus:outline-none"
                    aria-label={`Give ${starValue} star`}
                  >
                    <span
                      className={`material-symbols-outlined text-[40px] transition-colors ${
                        isActive
                          ? "text-[#10b77f]"
                          : "text-slate-300 dark:text-slate-600 hover:text-[#10b77f]"
                      }`}
                      style={
                        isActive
                          ? { fontVariationSettings: "'FILL' 1" }
                          : undefined
                      }
                    >
                      star
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-5 text-[#10b77f] font-medium text-sm">
              {ratingText}
            </p>
          </div>

          <div className="h-6 w-full" />

          <div className="space-y-2">
            <label className="sr-only" htmlFor="review">
              Write a review
            </label>

            <div className="relative">
              <textarea
                id="review"
                value={review}
                onChange={handleReviewChange}
                placeholder="Share more about your experience (optional)..."
                rows={4}
                maxLength={maxReviewLength}
                className="w-full bg-slate-50 dark:bg-[#152a23] border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-4 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-[#10b77f] focus:border-[#10b77f] focus:ring-opacity-50 resize-none text-sm leading-relaxed"
              />

              <div className="absolute bottom-3 right-4 text-[10px] font-light text-slate-300 dark:text-slate-600">
                {review.length}/{maxReviewLength}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-3 w-full p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-[#10b77f]/10 flex items-center justify-center text-[#10b77f] group-hover:bg-[#10b77f] group-hover:text-white transition-colors shrink-0">
                <span className="material-symbols-outlined text-xl">
                  add_a_photo
                </span>
              </div>

              <div className="text-left flex-1 min-w-0">
                <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {img_url || "Add a photo (optional)"}
                </span>

                <span className="block text-xs text-slate-500 dark:text-slate-400">
                  Show others what you saved
                </span>
              </div>

              <div className="flex items-center justify-center h-full">
                <span className="material-symbols-outlined text-slate-400">
                  chevron_right
                </span>
              </div>
            </button>
          </div>
        </main>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white dark:bg-[#10221c] border-t border-slate-100 dark:border-slate-800 z-20">
          <button
            type="button"
            onClick={handleSubmitReview}
            className="w-full bg-[#10b77f] hover:bg-[#0e9f6e] text-white font-bold py-4 rounded-xl shadow-md shadow-[#10b77f]/20 transition-all active:scale-[0.98] mb-6"
          >
            Submit Review
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="w-full text-slate-500 dark:text-slate-400 font-medium text-sm hover:text-slate-800 dark:hover:text-slate-200 transition-colors py-2"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}