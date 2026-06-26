"use client";

import type React from "react";
import { useRouter, useParams } from "next/navigation";
import { useOrder } from "../../../../components/providers/OrderProvider";
import { update_order_status } from "@/services/order";
import { useState } from "react";
import { getApiErrorMessage } from "@/lib/api";
import { format_price } from "@/app/home/page";

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmt_time(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function fmt_datetime(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// Mapping status → label + warna badge
const STATUS_META: Record<
  string,
  { label: string; badgeCls: string; bannerCls: string; icon: string; bannerText: string }
> = {
  paid_reserved: {
    label: "Accepted",
    badgeCls: "bg-blue-100 text-blue-600",
    bannerCls: "bg-blue-50 border-blue-200",
    icon: "receipt",
    bannerText: "Order diterima. Segera siapkan sebelum batas waktu pickup.",
  },
  preparing: {
    label: "Preparing",
    badgeCls: "bg-amber-100 text-amber-600",
    bannerCls: "bg-amber-50 border-amber-200",
    icon: "restaurant",
    bannerText: "Sedang menyiapkan pesanan. Tandai siap setelah selesai.",
  },
  ready_to_pickup: {
    label: "Ready",
    badgeCls: "bg-emerald-100 text-emerald-600",
    bannerCls: "bg-emerald-50 border-emerald-200",
    icon: "shopping_bag",
    bannerText: "Pesanan siap. Tunggu customer datang atau scan QR mereka.",
  },
  completed: {
    label: "Completed",
    badgeCls: "bg-emerald-100 text-emerald-600",
    bannerCls: "bg-emerald-50 border-emerald-200",
    icon: "check_circle",
    bannerText: "Pesanan telah selesai.",
  },
};

// Status apa yang bisa diubah → ke apa, dan label tombolnya
const NEXT_ACTION: Record<string, { next: string; label: string; icon: string }> = {
  paid_reserved:  { next: "preparing",     label: "Mulai Persiapan",        icon: "restaurant" },
  preparing:      { next: "ready_to_pickup", label: "Tandai Siap Pickup",  icon: "inventory_2" },
  ready_to_pickup:{ next: "scan",          label: "Verifikasi Pickup (QR)", icon: "qr_code_scanner" },
};

// ── Timeline helper ────────────────────────────────────────────────────────────

function Timeline({
  status,
  createdAt,
  updatedAt,
}: {
  status: string;
  createdAt: string | null;
  updatedAt: string | null;
}) {
  const steps: { key: string; label: string }[] = [
    { key: "paid_reserved",  label: "Pesanan Masuk" },
    { key: "preparing",      label: "Persiapan" },
    { key: "ready_to_pickup",label: "Siap Pickup" },
    { key: "completed",      label: "Selesai" },
  ];

  const order = ["paid_reserved", "preparing", "ready_to_pickup", "completed"];
  const currentIdx = order.indexOf(status);

  return (
    <div className="relative pl-6 flex flex-col gap-5 before:content-[''] before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
      {steps.map((step, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;
        return (
          <div key={step.key} className="relative">
            <div
              className={`absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-white z-10 ${
                done || active ? "bg-emerald-500" : "bg-slate-200 border-2 border-slate-300"
              }`}
            />
            <p
              className={`text-[14px] font-medium ${
                done
                  ? "text-slate-400 line-through"
                  : active
                  ? "text-slate-900 font-semibold"
                  : "text-slate-400"
              }`}
            >
              {step.label}
            </p>
            {/* Tampilkan waktu hanya untuk step pertama (created_at) dan step aktif (updated_at) */}
            {idx === 0 && createdAt && (
              <p className="text-[12px] text-slate-400 mt-0.5">{fmt_datetime(createdAt)}</p>
            )}
            {active && updatedAt && idx !== 0 && (
              <p className="text-[12px] text-slate-400 mt-0.5">{fmt_datetime(updatedAt)}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Loading skeleton ───────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="bg-white min-h-screen pb-24 animate-pulse">
      <header className="bg-white fixed top-0 w-full z-50 border-b border-slate-100 h-16" />
      <main className="pt-24 px-5 max-w-[448px] mx-auto flex flex-col gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-slate-100 rounded-xl h-20" />
        ))}
      </main>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function MerchantOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { order, isLoading, refetchOrder } = useOrder();

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  if (isLoading) return <PageSkeleton />;

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="material-symbols-outlined text-[48px] text-slate-300">
          receipt_long
        </span>
        <p className="text-slate-500 font-medium text-sm">Order tidak ditemukan.</p>
        <button
          onClick={() => router.push("/m/order")}
          className="bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold"
        >
          Kembali ke Daftar Order
        </button>
      </div>
    );
  }

  const status = order.status ?? "paid_reserved";
  const meta = STATUS_META[status] ?? STATUS_META["paid_reserved"];
  const action = NEXT_ACTION[status];

  // Data dari schema
  const listing = order.listing;
  const merchant = order.merchant;
  // Customer.full_name dari relasi Customer
  const customerName = (order as any).customer?.full_name ?? "—";
  const initials = customerName
    .split(" ")
    .map((w: string) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Payment: Order.total_amount (ada di schema), dan Payment.payment_method
  const totalAmount = Number(order.total_amount ?? 0);
  // Platform fee tidak ada di schema — ditampilkan sebagai komentar
  // Service fee Rp 2.000 sudah masuk total_amount saat pembayaran

  // Order.order_code (schema: orders.order_code Char(6))
  const orderCode = order.order_code ?? "——";

  async function handleAction() {
    if (!action) return;

    if (action.next === "scan") {
      router.push(`/m/order/${params.public_id}/scan`);
      return;
    }

    setIsUpdating(true);
    setUpdateError("");
    try {
      await update_order_status(order!.public_id, action.next);
      await refetchOrder();
    } catch (err) {
      setUpdateError(getApiErrorMessage(err));
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="bg-[#F7FAF8] text-slate-900 antialiased pb-28">
      {/* Header */}
      <header className="bg-white fixed top-0 w-full z-50 border-b border-slate-100 shadow-sm">
        <div className="flex items-center justify-between px-5 h-16 max-w-[448px] mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center p-2 -ml-2 rounded-full hover:bg-slate-50 transition-colors"
          >
            <span className="material-symbols-outlined text-slate-700">arrow_back</span>
          </button>

          {/* Order.order_code (schema) */}
          <h1 className="text-[17px] font-semibold text-slate-900">
            Order #{orderCode || "—"}
          </h1>

          <span
            className={`text-[11px] font-semibold tracking-wider px-2.5 py-1 rounded-full uppercase ${meta.badgeCls}`}
          >
            {meta.label}
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="pt-24 px-5 max-w-[448px] mx-auto flex flex-col gap-5">

        {/* Banner status */}
        <section className={`border rounded-xl p-4 flex items-center gap-3 ${meta.bannerCls}`}>
          <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center shrink-0">
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {meta.icon}
            </span>
          </div>
          <p className="text-[13px] text-slate-700 font-medium">{meta.bannerText}</p>
        </section>

        {/* Customer — Customer.full_name (schema: customers.full_name) */}
        <section className="flex flex-col gap-2">
          <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Customer</h2>
          <div className="bg-white border border-slate-100 rounded-xl p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
              <span className="text-[14px] font-bold text-violet-600">{initials}</span>
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-slate-900">{customerName}</h3>
              <p className="text-[12px] text-slate-500 mt-0.5">Customer</p>
            </div>
          </div>
        </section>

        {/* Order Items — Listing.name, Order.qty, Listing.discount_price (schema) */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Pesanan
            </h2>
            <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">
              {order.qty} item
            </span>
          </div>
          <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
            <div className="p-4 flex justify-between items-start">
              <div className="flex items-start gap-3">
                {/* Listing.img_url (schema) */}
                {listing?.img_url ? (
                  <img
                    src={listing.img_url}
                    alt={listing.name ?? ""}
                    className="w-14 h-14 rounded-lg object-cover shrink-0 bg-slate-100"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-slate-400 text-[28px]">
                      lunch_dining
                    </span>
                  </div>
                )}
                <div>
                  {/* Listing.name (schema) */}
                  <p className="text-[15px] font-semibold text-slate-900">
                    {listing?.name ?? "—"}
                  </p>
                  {/* Listing.description (schema) */}
                  {listing?.description && (
                    <p className="text-[12px] text-slate-400 mt-0.5 line-clamp-2">
                      {listing.description}
                    </p>
                  )}
                  {/* Order.qty × Listing.discount_price */}
                  <p className="text-[12px] text-slate-500 mt-1">
                    {order.qty}× {format_price(listing?.discount_price ?? 0)}
                  </p>
                </div>
              </div>
              {/* Order.total_amount (schema) */}
              <p className="text-[15px] font-semibold text-slate-900 shrink-0 ml-2">
                {format_price(totalAmount)}
              </p>
            </div>
          </div>
        </section>

        {/* Payment Summary — menggunakan Order.total_amount dari schema */}
        <section className="flex flex-col gap-2">
          <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Ringkasan Pembayaran
          </h2>
          <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col gap-3">
            {/* Subtotal = Order.total_amount (includes service fee, sudah final) */}
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-slate-500">Total Pembayaran Customer</span>
              <span className="text-[13px] text-slate-900">{format_price(totalAmount)}</span>
            </div>

            {/* Pickup window — Merchant.pickup_open / pickup_close (schema) */}
            {(merchant?.pickup_open || merchant?.pickup_close) && (
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-slate-500">Jendela Pickup</span>
                <span className="text-[13px] text-slate-900">
                  {fmt_time(merchant?.pickup_open)} – {fmt_time(merchant?.pickup_close)}
                </span>
              </div>
            )}

            {/* Payment.payment_method (schema) — dari order.payment */}
            {(order as any).payment?.payment_method && (
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-slate-500">Metode Pembayaran</span>
                <span className="text-[13px] text-slate-900 capitalize">
                  {(order as any).payment.payment_method.replace(/_/g, " ")}
                </span>
              </div>
            )}

            {/* Platform fee/revenue split tidak ada di schema — hanya komentar */}
            {/* Catatan: pembagian revenue merchant dan platform fee
                belum ada di tabel Payment/Order saat ini.
                Akan ditambahkan di iterasi berikutnya. */}

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <span className="text-[14px] font-semibold text-slate-900">Total Diterima</span>
              <span className="text-[17px] font-bold text-emerald-600">
                {format_price(totalAmount)}
              </span>
            </div>
          </div>
        </section>

        {/* Pickup info — Merchant.address, Merchant.pickup_instruction (schema) */}
        {(merchant?.address || merchant?.pickup_instruction) && (
          <section className="flex flex-col gap-2">
            <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Info Pickup
            </h2>
            <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col gap-2">
              {merchant?.address && (
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-[18px] mt-0.5">
                    location_on
                  </span>
                  <p className="text-[13px] text-slate-700">{merchant.address}</p>
                </div>
              )}
              {merchant?.pickup_instruction && (
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-[18px] mt-0.5">
                    hail
                  </span>
                  <p className="text-[13px] text-slate-500">{merchant.pickup_instruction}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Order Timeline — berdasarkan Order.status + created_at + updated_at (schema) */}
        <section className="flex flex-col gap-2">
          <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Timeline Order
          </h2>
          <div className="bg-white border border-slate-100 rounded-xl p-5">
            <Timeline
              status={status}
              createdAt={order.created_at}
              updatedAt={order.updated_at}
            />
          </div>
        </section>

        {/* Error message */}
        {updateError && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {updateError}
          </p>
        )}

        {/* Padding untuk bottom bar */}
        <div className="h-4" />
      </main>

      {/* Bottom Action Bar */}
      {action ? (
        <div className="fixed bottom-0 w-full z-50 bg-white border-t border-slate-100 p-4 pb-[calc(env(safe-area-inset-bottom)+16px)] shadow-[0_-4px_16px_-4px_rgba(0,0,0,0.06)]">
          <div className="max-w-[448px] mx-auto">
            <button
              onClick={handleAction}
              disabled={isUpdating}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-xl font-semibold text-[15px] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isUpdating ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">
                    progress_activity
                  </span>
                  Memperbarui...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">
                    {action.icon}
                  </span>
                  {action.label}
                </>
              )}
            </button>
          </div>
        </div>
      ) : status === "completed" ? (
        <div className="fixed bottom-0 w-full z-50 bg-white border-t border-slate-100 p-4 pb-[calc(env(safe-area-inset-bottom)+16px)]">
          <div className="max-w-[448px] mx-auto">
            <button
              onClick={() => router.push("/m/order")}
              className="w-full bg-white border border-slate-200 text-slate-700 py-3.5 rounded-xl font-semibold text-[15px] hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
              Kembali ke Daftar Order
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
