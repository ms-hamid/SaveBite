"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyProfile, updateMerchantProfile } from "@/services/user";
import { supabase } from "@/lib/supabase";
import AuthInputComponent from "@/components/auth/input_column";
import DashboardBottomNav from "@/components/m/DashboardBottomNav";

export default function MerchantEditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    merchant_name: "",
    category: "",
    desc: "",
    address: "",
    bank_name: "",
    bank_account: "",
    pickup_instruction: "",
    contactless_pickup: false,
    notify_staff_upon_arrival: false,
    same_day_pickup: false,
    pickup_open: "",
    pickup_close: "",
    max_prep_time: "",
    profile_pic: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await getMyProfile();
        if (res?.data) {
          const profile = res.data.profile || {};
          const merchant = res.data.merchant || {};
          
          // Format pickup_open and pickup_close (DateTime from PostgreSQL) to HH:MM format for HTML input
          const formatTime = (timeStr: any) => {
            if (!timeStr) return "";
            const d = new Date(timeStr);
            if (isNaN(d.getTime())) return "";
            const hours = String(d.getUTCHours()).padStart(2, "0");
            const minutes = String(d.getUTCMinutes()).padStart(2, "0");
            return `${hours}:${minutes}`;
          };

          setFormData({
            full_name: profile.full_name || "",
            merchant_name: merchant.merchant_name || "",
            category: merchant.category || "",
            desc: merchant.desc || "",
            address: merchant.address || "",
            bank_name: merchant.bank_name || "",
            bank_account: merchant.bank_account || "",
            pickup_instruction: merchant.pickup_instruction || "",
            contactless_pickup: merchant.contactless_pickup || false,
            notify_staff_upon_arrival: merchant.notify_staff_upon_arrival || false,
            same_day_pickup: merchant.same_day_pickup || false,
            pickup_open: formatTime(merchant.pickup_open),
            pickup_close: formatTime(merchant.pickup_close),
            max_prep_time: merchant.max_prep_time ? String(merchant.max_prep_time) : "",
            profile_pic: merchant.profile_pic || "",
          });
        }
      } catch (err: any) {
        console.error("Failed to load profile", err);
        setError("Gagal memuat profil merchant");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
    setError("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDeleteImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData((prev) => ({
      ...prev,
      profile_pic: "",
    }));
  };

  async function uploadMerchantImage(file: File) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `merchants/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("listing-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from("listing-images").getPublicUrl(filePath);
    return data.publicUrl;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name.trim()) {
      setError("Nama lengkap pemilik tidak boleh kosong");
      return;
    }
    if (!formData.merchant_name.trim()) {
      setError("Nama toko tidak boleh kosong");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      let finalProfilePic = formData.profile_pic;
      if (imageFile) {
        finalProfilePic = await uploadMerchantImage(imageFile);
      }

      const payload = {
        ...formData,
        profile_pic: finalProfilePic || null,
        max_prep_time: formData.max_prep_time ? parseInt(formData.max_prep_time, 10) : null,
      };
      await updateMerchantProfile(payload);
      setSuccess(true);
      setTimeout(() => {
        router.push("/m/store");
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Gagal memperbarui profil");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <title>Edit Profile - SaveBite Merchant</title>
      <div className="text-slate-900 antialiased min-h-screen flex justify-center bg-white">
        <div className="w-full max-w-[448px] min-h-screen flex flex-col relative pb-40 bg-white">
          {/* TopAppBar */}
          <header className="fixed top-0 left-0 w-full z-50 flex items-center px-6 h-16 backdrop-blur-xl border-b border-[#EAEAEA] bg-white/95" style={{ maxWidth: "inherit", left: "inherit" }}>
            <button
              onClick={() => router.push("/m/store")}
              className="mr-4 p-2 -ml-2 rounded-full hover:bg-slate-50 active:scale-95 transition-all text-slate-500 flex items-center justify-center"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Edit Profile</h1>
          </header>

          {/* Main Content */}
          <main className="flex-1 mt-16 px-6 pt-6 overflow-y-auto no-scrollbar flex flex-col gap-6">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#16C47F]"></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                {/* Section: Store Image (CRUD) */}
                <section className="border border-[#EAEAEA] rounded-3xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] bg-white flex flex-col gap-4 items-center">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1 self-start">Store Image</h3>
                  <div className="relative w-28 h-28 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                    {imagePreview || formData.profile_pic ? (
                      <img src={imagePreview || formData.profile_pic} alt="Store Image" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400 dark:bg-slate-800">
                        <span className="material-symbols-outlined text-[48px]">storefront</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 w-full mt-2">
                    <button
                      type="button"
                      onClick={() => document.getElementById("store-image-input")?.click()}
                      className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 text-[12px] font-bold py-2 rounded-xl hover:bg-slate-100 transition-colors active:scale-[0.98] transition-transform"
                    >
                      {formData.profile_pic || imagePreview ? "Change Image" : "Upload Image"}
                    </button>
                    {(formData.profile_pic || imagePreview) && (
                      <button
                        type="button"
                        onClick={handleDeleteImage}
                        className="flex-1 bg-red-50 border border-red-200 text-red-600 text-[12px] font-bold py-2 rounded-xl hover:bg-red-100 transition-colors active:scale-[0.98] transition-transform"
                      >
                        Delete Image
                      </button>
                    )}
                  </div>
                  <input
                    id="store-image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </section>

                {/* Section: Personal Info */}
                <section className="border border-[#EAEAEA] rounded-3xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] bg-white flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Owner Information</h3>
                  <AuthInputComponent
                    label="Owner Full Name"
                    name={"full_name" as any}
                    placeholder="Enter owner's full name"
                    value={formData.full_name}
                    onChange={handleChange as any}
                    type="text"
                  />
                </section>

                {/* Section: Store Details */}
                <section className="border border-[#EAEAEA] rounded-3xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] bg-white flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Store Details</h3>
                  <AuthInputComponent
                    label="Store Name"
                    name={"merchant_name" as any}
                    placeholder="Enter store name"
                    value={formData.merchant_name}
                    onChange={handleChange as any}
                    type="text"
                  />
                  <AuthInputComponent
                    label="Category"
                    name={"category" as any}
                    placeholder="E.g. Bakery, Cafe, Grocery"
                    value={formData.category}
                    onChange={handleChange as any}
                    type="text"
                  />
                  <AuthInputComponent
                    label="Description"
                    name={"desc" as any}
                    placeholder="Tell customers about your store..."
                    value={formData.desc}
                    onChange={handleChange as any}
                    type="textarea"
                  />
                  <AuthInputComponent
                    label="Address"
                    name={"address" as any}
                    placeholder="Store physical address"
                    value={formData.address}
                    onChange={handleChange as any}
                    type="textarea"
                  />
                </section>

                {/* Section: Bank Settings */}
                <section className="border border-[#EAEAEA] rounded-3xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] bg-white flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Payout Settings</h3>
                  <AuthInputComponent
                    label="Bank Name"
                    name={"bank_name" as any}
                    placeholder="E.g. BCA, Mandiri, BRI"
                    value={formData.bank_name}
                    onChange={handleChange as any}
                    type="text"
                  />
                  <AuthInputComponent
                    label="Bank Account"
                    name={"bank_account" as any}
                    placeholder="Enter bank account number"
                    value={formData.bank_account}
                    onChange={handleChange as any}
                    type="text"
                  />
                </section>

                {/* Section: Pickup Preferences */}
                <section className="border border-[#EAEAEA] rounded-3xl p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] bg-white flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Pickup Preferences</h3>
                  <AuthInputComponent
                    label="Pickup Instruction"
                    name={"pickup_instruction" as any}
                    placeholder="E.g. Go to the cashier on the 2nd floor"
                    value={formData.pickup_instruction}
                    onChange={handleChange as any}
                    type="textarea"
                  />

                  <div className="flex flex-col gap-3 mt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-slate-900">Contactless Pickup</span>
                        <span className="text-[11px] text-slate-500">Enable contactless box/area collection</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.contactless_pickup}
                          onChange={(e) => handleChange("contactless_pickup", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16C47F] shadow-inner after:shadow-sm"></div>
                      </label>
                    </div>

                    <div className="h-px bg-slate-100 w-full"></div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-slate-900">Notify Staff Upon Arrival</span>
                        <span className="text-[11px] text-slate-500">Send automatic arrival alert to store</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.notify_staff_upon_arrival}
                          onChange={(e) => handleChange("notify_staff_upon_arrival", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16C47F] shadow-inner after:shadow-sm"></div>
                      </label>
                    </div>

                    <div className="h-px bg-slate-100 w-full"></div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-slate-900">Same Day Pickup</span>
                        <span className="text-[11px] text-slate-500">Allow same day pickup orders</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.same_day_pickup}
                          onChange={(e) => handleChange("same_day_pickup", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#16C47F] shadow-inner after:shadow-sm"></div>
                      </label>
                    </div>

                    <div className="h-px bg-slate-100 w-full mt-2"></div>

                    <div className="flex gap-4 mt-2">
                      <div className="flex-1">
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Pickup Open Time</label>
                        <input
                          type="time"
                          value={formData.pickup_open}
                          onChange={(e) => handleChange("pickup_open", e.target.value)}
                          className="w-full bg-slate-50 rounded-xl border border-[#EAEAEA] px-3 py-2.5 text-[13px] font-medium text-slate-900 focus:ring-1 focus:ring-[#16C47F] focus:border-[#16C47F] outline-none transition-all"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Pickup Close Time</label>
                        <input
                          type="time"
                          value={formData.pickup_close}
                          onChange={(e) => handleChange("pickup_close", e.target.value)}
                          className="w-full bg-slate-50 rounded-xl border border-[#EAEAEA] px-3 py-2.5 text-[13px] font-medium text-slate-900 focus:ring-1 focus:ring-[#16C47F] focus:border-[#16C47F] outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="mt-2">
                      <AuthInputComponent
                        label="Max Preparation Time (Minutes)"
                        name={"max_prep_time" as any}
                        placeholder="E.g. 15"
                        value={formData.max_prep_time}
                        onChange={handleChange as any}
                        type="number"
                      />
                    </div>
                  </div>
                </section>

                {error && (
                  <p className="text-red-500 text-xs font-normal px-1 text-center">{error}</p>
                )}

                {success && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl p-4 text-sm font-semibold text-center">
                    Profil toko berhasil diperbarui!
                  </div>
                )}

                {/* Fixed Bottom Actions */}
                <div className="fixed bottom-0 left-0 w-full z-40 bg-white border-t border-[#EAEAEA] p-4 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.02)]" style={{ maxWidth: "inherit", left: "inherit" }}>
                  <div className="flex flex-col gap-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#16C47F] hover:bg-[#16C47F]/90 text-white text-[13px] font-bold py-3 px-4 rounded-xl shadow-sm transition-colors active:scale-[0.98] disabled:opacity-50"
                    >
                      {submitting ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push("/m/store")}
                      className="w-full bg-transparent border border-[#EAEAEA] text-slate-500 hover:text-slate-900 text-[13px] font-bold py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors active:scale-[0.98]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}
          </main>
          <DashboardBottomNav page="store" />
        </div>
      </div>
    </>
  );
}
