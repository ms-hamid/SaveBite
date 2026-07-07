import { Order } from "@/types";
import { MerchantCard, OrderSummary, OrderDetailsInfo } from "../shared";
import { get_close_text, get_remaining_time } from "@/lib/format";
import { useState } from "react";
import { cancelOrder } from "@/services/order";
import { getApiErrorMessage } from "@/lib/api";
import { useRouter } from "next/navigation";

export function OrderDetailUpcomingStateScreen({ order }: { order: Order | null | undefined }) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  async function handleCancelOrder() {
    if (!order?.public_id) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order? This action cannot be undone."
    );
    
    if (!confirmed) return;

    setIsCancelling(true);
    setCancelError("");

    try {
      await cancelOrder(order.public_id);
      alert("Order cancelled successfully!");
      router.push(`/order/${order.public_id}`); // Refresh to show cancelled state
      router.refresh();
    } catch (err) {
      const errorMsg = getApiErrorMessage(err);
      setCancelError(errorMsg);
      alert(`Failed to cancel order: ${errorMsg}`);
    } finally {
      setIsCancelling(false);
    }
  }
  
  return (
    <>

      <main className="flex-1 overflow-y-auto pb-24">
        <div className="px-4 py-8 flex flex-col items-center justify-center bg-surface-light dark:bg-surface-dark shadow-sm">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-emerald-700 dark:text-primary mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-primary mr-2" />
            Upcoming Pickup
          </span>
          <h1 className="text-3xl font-bold text-text-main-light dark:text-text-main-dark text-center mb-2">{get_remaining_time(order?.merchant?.pickup_close ?? "")}</h1>
          <p className="text-text-sub-light dark:text-text-sub-dark font-medium text-center">{new Date(order?.merchant?.pickup_open ?? "").toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(order?.merchant?.pickup_close ?? "").toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} </p>
        </div>
        <div className="px-4 mt-6">
          <MerchantCard
            storeName={order?.merchant?.merchant_name ?? ""}
            address={order?.merchant?.address}
            distance={"-"}
            imageUrl={order?.listing?.img_url ?? "https://upload.wikimedia.org/wikipedia/commons/6/60/No-Image-Placeholder-banner.svg"}
          />
        </div>

        <div className="px-4 mt-6">
          <h3 className="text-base font-bold text-text-main-light dark:text-text-main-dark mb-4 px-1">Order Summary</h3>
          <OrderSummary
            item={order}
            amountSaved={order?.formatted?.saved_price || ""}
          />
        </div>

        <div className="px-4 mt-6 mb-6">
          <OrderDetailsInfo
            orderId={order?.public_id}
            paymentMethod={order?.payment?.payment_method ?? ""}
          />
        </div>
        <div className="px-4 mt-8 pb-8">
          {cancelError && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
              {cancelError}
            </div>
          )}
          <button 
            onClick={handleCancelOrder}
            disabled={isCancelling}
            className="w-full py-3.5 px-4 rounded-full border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 font-semibold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {isCancelling ? (
              <>
                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                Cancelling...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">cancel</span>
                Cancel Order
              </>
            )}
          </button>
          <p className="text-xs text-center text-text-sub-light dark:text-text-sub-dark mt-4 px-8">
            Cancellations are only available up to 2 hours before the pickup window starts.
          </p>
        </div>
      </main>


    </>
  );
}

