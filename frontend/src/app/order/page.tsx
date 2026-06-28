"use client";

import { useCallback, useEffect, useState } from "react";

import { PageHeader, TabNav } from "../../components/shared";
import EmptyOrder from "../../components/history/EmptyOrder";
import CancelledCard from "../../components/history/cancelled_card";
import CustomerNavbar from "../../components/navbar/customer_navbar";
import OrderList from "../../components/HistoryCard";
import { Order } from "../../types";
import { getCustomerOrder } from "@/services/order";

type TabId = "upcoming" | "completed" | "cancelled";

function format_date_month(date_string: string) {
  const date = new Date(date_string);

  return new Intl.DateTimeFormat("en-EN", {
    day: "2-digit",
    month: "long",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

export default function HistoryPage() {
  const [active_tab, setActiveTab] = useState<TabId>("upcoming");

  const tabs = [
    { id: "upcoming", label: "Upcoming" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ];

  const [orders, set_orders] = useState<Record<TabId, Order[]>>({
    upcoming: [],
    cancelled: [],
    completed: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  // Reusable refresh function — call after any order state change
  const refresh_orders = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = (await getCustomerOrder()).data;

      const filtered_orders: Record<TabId, Order[]> = {
        cancelled: [],
        upcoming: [],
        completed: [],
      };


      data.forEach((order: Order) => {
        if (order.status === "cancelled") {
          filtered_orders.cancelled.unshift(order);
        } else if (order.status === "completed") {
          filtered_orders.completed.unshift(order);
        } else {
          filtered_orders.upcoming.unshift(order);
        }
      });


      set_orders(filtered_orders);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh_orders();
  }, [refresh_orders]);

  const currentOrders = orders[active_tab];

  // Skeleton placeholder for loading state
  const OrderSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 shadow-sm animate-pulse"
        >
          <div className="flex gap-3 mb-3">
            <div className="h-14 w-14 rounded-lg bg-slate-200 dark:bg-slate-700 shrink-0" />
            <div className="flex flex-col gap-2 flex-1 justify-center">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
            </div>
          </div>
          <div className="flex justify-between pt-3 border-t border-slate-100 dark:border-white/5">
            <div className="h-5 w-20 bg-slate-100 dark:bg-slate-800 rounded-full" />
            <div className="h-5 w-24 bg-slate-100 dark:bg-slate-800 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative flex h-screen w-full max-w-md mx-auto flex-col overflow-hidden bg-white dark:bg-surface-dark shadow-2xl">
      <PageHeader title="Orders" showFilter />

      <div className="px-6 pt-4 pb-2 mb-4">
        <TabNav
          tabs={tabs}
          activeTab={active_tab}
          onTabChange={(id) => setActiveTab(id as TabId)}
        />
      </div>

      <main className="flex-1 overflow-y-auto px-6 pb-24">
        {isLoading ? (
          <OrderSkeleton />
        ) : currentOrders.length === 0 ? (
          <EmptyOrder />
        ) : (
          <div className="space-y-4">
            {active_tab === "cancelled"
              ? currentOrders.map((order) => (
                  <CancelledCard
                    key={order.public_id}
                    id={order.public_id}
                    name={order.listing?.name ?? ""}
                    image={order.listing?.img_url ?? "https://upload.wikimedia.org/wikipedia/commons/6/60/No-Image-Placeholder-banner.svg"}
                    date={format_date_month(order?.updated_at ?? "")}
                    product={order.merchant?.merchant_name ?? ""}
                    order_number={order.order_code ?? ""}
                    product_pid={order.listing?.public_id ?? ""}
                  />
                ))
              : currentOrders.map((order) => (
                  <OrderList
                    key={order.public_id}
                    id={order.public_id}
                    name={order.listing?.name ?? ""}
                    image={order.listing?.img_url ?? "https://upload.wikimedia.org/wikipedia/commons/6/60/No-Image-Placeholder-banner.svg"}
                    date={format_date_month(order?.updated_at ?? "")}
                    product={order.merchant?.merchant_name ?? ""}
                    order_number={order.order_code ?? "order code unavailable"}
                    status={order.status ?? ""}
                    active_tab={active_tab}
                    onRefresh={refresh_orders}
                  />
                ))}
          </div>
        )}
      </main>

      <CustomerNavbar active_tab="order" />
    </div>
  );
}