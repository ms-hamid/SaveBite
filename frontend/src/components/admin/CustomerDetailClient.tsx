"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import CustomerOrderTableRow, { CustomerOrder } from "./CustomerOrderTabelRow";


type Customer = {
  full_name: string;
  exp: number | null;
  strike_count: number | null;
  user_id: string;
};

type CustomerWithOrders = Customer & {
  orders: CustomerOrder[] | null;
};



function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CustomerDetailClient({
  public_id,
}: {public_id: string | undefined}) {
  const [customer, set_customer] = useState<CustomerWithOrders | null>(null);
  const [loading, set_loading] = useState<boolean>(true);
  const [error_message, set_error_message] = useState<string>("");

  async function get_customer_detail() {
    set_loading(true);
    set_error_message("");

    const { data, error } = await supabase
      .from("customers")
      .select(
        `
        full_name,
        exp,
        strike_count,
        user_id,
        orders (
          id,
          qty,
          total_amount,
          qr_token,
          status,
          created_at,
          updated_at,
          deleted_at,
          listing_id,
          public_id,
          merchant_id,
          customer_id
        )
      `
      )
      .eq("user_id", public_id)
      .single<CustomerWithOrders>();

    if (error) {
      console.log(error);
      set_error_message(error.message);
      set_customer(null);
      set_loading(false);
      return;
    }

    set_customer(data);
    set_loading(false);
  }

  useEffect(() => {
    get_customer_detail();
  }, [public_id]);

  const orders = useMemo(() => {
    return (customer?.orders ?? [])
      .filter((order) => order.deleted_at === null)
      .sort((a, b) => {
        const date_a = a.created_at ? new Date(a.created_at).getTime() : 0;
        const date_b = b.created_at ? new Date(b.created_at).getTime() : 0;

        return date_b - date_a;
      });
  }, [customer]);

  const total_orders = orders.length;

  const completed_orders = orders.filter(
    (order) => order.status === "completed"
  ).length;

  const cancelled_orders = orders.filter(
    (order) => order.status === "cancelled" || order.status === "cancel"
  ).length;

  const total_transaction = orders.reduce((total, order) => {
    return total + Number(order.total_amount ?? 0);
  }, 0);

  const completion_rate =
    total_orders === 0
      ? 0
      : Math.round((completed_orders / total_orders) * 100);

  const cancellation_rate =
    total_orders === 0
      ? 0
      : Math.round((cancelled_orders / total_orders) * 100);

  const strike_count = customer?.strike_count ?? 0;
  const status = strike_count >= 3 ? "Suspended" : "Active";

  if (loading) {
    return (
      <div className="bg-surface-container-lowest p-unit-lg rounded-xl border border-outline-variant/30 text-on-surface-variant">
        Loading customer detail...
      </div>
    );
  }

  if (error_message) {
    return (
      <div className="bg-error-container p-unit-lg rounded-xl border border-error/30 text-error">
        {error_message}
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="bg-surface-container-lowest p-unit-lg rounded-xl border border-outline-variant/30 text-on-surface-variant">
        Customer not found.
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-unit-md bg-surface-container-lowest p-unit-lg rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] border border-outline-variant/30">
        <div className="flex items-center gap-unit-md">
          <div className="w-20 h-20 rounded-full border-2 border-surface-container bg-surface-variant flex items-center justify-center font-page-title-mobile text-page-title-mobile text-on-surface-variant">
            {getInitials(customer.full_name)}
          </div>

          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="font-page-title text-page-title text-on-surface">
                {customer.full_name}
              </h2>

              <span
                className={`px-3 py-1 rounded-full font-label-bold text-[12px] uppercase tracking-wider flex items-center gap-1 border ${
                  status === "Suspended"
                    ? "bg-error-container text-error border-error/20"
                    : "bg-[#d0e8dd] text-[#00422b] border-[#10b981]/20"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    status === "Suspended" ? "bg-error" : "bg-[#10b981]"
                  }`}
                ></span>
                {status}
              </span>
            </div>

            <div className="flex items-center gap-4 text-on-surface-variant font-body-sm text-body-sm">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">
                  calendar_today
                </span>
                Joined -
              </span>

              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">
                  person
                </span>
                ID: {customer.user_id}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-unit-sm mt-4 md:mt-0">
          <button className="px-4 py-2 bg-[#d0e8dd] text-[#005236] rounded-lg font-label-bold text-label-bold hover:bg-[#b4ccc1] transition-colors shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">
              history
            </span>
            View Activity
          </button>

          {status === "Suspended" ? (
            <button className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-bold text-label-bold hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">
                check_circle
              </span>
              Reactivate Account
            </button>
          ) : (
            <button className="px-4 py-2 border border-error/30 text-error rounded-lg font-label-bold text-label-bold hover:bg-error-container/50 transition-colors shadow-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">
                block
              </span>
              Suspend Account
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-unit-md">
        <div className="bg-surface-container-lowest p-unit-md rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] border border-outline-variant/30 flex flex-col justify-between group hover:-translate-y-0.5 transition-transform duration-200">
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-bold text-label-bold text-on-surface-variant">
              Total Orders
            </span>
            <div className="p-2 bg-primary-container/10 rounded-lg text-primary-container">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                shopping_bag
              </span>
            </div>
          </div>

          <div>
            <div className="font-page-title-mobile text-page-title-mobile text-on-surface">
              {total_orders}
            </div>
            <div className="font-caption text-caption text-primary mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">
                trending_up
              </span>
              Based on orders data
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-unit-md rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] border border-outline-variant/30 flex flex-col justify-between group hover:-translate-y-0.5 transition-transform duration-200">
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-bold text-label-bold text-on-surface-variant">
              Completed Orders
            </span>
            <div className="p-2 bg-secondary-container/50 rounded-lg text-secondary">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
          </div>

          <div>
            <div className="font-page-title-mobile text-page-title-mobile text-on-surface">
              {completed_orders}
            </div>
            <div className="font-caption text-caption text-on-surface-variant mt-1">
              {completion_rate}% completion rate
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-unit-md rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] border border-outline-variant/30 flex flex-col justify-between group hover:-translate-y-0.5 transition-transform duration-200">
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-bold text-label-bold text-on-surface-variant">
              Cancelled Orders
            </span>
            <div className="p-2 bg-error-container/50 rounded-lg text-error">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                cancel
              </span>
            </div>
          </div>

          <div>
            <div className="font-page-title-mobile text-page-title-mobile text-on-surface">
              {cancelled_orders}
            </div>
            <div className="font-caption text-caption text-on-surface-variant mt-1">
              {cancellation_rate}% cancellation rate
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-unit-md rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] border border-outline-variant/30 flex flex-col justify-between group hover:-translate-y-0.5 transition-transform duration-200">
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-bold text-label-bold text-on-surface-variant">
              Total Transaction
            </span>
            <div className="p-2 bg-primary-container/10 rounded-lg text-primary-container">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                savings
              </span>
            </div>
          </div>

          <div>
            <div className="font-page-title-mobile text-page-title-mobile text-on-surface tracking-tight">
              {formatRupiah(total_transaction)}
            </div>
            <div className="font-caption text-caption text-primary mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">
                trending_up
              </span>
              From total_amount
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-unit-lg rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] border border-outline-variant/30">
        <h3 className="font-section-title-sm text-section-title-sm text-on-surface mb-6 flex items-center gap-2 border-b border-outline-variant/30 pb-3">
          <span className="material-symbols-outlined text-primary-container">
            badge
          </span>
          Customer Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-caption text-caption text-on-surface-variant uppercase tracking-wider block mb-1">
              Full Name
            </label>
            <div className="font-body-medium text-body-medium text-on-surface">
              {customer.full_name}
            </div>
          </div>

          <div>
            <label className="font-caption text-caption text-on-surface-variant uppercase tracking-wider block mb-1">
              User ID
            </label>
            <div className="font-body-medium text-body-medium text-on-surface break-all">
              {customer.user_id}
            </div>
          </div>

          <div>
            <label className="font-caption text-caption text-on-surface-variant uppercase tracking-wider block mb-1">
              Experience Point
            </label>
            <div className="font-body-medium text-body-medium text-on-surface">
              {customer.exp ?? 0}
            </div>
          </div>

          <div>
            <label className="font-caption text-caption text-on-surface-variant uppercase tracking-wider block mb-1">
              Strike Count
            </label>
            <div className="font-body-medium text-body-medium text-on-surface">
              {customer.strike_count ?? 0}
            </div>
          </div>

          <div>
            <label className="font-caption text-caption text-on-surface-variant uppercase tracking-wider block mb-1">
              Phone Number
            </label>
            <div className="font-body-medium text-body-medium text-on-surface">
              -
            </div>
          </div>

          <div>
            <label className="font-caption text-caption text-on-surface-variant uppercase tracking-wider block mb-1">
              Email Address
            </label>
            <div className="font-body-medium text-body-medium text-on-surface">
              -
            </div>
          </div>

          <div>
            <label className="font-caption text-caption text-on-surface-variant uppercase tracking-wider block mb-1">
              Location
            </label>
            <div className="font-body-medium text-body-medium text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                location_on
              </span>
              -
            </div>
          </div>

          <div>
            <label className="font-caption text-caption text-on-surface-variant uppercase tracking-wider block mb-1">
              Joined Date
            </label>
            <div className="font-body-medium text-body-medium text-on-surface">
              -
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] border border-outline-variant/30 overflow-hidden">
        <div className="p-unit-lg border-b border-outline-variant/30 flex justify-between items-center bg-surface-bright">
          <h3 className="font-section-title-sm text-section-title-sm text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container">
              receipt_long
            </span>
            Recent Rescue History
          </h3>

          <button className="text-primary hover:text-primary-container font-label-bold text-label-bold transition-colors">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-outline-variant/50 font-label-bold text-label-bold text-on-surface-variant">
                <th className="py-4 px-6 whitespace-nowrap">Order ID</th>
                <th className="py-4 px-6 whitespace-nowrap">Created At</th>
                <th className="py-4 px-6 whitespace-nowrap">Qty</th>
                <th className="py-4 px-6 whitespace-nowrap">Listing ID</th>
                <th className="py-4 px-6 whitespace-nowrap">Merchant ID</th>
                <th className="py-4 px-6 whitespace-nowrap">Total</th>
                <th className="py-4 px-6 whitespace-nowrap">Status</th>
              </tr>
            </thead>

            <tbody className="font-body-default text-body-default text-on-surface divide-y divide-outline-variant/20">
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-6 px-6 text-center text-on-surface-variant"
                  >
                    No order history found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <CustomerOrderTableRow key={order.id} order={order} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}