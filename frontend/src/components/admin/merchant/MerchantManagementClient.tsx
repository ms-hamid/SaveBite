"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabase";
import MerchantTableRow, {
  MerchantOrder,
  MerchantRowData,
} from "./MerchantTableRow";

type Merchant = {
  user_id: string;
  orders: MerchantOrder[] | null;
};

const PAGE_SIZE = 5;

export default function MerchantManagementClient() {
  const [merchants, set_merchants] = useState<Merchant[]>([]);
  const [loading, set_loading] = useState<boolean>(true);
  const [error_message, set_error_message] = useState<string>("");

  const [current_page, set_current_page] = useState<number>(1);
  const [total_count, set_total_count] = useState<number>(0);

  const total_pages = Math.max(1, Math.ceil(total_count / PAGE_SIZE));

  const start_entry =
    total_count === 0 ? 0 : (current_page - 1) * PAGE_SIZE + 1;

  const end_entry = Math.min(current_page * PAGE_SIZE, total_count);

  async function get_merchants(page: number) {
    set_loading(true);
    set_error_message("");

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error, count } = await supabase
      .from("merchants")
      .select(
        `
        user_id,
        orders (
          id,
          qty,
          total_amount,
          status,
          created_at,
          deleted_at,
          merchant_id
        )
      `,
        { count: "exact" }
      )
      .range(from, to)
      .returns<Merchant[]>();

    if (error) {
      console.log(error);
      set_error_message(error.message);
      set_merchants([]);
      set_total_count(0);
      set_loading(false);
      return;
    }

    set_merchants(data ?? []);
    set_total_count(count ?? 0);
    set_loading(false);
  }

  useEffect(() => {
    get_merchants(current_page);
  }, [current_page]);

  const merchant_rows: MerchantRowData[] = useMemo(() => {
    return merchants.map((merchant) => {
      const orders = (merchant.orders ?? []).filter(
        (order) => order.deleted_at === null
      );

      const total_revenue = orders.reduce((total, order) => {
        return total + Number(order.total_amount ?? 0);
      }, 0);

      const active_orders = orders.filter(
        (order) =>
          order.status === "paid" ||
          order.status === "ready" ||
          order.status === "completed"
      );

      return {
        user_id: merchant.user_id,

        // Placeholder karena data definition merchants tidak diberikan
        merchant_name: "-",
        category: "-",
        location: "-",
        rating: "-",
        review_count: "-",

        // Status sementara dibuat dari data order
        status: active_orders.length > 0 ? "Active" : "Incomplete",

        total_orders: orders.length,
        total_revenue,
      };
    });
  }, [merchants]);

  const active_merchants = merchant_rows.filter(
    (merchant) => merchant.status === "Active"
  ).length;

  function goToPage(page: number) {
    if (page < 1 || page > total_pages || page === current_page) return;
    set_current_page(page);
  }

  function getPaginationNumbers() {
    const pages: number[] = [];

    const start = Math.max(1, current_page - 1);
    const end = Math.min(total_pages, current_page + 1);

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    return pages;
  }

  return (
    <div className="max-w-container-max space-y-unit-xl">
      <div>
        <h2 className="font-page-title text-page-title font-bold text-on-surface mb-unit-xs hidden md:block">
          Merchant Management
        </h2>

        <h2 className="font-page-title-mobile text-page-title-mobile font-bold text-on-surface mb-unit-xs md:hidden">
          Merchant Management
        </h2>

        <p className="font-body-medium text-body-medium text-on-surface-variant">
          Manage platform partners and their store performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-unit-md">
        <div className="bg-surface-container-lowest rounded-[16px] p-unit-md shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30 flex flex-col gap-2 relative overflow-hidden group hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />

          <div className="flex justify-between items-start">
            <span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">
              Total Merchants
            </span>

            <div className="p-1.5 bg-surface-container rounded-lg text-primary">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "20px" }}
              >
                store
              </span>
            </div>
          </div>

          <div className="flex items-end gap-3 mt-1">
            <span className="font-section-title text-section-title text-on-surface">
              {loading ? "..." : total_count}
            </span>

            <div className="flex items-center text-primary font-label-bold text-label-bold mb-1 bg-highlight px-2 py-0.5 rounded">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "14px" }}
              >
                database
              </span>
              <span>From merchants</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-[16px] p-unit-md shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30 flex flex-col gap-2 relative overflow-hidden group hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />

          <div className="flex justify-between items-start">
            <span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">
              Active Now
            </span>

            <div className="p-1.5 bg-secondary-container rounded-lg text-tertiary">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "20px" }}
              >
                online_prediction
              </span>
            </div>
          </div>

          <div className="flex items-end gap-3 mt-1">
            <span className="font-section-title text-section-title text-on-surface">
              {loading ? "..." : active_merchants}
            </span>

            <div className="flex items-center text-on-surface-variant font-label-bold text-label-bold mb-1 bg-surface-container px-2 py-0.5 rounded">
              <span>Based on active orders</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-[16px] p-unit-md shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30 flex flex-col gap-2 relative overflow-hidden group hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />

          <div className="flex justify-between items-start">
            <span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">
              Avg. Rating
            </span>

            <div className="p-1.5 bg-amber-soft rounded-lg text-amber-icon">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "20px" }}
              >
                star
              </span>
            </div>
          </div>

          <div className="flex items-end gap-3 mt-1">
            <span className="font-section-title text-section-title text-on-surface">
              -
            </span>

            <div className="flex items-center text-amber-icon font-label-bold text-label-bold mb-1 bg-amber-soft px-2 py-0.5 rounded">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "14px" }}
              >
                star
              </span>
              <span>Placeholder</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30 overflow-hidden flex flex-col">
        <div className="p-unit-md border-b border-outline-variant/50 flex flex-col sm:flex-row gap-unit-sm justify-between items-center bg-surface-container-lowest">
          <div className="relative w-full sm:w-72">
            <span
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant"
              style={{ fontSize: "20px" }}
            >
              search
            </span>

            <input
              className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg font-body-sm text-body-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-secondary-container transition-all bg-surface-bright"
              placeholder="Search merchants..."
              type="text"
            />
          </div>

          <div className="flex gap-unit-sm w-full sm:w-auto">
            <select className="flex-1 sm:w-auto px-4 py-2 border border-outline-variant rounded-lg font-body-sm text-body-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-secondary-container bg-surface-bright text-on-surface cursor-pointer appearance-none">
              <option value="">All Categories</option>
              <option value="bakery">Bakery</option>
              <option value="restaurant">Restaurant</option>
              <option value="grocery">Grocery</option>
            </select>

            <select className="flex-1 sm:w-auto px-4 py-2 border border-outline-variant rounded-lg font-body-sm text-body-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-secondary-container bg-surface-bright text-on-surface cursor-pointer appearance-none">
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="incomplete">Incomplete</option>
            </select>

            <button className="px-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors text-on-surface flex items-center justify-center">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "20px" }}
              >
                filter_list
              </span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[960px]">
            <thead>
              <tr className="bg-surface-bright border-b border-outline-variant/50">
                <th className="p-unit-md font-label-bold text-label-bold text-outline tracking-wider font-semibold">
                  Merchant Name
                </th>
                <th className="p-unit-md font-label-bold text-label-bold text-outline tracking-wider font-semibold">
                  Category
                </th>
                <th className="p-unit-md font-label-bold text-label-bold text-outline tracking-wider font-semibold">
                  Location
                </th>
                <th className="p-unit-md font-label-bold text-label-bold text-outline tracking-wider font-semibold">
                  Rating
                </th>
                <th className="p-unit-md font-label-bold text-label-bold text-outline tracking-wider font-semibold">
                  Orders
                </th>
                <th className="p-unit-md font-label-bold text-label-bold text-outline tracking-wider font-semibold">
                  Revenue
                </th>
                <th className="p-unit-md font-label-bold text-label-bold text-outline tracking-wider font-semibold">
                  Status
                </th>
                <th className="p-unit-md font-label-bold text-label-bold text-outline tracking-wider font-semibold text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-outline-variant/30 font-body-sm text-body-sm">
              {loading && (
                <tr>
                  <td
                    colSpan={8}
                    className="p-unit-lg text-center text-on-surface-variant"
                  >
                    Loading merchants...
                  </td>
                </tr>
              )}

              {!loading && error_message && (
                <tr>
                  <td
                    colSpan={8}
                    className="p-unit-lg text-center text-error"
                  >
                    {error_message}
                  </td>
                </tr>
              )}

              {!loading && !error_message && merchant_rows.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="p-unit-lg text-center text-on-surface-variant"
                  >
                    No merchants found.
                  </td>
                </tr>
              )}

              {!loading &&
                !error_message &&
                merchant_rows.map((merchant) => (
                  <MerchantTableRow
                    key={merchant.user_id}
                    merchant={merchant}
                  />
                ))}
            </tbody>
          </table>
        </div>

        <div className="p-unit-md border-t border-outline-variant/50 bg-surface-bright flex items-center justify-between">
          <p className="text-sm text-on-surface-variant hidden sm:block">
            Showing {start_entry} to {end_entry} of {total_count} entries
          </p>

          <div className="flex items-center gap-1 w-full sm:w-auto justify-center sm:justify-end">
            <button
              disabled={current_page === 1 || loading}
              onClick={() => goToPage(current_page - 1)}
              className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant transition-colors disabled:opacity-50 hover:bg-secondary-container hover:text-primary"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "20px" }}
              >
                chevron_left
              </span>
            </button>

            {current_page > 2 && (
              <>
                <button
                  onClick={() => goToPage(1)}
                  className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface font-medium text-sm transition-colors hover:bg-secondary-container hover:text-primary"
                >
                  1
                </button>
                <span className="w-8 h-8 flex items-center justify-center text-on-surface-variant">
                  ...
                </span>
              </>
            )}

            {getPaginationNumbers().map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded font-medium text-sm transition-colors ${
                  current_page === page
                    ? "text-on-primary bg-primary hover:bg-primary-dark"
                    : "border border-outline-variant text-on-surface hover:bg-secondary-container hover:text-primary"
                }`}
              >
                {page}
              </button>
            ))}

            {current_page < total_pages - 1 && (
              <>
                <span className="w-8 h-8 flex items-center justify-center text-on-surface-variant">
                  ...
                </span>
                <button
                  onClick={() => goToPage(total_pages)}
                  className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface font-medium text-sm transition-colors hover:bg-secondary-container hover:text-primary"
                >
                  {total_pages}
                </button>
              </>
            )}

            <button
              disabled={current_page === total_pages || loading}
              onClick={() => goToPage(current_page + 1)}
              className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant transition-colors disabled:opacity-50 hover:bg-secondary-container hover:text-primary"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "20px" }}
              >
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}