export function OrderDetailUpcomingStateScreen() {
    return (
      <>
        
          <main className="flex-1 overflow-y-auto pb-24">
            <div className="px-4 py-8 flex flex-col items-center justify-center bg-surface-light dark:bg-surface-dark shadow-sm">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-emerald-700 dark:text-primary mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-primary mr-2" />
                Upcoming Pickup
              </span>
              <h1 className="text-3xl font-bold text-text-main-light dark:text-text-main-dark text-center mb-2">Pickup in 1h 24m</h1>
              <p className="text-text-sub-light dark:text-text-sub-dark font-medium text-center">Today, 5:30 PM â€“ 6:00 PM</p>
            </div>
            <div className="px-4 mt-6">
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex gap-4">
                  <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-200">
                    <img alt="Bakery storefront with pastries" className="w-full h-full object-cover" data-alt="Bakery storefront with pastries" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtO-sj3nO3ygiNwD6L5vxQ0qfa43NlEHE4FZpw8m2JnBd8UJQwXLH5xgG1J0ZxoIU7ZEg8DjrJc8foFhjCMMVMEQC1h8oNLN4kDv4h36eP47ITTZJ2kimC5WvJLdoNXhR7rpd8Z2CfhLTn-TC58kUgmrTvXRSCpeZ8IgOsBVM075iT7PdlAhnIeStNIvj5aGR24Z6GMHpxZI9N8WHyvvdgsc6x-3vDEdIyuEwvKQlac2l_mv74KPcPAZU7rUqEO3UV4LOj9rLiUpeH" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-text-main-light dark:text-text-main-dark mb-1">Green Leaf Bakery</h3>
                    <p className="text-sm text-text-sub-light dark:text-text-sub-dark mb-3">123 Market Street, Downtown â€¢ 0.8 mi</p>
                    <button className="self-start text-sm font-semibold text-emerald-700 dark:text-primary flex items-center gap-1 hover:underline">
                      <span className="material-symbols-outlined text-[18px]">directions</span>
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 mt-6">
              <h3 className="text-base font-bold text-text-main-light dark:text-text-main-dark mb-4 px-1">Order Summary</h3>
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100 dark:border-gray-800/50">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded flex items-center justify-center bg-background-light dark:bg-surface-dark text-xs font-bold text-text-sub-light dark:text-text-sub-dark">
                      1x
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-main-light dark:text-text-main-dark">Surprise Bag (Large)</p>
                      <p className="text-xs text-text-sub-light dark:text-text-sub-dark mt-0.5">Assorted Pastries &amp; Bread</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-text-main-light dark:text-text-main-dark">$5.99</p>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <p className="text-base font-bold text-text-main-light dark:text-text-main-dark">Total Paid</p>
                  <p className="text-lg font-bold text-text-main-light dark:text-text-main-dark">$5.99</p>
                </div>
                <div className="mt-2 text-xs text-text-sub-light dark:text-text-sub-dark flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">savings</span>
                  You saved $12.00 on this order!
                </div>
              </div>
            </div>
            <div className="px-4 mt-6 mb-6">
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-0 shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-800/50">
                  <span className="text-sm text-text-sub-light dark:text-text-sub-dark">Order ID</span>
                  <span className="text-sm font-medium text-text-main-light dark:text-text-main-dark">#ORD-9283-KA</span>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="text-sm text-text-sub-light dark:text-text-sub-dark">Payment Method</span>
                  <span className="text-sm font-medium text-text-main-light dark:text-text-main-dark flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">credit_card</span>
                    Apple Pay
                  </span>
                </div>
              </div>
            </div>
            <div className="px-4 mt-8 pb-8">
              <button className="w-full py-3.5 px-4 rounded-full border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 font-semibold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[20px]">cancel</span>
                Cancel Order
              </button>
              <p className="text-xs text-center text-text-sub-light dark:text-text-sub-dark mt-4 px-8">
                Cancellations are only available up to 2 hours before the pickup window starts.
              </p>
            </div>
          </main>
    

      </>
    );
  }
  
  