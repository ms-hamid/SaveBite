"use client";

import { useEffect, useState } from "react";

import { PageHeader, TabNav } from "../../components/shared";
import EmptyOrder from "../../components/history/EmptyOrder";
import CancelledCard from "../../components/history/cancelled_card";
import CustomerNavbar from "../../components/navbar/customer_navbar";
import { supabase } from "../../lib/supabase";
import OrderList from "../../components/HistoryCard";
import { Order } from "../../types";

type TabId = "upcoming" | "completed" | "cancelled";

export function format_date_month(date_string: string) {
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
    completed: []
  });
  
  useEffect(() => {
    async function get_ordere() {
      
      const { data, error } = await supabase
      .from("orders")
      .select(`
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
        listings:listing_id (
          name,
          img_url,
          public_id,
          merchants:merchant_id (
            merchant_name
          )
        )
      `)
      .returns<Order[]>();
    
      if (error) {
        console.error(error);
        return;
      }
    
      let filtered_orders: Record<TabId, Order[]>= {
        cancelled: [],
        upcoming: [],
        completed: []
      };
      data.map((order) => {
        if (order.status === "cancelled") {
          filtered_orders.cancelled.unshift(order)
        } else if (order.status === "completed") {
          filtered_orders.completed.unshift(order)
        } else {
          
          filtered_orders.upcoming.unshift(order)
        }
        
      })
      
      set_orders(filtered_orders)
      console.log(data);
    }
    
    get_ordere();
  }, [])

  const currentOrders = orders[active_tab];

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
        {currentOrders.length === 0 ? (
          <EmptyOrder />
        ) : (
          <div className="space-y-4">
            { active_tab === "cancelled" ? 
              currentOrders.map((order) => (
              <CancelledCard key={order.public_id} id={order.public_id} name={order.listing?.name ?? ""} image={order.listing?.img_url ?? ""} date={format_date_month(order?.updated_at ?? "") } product={order.merchant?.merchant_name ?? ""} order_number={order.order_code ?? ""} product_pid={order.listing?.public_id ?? ""}/>)) 
            : currentOrders.map((order) => (
              <OrderList key={order.public_id} id={order.public_id} name={order.listing?.name ?? ""} image={order.listing?.img_url ?? ""} date={format_date_month(order?.updated_at ?? "")} product={order.merchant?.merchant_name ?? ""} order_number={order.order_code ?? ""} status={order.status ?? ""} active_tab={active_tab} />
            ))}
          </div>
        )}
      </main>

      <CustomerNavbar active_tab="order" />
    </div>
  );
}