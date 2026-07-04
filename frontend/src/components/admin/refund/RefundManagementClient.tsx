"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getAdminRefunds, type Refund, type RefundStatus } from "@/services/refund";
import { getApiErrorMessage } from "@/lib/api";

function formatRupiah(value: number | string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function statusBadge(status: RefundStatus) {
  switch (status) {
    case "pending":
      return "bg-amber-100 text-amber-800";
    case "done":
      return "bg-emerald-100 text-emerald-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    case "cancel":
      return "bg-slate-100 text-slate-600";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

const FILTERS = ["all", "pending", "done", "rejected", "cancel"] as const;
type FilterTab = (typeof FILTERS)[number];

export default function RefundManagementClient() {
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        const data = await getAdminRefunds();
        setRefunds(data);
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return refunds;
    return refunds.filter((r) => r.status === filter);
  }, [refunds, filter]);

  const pendingCount = useMemo(
    () => refunds.filter((r) => r.status === "pending").length,
    [refunds]
  );

  const pendingTotal = useMemo(
    () =>
      refunds
        .filter((r) => r.status === "pending")
        .reduce((sum, r) => sum + Number(r.amount), 0),
    [refunds]
  );

  return (
    <div className="flex-1 mt-[72px] p-page_padding bg-background overflow-y-auto">
      {/* Page Header */}
      <div className="mb-section_gap flex justify-between items-end">
        <div>
          <h2 className="text-on-background mb-2 font-page-title text-page-title">
            Refund Management
          </h2>
          <p className="font-body-lg text-body-lg text-secondary">
            Review and process customer refund requests.
          </p>
        </div>
      </div>

      {errorMessage && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {errorMessage}
        </p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-6 mb-section_gap">
        <div className="bg-surface-container-lowest rounded-2xl p-card_padding border border-outline-variant shadow-sm">
          <p className="font-label-sm text-label-sm text-secondary mb-2 uppercase tracking-wider">
            Pending Refunds
          </p>
          <h3 className="font-display-lg text-display-lg text-on-surface">
            {pendingCount}
          </h3>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl p-card_padding border border-outline-variant shadow-sm">
          <p className="font-label-sm text-label-sm text-secondary mb-2 uppercase tracking-wider">
            Pending Amount
          </p>
          <h3 className="font-display-lg text-display-lg text-on-surface">
            {formatRupiah(pendingTotal)}
          </h3>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm flex flex-col">
        <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-bright rounded-t-2xl">
          <div className="flex bg-surface-container-low p-1 rounded-lg">
            {FILTERS.map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-1.5 rounded-md font-label-sm text-label-sm transition-colors ${
                  filter === tab
                    ? "bg-surface-container-lowest text-primary shadow-sm"
                    : "text-secondary hover:text-on-surface"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-bright">
                <th className="py-4 px-6 font-label-sm text-label-sm text-secondary uppercase">Customer</th>
                <th className="py-4 px-6 font-label-sm text-label-sm text-secondary uppercase">Order / Item</th>
                <th className="py-4 px-6 font-label-sm text-label-sm text-secondary uppercase">Amount</th>
                <th className="py-4 px-6 font-label-sm text-label-sm text-secondary uppercase">Requested</th>
                <th className="py-4 px-6 font-label-sm text-label-sm text-secondary uppercase">Status</th>
                <th className="py-4 px-6 font-label-sm text-label-sm text-secondary uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {isLoading && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-secondary">Loading...</td>
                </tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-secondary">No refund requests found.</td>
                </tr>
              )}
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-label-md text-label-md text-on-surface">
                      {item.users?.email ?? "—"}
                    </p>
                    <p className="font-body-sm text-body-sm text-secondary text-xs">
                      ID: {item.customer_id?.slice(0, 8)}...
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-label-md text-label-md text-on-surface">
                      {item.orders?.listing?.name ?? "—"}
                    </p>
                    <p className="font-body-sm text-body-sm text-secondary text-xs">
                      {item.orders?.merchant?.merchant_name ?? ""}
                    </p>
                  </td>
                  <td className="py-4 px-6 font-label-md text-label-md text-on-surface">
                    {formatRupiah(item.amount)}
                  </td>
                  <td className="py-4 px-6 font-body-md text-body-md text-secondary">
                    {formatDate(item.created_at)}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full font-label-sm text-[11px] font-bold ${statusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link
                      href={`/admin/refund/${item.public_id}`}
                      className="bg-primary-container text-on-primary hover:bg-primary px-4 py-1.5 rounded-lg font-label-sm text-label-sm transition-colors shadow-sm inline-block"
                    >
                      {item.status === "pending" ? "Review" : "View"}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
