"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/services/auth";
import { useState } from "react";

export default function UnauthorizedPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleBackToLogin() {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed during 401 redirect:", err);
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
      <title>401 - Unauthorized Access</title>
      <main className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700/50 shadow-soft flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-900/10 flex items-center justify-center text-rose-500 mb-6">
            <span className="material-symbols-outlined text-[40px]">
              gpp_maybe
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
            Unauthorized
          </h1>
          
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-xs">
            Sesi Anda telah berakhir atau Anda tidak memiliki izin untuk mengakses halaman ini. Silakan masuk kembali.
          </p>

          <button
            onClick={handleBackToLogin}
            disabled={isLoggingOut}
            className="w-full bg-[#16C47F] hover:bg-[#16C47F]/90 text-white text-sm font-bold py-3.5 px-4 rounded-xl shadow-sm transition-colors active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">
              logout
            </span>
            {isLoggingOut ? "Mengeluarkan Akun..." : "Kembali ke Login"}
          </button>
        </div>
      </main>
    </>
  );
}
