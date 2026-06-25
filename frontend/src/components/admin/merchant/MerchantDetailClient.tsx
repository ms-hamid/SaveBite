"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import MerchantStatCard from "./MerchantStatCard";
import MerchantInfoCard from "./MerchantInfoCard";
import MerchantOrderRow, { MerchantOrder } from "./MerchantOrderRow";
import { getUserProfile } from "@/services/user";
import { Merchant as MerchantBase } from "@/types";

type Merchant = MerchantBase & {
  // Kolom merchant dibuat fleksibel karena nama kolom bisa berbeda
  // sesuai data definition merchants yang kamu gunakan.
  [key: string]: unknown;

  orders: MerchantOrder[] | null;
};

function getParamValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function getText(
  merchant: Merchant | null,
  keys: string[],
  placeholder = "-"
): string {
  if (!merchant) return placeholder;

  for (const key of keys) {
    const value = merchant[key];

    if (value !== null && value !== undefined && String(value).trim() !== "") {
      return String(value);
    }
  }

  return placeholder;
}

function getInitials(name: string) {
  if (!name || name === "-") return "M";

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

export default function MerchantDetailClient() {
  const params = useParams();

  const public_id =
    getParamValue(params.id as string | string[] | undefined) ||
    getParamValue(params.public_id as string | string[] | undefined);

  const [merchant, set_merchant] = useState<Merchant & {
    [key: string]: any
  } | null>(null);
  const [loading, set_loading] = useState<boolean>(true);
  const [error_message, set_error_message] = useState<string>("");

  async function get_merchant_detail() {
    if (!public_id) {
      set_error_message("Public ID merchant tidak ditemukan pada URL.");
      set_loading(false);
      return;
    }

    set_loading(true);
    set_error_message("");

    const data = await getUserProfile(public_id)
    console.log(data.data.merchant.merchant_name)

    set_merchant(data.data);
    set_loading(false);
  }

  useEffect(() => {
    get_merchant_detail();
  }, [public_id]);

  const orders = useMemo(() => {
    return (merchant?.orders ?? [])
      .filter((order) => order.deleted_at === null)
      .sort((a, b) => {
        const date_a = a.created_at ? new Date(a.created_at).getTime() : 0;
        const date_b = b.created_at ? new Date(b.created_at).getTime() : 0;

        return date_b - date_a;
      });
  }, [merchant]);

  const total_orders = orders.length;

  const completed_orders = orders.filter(
    (order) => order.status === "completed"
  ).length;

  const pending_orders = orders.filter(
    (order) => order.status === "pending_payment"
  ).length;

  const cancelled_orders = orders.filter(
    (order) => order.status === "cancelled" || order.status === "expired_unclaimed"
  ).length;

  const total_revenue = orders.reduce((total, order) => {
    return total + Number(order.total_amount ?? 0);
  }, 0);

  const pending_payouts = orders
    .filter((order) => order.status === "completed")
    .reduce((total, order) => {
      return total + Number(order.total_amount ?? 0);
    }, 0);

  const merchant_name = merchant?.merchant.merchant_name;

  const legal_name = "merchant.legal-name";

  const tax_id = 'merchant.tax_id';

  const address = merchant?.merchant.address;

  const contact_email = getText(merchant, [
    "email",
    "contact_email",
    "business_email",
  ]);

  const phone_number = getText(merchant, [
    "phone",
    "phone_number",
    "contact_phone",
  ]);

  const category = getText(merchant, [
    "category",
    "business_category",
    "merchant_category",
  ]);

  const owner_name = getText(merchant, [
    "owner_name",
    "pic_name",
    "contact_person",
  ]);

  const owner_role = getText(merchant, ["owner_role", "role"], "Owner");

  const status = getText(merchant, ["status", "merchant_status"], "Active");

  if (loading) {
    return (
      <div className="bg-surface-container-lowest p-unit-lg rounded-xl border border-outline-variant/30 text-on-surface-variant">
        Loading merchant detail...
      </div>
    );
  }

  if (error_message) {
    return (
      <div className="bg-error-light p-unit-lg rounded-xl border border-error/30 text-error">
        {error_message}
      </div>
    );
  }

  if (!merchant) {
    return (
      <div className="bg-surface-container-lowest p-unit-lg rounded-xl border border-outline-variant/30 text-on-surface-variant">
        Merchant not found.
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto flex flex-col gap-unit-lg">
      <div className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
        <a
          className="hover:text-primary transition-colors"
          href="/admin/merchant"
        >
          Merchant Management
        </a>
        <span className="material-symbols-outlined text-[16px]">
          chevron_right
        </span>
        <span className="text-on-surface font-medium">{merchant_name}</span>
      </div>

      <section className="bg-surface-container-lowest rounded-xl p-unit-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-unit-lg">
        <div className="flex items-center gap-unit-lg">
          <div className="w-24 h-24 rounded-full border border-outline-variant overflow-hidden flex-shrink-0 bg-surface flex items-center justify-center">
            <div className="w-full h-full bg-surface-variant flex items-center justify-center font-page-title-mobile text-page-title-mobile text-on-surface-variant">
              {getInitials(merchant_name)}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-page-title text-page-title text-on-surface">
                {merchant_name}
              </h1>

              <span className="px-2 py-1 rounded bg-secondary-container text-primary font-label-bold text-caption border border-primary/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-unit-md font-body-sm text-body-sm text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">
                  tag
                </span>
                {merchant.user_id}
              </span>

              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">
                  location_on
                </span>
                {address}
              </span>

              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">
                  category
                </span>
                {category}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-unit-md w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-2 rounded-lg border border-outline-variant text-on-surface font-semibold text-sm hover:bg-surface-container-low transition-all flex items-center justify-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">edit</span>
            Edit Profile
          </button>

          <button className="flex-1 md:flex-none px-6 py-2 rounded-lg border border-error/30 text-error font-semibold text-sm hover:bg-error-light transition-all flex items-center justify-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">
              block
            </span>
            Suspend
          </button>

          <button className="flex-1 md:flex-none px-6 py-2 rounded-lg bg-primary text-on-primary font-semibold text-sm hover:bg-primary-dark transition-all shadow-md flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[20px]">
              payments
            </span>
            Payouts
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-unit-md">
        <MerchantStatCard
          icon="receipt_long"
          label="Total Orders"
          value={total_orders}
          trend={`${completed_orders} completed`}
        />

        <MerchantStatCard
          icon="account_balance_wallet"
          label="Total Revenue"
          value={formatRupiah(total_revenue)}
          trend="From orders"
        />

        <MerchantStatCard
          icon="payments"
          label="Pending Payouts"
          value={formatRupiah(pending_payouts)}
          trend={`${pending_orders} pending`}
        />

        <MerchantStatCard
          icon="verified_user"
          label="Merchant Status Summary"
          value={`${status} • ${cancelled_orders} cancelled`}
        />
      </section>

      <div className="border-b border-outline-variant">
        <nav className="flex gap-unit-lg px-unit-md overflow-x-auto">
          <button className="py-3 border-b-2 border-primary text-primary font-label-bold text-label-bold">
            Overview
          </button>
          <button className="py-3 border-b-2 border-transparent text-on-surface-variant hover:text-on-surface font-label-bold text-label-bold transition-colors">
            Bank Account
          </button>
          <button className="py-3 border-b-2 border-transparent text-on-surface-variant hover:text-on-surface font-label-bold text-label-bold transition-colors">
            Payout History
          </button>
        </nav>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-unit-lg">
        <div className="lg:col-span-1 flex flex-col gap-unit-lg">
          <MerchantInfoCard
            title="Business Information"
            icon="business"
            items={[
              { label: "Legal Name", value: legal_name },
              { label: "Tax ID / NPWP", value: tax_id },
              { label: "Address", value: address },
              {
                label: "Contact Email",
                value: contact_email,
                highlight: true,
              },
              { label: "Phone Number", value: phone_number },
              { label: "User ID", value: merchant.user_id },
              { label: "Public ID", value: 'merchant.public_id'},
            ]}
          />

          <MerchantInfoCard
            title="Owner Information"
            icon="person"
            items={[
              { label: "Full Name", value: owner_name },
              { label: "Role", value: owner_role },
            ]}
          />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-surface-container-lowest rounded-xl p-unit-lg shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-unit-lg">
              <h3 className="font-section-title-sm text-section-title-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  receipt_long
                </span>
                Recent Orders
              </h3>

              <a
                className="text-primary font-label-bold text-label-bold hover:underline"
                href="#"
              >
                View All
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[720px]">
                <thead>
                  <tr className="border-b border-outline-variant">
                    <th className="py-3 px-4 font-label-bold text-caption text-on-surface-variant">
                      Order ID
                    </th>
                    <th className="py-3 px-4 font-label-bold text-caption text-on-surface-variant">
                      Date
                    </th>
                    <th className="py-3 px-4 font-label-bold text-caption text-on-surface-variant">
                      Qty
                    </th>
                    <th className="py-3 px-4 font-label-bold text-caption text-on-surface-variant">
                      Listing ID
                    </th>
                    <th className="py-3 px-4 font-label-bold text-caption text-on-surface-variant">
                      Amount
                    </th>
                    <th className="py-3 px-4 font-label-bold text-caption text-on-surface-variant">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="font-body-sm text-body-sm text-on-surface">
                  {orders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-6 px-4 text-center text-on-surface-variant"
                      >
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <MerchantOrderRow key={order.id} order={order} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}