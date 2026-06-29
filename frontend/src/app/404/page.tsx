"use client";

import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <>
      <title>404 - Halaman Tidak Ditemukan</title>
      <main className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700/50 shadow-soft flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 mb-6">
            <span className="material-symbols-outlined text-[40px]">
              search_off
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
            404 Not Found
          </h1>
          
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-xs">
            Halaman yang Anda cari tidak dapat ditemukan atau telah dihapus.
          </p>

          <button
            onClick={() => router.back()}
            className="w-full bg-[#16C47F] hover:bg-[#16C47F]/90 text-white text-sm font-bold py-3.5 px-4 rounded-xl shadow-sm transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
            Kembali ke Halaman Sebelumnya
          </button>
        </div>
      </main>
    </>
  );
}
