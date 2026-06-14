"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { supabase } from "../../../lib/supabase";
import CustomerTableRow, { CustomerRow } from "../../../components/admin/CustomerTabelRow";

type Customer = {
  full_name: string;
  exp: number | null;
  strike_count: number | null;
  user_id: string;
};

const PAGE_SIZE = 5;

export default function Page() {
  const [customers, set_customers] = useState<Customer[]>([]);
  const [loading, set_loading] = useState<boolean>(true);
  const [error_message, set_error_message] = useState<string>("");

  const [current_page, set_current_page] = useState<number>(1);
  const [total_count, set_total_count] = useState<number>(0);
  const [suspended_count, set_suspended_count] = useState<number>(0);

  const total_pages = Math.max(1, Math.ceil(total_count / PAGE_SIZE));

  const start_entry =
    total_count === 0 ? 0 : (current_page - 1) * PAGE_SIZE + 1;

  const end_entry = Math.min(current_page * PAGE_SIZE, total_count);

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  async function get_customers(page: number) {
    set_loading(true);
    set_error_message("");

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error, count } = await supabase
      .from("customers")
      .select("full_name, exp, strike_count, user_id", { count: "exact" })
      .order("full_name", { ascending: true })
      .range(from, to)
      .returns<Customer[]>();

    if (error) {
      console.log(error);
      set_error_message(error.message);
      set_customers([]);
      set_total_count(0);
    } else {
      set_customers(data ?? []);
      set_total_count(count ?? 0);
    }

    set_loading(false);
  }

  async function get_suspended_count() {
    const { count, error } = await supabase
      .from("customers")
      .select("user_id", { count: "exact", head: true })
      .gte("strike_count", 3);

    if (error) {
      console.log(error);
      set_suspended_count(0);
      return;
    }

    set_suspended_count(count ?? 0);
  }

  useEffect(() => {
    get_customers(current_page);
    get_suspended_count();
  }, [current_page]);

  const customer_rows: CustomerRow[] = useMemo(() => {
    return customers.map((customer) => {
      const strike_count = customer.strike_count ?? 0;

      return {
        ...customer,

        // Placeholder karena kolom ini tidak ada di tabel customers
        email: "-",
        total_rescue: "-",
        joined_date: "-",

        status: strike_count >= 3 ? "Suspended" : "Active",
        initials: getInitials(customer.full_name),
      };
    });
  }, [customers]);

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
    <AdminLayout>
      <div className="mb-unit-xl">
        <h2 className="font-section-title text-section-title text-on-background">
          Customer Management
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-unit-xs">
          Monitor user engagement and account status.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-unit-md mb-unit-xl">
        <div className="bg-surface-container-lowest rounded-[16px] p-unit-lg shadow-sm">
          <div className="flex justify-between items-start mb-unit-md">
            <span className="font-label-bold text-label-bold text-on-surface-variant">
              Total Customers
            </span>
            <div className="p-unit-sm bg-surface-container-low rounded-[16px]">
              <span className="material-symbols-outlined text-primary">
                groups
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-unit-sm">
            <span className="font-page-title text-page-title text-on-background">
              {loading ? "..." : total_count}
            </span>
            <span className="font-label-bold text-label-bold text-primary-container flex items-center">
              <span className="material-symbols-outlined text-[16px]">
                arrow_upward
              </span>
              -
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-[16px] p-unit-lg shadow-sm">
          <div className="flex justify-between items-start mb-unit-md">
            <span className="font-label-bold text-label-bold text-on-surface-variant">
              Active Users (30d)
            </span>
            <div className="p-unit-sm bg-surface-container-low rounded-[16px]">
              <span className="material-symbols-outlined text-primary">
                person_check
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-unit-sm">
            <span className="font-page-title text-page-title text-on-background">
              -
            </span>
            <span className="font-label-bold text-label-bold text-primary-container flex items-center">
              <span className="material-symbols-outlined text-[16px]">
                arrow_upward
              </span>
              -
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-[16px] p-unit-lg shadow-sm">
          <div className="flex justify-between items-start mb-unit-md">
            <span className="font-label-bold text-label-bold text-on-surface-variant">
              Suspended Accounts
            </span>
            <div className="p-unit-sm bg-error-container rounded-[16px]">
              <span className="material-symbols-outlined text-error">
                block
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-unit-sm">
            <span className="font-page-title text-page-title text-on-background">
              {loading ? "..." : suspended_count}
            </span>
            <span className="font-label-bold text-label-bold text-error flex items-center">
              <span className="material-symbols-outlined text-[16px]">
                arrow_downward
              </span>
              -
            </span>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-[16px] shadow-sm overflow-hidden flex flex-col">
        <div className="p-unit-lg border-b border-outline-variant flex justify-between items-center">
          <h3 className="font-section-title-sm text-section-title-sm text-on-background">
            Customer Directory
          </h3>

          <div className="flex gap-unit-md">
            <button className="flex items-center gap-unit-sm px-unit-md py-unit-sm border border-outline-variant rounded-[16px] font-label-bold text-label-bold hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-[18px]">
                filter_list
              </span>
              Filter
            </button>

            <button className="flex items-center gap-unit-sm px-unit-md py-unit-sm bg-[#10b981] text-on-primary rounded-[16px] font-label-bold text-label-bold hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined text-[18px]">
                download
              </span>
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background border-b border-outline-variant">
                <th className="py-unit-md px-unit-lg font-label-bold text-label-bold text-on-surface-variant font-semibold">
                  Customer Name
                </th>
                <th className="py-unit-md px-unit-lg font-label-bold text-label-bold text-on-surface-variant font-semibold">
                  Email
                </th>
                <th className="py-unit-md px-unit-lg font-label-bold text-label-bold text-on-surface-variant font-semibold">
                  Total Rescues
                </th>
                <th className="py-unit-md px-unit-lg font-label-bold text-label-bold text-on-surface-variant font-semibold">
                  Joined Date
                </th>
                <th className="py-unit-md px-unit-lg font-label-bold text-label-bold text-on-surface-variant font-semibold">
                  Status
                </th>
                <th className="py-unit-md px-unit-lg font-label-bold text-label-bold text-on-surface-variant font-semibold text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="font-body-sm text-body-sm divide-y divide-outline-variant">
              {loading && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-unit-lg px-unit-lg text-center text-on-surface-variant"
                  >
                    Loading customers...
                  </td>
                </tr>
              )}

              {!loading && error_message && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-unit-lg px-unit-lg text-center text-error"
                  >
                    {error_message}
                  </td>
                </tr>
              )}

              {!loading && !error_message && customer_rows.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-unit-lg px-unit-lg text-center text-on-surface-variant"
                  >
                    No customers found.
                  </td>
                </tr>
              )}

              {!loading &&
                !error_message &&
                customer_rows.map((customer) => (
                  <CustomerTableRow
                    key={customer.user_id}
                    customer={customer}
                  />
                ))}
            </tbody>
          </table>
        </div>

        <div className="p-unit-md border-t border-outline-variant flex justify-between items-center bg-surface-container-lowest mt-auto">
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Showing {start_entry} to {end_entry} of {total_count} entries
          </span>

          <div className="flex items-center gap-unit-xs">
            <button
              disabled={current_page === 1 || loading}
              onClick={() => goToPage(current_page - 1)}
              className="p-unit-sm border border-outline-variant rounded-md text-on-surface-variant disabled:opacity-50 hover:bg-[#ecfdf5] hover:text-[#10b981] hover:border-[#10b981]"
            >
              <span className="material-symbols-outlined text-[18px]">
                chevron_left
              </span>
            </button>

            {current_page > 2 && (
              <>
                <button
                  onClick={() => goToPage(1)}
                  className="w-8 h-8 rounded-md border border-outline-variant text-on-surface-variant font-label-bold flex items-center justify-center hover:bg-[#ecfdf5] hover:text-[#10b981] hover:border-[#10b981]"
                >
                  1
                </button>
                <span className="font-body-sm text-on-surface-variant px-unit-xs">
                  ...
                </span>
              </>
            )}

            {getPaginationNumbers().map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-8 h-8 rounded-md flex items-center justify-center font-label-bold ${
                  current_page === page
                    ? "text-on-primary bg-[#10b981] hover:bg-[#059669]"
                    : "border border-outline-variant text-on-surface-variant hover:bg-[#ecfdf5] hover:text-[#10b981] hover:border-[#10b981]"
                }`}
              >
                {page}
              </button>
            ))}

            {current_page < total_pages - 1 && (
              <>
                <span className="font-body-sm text-on-surface-variant px-unit-xs">
                  ...
                </span>
                <button
                  onClick={() => goToPage(total_pages)}
                  className="w-8 h-8 rounded-md border border-outline-variant text-on-surface-variant font-label-bold flex items-center justify-center hover:bg-[#ecfdf5] hover:text-[#10b981] hover:border-[#10b981]"
                >
                  {total_pages}
                </button>
              </>
            )}

            <button
              disabled={current_page === total_pages || loading}
              onClick={() => goToPage(current_page + 1)}
              className="p-unit-sm border border-outline-variant rounded-md text-on-surface-variant disabled:opacity-50 hover:bg-[#ecfdf5] hover:text-[#10b981] hover:border-[#10b981]"
            >
              <span className="material-symbols-outlined text-[18px]">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}