export type OrderStatus =
  | "pending_payment"
  | "paid_reserved"
  | "completed"
  | "expired_unclaimed"
  | "cancelled"
  | "ready_to_pickup"
  | "preparing";

export type Order = {
  id: number;
  qty: number;
  total_amount: number | string;
  qr_token: string | null;
  status: OrderStatus | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  listing_id: number;
  public_id: string;
  merchant_id: string;
  customer_id: string;
};

type OrderMonitoringTableRowProps = {
  order: Order;
};

function formatRupiah(value: number | string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

function formatCreatedTime(value: string | null) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatStatusLabel(status: OrderStatus | null) {
  if (!status) return "-";

  const labels: Record<OrderStatus, string> = {
    pending_payment: "Pending Payment",
    paid_reserved: "Paid Reserved",
    completed: "Completed",
    expired_unclaimed: "Expired Unclaimed",
    cancelled: "Cancelled",
    ready_to_pickup: "Ready To Pickup",
    preparing: "Preparing",
  };

  return labels[status] ?? status;
}

function getStatusClass(status: OrderStatus | null) {
  if (status === "completed") {
    return "bg-secondary-container text-primary";
  }

  if (status === "cancelled") {
    return "bg-error-light text-error";
  }

  if (status === "pending_payment") {
    return "bg-amber-soft text-amber-icon";
  }

  if (status === "paid_reserved") {
    return "bg-tertiary-fixed text-on-tertiary-container";
  }

  if (status === "ready_to_pickup") {
    return "bg-highlight text-primary";
  }

  if (status === "preparing") {
    return "bg-surface-container text-on-surface";
  }

  if (status === "expired_unclaimed") {
    return "bg-surface-container text-on-surface-variant";
  }

  return "bg-surface-container text-on-surface-variant";
}

export default function OrderMonitoringTableRow({
  order,
}: OrderMonitoringTableRowProps) {
  return (
    <tr className="hover:bg-surface-container-low transition-colors group">
      <td className="py-4 px-6 font-medium">
        #{order.id}
        <div className="text-secondary text-xs font-normal break-all">
          {order.public_id}
        </div>
      </td>

      <td className="py-4 px-6">
        <div className="flex flex-col">
          <span>-</span>
          <span className="text-secondary text-xs break-all">
            {order.merchant_id}
          </span>
        </div>
      </td>

      <td className="py-4 px-6">
        <div className="flex flex-col">
          <span>-</span>
          <span className="text-secondary text-xs break-all">
            {order.customer_id}
          </span>
        </div>
      </td>

      <td className="py-4 px-6">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusClass(
            order.status
          )}`}
        >
          {formatStatusLabel(order.status)}
        </span>
      </td>

      <td className="py-4 px-6 text-right">
        {formatRupiah(order.total_amount)}
      </td>

      <td className="py-4 px-6 text-secondary">
        {formatCreatedTime(order.created_at)}
      </td>
    </tr>
  );
}