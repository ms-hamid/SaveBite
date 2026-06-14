"use client";

import { useEffect, useState } from "react";
import DashboardBottomNav from "../../../components/m/DashboardBottomNav";
import DashboardTopAppBar from "../../../components/m/DashboardTopAppBar";
import { supabase } from "../../../lib/supabase";
import ListingCard from "../../../components/m/ListingCard";


export type Listing = {
  id: number, 
  public_id:string,
  name: string, 
  open_time: string, 
  close_time: string, 
  sold_total: number, 
  stock_total: number, 
  description: string, 
  is_open: boolean, 
  original_price: number, 
  discount_price: number, 
  discount_percentage: number,
  deleted_at: string,
  merchant_id: string,
  img_url: string,
  status: string,
  merchants: {
      merchant_name: string;
  },
  // others: {
  //     formatted_original_price: string,
  //     formatted_discount_price: string,
  //     price_diff:string,
  //     ended_time: string,
  //     stock_left: number
  // }
}

export default function RefinedMerchantSurplusHubPage() {
  const [listings, set_listings] = useState<Listing[] | null>();

 

  useEffect(() => {

    async function get_listings() {
      const user = await supabase.auth.getUser();

      const {data, error} = await supabase.from("listings").select("*").eq("merchant_id", user.data.user?.id).returns<Listing[]>();
      console.log(data)
      console.log(error)

      set_listings(data);
    } 
    get_listings()

  }, [])

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
              <div
                className="flex-1 flex items-center bg-white rounded-full px-4 py-2.5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-200 transition-colors focus-within:border-primary-emerald focus-within:ring-1 focus-within:ring-primary-emerald/20">
                <span className="material-symbols-outlined text-slate-400 mr-2 text-[20px]">search</span>
                <input
                  className="bg-transparent border-none outline-none w-full text-sm text-slate-900 placeholder-slate-400 font-medium"
                  placeholder="Search surplus items..." type="text" />
              </div>
              <button
                className="bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shrink-0">
                <span className="material-symbols-outlined text-[20px]">tune</span>
              </button>
            </div>
            {/* Scrollable Tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-6">
              <button
                className="whitespace-nowrap px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold shadow-sm">All</button>
              <button
                className="whitespace-nowrap px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors">Active</button>
              <button
                className="whitespace-nowrap px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors">Ended</button>
              <button
                className="whitespace-nowrap px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors">Drafts</button>
            </div>
            {/* Listing Cards Stack */}
            <div className="flex flex-col gap-4">
              {/* Active Listing Card */}
              {listings?.map((listing) => <ListingCard listing={listing}/>)}
            </div>
          </div>
          {/* Floating Action Button (FAB) */}
          <button
            className="absolute bottom-20 right-5 w-14 h-14 bg-primary-emerald text-white rounded-2xl shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-40">
            <span className="material-symbols-outlined text-[28px]">add</span>
          </button>
          {/* BottomNavBar */}
          <DashboardBottomNav page="listing" />
        </main>
      </div>
    </>
  );
}
