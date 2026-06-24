"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TopNavBack from "../../../../../components/m/TopNavArrow";
import { supabase } from "../../../../../lib/supabase";
import {
  getListingByPublicID,
  updateListing,
  UpdateListingPayload,
} from "@/services/listing";
import { getApiErrorMessage } from "@/lib/api";

type FormState = {
  name: string;
  description: string;
  stock_total: number;
  original_price: string;
  discount_price: string;
  open_time: string;
  close_time: string;
};

const BUCKET_NAME = "listing-images";

function timeFromISO(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function timeToTodayDate(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date;
}

function buildPickupWindow(open_time: string, close_time: string) {
  const openDate = timeToTodayDate(open_time);
  const closeDate = timeToTodayDate(close_time);
  if (closeDate <= openDate) {
    closeDate.setDate(closeDate.getDate() + 1);
  }
  return {
    open_time: openDate.toISOString(),
    close_time: closeDate.toISOString(),
  };
}

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const publicId = params?.public_id as string;

  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    stock_total: 1,
    original_price: "",
    discount_price: "",
    open_time: "",
    close_time: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [existingImgUrl, setExistingImgUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch existing listing data
  useEffect(() => {
    async function fetchListing() {
      try {
        setIsLoading(true);
        const res = await getListingByPublicID(publicId);
        const listing = res?.data;
        if (!listing) throw new Error("Listing not found");

        setForm({
          name: listing.name ?? "",
          description: listing.description ?? "",
          stock_total: listing.stock_total ?? 1,
          original_price: listing.original_price?.toString() ?? "",
          discount_price: listing.discount_price?.toString() ?? "",
          open_time: timeFromISO(listing.open_time),
          close_time: timeFromISO(listing.close_time),
        });

        if (listing.img_url) {
          setExistingImgUrl(listing.img_url);
          setImagePreview(listing.img_url);
        }
      } catch {
        setErrorMessage("Gagal memuat data listing.");
      } finally {
        setIsLoading(false);
      }
    }

    if (publicId) fetchListing();
  }, [publicId]);

  const original_price = Number(form.original_price || 0);
  const discount_price = Number(form.discount_price || 0);

  const customerSaving = useMemo(
    () => Math.max(0, original_price - discount_price),
    [original_price, discount_price]
  );

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function uploadListingImage(file: File) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `listings/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
    return data.publicUrl;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      if (!form.name.trim()) throw new Error("Product name wajib diisi.");
      if (!form.open_time || !form.close_time) throw new Error("Pickup window wajib diisi.");
      if (form.stock_total <= 0) throw new Error("Quantity minimal 1.");
      if (original_price <= 0) throw new Error("Regular price wajib lebih dari 0.");
      if (discount_price <= 0) throw new Error("Surplus price wajib lebih dari 0.");
      if (discount_price >= original_price)
        throw new Error("Surplus price harus lebih murah dari regular price.");

      const imageUrl = imageFile
        ? await uploadListingImage(imageFile)
        : existingImgUrl;

      const pickupWindow = buildPickupWindow(form.open_time, form.close_time);

      const payload: UpdateListingPayload = {
        name: form.name.trim(),
        description: form.description.trim(),
        open_time: pickupWindow.open_time,
        close_time: pickupWindow.close_time,
        stock_total: form.stock_total,
        original_price: original_price,
        discount_price: discount_price,
        img_url: imageUrl,
      };

      await updateListing(publicId, payload);

      setSuccessMessage("Listing berhasil diperbarui!");
      setTimeout(() => router.push("/m/listing"), 1200);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : getApiErrorMessage(error);
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center w-full max-w-[448px] mx-auto">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Memuat listing...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white text-slate-900 min-h-screen pb-32 antialiased w-full max-w-[448px] mx-auto relative">
        <TopNavBack title="Edit Surplus Listing" />

        <main className="pt-24 px-5 space-y-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Image Upload */}
            <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-6 flex flex-col items-center justify-center gap-3 relative overflow-hidden group cursor-pointer hover:bg-slate-100 transition-colors">
              {imagePreview ? (
                <div className="w-full relative">
                  <img
                    src={imagePreview ?? "https://upload.wikimedia.org/wikipedia/commons/6/60/No-Image-Placeholder-banner.svg"}
                    alt="Preview listing"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white text-3xl">edit</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                    <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-700">Tap to upload image</p>
                    <p className="text-[11px] text-slate-500 mt-1">Recommended size: 800x800px</p>
                  </div>
                </>
              )}
              <input
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                type="file"
                onChange={handleImageChange}
              />
            </div>

            <div className="space-y-5">
              {/* Product Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                  Product Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-emerald focus:border-transparent transition-shadow shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]"
                  placeholder="e.g. Day-old Sourdough Loaf"
                  type="text"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-emerald focus:border-transparent transition-shadow shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] min-h-[100px] resize-none"
                  placeholder="Describe your surplus items..."
                />
              </div>

              {/* Quantity */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                  Quantity Available
                </label>
                <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
                  <button
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors border border-slate-100 active:scale-95"
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        stock_total: Math.max(1, prev.stock_total - 1),
                      }))
                    }
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <span className="text-xl font-bold text-slate-900 w-16 text-center">
                    {form.stock_total}
                  </span>
                  <button
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors border border-slate-100 active:scale-95"
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        stock_total: prev.stock_total + 1,
                      }))
                    }
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                    Regular Price
                  </label>
                  <div className="relative shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] rounded-xl">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-medium">
                      Rp
                    </span>
                    <input
                      name="original_price"
                      value={form.original_price}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-emerald focus:border-transparent transition-shadow"
                      placeholder="0"
                      type="number"
                      min="0"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-primary-emerald uppercase tracking-wide block">
                    Surplus Price
                  </label>
                  <div className="relative shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] rounded-xl">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-primary-emerald font-bold">
                      Rp
                    </span>
                    <input
                      name="discount_price"
                      value={form.discount_price}
                      onChange={handleInputChange}
                      className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-emerald focus:border-transparent transition-shadow font-semibold"
                      placeholder="0"
                      type="number"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1 justify-end bg-emerald-50 px-3 py-1.5 rounded-lg w-max ml-auto border border-emerald-100">
                <span className="material-symbols-outlined text-[14px]">eco</span>
                Customers save {formatRupiah(customerSaving)}
              </p>

              {/* Pickup Window */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                  Pickup Window
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] rounded-xl">
                    <input
                      name="open_time"
                      value={form.open_time}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-emerald focus:border-transparent transition-shadow"
                      type="time"
                    />
                  </div>
                  <span className="text-slate-400 text-sm font-medium">to</span>
                  <div className="relative flex-1 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] rounded-xl">
                    <input
                      name="close_time"
                      value={form.close_time}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-emerald focus:border-transparent transition-shadow"
                      type="time"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            {errorMessage && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {errorMessage}
              </p>
            )}
            {successMessage && (
              <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                {successMessage}
              </p>
            )}

            {/* Actions */}
            <div className="pt-4 space-y-3">
              <button
                className="w-full bg-primary-emerald text-white text-sm font-bold rounded-2xl py-3.5 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-md border border-primary-emerald disabled:opacity-60"
                type="submit"
                disabled={isSubmitting}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {isSubmitting ? "hourglass_empty" : "save"}
                </span>
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>

              <button
                className="w-full bg-white text-slate-700 text-sm font-semibold rounded-2xl py-3.5 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform border border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:bg-slate-50"
                type="button"
                onClick={() => router.push("/m/listing")}
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
                Batal
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}
