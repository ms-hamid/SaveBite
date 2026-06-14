import Link from "next/link";

export type MerchantOrder = {
  id: number;
  qty: number;
  total_amount: number | string;
  status: string | null;
  created_at: string | null;
  deleted_at: string | null;
  merchant_id: string;
};

export type MerchantRowData = {
  user_id: string;
  merchant_name: string;
  category: string;
  location: string;
  rating: string;
  review_count: string;
  status: "Active" | "Inactive" | "Incomplete";
  total_orders: number;
  total_revenue: number;
};

type MerchantTableRowProps = {
  merchant: MerchantRowData;
};

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getStatusClass(status: MerchantRowData["status"]) {
  if (status === "Active") {
    return "bg-highlight text-primary";
  }

  if (status === "Inactive") {
    return "bg-error-light text-error";
  }

  return "bg-surface-container text-on-surface-variant";
}

export default function MerchantTableRow({ merchant }: MerchantTableRowProps) {
  return (
    <tr className="hover:bg-surface-container-low/50 transition-colors group bg-surface-container-lowest">
      <td className="p-unit-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-outline-variant/20 bg-surface-variant flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined">storefront</span>
          </div>

          <div>
            <p className="font-semibold text-on-surface group-hover:text-primary transition-colors">
              {merchant.merchant_name}
            </p>
            <p className="text-on-surface-variant text-xs break-all">
              ID: {merchant.user_id}
            </p>
          </div>
        </div>
      </td>

      <td className="p-unit-md text-on-surface-variant">
        {merchant.category}
      </td>

      <td className="p-unit-md">
        <div className="flex items-center gap-1 text-on-surface-variant">
          <span
            className="material-symbols-outlined text-outline"
            style={{ fontSize: "16px" }}
          >
            location_on
          </span>
          <span>{merchant.location}</span>
        </div>
      </td>

      <td className="p-unit-md">
        {merchant.rating === "-" ? (
          <span className="text-on-surface-variant italic">No ratings yet</span>
        ) : (
          <div className="flex items-center gap-1">
            <span
              className="material-symbols-outlined text-amber-icon"
              style={{ fontSize: "16px" }}
            >
              star
            </span>
            <span className="font-semibold text-on-surface">
              {merchant.rating}
            </span>
            <span className="text-on-surface-variant text-xs">
              ({merchant.review_count})
            </span>
          </div>
        )}
      </td>

      <td className="p-unit-md text-on-surface-variant">
        {merchant.total_orders} orders
      </td>

      <td className="p-unit-md font-semibold text-on-surface">
        {formatRupiah(merchant.total_revenue)}
      </td>

      <td className="p-unit-md">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusClass(
            merchant.status
          )}`}
        >
          {merchant.status}
        </span>
      </td>

      <td className="p-unit-md text-right">
        <Link
          href={`/admin/merchant/${merchant.user_id}`}
          className="inline-block bg-primary hover:bg-primary-dark text-on-primary px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          Detail
        </Link>
      </td>
    </tr>
  );
}