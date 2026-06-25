"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardBottomNav from "../../../components/m/DashboardBottomNav";
import DashboardTopAppBar from "../../../components/m/DashboardTopAppBar";
import ListingCard from "../../../components/m/ListingCard";
import { deleteListing, getMyListing } from "@/services/listing";
import { getApiErrorMessage } from "@/lib/api";
import type { Listing } from "@/types";

export default function RefinedMerchantSurplusHubPage() {
  const router = useRouter();
  const [listings, set_listings] = useState<Listing[] | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    async function get_listings() {
      const data = await getMyListing();
      set_listings(data);
    }
    get_listings();
  }, []);

  function openDeleteModal(listing: Listing) {
    setDeleteError("");
    setDeleteTarget(listing);
  }

  function closeDeleteModal() {
    if (isDeleting) return;
    setDeleteTarget(null);
    setDeleteError("");
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError("");
    try {
      await deleteListing(deleteTarget.public_id);
      const new_listing = await getMyListing();
      set_listings(new_listing);
      setDeleteTarget(null);
    } catch (error) {
      setDeleteError(getApiErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className={"bg-white min-h-screen flex justify-center antialiased text-slate-900"}>
        {/* Main Mobile Container */}
        <main className="w-full max-w-[448px] bg-white relative min-h-screen pb-[88px] flex flex-col mx-auto">
          <DashboardTopAppBar />
          {/* Page Content */}
          <div className="flex-1 overflow-y-auto px-5 py-6">
            {/* Search & Filter Area */}
            <div className="flex gap-2 mb-4">
              <div className="flex-1 flex items-center bg-white rounded-full px-4 py-2.5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-200 transition-colors focus-within:border-primary-emerald focus-within:ring-1 focus-within:ring-primary-emerald/20">
                <span className="material-symbols-outlined text-slate-400 mr-2 text-[20px]">search</span>
                <input
                  className="bg-transparent border-none outline-none w-full text-sm text-slate-900 placeholder-slate-400 font-medium"
                  placeholder="Search surplus items..."
                  type="text"
                />
              </div>
              <button className="bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shrink-0">
                <span className="material-symbols-outlined text-[20px]">tune</span>
              </button>
            </div>
            {/* Scrollable Tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-6">
              <button className="whitespace-nowrap px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold shadow-sm">All</button>
              <button className="whitespace-nowrap px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors">Active</button>
              <button className="whitespace-nowrap px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors">Ended</button>
              <button className="whitespace-nowrap px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors">Drafts</button>
            </div>
            {/* Listing Cards Stack */}
            <div className="flex flex-col gap-4">
              {listings?.map((listing) => (
                <ListingCard
                  key={listing.public_id}
                  listing={listing}
                  onEdit={() => router.push(`/m/listing/${listing.public_id}/edit`)}
                  onDelete={() => openDeleteModal(listing)}
                />
              ))}

              {listings?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-[32px] text-slate-400">inventory_2</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">Belum ada listing</p>
                    <p className="text-xs text-slate-500 mt-1">Tambahkan surplus listing pertamamu!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* FAB - Add new listing */}
          <button
            onClick={() => router.push("/m/listing/create")}
            className="absolute bottom-20 right-5 w-14 h-14 bg-primary-emerald text-white rounded-2xl shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-40"
          >
            <span className="material-symbols-outlined text-[28px]">add</span>
          </button>
          {/* BottomNavBar */}
          <DashboardBottomNav page="listing" />
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
          onClick={closeDeleteModal}
        >
          <div
            className="w-full max-w-[448px] bg-white rounded-t-3xl p-6 pb-10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-6" />

            {/* Icon */}
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-red-500 text-[28px]">delete</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 text-center">Hapus Listing?</h3>
            <p className="text-sm text-slate-500 text-center mt-2 leading-relaxed">
              Listing{" "}
              <span className="font-semibold text-slate-700">&quot;{deleteTarget.name}&quot;</span>{" "}
              akan dihapus dari daftar listing kamu.
            </p>

            {deleteError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mt-4">
                {deleteError}
              </p>
            )}

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="w-full bg-red-500 text-white text-sm font-bold rounded-2xl py-3.5 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-sm disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                    Ya, Hapus Listing
                  </>
                )}
              </button>
              <button
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="w-full bg-white text-slate-700 text-sm font-semibold rounded-2xl py-3.5 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform border border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:bg-slate-50 disabled:opacity-60"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
