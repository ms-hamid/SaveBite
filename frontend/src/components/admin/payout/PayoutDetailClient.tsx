"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getWithdrawalById,
  reviewWithdrawal,
  Withdrawal,
} from "@/services/withdrawal";
import { getApiErrorMessage } from "@/lib/api";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusLabel(status: Withdrawal["status"]) {
  switch (status) {
    case "pending":
      return "Pending";
    case "completed":
      return "Completed";
    case "declinec":
      return "Declined";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

export default function PayoutDetailClient({ withdrawalId }: { withdrawalId: string }) {
  const router = useRouter();
  const [withdrawal, setWithdrawal] = useState<Withdrawal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadWithdrawal() {
    try {
      setIsLoading(true);
      const data = await getWithdrawalById(withdrawalId);
      setWithdrawal(data);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadWithdrawal();
  }, [withdrawalId]);

  async function handleReview(status: "completed" | "declinec") {
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await reviewWithdrawal(withdrawalId, { status });
      setSuccessMessage(
        status === "completed"
          ? "Payout marked as completed."
          : "Payout request declined."
      );
      await loadWithdrawal();
      if (status === "completed") {
        setTimeout(() => router.push("/admin/payout"), 1500);
      }
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="flex-1 p-gutter overflow-y-auto flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
      </main>
    );
  }

  if (!withdrawal) {
    return (
      <main className="flex-1 p-gutter overflow-y-auto">
        <p className="text-red-600">{errorMessage || "Withdrawal not found."}</p>
      </main>
    );
  }

  const isPending = withdrawal.status === "pending";

  return (
    <main className="flex-1 p-gutter overflow-y-auto">
      <nav className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm mb-unit-lg">
        <Link className="hover:text-primary transition-colors" href="/admin/payout">
          Payout Management
        </Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-surface font-medium">Payout Detail</span>
      </nav>

      <div className="bg-surface-container-lowest rounded-lg p-gutter shadow-sm border border-outline-variant/30 mb-gutter flex flex-col md:flex-row justify-between items-start md:items-end gap-unit-md">
        <div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-1">
            Withdrawal ID: #{withdrawal.id}
          </p>
          <h2 className="font-page-title-mobile md:font-page-title text-page-title-mobile md:text-page-title text-on-surface">
            {withdrawal.merchant?.merchant_name ?? "Merchant"}
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Requested: {formatDateTime(withdrawal.created_at)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning-container text-on-warning-container font-label-bold text-label-bold">
            <span className="material-symbols-outlined text-[16px]">
              {isPending ? "pending" : "check_circle"}
            </span>
            {statusLabel(withdrawal.status)}
          </div>
          <div className="text-right">
            <p className="font-caption text-caption text-on-surface-variant mb-0.5">
              Total Payout Amount
            </p>
            <p className="font-section-title text-section-title text-primary">
              {formatRupiah(Number(withdrawal.amount))}
            </p>
          </div>
          {isPending && (
            <div className="flex gap-2">
              <button
                onClick={() => handleReview("declinec")}
                disabled={isSubmitting}
                className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg font-label-bold text-label-bold hover:bg-red-50 disabled:opacity-60"
              >
                Decline
              </button>
              <button
                onClick={() => handleReview("completed")}
                disabled={isSubmitting}
                className="bg-primary text-on-primary px-6 py-2 rounded-lg font-label-bold text-label-bold hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-60"
              >
                Mark as Completed
              </button>
            </div>
          )}
        </div>
      </div>

      {errorMessage && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <p className="mb-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
          {successMessage}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-8 flex flex-col gap-gutter">
          <section className="bg-surface-container-lowest rounded-lg p-gutter shadow-sm border border-outline-variant/30">
            <h3 className="font-section-title-sm text-section-title-sm text-on-surface mb-unit-md flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">store</span>
              Merchant Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md">
              <div>
                <p className="font-caption text-caption text-on-surface-variant">Merchant Name</p>
                <p className="font-body-medium text-body-medium text-on-surface">
                  {withdrawal.merchant?.merchant_name ?? "—"}
                </p>
              </div>
              <div>
                <p className="font-caption text-caption text-on-surface-variant">Merchant ID</p>
                <p className="font-body-medium text-body-medium text-on-surface font-mono text-sm">
                  {withdrawal.merchant_id}
                </p>
              </div>
              <div className="md:col-span-2 mt-2 pt-4 border-t border-outline-variant/50">
                <p className="font-caption text-caption text-on-surface-variant">Business Address</p>
                <p className="font-body-default text-body-default text-on-surface">
                  {withdrawal.merchant?.address ?? "—"}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-surface-container-lowest rounded-lg p-gutter shadow-sm border border-outline-variant/30">
            <h3 className="font-section-title-sm text-section-title-sm text-on-surface mb-unit-md flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">account_balance</span>
              Settlement Bank Account
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md">
              <div>
                <p className="font-caption text-caption text-on-surface-variant">Bank Name</p>
                <p className="font-body-medium text-body-medium text-on-surface">
                  {withdrawal.merchant?.bank_name ?? "—"}
                </p>
              </div>
              <div>
                <p className="font-caption text-caption text-on-surface-variant">Account Number</p>
                <p className="font-body-medium text-body-medium text-on-surface font-mono">
                  {withdrawal.merchant?.bank_account ?? "—"}
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-gutter">
          <section className="bg-surface-container-lowest rounded-lg p-gutter shadow-sm border border-outline-variant/30">
            <h3 className="font-section-title-sm text-section-title-sm text-on-surface mb-unit-lg">
              Status History
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0" />
                <div>
                  <p className="font-label-bold text-label-bold text-on-surface">Created</p>
                  <p className="font-caption text-caption text-on-surface-variant">
                    {formatDateTime(withdrawal.created_at)}
                  </p>
                </div>
              </li>
              {withdrawal.updated_at && withdrawal.status !== "pending" && (
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  <div>
                    <p className="font-label-bold text-label-bold text-on-surface">
                      {statusLabel(withdrawal.status)}
                    </p>
                    <p className="font-caption text-caption text-on-surface-variant">
                      {formatDateTime(withdrawal.updated_at)}
                    </p>
                  </div>
                </li>
              )}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
