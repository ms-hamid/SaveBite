import { Merchant } from "@/types";
import Link from "next/link";


function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getStatusClass(status: Merchant["kyc_status"]) {
  if (status === "approved") {
    return "bg-highlight text-primary";
  }

  if (status === "rejected") {
    return "bg-error-light text-error";
  }

  return "bg-surface-container text-on-surface-variant";
}

export default function MerchantTableRow({merchant} : {merchant: Merchant}) {
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
          <span>{merchant.address}</span>
        </div>
      </td>

      <td className="p-unit-md">
        {/* "rating" */}
        {"-" === "-" ? (
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
              ({"merchant.review_count"})
            </span>
          </div>
        )}
      </td>

      <td className="p-unit-md text-on-surface-variant">
        {merchant.orders?.length || 0} orders
      </td>

      <td className="p-unit-md font-semibold text-on-surface">
      {/* merchant.total_revenue */}
        {formatRupiah(1000000)}
      </td>

      <td className="p-unit-md">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusClass(
            merchant.kyc_status
            
          )}`}
        >
          {merchant.kyc_status}
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