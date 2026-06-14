export default function OrderReadyNormal({set_page_state}: {set_page_state: (state: string) => void}){
    return (<div className="relative flex h-full min-h-screen w-full max-w-md flex-col bg-background-light dark:bg-surface-dark shadow-2xl overflow-hidden mx-auto mt-5">
        <main className="flex-1 overflow-y-auto px-4 pb-64">
          <div className="mb-6 overflow-hidden rounded-xl bg-primary text-primary-content shadow-lg relative group">
            <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#004d36 2px, transparent 2px)', backgroundSize: '20px 20px'}} />
            <div className="relative p-6 flex flex-col items-center text-center z-10">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-surface-light/30 backdrop-blur-sm shadow-sm">
                <span className="material-symbols-outlined text-3xl">shopping_bag</span>
              </div>
              <h2 className="mb-1 text-2xl font-bold tracking-tight">Ready for Pickup</h2>
              <p className="mb-4 text-sm font-medium opacity-90">Your order is prepared and waiting.</p>
              <div className="w-full border-t border-primary-content/20 my-2" />
              <div className="mt-4 flex flex-col items-center w-full bg-white p-6 rounded-lg shadow-inner">
                <p className="mb-4 text-sm text-slate-500 font-medium">Show this code to staff upon arrival.</p>
                <p className="text-3xl font-extrabold tracking-wider text-slate-900 mb-6">#SB-9281</p>
                <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-900 py-3 px-4 text-sm font-bold text-white shadow-md hover:bg-slate-800 transition-colors active:scale-[0.98]" onClick={ () => {set_page_state("qr")}}>
                  <span className="material-symbols-outlined text-lg">qr_code_2</span>
                  Show Pickup Code
                </button>
              </div>
            </div>
          </div>
          <div className="mb-4 flex items-center gap-4 rounded-xl bg-surface-light dark:bg-surface-dark p-4 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-200">
              <img alt="Restaurant Logo" className="h-full w-full object-cover" data-alt="Close-up of a burger and fries" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWGNmP3aVvA6Ytata77p_kBw-NlMSs4IIHsjShn9nAQw8Sl6YR4jPFDKfd33rxfCO51shcwNVU2rxCK_RtblPlcTmxDvUMUpYA1LiNlXDVO5anx2lx53AlMChWc3goy3ZuzSQ1QcrRZaz3Rkuh6Orpu7oP_h4B95JE_f5bc4khxvHQcM7ce0I89qdn54AlIA_O8ROBQA8zQUOBGE3b3_Z-MJh8V4WgrGqy66fMJYpVCFW_U6r2XAW4TNGKw5wSL1JPGxibazxmSv_D" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 dark:text-slate-100">Burger Joint NYC</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">123 W 45th St, New York</p>
            </div>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-background-light dark:bg-surface-dark text-primary">
              <span className="material-symbols-outlined">call</span>
            </button>
          </div>
          <div className="rounded-xl bg-surface-light dark:bg-surface-dark p-4 shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="mb-4 text-base font-bold text-slate-900 dark:text-slate-100">Order Summary</h3>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded bg-primary/20 text-primary-content text-xs font-bold shrink-0">1x</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Classic Cheeseburger</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">No onions, Extra cheese</p>
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">$12.50</p>
              </div>
              <div className="flex justify-between items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded bg-primary/20 text-primary-content text-xs font-bold shrink-0">1x</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Large Fries</p>
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">$4.50</p>
              </div>
              <div className="flex justify-between items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded bg-primary/20 text-primary-content text-xs font-bold shrink-0">2x</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Cola Zero</p>
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">$5.00</p>
              </div>
              <div className="h-px w-full bg-slate-100 dark:bg-slate-700 my-1" />
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Paid</p>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">$22.00</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <button className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-base">help</span>
              Need help with this order?
            </button>
          </div>
        </main>
        <div className="fixed bottom-[90px] left-0 right-0 px-4 w-full max-w-md mx-auto pointer-events-none">
          <button className="pointer-events-auto w-full rounded-full bg-primary py-4 text-center font-bold text-primary-content shadow-lg shadow-primary/30 transition-transform active:scale-[0.98] hover:shadow-primary/50">
            Mark as Picked Up
          </button>
        </div>
      </div>)}