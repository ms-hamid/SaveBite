export type MerchantOrder = {
  id: number;
  qty: number;
  total_amount: number | string;
  qr_token: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  listing_id: number;
  public_id: string;
  merchant_id: string;
  customer_id: string;
};

type MerchantOrderRowProps = {
  order: MerchantOrder;
};

function formatRupiah(value: number | string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

function formatDate(date: string | null) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatStatus(status: string | null) {
  if (!status) return "-";

  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getStatusClass(status: string | null) {
  if (status === "completed") {
    return "bg-secondary-container text-primary";
  }

  if (status === "cancelled" || status === "cancel") {
    return "bg-error-light text-error";
  }

  if (status === "pending_payment") {
    return "bg-amber-soft text-amber-icon";
  }

  return "bg-surface-container text-on-surface-variant";
}

export default function MerchantOrderRow({ order }: MerchantOrderRowProps) {
  return (
    <tr className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors">
      <td className="py-3 px-4 font-medium">#{order.id}</td>

      <td className="py-3 px-4 text-on-surface-variant">
        {formatDate(order.created_at)}
      </td>

      <td className="py-3 px-4">{order.qty}</td>

      <td className="py-3 px-4 text-on-surface-variant">
        {order.listing_id}
      </td>

      <td className="py-3 px-4">{formatRupiah(order.total_amount)}</td>

      <td className="py-3 px-4">
        <span
          className={`px-2 py-1 rounded font-label-bold text-caption border border-outline-variant/20 ${getStatusClass(
            order.status
          )}`}
        >
          {formatStatus(order.status)}
        </span>
      </td>
    </tr>
  );
}