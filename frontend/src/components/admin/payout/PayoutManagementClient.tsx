"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  getAdminWithdrawals,
  Withdrawal,
  WithdrawStatus,
} from "@/services/withdrawal";
import { getApiErrorMessage } from "@/lib/api";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function maskAccount(account?: string | null) {
  if (!account) return "—";
  if (account.length <= 4) return account;
  return `•••• ${account.slice(-4)}`;
}

function statusBadge(status: WithdrawStatus) {
  switch (status) {
    case "pending":
      return "bg-amber-100 text-amber-800";
    case "completed":
      return "bg-emerald-100 text-emerald-700";
    case "declinec":
      return "bg-red-100 text-red-700";
    case "cancelled":
      return "bg-slate-100 text-slate-600";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

export default function PayoutManagementClient() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [filter, setFilter] = useState<"all" | WithdrawStatus>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        const data = await getAdminWithdrawals();
        setWithdrawals(data);
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return withdrawals;
    return withdrawals.filter((item) => item.status === filter);
  }, [withdrawals, filter]);

  const pendingTotal = useMemo(
    () =>
      withdrawals
        .filter((item) => item.status === "pending")
        .reduce((sum, item) => sum + Number(item.amount), 0),
    [withdrawals]
  );

  const completedTotal = useMemo(
    () =>
      withdrawals
        .filter((item) => item.status === "completed")
        .reduce((sum, item) => sum + Number(item.amount), 0),
    [withdrawals]
  );

  return (
    <div className="flex-1 mt-[72px] p-page_padding bg-background overflow-y-auto">
      <div className="mb-section_gap flex justify-between items-end">
        <div>
          <h2 className="text-on-background mb-2 font-page-title text-page-title">
            Payout Management
          </h2>
          <p className="font-body-lg text-body-lg text-secondary">
            Manage and process merchant withdrawals.
          </p>
        </div>
      </div>

      {errorMessage && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {errorMessage}
        </p>
      )}

      <div className="grid grid-cols-2 gap-6 mb-section_gap">
        <div className="bg-surface-container-lowest rounded-2xl p-card_padding border border-outline-variant shadow-sm">
          <p className="font-label-sm text-label-sm text-secondary mb-2 uppercase tracking-wider">
            Total Pending Payouts
          </p>
          <h3 className="font-display-lg text-display-lg text-on-surface">
            {formatRupiah(pendingTotal)}
          </h3>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl p-card_padding border border-outline-variant shadow-sm">
          <p className="font-label-sm text-label-sm text-secondary mb-2 uppercase tracking-wider">
            Total Completed
          </p>
          <h3 className="font-display-lg text-display-lg text-on-surface">
            {formatRupiah(completedTotal)}
          </h3>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm flex flex-col">
        <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-bright rounded-t-2xl">
          <div className="flex bg-surface-container-low p-1 rounded-lg">
            {(["all", "pending", "completed", "declinec", "cancelled"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-4 py-1.5 rounded-md font-label-sm text-label-sm transition-colors ${
                    filter === tab
                      ? "bg-surface-container-lowest text-primary shadow-sm"
                      : "text-secondary hover:text-on-surface"
                  }`}
                >
                  {tab === "all"
                    ? "All"
                    : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              )
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-bright">
                <th className="py-4 px-6 font-label-sm text-label-sm text-secondary uppercase">
                  Merchant
                </th>
                <th className="py-4 px-6 font-label-sm text-label-sm text-secondary uppercase">
                  Amount
                </th>
                <th className="py-4 px-6 font-label-sm text-label-sm text-secondary uppercase">
                  Requested
                </th>
                <th className="py-4 px-6 font-label-sm text-label-sm text-secondary uppercase">
                  Bank
                </th>
                <th className="py-4 px-6 font-label-sm text-label-sm text-secondary uppercase">
                  Status
                </th>
                <th className="py-4 px-6 font-label-sm text-label-sm text-secondary uppercase text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {isLoading && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-secondary">
                    Loading...
                  </td>
                </tr>
              )}

              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-secondary">
                    No withdrawals found.
                  </td>
                </tr>
              )}

              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-surface-container-low transition-colors"
                >
                  <td className="py-4 px-6">
                    <p className="font-label-md text-label-md text-on-surface">
                      {item.merchant?.merchant_name ?? "—"}
                    </p>
                    <p className="font-body-sm text-body-sm text-secondary text-xs">
                      ID: {item.merchant_id.slice(0, 8)}...
                    </p>
                  </td>
                  <td className="py-4 px-6 font-label-md text-label-md text-on-surface">
                    {formatRupiah(Number(item.amount))}
                  </td>
                  <td className="py-4 px-6 font-body-md text-body-md text-secondary">
                    {formatDate(item.created_at)}
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-label-md text-label-md text-on-surface">
                      {item.merchant?.bank_name ?? "—"}{" "}
                      {maskAccount(item.merchant?.bank_account)}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full font-label-sm text-[11px] font-bold ${statusBadge(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link
                      href={`/admin/payout/${item.id}`}
                      className="bg-primary-container text-on-primary hover:bg-primary px-4 py-1.5 rounded-lg font-label-sm text-label-sm transition-colors shadow-sm inline-block"
                    >
                      {item.status === "pending" ? "Process" : "View"}
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
