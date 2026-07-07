import { Order } from "@/types";

export default function PaymentDoneOrderPage({order}: {order: Order | null | undefined}) {
    return (
      <>
        <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-white dark:bg-surface-dark shadow-xl overflow-hidden">
          <div className="flex-1 overflow-y-auto pb-24 pt-12">
            <div className="flex flex-col items-center justify-center pt-6 pb-6 px-4 text-center">
              <div className="relative flex items-center justify-center mb-6">
                <div className="absolute w-24 h-24 rounded-full bg-primary/10 animate-ping" />
                <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-primary text-white shadow-lg shadow-primary/30 animate-scaleIn">
                  <span className="material-symbols-outlined text-[40px] font-bold">check</span>
                </div>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Payment Confirmed!</h1>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold tracking-wide uppercase mb-2">
                Ready for Pickup
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Your order is now reserved.</p>
            </div>
            <div className="px-4 mb-6">
              <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-5 border border-slate-100 dark:border-white/10 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Order #{order?.public_id?.substring(0, 8).toUpperCase()}...</p>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{order?.listing?.name}</h3>
                  </div>
                  <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-lg bg-cover bg-center" style={{backgroundImage: `url("${order?.listing?.img_url ?? 'https://upload.wikimedia.org/wikipedia/commons/6/60/No-Image-Placeholder-banner.svg'}")`}} />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <span className="material-symbols-outlined text-primary text-[20px]">schedule</span>
                    <div className="flex flex-col">
                      <span className="font-medium">Pickup time limits apply</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <span className="material-symbols-outlined text-primary text-[20px]">storefront</span>
                    <span className="font-medium">{order?.merchant?.address || "Address not provided"}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4">
              <div className="flex flex-col items-center bg-white dark:bg-white/5 rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] dark:shadow-none border border-slate-100 dark:border-white/10">
                <p className="text-slate-900 dark:text-white font-bold mb-2 text-center">Show this QR code at pickup</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-4 bg-slate-100 dark:bg-white/10 px-3 py-1 rounded-full">
                  Valid for pickup at <span className="text-primary font-bold tabular-nums">{new Date(order?.merchant?.pickup_open ?? "").toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}</span>
                </p>
                <div className="bg-white p-3 rounded-xl border border-slate-100 mb-2 w-full max-w-[276px] aspect-square flex items-center justify-center">
                  <img alt="Order QR Code" className="w-full h-full object-contain mix-blend-multiply opacity-90" src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${order?.order_code}`} />
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-6 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">refresh</span>
                  QR refreshes automatically every 30 seconds.
                </p>
                <div className="flex gap-3 w-full">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Save
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                    Details
                  </button>
                </div>
              </div>
            </div>
            <div className="px-6 py-6 text-center">
              <div className="inline-flex flex-col gap-1 text-xs text-slate-400 dark:text-slate-500">
                <p className="flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">info</span>
                  No refunds after pickup window ends.
                </p>
                <p>Please arrive within the designated time slot.</p>
              </div>
            </div>
          </div>
          
          {/* Fixed Bottom Button - Above Navbar */}
          <div className="sticky bottom-0 left-0 right-0 p-4 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-white/10 z-10">
            <button className="w-full bg-primary hover:bg-emerald-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              <span>View Orders</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </>
    );
  }
  
  