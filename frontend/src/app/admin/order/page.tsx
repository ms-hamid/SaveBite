"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { supabase } from "../../../lib/supabase";
import OrderMonitoringTableRow, { Order, OrderStatus } from "../../../components/admin/OrderMonitoringTableRow";
import { getAllOrder } from "@/services/order";

type StatusFilter = "all" | OrderStatus;

const PAGE_SIZE = 5;

const status_filters: {
  label: string;
  value: StatusFilter;
}[] = [
  { label: "All", value: "all" },
  { label: "Pending Payment", value: "pending_payment" },
  { label: "Paid Reserved", value: "paid_reserved" },
  { label: "Preparing", value: "preparing" },
  { label: "Ready To Pickup", value: "ready_to_pickup" },
  { label: "Completed", value: "completed" },
  { label: "Expired Unclaimed", value: "expired_unclaimed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function Page() {

    console.log('start')

  const [orders, set_orders] = useState<Order[]>([]);
  const [selected_status, set_selected_status] = useState<StatusFilter>("all");
  const [current_page, set_current_page] = useState<number>(1);
  const [total_count, set_total_count] = useState<number>(0);

  const [loading, set_loading] = useState<boolean>(true);
  const [error_message, set_error_message] = useState<string>("");

  const total_pages = Math.max(1, Math.ceil(total_count / PAGE_SIZE));

  const start_entry =
    total_count === 0 ? 0 : (current_page - 1) * PAGE_SIZE + 1;

  const end_entry = Math.min(current_page * PAGE_SIZE, total_count);

  async function get_orders() {
    console.log('start')
    set_loading(true);
    set_error_message("");

    const from = (current_page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const data = await getAllOrder();

    console.log(data)

    set_orders(data.data ?? []);
    set_total_count(data.data.length ?? 0);
    set_loading(false);
  }

  useEffect(() => {
    console.log('start')


    get_orders();
  }, [selected_status, current_page]);

  function handle_status_change(status: StatusFilter) {
    set_selected_status(status);
    set_current_page(1);
  }

  function go_to_page(page: number) {
    if (page < 1 || page > total_pages || page === current_page) return;
    set_current_page(page);
  }

  function get_pagination_numbers() {
    const pages: number[] = [];

    const start = Math.max(1, current_page - 1);
    const end = Math.min(total_pages, current_page + 1);

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    return pages;
  }

  function render_order_rows() {
    if (loading) {
      return (
        <tr>
          <td
            colSpan={6}
            className="py-6 px-6 text-center text-secondary"
          >
            Loading orders...
          </td>
        </tr>
      );
    }

    if (error_message) {
      return (
        <tr>
          <td
            colSpan={6}
            className="py-6 px-6 text-center text-error"
          >
            {error_message}
          </td>
        </tr>
      );
    }

    if (orders.length === 0) {
      return (
        <tr>
          <td
            colSpan={6}
            className="py-6 px-6 text-center text-secondary"
          >
            No orders found.
          </td>
        </tr>
      );
    }

    return orders.map((order) => (
      <OrderMonitoringTableRow key={order.id} order={order} />
    ));
  }

  return (
    <AdminLayout>
      <div className="mb-section_gap flex justify-between items-end gap-unit-md">
        <div>
          <h2 className="font-page-title text-page-title text-on-surface">
            Order Monitoring
          </h2>
          <p className="font-body-default text-body-default text-secondary mt-2">
            Platform-wide order tracking and auditing.
          </p>
        </div>

        <button className="bg-primary text-on-primary rounded-lg px-6 py-2.5 font-label-md text-label-md flex items-center gap-2 hover:bg-primary-dark transition-colors shadow-[0px_1px_3px_rgba(0,0,0,0.05),0px_10px_15px_-5px_rgba(0,0,0,0.03)]">
          <span className="material-symbols-outlined text-[20px]">
            download
          </span>
          Export Report
        </button>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 mb-unit-md flex flex-wrap gap-4 items-center justify-between shadow-[0px_1px_3px_rgba(0,0,0,0.05),_0px_10px_15px_-5px_rgba(0,0,0,0.03)]">
        <div className="flex flex-wrap gap-2">
          {status_filters.map((filter) => {
            const is_active = selected_status === filter.value;

            return (
              <button
                key={filter.value}
                onClick={() => handle_status_change(filter.value)}
                className={`px-3 py-1.5 rounded-lg font-label-bold text-label-bold border transition-colors ${
                  is_active
                    ? "bg-surface-container-high text-on-surface border-outline-variant"
                    : "text-secondary border-transparent hover:bg-surface-container-low"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[18px]">
              calendar_today
            </span>

            <select className="pl-9 pr-8 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-default text-body-default focus:outline-none focus:border-primary appearance-none cursor-pointer">
              <option>Today</option>
              <option>Yesterday</option>
              <option>Last 7 Days</option>
            </select>
          </div>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[18px]">
              store
            </span>

            <select className="pl-9 pr-8 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-default text-body-default focus:outline-none focus:border-primary appearance-none cursor-pointer">
              <option>All Merchants</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-[0px_1px_3px_rgba(0,0,0,0.05),_0px_10px_15px_-5px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[960px]">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low">
                <th className="py-3 px-6 font-caption text-caption text-secondary font-semibold uppercase tracking-wider">
                  Order ID
                </th>
                <th className="py-3 px-6 font-caption text-caption text-secondary font-semibold uppercase tracking-wider">
                  Merchant
                </th>
                <th className="py-3 px-6 font-caption text-caption text-secondary font-semibold uppercase tracking-wider">
                  Customer
                </th>
                <th className="py-3 px-6 font-caption text-caption text-secondary font-semibold uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-6 font-caption text-caption text-secondary font-semibold uppercase tracking-wider text-right">
                  Total
                </th>
                <th className="py-3 px-6 font-caption text-caption text-secondary font-semibold uppercase tracking-wider">
                  Created Time
                </th>
              </tr>
            </thead>

            <tbody className="font-body-default text-body-default text-on-surface divide-y divide-outline-variant">
              {render_order_rows()}
            </tbody>
          </table>
        </div>

        <div className="bg-surface-container-lowest px-6 py-4 border-t border-outline-variant flex items-center justify-between">
          <div className="font-body-default text-body-default text-secondary">
            Showing{" "}
            <span className="font-medium text-on-surface">
              {start_entry}
            </span>{" "}
            to{" "}
            <span className="font-medium text-on-surface">
              {end_entry}
            </span>{" "}
            of{" "}
            <span className="font-medium text-on-surface">
              {total_count}
            </span>{" "}
            results
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => go_to_page(current_page - 1)}
              disabled={current_page === 1 || loading}
              className="px-3 py-1.5 border border-outline-variant rounded-md text-secondary hover:bg-surface-container-low disabled:opacity-50 disabled:cursor-not-allowed font-label-bold text-label-bold transition-colors"
            >
              Previous
            </button>

            {current_page > 2 && (
              <>
                <button
                  onClick={() => go_to_page(1)}
                  className="px-3 py-1.5 border border-outline-variant rounded-md text-on-surface hover:bg-surface-container-low font-label-bold text-label-bold transition-colors"
                >
                  1
                </button>
                <span className="px-3 py-1.5 text-secondary">...</span>
              </>
            )}

            {get_pagination_numbers().map((page) => (
              <button
                key={page}
                onClick={() => go_to_page(page)}
                className={`px-3 py-1.5 border rounded-md font-label-bold text-label-bold transition-colors ${
                  current_page === page
                    ? "bg-primary text-on-primary border-primary"
                    : "border-outline-variant text-on-surface hover:bg-surface-container-low"
                }`}
              >
                {page}
              </button>
            ))}

            {current_page < total_pages - 1 && (
              <>
                <span className="px-3 py-1.5 text-secondary">...</span>
                <button
                  onClick={() => go_to_page(total_pages)}
                  className="px-3 py-1.5 border border-outline-variant rounded-md text-on-surface hover:bg-surface-container-low font-label-bold text-label-bold transition-colors"
                >
                  {total_pages}
                </button>
              </>
            )}

            <button
              onClick={() => go_to_page(current_page + 1)}
              disabled={current_page === total_pages || loading}
              className="px-3 py-1.5 border border-outline-variant rounded-md text-secondary hover:bg-surface-container-low disabled:opacity-50 disabled:cursor-not-allowed font-label-bold text-label-bold transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="h-12" />
    </AdminLayout>
  );
}