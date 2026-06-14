export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "ready"
  | "completed"
  | "cancelled"
  | "cancel"
  | string
  | null;

export type CustomerOrder = {
  id: number;
  qty: number;
  total_amount: number | string;
  qr_token: string | null;
  status: OrderStatus;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  listing_id: number;
  public_id: string;
  merchant_id: string;
  customer_id: string;
};

type CustomerOrderTableRowProps = {
  order: CustomerOrder;
};

function formatRupiah(value: number | string) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string | null) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatStatus(status: OrderStatus) {
  if (!status) return "-";

  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getStatusClass(status: OrderStatus) {
  if (status === "completed") {
    return "bg-[#d0e8dd] text-[#005236]";
  }

  if (status === "cancelled" || status === "cancel") {
    return "bg-error-container text-on-error-container";
  }

  if (status === "pending_payment") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-surface-container-low text-on-surface-variant";
}

export default function CustomerOrderTableRow({
  order,
}: CustomerOrderTableRowProps) {
  return (
    <tr className="hover:bg-surface-container-low transition-colors group cursor-pointer">
      <td className="py-4 px-6 font-medium group-hover:text-primary transition-colors whitespace-nowrap">
        #{order.id}
      </td>

      <td className="py-4 px-6 text-on-surface-variant whitespace-nowrap">
        {formatDate(order.created_at)}
      </td>

      <td className="py-4 px-6 whitespace-nowrap">{order.qty} item</td>

      <td className="py-4 px-6 text-on-surface-variant whitespace-nowrap">
        {order.listing_id}
      </td>

      <td className="py-4 px-6 text-on-surface-variant whitespace-nowrap">
        {order.merchant_id}
      </td>

      <td className="py-4 px-6 font-medium whitespace-nowrap">
        {formatRupiah(order.total_amount)}
      </td>

      <td className="py-4 px-6">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-label-bold text-[12px] ${getStatusClass(
            order.status
          )}`}
        >
          {formatStatus(order.status)}
        </span>
      </td>
    </tr>
  );
}