import CustomerNavbar from "../navbar/customer_navbar";

export function SavebiteOrdersEmptyStateScreen() {
  return (
    <>
      <div className="relative flex h-screen w-full max-w-md mx-auto flex-col overflow-hidden bg-white dark:bg-surface-dark shadow-2xl">
        <header className="flex items-center justify-between px-6 pt-[24px] pb-4 bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Orders</h1>
          <button className="w-[40px] h-[40px] rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
        </header>
        <div className="px-6 pb-2 pt-0 mb-[16px]"> 
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl relative">
            <div className="absolute left-1 top-1 bottom-1 w-[calc(33.333%-4px)] bg-white dark:bg-slate-700 rounded-lg shadow-sm z-0" />
            <button className="flex-1 relative z-10 py-2 text-sm font-semibold text-primary text-center transition-colors">
              Upcoming
            </button>
            <button className="flex-1 relative z-10 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 text-center hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
              Completed
            </button>
            <button className="flex-1 relative z-10 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 text-center hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
              Cancelled
            </button>
          </div>
        </div>
        <main className="flex-1 flex flex-col items-center justify-center px-6 w-full">
          <div className="w-48 h-48 mb-6 relative flex items-center justify-center opacity-80">
            <div className="relative w-32 h-40">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 border-4 border-primary/30 rounded-full clip-top" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border-2 border-primary/20 transform -rotate-3" />
              <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-2xl border-2 border-primary/20 shadow-lg flex items-center justify-center overflow-hidden">
                <div className="w-16 h-1 bg-slate-100 dark:bg-slate-700 rounded-full mb-2" />
                <div className="w-10 h-1 bg-slate-100 dark:bg-slate-700 rounded-full" />
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-primary/10 rounded-full" />
              </div>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-12 border-t-4 border-l-4 border-r-4 border-primary rounded-t-full" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center">No orders yet</h2>
          <p className="text-slate-500 dark:text-slate-400 text-center text-sm leading-relaxed max-w-[280px] mb-8">
            You donâ€™t have any orders yet.
          </p>
          <button className="w-full bg-primary hover:bg-emerald-600 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group">
            <span className="material-symbols-outlined text-[20px] group-hover:-translate-y-0.5 transition-transform">search</span>
            Browse deals
          </button>
        </main>

        <CustomerNavbar/>
      
      </div>
    </>
  );
}

