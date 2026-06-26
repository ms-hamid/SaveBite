"use client"
import DashboardTopAppBar from "../../components/m/DashboardTopAppBar";
import DashboardBottomNav from "../../components/m/DashboardBottomNav"; 
import AIPredictionCard from "../../components/m/AiHomeExplanation";
import ActiveListingCard from "../../components/m/HomeListingCard";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getMyListing } from "@/services/listing";
import { useRouter } from "next/navigation";

export default function MerchantDashboardActiveListingEndedPage() {
  const [listing_data, set_listing_data] = useState<any[]>([]);
  const router = useRouter();
  const [loading, set_loading] = useState(true);
  const [error, set_error] = useState("");

  useEffect(() => {
    async function fetch_my_listings() {
      try {
        set_loading(true);
        const listings = await getMyListing();
        set_listing_data(listings);
      } catch (err: any) {
        console.error(err);
        set_error(
          err?.response?.data?.message || "Gagal mengambil data listing"
        );
      } finally {
        set_loading(false);
      }
    }
    fetch_my_listings();
  }, []);

  // Hitung stats dari listing_data (Listing.sold_total ada di schema)
  const total_items_sold = listing_data.reduce(
    (sum: number, l: any) => sum + (l.sold_total ?? 0),
    0
  );
  const active_listings = listing_data.filter(
    (l: any) => l.status === "active" || l.is_open
  ).length;

  // Revenue, Surplus Saved (kg), Waste Reduced (kg) tidak ada di tabel DB saat ini
  // → akan tersedia dari tabel ai_feature_history (actual_surplus, sold_qty) di iterasi berikutnya

  return (
    <>
      <div className={"bg-white text-slate-900 min-h-screen pb-24 antialiased"}>
        <DashboardTopAppBar />
        <main className="max-w-[448px] mx-auto px-5 space-y-8">
          {/* Business Overview */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">Today's Overview</h2>
            {loading ? (
              <div className="grid grid-cols-2 gap-3">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 animate-pulse">
                    <div className="h-4 bg-slate-100 rounded w-1/2 mb-3" />
                    <div className="h-6 bg-slate-200 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-slate-100 rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {/* Items Sold — dari Listing.sold_total (tersedia di DB) */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">local_mall</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-500">Items Sold</p>
                  </div>
                  <p className="text-[20px] font-bold text-slate-900 mb-1 leading-tight">
                    {total_items_sold > 0 ? total_items_sold : "—"}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">Total dari semua listing</p>
                </div>

                {/* Active Listings — dari Listing.status */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-500">Active Listings</p>
                  </div>
                  <p className="text-[20px] font-bold text-slate-900 mb-1 leading-tight">
                    {active_listings > 0 ? active_listings : "—"}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">Listing aktif saat ini</p>
                </div>

                {/* Revenue — tidak tersedia di DB (tidak ada kolom revenue per listing)
                <div className="bg-white p-4 rounded-2xl border border-slate-100 ...">
                  <p className="text-xs font-semibold text-slate-500">Revenue</p>
                  <p className="text-[20px] font-bold">Rp 1.500.000</p>
                </div> */}

                {/* Surplus Saved (kg) — tidak tersedia langsung, perlu kolom di ai_feature_history
                <div className="bg-white p-4 rounded-2xl border border-slate-100 ...">
                  <p className="text-xs font-semibold text-slate-500">Surplus Saved</p>
                  <p className="text-[20px] font-bold">15.0 kg</p>
                </div> */}
              </div>
            )}
          </section>

          {/* AI Prediction */}
          <section>
            <AIPredictionCard confidence={0} />
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">Quick Actions</h2>
            <div className="grid grid-cols-3 gap-3">
              <Link
                href={'/m/listing/create'}
                className="flex flex-col items-center gap-2 p-3 bg-primary border border-primary rounded-2xl shadow-md active:scale-[0.98] transition-transform">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-white">add</span>
                </div>
                <span className="text-xs font-bold text-white">Add surplus</span>
              </Link>
              <Link
                href={'/m/listing'}
                className="flex flex-col items-center gap-2 p-3 bg-white border border-slate-100 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] active:scale-[0.98] transition-transform hover:bg-slate-50">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                  <span className="material-symbols-outlined">inventory_2</span>
                </div>
                <span className="text-xs font-semibold text-slate-700">Manage stock</span>
              </Link>
              <Link
                href={'/m/order'}
                className="flex flex-col items-center gap-2 p-3 bg-white border border-slate-100 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] active:scale-[0.98] transition-transform hover:bg-slate-50">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                  <span className="material-symbols-outlined">receipt_long</span>
                </div>
                <span className="text-xs font-semibold text-slate-700">View orders</span>
              </Link>
            </div>
          </section>

          {/* Active Listings */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Active Listings</h2>
              <Link
                href="/m/listing"
                className="text-sm font-semibold text-primary hover:text-emerald-700 transition-colors"
              >
                View all
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 animate-pulse">
                    <div className="flex gap-3">
                      <div className="w-14 h-14 rounded-xl bg-slate-200 shrink-0" />
                      <div className="flex flex-col gap-2 flex-1 justify-center">
                        <div className="h-4 bg-slate-200 rounded w-3/4" />
                        <div className="h-3 bg-slate-100 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : listing_data.length !== 0 ? (
              listing_data.map((listing) =>
                <ActiveListingCard
                  key={listing.id}
                  listing={listing}
                  onPrimaryAction={() => router.push(`/m/listing/${listing.public_id}`)}
                  onViewDetails={() => router.push(`/m/listing/${listing.public_id}/edit`)}
                />
              )
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] p-6 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[28px] text-slate-400">inventory_2</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">No active listings</h3>
                <p className="text-xs text-slate-500 mb-4">Start selling your surplus food today</p>
                <Link
                  href="/m/listing/create"
                  className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold shadow-sm active:scale-95 transition-transform"
                >
                  Add surplus
                </Link>
              </div>
            )}
          </section>
        </main>
        <DashboardBottomNav page="home" />
      </div>
    </>
  );
}
