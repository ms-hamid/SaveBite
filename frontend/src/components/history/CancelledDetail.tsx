export function OrderDetailCancelledStateScreen() {
    return (
      <>
          {/* Header */}

          <div className="flex-1 overflow-y-auto pb-24">
            {/* Cancelled Status Card */}
            <div className="p-4 pt-6 text-center">
              <div className="relative mb-3 group flex justify-center">
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl transform scale-110 group-hover:scale-125 transition-transform duration-700 w-20 h-20 mx-auto" />
                <div className="relative w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-soft">
                  <span className="material-symbols-outlined text-white text-[40px] font-bold" style={{fontSize: 40}}>close</span>
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Order Cancelled</h1>
                <p className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-relaxed max-w-[280px] mx-auto">
                  Merchant ran out of stock. You have not been charged for this transaction.
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/10 mt-4">
                <span className="material-symbols-outlined text-slate-500 text-sm">credit_card_off</span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wide uppercase">No charge applied</span>
              </div>
            </div>
            {/* Merchant Card (Static) */}
            <div className="px-6 mb-6">
            <div
                className="flex items-center bg-white dark:bg-background-dark border border-gray-100 dark:border-white/10 p-4 rounded-xl shadow-sm flex items-start gap-4">
                <div
                    className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0 relative">
                    <div className="w-full h-full bg-center bg-no-repeat bg-cover" data-alt="Restaurant interior view"
                        style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAcXHUiglukYFMWznSEIIvWI15AQWZRmKVna17H6q0pS_s_EG1FkouHFhikShqYd9ewUFtHXp5UtBCNyuwb9f4yzwjArQjQ4SMWSKvYXin_z9LD9RXZe_k6bun59gfoFr6ZzHFzTrQBKu24c-FhUHOYutOenlvtFDuxvDGPGS-5SxQjm1E9E09QTf8v4eQuahajklRuQR9o9TXcIqqsXpiXmK8ijETVPC-0GhU6sJlqRDlMqhujHeSz0BieFCm2zm9eA02On49xW3wl");'}}>
                    </div>
                </div>
                <div className="flex flex-col flex-1 min-w-0 justify-center">
                    <div className="flex justify-between items-start mb-0.5">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">Green Leaf Bistro
                        </h3>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1.5 truncate">123 Main St, City, State
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        <span>Closed • Opens 9:00 AM</span>
                    </div>
                </div>
                <button
                    className="shrink-0 size-8 mt-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
                    <span
                        className="material-symbols-outlined text-slate-600 dark:text-slate-300 text-[20px]">chevron_right</span>
                </button>
            </div>
        </div>
            {/* Order Summary (Greyed Out) */}
            <div className="px-6 mb-8">
              <h3 className="text-slate-900 dark:text-white font-bold mb-3">Order Summary</h3>
              <div className="bg-gray-50 dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-xl p-4 opacity-70 grayscale">
                <div className="space-y-3 pb-4 border-b border-gray-200 dark:border-white/10 border-dashed">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-200 dark:bg-gray-700 size-6 flex items-center justify-center rounded text-xs font-bold text-slate-600 dark:text-slate-300">1x</div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Surprise Bag - Vegetarian</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Large Size</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Â£12.50</p>
                  </div>
                </div>
                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                    <span className="text-slate-900 dark:text-white">Â£12.50</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Taxes &amp; Fees</span>
                    <span className="text-slate-900 dark:text-white">Â£1.50</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 font-bold text-slate-400 dark:text-slate-500 line-through decoration-2">
                    <span>Total</span>
                    <span>Â£14.00</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex justify-between px-1 text-xs text-slate-400 dark:text-slate-500 font-medium">
                <span>Order #29384910</span>
                <span>Oct 24, 2023 â€¢ 14:30</span>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="px-6 space-y-3">
              <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-full shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 text-[15px]">
                <span className="material-symbols-outlined text-[20px]">search</span>
                Browse Other Deals
              </button>
              <button className="w-full bg-transparent border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 font-bold py-3.5 rounded-full transition-all flex items-center justify-center gap-2 shadow-sm text-[15px]">
                <span className="material-symbols-outlined text-[20px]">support_agent</span>
                Contact Support
              </button>
            </div>
          </div>
        
      </>
    );
  }
  
  