"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/services/auth";
import { useState } from "react";

export default function ForbiddenPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleBackToLogin() {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed during 403 redirect:", err);
    } finally {
      // Clear all possible local auth tokens manually
      localStorage.removeItem("sb_access_token");
      localStorage.removeItem("role");
      localStorage.removeItem("kyc_status");
      localStorage.removeItem("email");
      sessionStorage.clear();
      router.push("/login");
    }
  }

  return (
    <>
      <title>403 - Access Denied</title>
      <main className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700/50 shadow-soft flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-900/10 flex items-center justify-center text-amber-500 mb-6">
            <span className="material-symbols-outlined text-[40px]">
              block
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
            Akses Ditolak
          </h1>
          
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-xs">
            Anda tidak memiliki izin yang cukup untuk mengakses halaman ini. Hubungi administrator atau ganti akun Anda.
          </p>

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => router.back()}
              className="w-full bg-[#16C47F] hover:bg-[#16C47F]/90 text-white text-sm font-bold py-3.5 px-4 rounded-xl shadow-sm transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">
                arrow_back
              </span>
              Kembali ke Halaman Sebelumnya
            </button>
            
            <button
              onClick={handleBackToLogin}
              disabled={isLoggingOut}
              className="w-full bg-transparent border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/30 text-sm font-bold py-3.5 px-4 rounded-xl transition-colors active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">
                logout
              </span>
              {isLoggingOut ? "Mengeluarkan Akun..." : "Kembali ke Login & Keluar"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
