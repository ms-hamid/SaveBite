"use client";
import { useEffect, useState } from "react";
import MerchantOrderCard, { OrderCardData } from "../../../components/m/MerchantOrderCard";
import DashboardBottomNav from "../../../components/m/DashboardBottomNav";
import DashboardTopAppBar from "../../../components/m/DashboardTopAppBar";
import { Order } from "../../../components/providers/OrderProvider";
import api, { getApiErrorMessage } from "../../../lib/api";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase"; // Retained for auth.getUser() — migrate in Phase 3

export default function MerchantOrdersActiveStateRefinedPage() {

  const router = useRouter();
const [page_state, set_page_state] = useState<"completed" | "other">("other");

const [orders, set_orders] = useState<Order[] | null>();

async function change_status(id: number, status: string) {
  if (status === "ready_to_pickup") {
    router.push("/m/scan");
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
    await api.patch(`/order/${id}/status`, { status: next_status });
    // Refresh orders list after update
    get_orders_ref.current?.();
  } catch (err) {
    console.error("Status change failed:", getApiErrorMessage(err));
  }
}

useEffect(() => {
  async function get_orders() {
    const {data: user_data, error: user_error} = (await supabase.auth.getUser());

    const {data, error} = await supabase.from("orders").select(`
      id,
      qty,
      total_amount,
      qr_token,
      status,
      created_at,
      updated_at,
      deleted_at,
      listing_id,
      customer_id,
      public_id,
      customers: customer_id (
        full_name
      ),
      listings:listing_id (
        name,
        description,
        discount_price,
        discount_percentage,
        original_price,
        merchant_id,
        merchants:merchant_id (
          merchant_name,
          address
        )
      )`).eq("merchant_id", user_data.user?.id).returns<Order[]>();

    console.log(data);
    console.log(error);

    set_orders(data);
  }

  get_orders();
}, [])

// const orderPlaceholderData: OrderCardData[] = [
//   // NEW - 3 data
//   {
//     id: "1043",
//     status: "new",
//     customerName: "John D.",
//     customerTag: {
//       label: "Repeat customer",
//       variant: "repeat",
//       icon: "star",
//       iconType: "material",
//       fillIcon: true,
//     },
//     item: {
//       name: "Sourdough Loaf",
//       quantity: 1,
//       price: 45000,
//       icon: "bakery_dining",
//     },
//     pickupTime: "18:30-19:00",
//     statusNote: "Ordered 5m ago",
//     statusNoteIcon: "timer",
//   },
//   {
//     id: "1044",
//     status: "new",
//     customerName: "Nadia R.",
//     item: {
//       name: "Banana Muffin Box",
//       quantity: 2,
//       price: 56000,
//       icon: "bakery_dining",
//     },
//     pickupTime: "19:00-19:30",
//     statusNote: "Ordered 8m ago",
//     statusNoteIcon: "timer",
//   },
//   {
//     id: "1045",
//     status: "new",
//     customerName: "Kevin A.",
//     customerTag: {
//       label: "Repeat customer",
//       variant: "repeat",
//       icon: "star",
//       iconType: "material",
//       fillIcon: true,
//     },
//     item: {
//       name: "Croissant Bundle",
//       quantity: 1,
//       price: 38000,
//       icon: "bakery_dining",
//     },
//     pickupTime: "17:30-18:00",
//     statusNote: "Ordered 2m ago",
//     statusNoteIcon: "timer",
//   },

//   // PREPARING - 3 data
//   {
//     id: "1040",
//     status: "preparing",
//     customerName: "Sarah J.",
//     customerTag: {
//       label: "High priority",
//       variant: "priority",
//       icon: "🔥",
//       iconType: "emoji",
//     },
//     item: {
//       name: "Artisan Sourdough",
//       quantity: 2,
//       price: 90000,
//       icon: "shopping_bag",
//     },
//     pickupTime: "18:30-19:00",
//     statusNote: "Ready in 10m",
//     statusNoteIcon: "timelapse",
//   },
//   {
//     id: "1039",
//     status: "preparing",
//     customerName: "Rizky P.",
//     item: {
//       name: "Chicken Rice Box",
//       quantity: 1,
//       price: 25000,
//       icon: "lunch_dining",
//     },
//     pickupTime: "18:00-18:30",
//     statusNote: "Ready in 15m",
//     statusNoteIcon: "timelapse",
//   },
//   {
//     id: "1038",
//     status: "preparing",
//     customerName: "Maya L.",
//     customerTag: {
//       label: "High priority",
//       variant: "priority",
//       icon: "🔥",
//       iconType: "emoji",
//     },
//     item: {
//       name: "Surplus Salad Bowl",
//       quantity: 3,
//       price: 72000,
//       icon: "restaurant",
//     },
//     pickupTime: "19:00-19:30",
//     statusNote: "Ready in 20m",
//     statusNoteIcon: "timelapse",
//   },

//   // READY - 3 data
//   {
//     id: "1037",
//     status: "ready",
//     customerName: "Michael K.",
//     customerTag: {
//       label: "Pickup soon",
//       variant: "pickupSoon",
//       icon: "⚠",
//       iconType: "emoji",
//     },
//     item: {
//       name: "Surplus Pastry Box",
//       quantity: 1,
//       price: 35000,
//       icon: "inventory_2",
//     },
//     pickupTime: "18:00-18:30",
//     statusNote: "Awaiting Pickup",
//     statusNoteIcon: "person_check",
//   },
//   {
//     id: "1036",
//     status: "ready",
//     customerName: "Dina S.",
//     item: {
//       name: "Nasi Ayam Paket Hemat",
//       quantity: 2,
//       price: 50000,
//       icon: "inventory_2",
//     },
//     pickupTime: "17:30-18:00",
//     statusNote: "Awaiting Pickup",
//     statusNoteIcon: "person_check",
//   },
//   {
//     id: "1035",
//     status: "ready",
//     customerName: "Arif T.",
//     customerTag: {
//       label: "Pickup soon",
//       variant: "pickupSoon",
//       icon: "⚠",
//       iconType: "emoji",
//     },
//     item: {
//       name: "Donut Mixed Box",
//       quantity: 1,
//       price: 42000,
//       icon: "inventory_2",
//     },
//     pickupTime: "19:00-19:30",
//     statusNote: "Awaiting Pickup",
//     statusNoteIcon: "person_check",
//   },

//   // COMPLETED - 3 data
//   {
//     id: "1034",
//     status: "completed",
//     customerName: "Sarah J.",
//     item: {
//       name: "Artisan Sourdough",
//       quantity: 2,
//       price: 90000,
//       icon: "bakery_dining",
//     },
//     statusNote: "Picked up at 14:30",
//     statusNoteIcon: "check_circle",
//   },
//   {
//     id: "1033",
//     status: "completed",
//     customerName: "Fajar M.",
//     item: {
//       name: "Pasta Lunch Box",
//       quantity: 1,
//       price: 32000,
//       icon: "restaurant",
//     },
//     statusNote: "Picked up at 15:10",
//     statusNoteIcon: "check_circle",
//   },
//   {
//     id: "1032",
//     status: "completed",
//     customerName: "Lina W.",
//     item: {
//       name: "Brownies Slice Pack",
//       quantity: 3,
//       price: 60000,
//       icon: "bakery_dining",
//     },
//     statusNote: "Picked up at 16:05",
//     statusNoteIcon: "check_circle",
//   },
// ];
  
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
                Active: 4</div>
              <div
                className="flex-shrink-0 bg-orange-50 text-orange-700 text-[12px] px-3 py-1.5 rounded-full font-semibold border border-orange-100">
                Preparing: 2</div>
              <div
                className="flex-shrink-0 bg-[#E8F8F2] text-primary-emerald text-[12px] px-3 py-1.5 rounded-full font-semibold border border-primary-emerald/20">
                Ready: 1</div>
              <div
                className="flex-shrink-0 bg-slate-50 text-slate-500 text-[12px] px-3 py-1.5 rounded-full font-semibold border border-sb-border">
                Completed: 18</div>
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
                  Active (4)
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
                  Completed (18)
                </button>
              </div>
            </section>
            {/* Order List */}
            <section className="flex flex-col flex-1 items-center justify-center text-center gap-4">
              { orders?.length !== 0 ?
                orders?.map((data) => {
                  if (page_state === "completed") {
                    return data.status === "completed" ? <MerchantOrderCard key={data.id} order={data} />  : ""
                  } 
                  return data.status !== "completed" ? <MerchantOrderCard key={data.id} order={data} onAction={() => {change_status(data.id, data.status)}}/> : ""
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
          <DashboardBottomNav page="order"/>
        </div>
      </div>
    </>
  );
}
