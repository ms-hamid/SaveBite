"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getRefundByPublicId, reviewRefund, type Refund } from "@/services/refund";
import { getApiErrorMessage } from "@/lib/api";

function formatRupiah(value: number | string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
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

function statusLabel(status: Refund["status"]) {
  switch (status) {
    case "pending": return "Pending";
    case "done": return "Done";
    case "rejected": return "Rejected";
    case "cancel": return "Cancelled";
    default: return status;
  }
}

function statusColor(status: Refund["status"]) {
  switch (status) {
    case "pending": return "bg-amber-100 text-amber-800";
    case "done": return "bg-emerald-100 text-emerald-700";
    case "rejected": return "bg-red-100 text-red-700";
    case "cancel": return "bg-slate-100 text-slate-600";
    default: return "bg-slate-100 text-slate-600";
  }
}

export default function RefundDetailClient() {
  const params = useParams();
  const public_id = params?.public_id as string | undefined;
  const router = useRouter();
  const [refund, setRefund] = useState<Refund | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [adminDesc, setAdminDesc] = useState("");

  async function loadRefund() {
    try {
      setIsLoading(true);
      const data = await getRefundByPublicId(public_id);
      setRefund(data);
      if (data.desc) setAdminDesc(data.desc);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadRefund();
  }, [public_id]);

  async function handleReview(status: "done" | "rejected") {
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      await reviewRefund(public_id, { status, desc: adminDesc || undefined });
      setSuccessMessage(
        status === "done"
          ? "Refund approved and marked as done."
          : "Refund has been rejected."
      );
      await loadRefund();
      if (status === "done") {
        setTimeout(() => router.push("/admin/refund"), 1500);
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

  if (!refund) {
    return (
      <main className="flex-1 p-gutter overflow-y-auto">
        <p className="text-red-600">{errorMessage || "Refund not found."}</p>
      </main>
    );
  }

  const isPending = refund.status === "pending";

  return (
    <main className="flex-1 p-gutter overflow-y-auto mt-[72px]">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm mb-unit-lg">
        <Link className="hover:text-primary transition-colors" href="/admin/refund">
          Refund Management
        </Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-surface font-medium">Refund Detail</span>
      </nav>

      {/* Header card */}
      <div className="bg-surface-container-lowest rounded-lg p-gutter shadow-sm border border-outline-variant/30 mb-gutter flex flex-col md:flex-row justify-between items-start md:items-end gap-unit-md">
        <div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-1">
            Refund ID: #{refund.id}
          </p>
          <h2 className="font-page-title-mobile md:font-page-title text-page-title-mobile md:text-page-title text-on-surface">
            {refund.users?.email ?? refund.customer_id?.slice(0, 12) ?? "Customer"}
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Requested: {formatDateTime(refund.created_at)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full font-label-bold text-label-bold ${statusColor(refund.status)}`}>
            {statusLabel(refund.status)}
          </span>
          <div className="text-right">
            <p className="font-caption text-caption text-on-surface-variant mb-0.5">Refund Amount</p>
            <p className="font-section-title text-section-title text-primary">
              {formatRupiah(refund.amount)}
            </p>
          </div>
          {isPending && (
            <div className="flex gap-2">
              <button
                onClick={() => handleReview("rejected")}
                disabled={isSubmitting}
                className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg font-label-bold text-label-bold hover:bg-red-50 disabled:opacity-60"
              >
                Reject
              </button>
              <button
                onClick={() => handleReview("done")}
                disabled={isSubmitting}
                className="bg-primary text-on-primary px-6 py-2 rounded-lg font-label-bold text-label-bold hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-60"
              >
                {isSubmitting ? "Processing..." : "Approve Refund"}
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
        {/* Left column */}
        <div className="lg:col-span-8 flex flex-col gap-gutter">
          {/* Order Info */}
          <section className="bg-surface-container-lowest rounded-lg p-gutter shadow-sm border border-outline-variant/30">
            <h3 className="font-section-title-sm text-section-title-sm text-on-surface mb-unit-md flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">receipt_long</span>
              Order Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md">
              <div>
                <p className="font-caption text-caption text-on-surface-variant">Item</p>
                <p className="font-body-medium text-body-medium text-on-surface">
                  {refund.orders?.listing?.name ?? "—"}
                </p>
              </div>
              <div>
                <p className="font-caption text-caption text-on-surface-variant">Merchant</p>
                <p className="font-body-medium text-body-medium text-on-surface">
                  {refund.orders?.merchant?.merchant_name ?? "—"}
                </p>
              </div>
              <div>
                <p className="font-caption text-caption text-on-surface-variant">Order Total</p>
                <p className="font-body-medium text-body-medium text-on-surface">
                  {refund.orders?.total_amount ? formatRupiah(refund.orders.total_amount) : "—"}
                </p>
              </div>
              <div>
                <p className="font-caption text-caption text-on-surface-variant">Payment Method</p>
                <p className="font-body-medium text-body-medium text-on-surface capitalize">
                  {refund.payments?.payment_method ?? "—"}
                </p>
              </div>
            </div>
          </section>

          {/* Admin note / description */}
          <section className="bg-surface-container-lowest rounded-lg p-gutter shadow-sm border border-outline-variant/30">
            <h3 className="font-section-title-sm text-section-title-sm text-on-surface mb-unit-md flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">edit_note</span>
              Admin Notes
            </h3>
            {isPending ? (
              <div className="flex flex-col gap-3">
                <textarea
                  value={adminDesc}
                  onChange={(e) => setAdminDesc(e.target.value)}
                  placeholder="Add a note for this refund decision (optional)..."
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-100 resize-none"
                />
                <p className="text-xs text-slate-500">This note will be saved with the refund record.</p>
              </div>
            ) : (
              <p className="text-sm text-slate-700">
                {refund.desc ?? <span className="text-slate-400 italic">No notes added.</span>}
              </p>
            )}
          </section>
        </div>

        {/* Right column */}
        <div className="lg:col-span-4 flex flex-col gap-gutter">
          <section className="bg-surface-container-lowest rounded-lg p-gutter shadow-sm border border-outline-variant/30">
            <h3 className="font-section-title-sm text-section-title-sm text-on-surface mb-unit-lg">
              Status Timeline
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0" />
                <div>
                  <p className="font-label-bold text-label-bold text-on-surface">Requested</p>
                  <p className="font-caption text-caption text-on-surface-variant">
                    {formatDateTime(refund.created_at)}
                  </p>
                </div>
              </li>
              {refund.status !== "pending" && (
                <li className="flex items-start gap-3">
                  <div
                    className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      refund.status === "done"
                        ? "bg-emerald-500"
                        : "bg-red-400"
                    }`}
                  />
                  <div>
                    <p className="font-label-bold text-label-bold text-on-surface">
                      {statusLabel(refund.status)}
                    </p>
                    {refund.desc && (
                      <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                        {refund.desc}
                      </p>
                    )}
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
