"use client";

import { Order, OrderStatus } from "@/types";


type CustomerTagVariant = "repeat" | "priority" | "pickupSoon";

export type OrderCardData = {
  id: string;
  status: OrderStatus;
  customerName: string;
  customerTag?: {
    label: string;
    variant: CustomerTagVariant;
    icon?: string;
    iconType?: "material" | "emoji";
    fillIcon?: boolean;
  };
  item: {
    name: string;
    quantity: number;
    price: number;
    icon: string;
  };
  pickupTime?: string;
  statusNote: string;
  statusNoteIcon: string;
};

type StatusConfigItem = {
  label: string;
  badgeClassName: string;
  buttonLabel: string;
  buttonClassName: string;
  noteClassName: string;
  hasLeftAccent: boolean;
};

type OrderCardProps = {
  order: Order;
  onAction?: () => void;
};
export const statusConfig: Record<OrderStatus, StatusConfigItem> = {
  pending_payment: {
    label: "Pending Payment",
    badgeClassName: "bg-yellow-50 text-yellow-700 border border-yellow-100",
    buttonLabel: "Waiting Payment",
    buttonClassName:
      "w-full bg-slate-300 text-slate-600 py-3 rounded-xl text-[14px] font-bold cursor-not-allowed",
    noteClassName: "text-yellow-600",
    hasLeftAccent: false,
  },

  paid_reserved: {
    label: "New",
    badgeClassName: "bg-blue-50 text-blue-700",
    buttonLabel: "Accept Order",
    buttonClassName:
      "w-full bg-primary-emerald text-white py-3 rounded-xl text-[14px] font-bold active:scale-95 transition-all hover:bg-[#12A96D]",
    noteClassName: "text-red-600",
    hasLeftAccent: false,
  },

  preparing: {
    label: "Preparing",
    badgeClassName: "bg-orange-50 text-orange-700 border border-orange-100",
    buttonLabel: "Mark Ready",
    buttonClassName:
      "w-full bg-white border border-sb-border text-sb-primary-text py-3 rounded-xl text-[14px] font-bold shadow-sm active:scale-95 transition-all hover:bg-slate-50",
    noteClassName: "",
    hasLeftAccent: false,
  },

  ready_to_pickup: {
    label: "Ready",
    badgeClassName:
      "bg-[#E8F8F2] text-primary-emerald border border-primary-emerald/20",
    buttonLabel: "Complete Pickup",
    buttonClassName:
      "w-full bg-primary-emerald text-white py-3 rounded-xl text-[14px] font-bold active:scale-95 transition-all hover:bg-[#12A96D]",
    noteClassName: "text-primary-emerald font-bold",
    hasLeftAccent: true,
  },

  completed: {
    label: "Completed",
    badgeClassName: "bg-slate-50 text-slate-500 border border-sb-border",
    buttonLabel: "Details",
    buttonClassName:
      "px-4 py-2 bg-white border border-sb-border text-sb-primary-text rounded-xl text-[12px] font-bold",
    noteClassName: "",
    hasLeftAccent: false,
  },

  cancelled: {
    label: "Cancelled",
    badgeClassName: "bg-red-50 text-red-700 border border-red-100",
    buttonLabel: "Details",
    buttonClassName:
      "px-4 py-2 bg-white border border-sb-border text-sb-primary-text rounded-xl text-[12px] font-bold",
    noteClassName: "text-red-600",
    hasLeftAccent: false,
  },

  expired_unclaimed: {
    label: "Expired",
    badgeClassName: "bg-slate-100 text-slate-500 border border-slate-200",
    buttonLabel: "Details",
    buttonClassName:
      "px-4 py-2 bg-white border border-sb-border text-sb-primary-text rounded-xl text-[12px] font-bold",
    noteClassName: "text-slate-500",
    hasLeftAccent: false,
  },
};


export default function MerchantOrderCard({ order, onAction }: OrderCardProps) {

  const config = statusConfig[order.status ?? "cancelled"];
  const isCompleted = order.status === "completed";
  const contentOffset = config.hasLeftAccent ? "ml-2" : "";
  const headerOffset = config.hasLeftAccent ? "pl-2" : "";

  return (
    <article className="w-full bg-white border border-sb-border rounded-3xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col gap-4 relative overflow-hidden group hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.1)] transition-all">
      {config.hasLeftAccent && (
        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-emerald" />
      )}

      <div className="flex justify-between items-start">
        <div className={`flex flex-col gap-1.5 ${headerOffset}`}>
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-bold text-sb-secondary-text uppercase tracking-wider">
              ORDER #{order.id}
            </p>

            {/* <span
              className={`${config.badgeClassName} text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wide`}
            >
              {config.label}
            </span> */}
          </div>

          <h3 className="text-[16px] font-bold text-sb-primary-text flex items-center gap-2">
            {order.customer?.full_name}

            {/* {order.customerTag && (
              <span
                className={`${customerTagConfig[order.customerTag.variant]} text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center`}
              >
                {order.customerTag.icon &&
                  order.customerTag.iconType === "material" && (
                    <span
                      className="material-symbols-outlined text-[14px] mr-1"
                      style={{
                        fontVariationSettings: order.customerTag.fillIcon
                          ? "'FILL' 1"
                          : "'FILL' 0",
                      }}
                    >
                      {order.customerTag.icon}
                    </span>
                  )}

                {order.customerTag.icon &&
                  order.customerTag.iconType === "emoji" && (
                    <span className="mr-1">{order.customerTag.icon}</span>
                  )}

                {order.customerTag.label}
              </span>
            )} */}
          </h3>
        </div>
      </div>

      <div
        className={`flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 ${contentOffset}`}
      >
        <div className="w-12 h-12 rounded-xl bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-500">
          <span className="material-symbols-outlined">
            {/* order.item.icon */}
            bakery_dining
          </span>
        </div>

        <div className="flex-1">
          <p className="text-[14px] font-bold text-sb-primary-text">
            {order.listing?.name}
            <span className="text-sb-secondary-text ml-1">
              x{order.qty}
            </span>
          </p>

          <p className="text-[13px] font-medium text-sb-secondary-text mt-0.5">
            {order.listing?.formatted?.dis_price}
          </p>
        </div>
      </div>

      {isCompleted ? (
        <div className="border-t border-sb-border pt-4 flex items-center justify-between text-[12px] text-sb-secondary-text font-medium px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">
              {/* "{order.statusNoteIcon}" */}
            </span>
            {/* "{order.statusNote}" */}
          </div>

          <button
            onClick={() => onAction?.()}
            className={config.buttonClassName}
          >
            {config.buttonLabel}
          </button>
        </div>
      ) : (
        <div
          className={`border-t border-sb-border pt-4 flex flex-col gap-4 ${contentOffset}`}
        >
          <div className="flex items-center justify-between text-[12px] text-sb-secondary-text font-medium px-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">
                schedule
              </span>
              Pickup: {new Date(order.listing?.open_time??"").toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit"
              })}
            </div>

            <div
              className={`flex items-center gap-1.5 ${config.noteClassName}`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {/* {order.statusNoteIcon} */}
              </span>
              {order.status}
            </div>
          </div>

          <button
            onClick={() => {
              console.log(isCompleted ? "true" : "false")  

              onAction?.()}
            }
            className={config.buttonClassName}
          >
            {config.buttonLabel}
          </button>
        </div>
      )}
    </article>
  );
}