"use client"
// import DashboardTopAppBar from "../../components/m/DashboardTopAppBar";
// import DashboardBottomNav from "../../components/m/DashboardBottomNav";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function KYCPendingPage() {
  const router = useRouter();
  const [merchant_name, set_merchant_name] = useState<string>("Merchant");

  useEffect(() => {
    // Get merchant name from localStorage or profile
    const profile = localStorage.getItem("merchant_profile");
    if (profile) {
      try {
        const data = JSON.parse(profile);
        set_merchant_name(data.merchant_name || "Merchant");
      } catch (e) {
        console.error("Error parsing m erchant profile:", e);
      }
    }
  }, []);

  return (
    <>
      <div className="bg-white text-slate-900 min-h-screen pb-24 antialiased">
        {/* <DashboardTopAppBar /> */}

        <main className="max-w-[448px] mx-auto px-5">
          {/* Pending Status Section */}
          <section className="pt-8 pb-8">
            {/* Illustration/Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-amber-600" style={{ fontSize: "56px" }}>
                  schedule
                </span>
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                Verifikasi KYC Sedang Diproses
              </h1>
              <p className="text-slate-600 text-sm leading-relaxed">
                Toko Anda <span className="font-semibold">{merchant_name}</span> sedang dalam tahap verifikasi KYC oleh tim admin kami.
              </p>
            </div>

            {/* Status Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-amber-600">info</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">Status Saat Ini</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Kami telah menerima data KYC Anda dan sedang melakukan verifikasi. Proses ini biasanya memakan waktu 1-3 hari kerja.
                  </p>
                </div>
              </div>
            </div>

            {/* What's Happening Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-xl">checklist</span>
                Yang Kami Lakukan
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm">
                  <span className="material-symbols-outlined text-blue-600 flex-shrink-0 mt-0.5" style={{ fontSize: "18px" }}>
                    check_circle
                  </span>
                  <span className="text-slate-700">Verifikasi dokumen identitas Anda</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <span className="material-symbols-outlined text-blue-600 flex-shrink-0 mt-0.5" style={{ fontSize: "18px" }}>
                    check_circle
                  </span>
                  <span className="text-slate-700">Validasi informasi bisnis dan lokasi</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <span className="material-symbols-outlined text-blue-600 flex-shrink-0 mt-0.5" style={{ fontSize: "18px" }}>
                    check_circle
                  </span>
                  <span className="text-slate-700">Konfirmasi keaslian data dan foto</span>
                </li>
              </ul>
            </div>

            {/* After Approval Card */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-6">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-xl">done_all</span>
                Setelah Disetujui
              </h3>
              <p className="text-sm text-slate-700 mb-3">
                Anda akan dapat:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  Membuka listing produk di SaveBite
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  Menerima dan memproses pesanan
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  Mengakses dashboard penjualan lengkap
                </li>
              </ul>
            </div>

            {/* Need Help Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-6">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-600 text-xl">help</span>
                Pertanyaan atau Masalah?
              </h3>
              <p className="text-sm text-slate-700 mb-4">
                Jika Anda memiliki pertanyaan tentang status verifikasi KYC atau memerlukan bantuan, hubungi tim support kami.
              </p>
              <a
                href="mailto:support@savebite.com"
                className="inline-flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg h-10 transition-colors active:scale-95 duration-200"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                  mail
                </span>
                Hubungi Support
              </a>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/m"
                className="block text-center bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg h-12 flex items-center justify-center transition-colors active:scale-95 duration-200"
              >
                <span className="material-symbols-outlined mr-2" style={{ fontSize: "20px" }}>
                  home
                </span>
                Kembali ke Beranda
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="w-full border border-slate-200 hover:bg-slate-50 text-slate-900 font-semibold rounded-lg h-12 transition-colors active:scale-95 duration-200 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                  refresh
                </span>
                Refresh Status
              </button>
            </div>
          </section>

          {/* Timeline Section */}
          <section className="pb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">
              Timeline Proses
            </h2>
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-emerald-600 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-emerald-600 text-sm">check</span>
                  </div>
                  <div className="w-0.5 h-12 bg-slate-200 mt-2"></div>
                </div>
                <div className="pb-4">
                  <p className="font-semibold text-slate-900">Data Diterima</p>
                  <p className="text-sm text-slate-600">Kami telah menerima data KYC Anda</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-amber-600 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-amber-600 text-sm">schedule</span>
                  </div>
                  <div className="w-0.5 h-12 bg-slate-200 mt-2"></div>
                </div>
                <div className="pb-4">
                  <p className="font-semibold text-slate-900">Sedang Diverifikasi</p>
                  <p className="text-sm text-slate-600">Tim kami sedang memeriksa dokumen Anda</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-400 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-slate-600 text-sm">pending_actions</span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Menunggu Persetujuan</p>
                  <p className="text-sm text-slate-600">Kami akan memberitahu hasil verifikasi</p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* <DashboardBottomNav page="store" /> */}
      </div>
    </>
  );
}
