"use client";
import { useEffect, useState } from "react";
import MerchantOrderCard from "../../../components/m/MerchantOrderCard";
import DashboardBottomNav from "../../../components/m/DashboardBottomNav";
import DashboardTopAppBar from "../../../components/m/DashboardTopAppBar";
import { getApiErrorMessage } from "../../../lib/api";
import { useRouter } from "next/navigation";
import { get_merchant_order, update_order_status } from "@/services/order";
import { Order } from "@/types";

export default function MerchantOrdersActiveStateRefinedPage() {

  const router = useRouter();
const [page_state, set_page_state] = useState<"completed" | "other">("other");

const [orders, set_orders] = useState<Order[] | null>();
const [preparing_count, set_preparing_count] = useState<number>(0);
const [active_count, set_active_count] = useState<number>(0);
const [ready_count, set_ready_count] = useState<number>(0);
const [completed_count, set_completed_count] = useState<number>(0);

async function change_status(id: string, status: string) {
  
  if (status === "ready_to_pickup") {
    router.push(`/m/order/${id}/scan`);
    return;
  }

  // Map current status to the next status transition
  let next_status;
  if (status === "paid_reserved") next_status = "preparing";
  if (status === "preparing") next_status = "ready_to_pickup";

  if (!next_status) return;

  try {
    // TODO: Replace with a dedicated merchant status-transition endpoint
    // e.g. PATCH /merchant/order/:id/status { status: next_status }
    // For now, routed through the generic order cancel/confirm cycle
    await update_order_status(id, next_status);
    // Refresh orders list after update
    // get_orders_ref.current?.();
  } catch (err) {
    console.error("Status change failed:", getApiErrorMessage(err));
  }
}

useEffect(() => {
  async function get_orders() {
    const data = await get_merchant_order();
    console.log(data)
    set_orders(data.data);
  }

  get_orders();
}, []);

useEffect(() => {
  set_preparing_count(orders?.filter((order) => order.status === "preparing").length ?? 0);
  set_active_count(orders?.filter((order) => order.status === "paid_reserved").length ?? 0);
  set_ready_count(orders?.filter((order) => order.status === "ready_to_pickup").length ?? 0);
  set_completed_count(orders?.filter((order) => order.status === "completed").length ?? 0);
}, [orders]); 


  return (
    <>
      <title>SaveBite Merchant - Orders</title>
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script id="tailwind-config" dangerouslySetInnerHTML={{ __html: `tailwind.config = {
                  darkMode: "class",
                  theme: {
                      extend: {
                          "colors": {
                              "primary-emerald": "#16C47F",
                              "sb-bg": "#F7FAF8",
                              "sb-primary-text": "#111827",
                              "sb-secondary-text": "#6B7280",
                              "sb-border": "#EAEAEA"
                          },
                          "borderRadius": {
                              "DEFAULT": "0.25rem",
                              "lg": "0.5rem",
                              "xl": "0.75rem",
                              "2xl": "1rem",
                              "3xl": "1.5rem",
                              "full": "9999px"
                          },
                          "fontFamily": {
                              "sans": ["Plus Jakarta Sans", "sans-serif"]
                          }
                      }
                  }
              }` }} />
      <style dangerouslySetInnerHTML={{ __html: `body {
                  font-family: 'Plus Jakarta Sans', sans-serif;
                  -webkit-tap-highlight-color: transparent;
              }
              .material-symbols-outlined {
                  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
              }
              /* Custom scrollbar hiding */
              .no-scrollbar::-webkit-scrollbar {
                  display: none;
              }
              .no-scrollbar {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
              }` }} />
      <style dangerouslySetInnerHTML={{ __html: `body {
            min-height: max(884px, 100dvh);
          }` }} />
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport" />
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&amp;display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet" />
      <div className={"bg-sb-bg text-sb-primary-text min-h-screen flex justify-center antialiased"}>
        {/* Mobile Container (Max 448px) */}
        <div className="w-full max-w-[448px] bg-[#F7FAF8] relative flex flex-col min-h-screen shadow-xl pb-[80px]">
          {/* TopAppBar */}
          <header
            className="bg-white/95 sticky top-0 w-full max-w-[448px] z-50 backdrop-blur-md border-b border-sb-border flex flex-col">
            <DashboardTopAppBar />
            <div className="w-full px-6 pb-3 overflow-x-auto no-scrollbar flex items-center gap-2">
              <div
                className="flex-shrink-0 bg-slate-50 text-slate-700 text-[12px] px-3 py-1.5 rounded-full font-semibold border border-sb-border">
                Active: {active_count}</div>
              <div
                className="flex-shrink-0 bg-orange-50 text-orange-700 text-[12px] px-3 py-1.5 rounded-full font-semibold border border-orange-100">
                Preparing: {preparing_count}</div>
              <div
                className="flex-shrink-0 bg-[#E8F8F2] text-primary-emerald text-[12px] px-3 py-1.5 rounded-full font-semibold border border-primary-emerald/20">
                Ready: {ready_count}</div>
              <div
                className="flex-shrink-0 bg-slate-50 text-slate-500 text-[12px] px-3 py-1.5 rounded-full font-semibold border border-sb-border">
                Completed: {completed_count}</div>
            </div>
          </header>
          {/* Main Content Canvas */}
          <main className="flex-1 px-6 pb-4 overflow-y-auto no-scrollbar flex flex-col bg-[#F7FAF8] min-h-full">
            {/* Page Header & Filters */}
            <section className="flex flex-col gap-4">
              <h1 className="text-[20px] font-bold text-sb-primary-text tracking-tight">Orders</h1>
              <div
                className="flex bg-slate-50 rounded-xl p-1 border border-sb-border shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                <button
                  onClick={() => {
                    set_page_state("other");
                  }}
                  className={`flex-1 py-2.5 rounded-lg text-[14px] tracking-wide text-center transition-all ${
                    page_state === "other"
                      ? "bg-white shadow-sm border border-sb-border text-primary-emerald font-bold"
                      : "text-sb-secondary-text font-semibold hover:bg-slate-100/50"
                  }`}
                >
                  Active
                </button>

                <button
                  onClick={() => {
                    set_page_state("completed");
                  }}
                  className={`flex-1 py-2.5 rounded-lg text-[14px] tracking-wide text-center transition-all ${
                    page_state === "completed"
                      ? "bg-white shadow-sm border border-sb-border text-primary-emerald font-bold"
                      : "text-sb-secondary-text font-semibold hover:bg-slate-100/50"
                  }`}
                >
                  Completed
                </button>
              </div>
            </section>
            {/* Order List */}
            <section className="flex flex-col flex-1 items-center justify-center text-center gap-4">
              { orders?.length !== 0 ?
                orders?.map((data) => {
                  if (page_state !== "completed") {
                    return data.status !== "completed" ? <MerchantOrderCard key={data.id} order={data} onAction={() => {console.log(data); change_status(data.public_id, data.status ?? "")}}/>  : ""
                  } 
                  return data.status === "completed" ? <MerchantOrderCard key={data.id} order={data} onAction={() => {router.push(`/m/order/${data.public_id}`)}}/> : ""
              }) : <>
              <div className="w-24 h-24 bg-primary-emerald/10 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-5xl text-primary-emerald">receipt_long</span>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">No active orders</h3>
              <p className="text-sm text-text-secondary mb-8 max-w-[280px] leading-relaxed">You're all caught up! New orders will appear here when customers purchase your items.</p>
              <button className="bg-primary-emerald text-white px-8 py-3.5 rounded-xl text-[15px] font-bold hover:bg-[#13ab6f] active:scale-95 transition-all shadow-sm w-full max-w-[280px]">View completed orders</button>
              </>
              }
            </section>
          </main>
        </div>
          <DashboardBottomNav page="order"/>
      </div>
    </>
  );
}
