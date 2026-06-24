"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyProfile, updateCustomerProfile } from "@/services/user";
import AuthInputComponent from "@/components/auth/input_column";
import { RegisterData } from "@/app/sign-up/page";
import CustomerNavbar from "@/components/navbar/customer_navbar";

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<RegisterData>({
    role: "CUSTOMER",
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    merchant_name: "",
    category: "",
    desc: "",
    location: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await getMyProfile();
        if (res?.data) {
          const profileName = res.data.profile?.full_name || res.data.customer?.full_name || "";
          setFormData((prev) => ({
            ...prev,
            full_name: profileName,
            email: res.data.email || "",
          }));
        }
      } catch (err: any) {
        console.error("Failed to load profile", err);
        setError("Gagal memuat profil");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleChange = <K extends keyof RegisterData>(key: K, value: RegisterData[K]) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name.trim()) {
      setError("Nama lengkap tidak boleh kosong");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      await updateCustomerProfile({ full_name: formData.full_name });
      setSuccess(true);
      setTimeout(() => {
        router.push("/profile");
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
      <div className="bg-[#F7FAF8] min-h-screen">
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-4 pt-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between h-12 max-w-md mx-auto">
            <button
              onClick={() => router.push("/profile")}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Edit Profile</h2>
            <div className="w-10 h-10" />
          </div>
        </header>

        <main className="flex-1 px-4 pt-6 pb-32 overflow-y-auto no-scrollbar max-w-md mx-auto w-full">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-[20px] p-6 shadow-soft border border-slate-100 dark:border-slate-700/50 flex flex-col gap-4">
                <AuthInputComponent
                  label="Full Name"
                  name="full_name"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={handleChange}
                  type="text"
                  error={error}
                />

                <div className="flex flex-col gap-2">
                  <label className="text-slate-900 dark:text-white text-sm font-semibold leading-normal">
                    Email (Read-Only)
                  </label>
                  <input
                    type="text"
                    value={formData.email}
                    disabled
                    className="flex w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 text-slate-400 dark:text-slate-500 h-14 px-4 text-base font-normal cursor-not-allowed"
                  />
                </div>
              </div>

              {success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl p-4 text-sm font-semibold text-center">
                  Profil berhasil diperbarui!
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#6AD2A2] to-[#51C795] text-white font-bold h-14 rounded-xl transition-all flex justify-center items-center gap-2 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary active:scale-[0.98] disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}
        </main>
        <CustomerNavbar active_tab="profile" />
      </div>
    </>
  );
}
