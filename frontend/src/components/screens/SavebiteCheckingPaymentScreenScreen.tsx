export function SavebiteCheckingPaymentScreenScreen() {
  return (
    <>
      <div>
        <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto relative z-10 pt-16">
          <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
            <span className="material-symbols-outlined animate-spin">sync</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center animate-pulse-gentle">
                <span className="material-symbols-outlined text-primary text-2xl">account_balance</span>
              </div>
              <div className="absolute bottom-2 right-2 bg-white dark:bg-neutral-surface-dark rounded-full p-0.5 shadow-sm">
                <span className="material-symbols-outlined text-primary text-[10px]">sync_alt</span>
              </div>
            </div>
          </div>
          <div className="text-center mb-8 space-y-3 max-w-[85%]">
            <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">
              Checking your payment...
            </h2>
            <div className="space-y-1">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-relaxed">
                Weâ€™re waiting for your bank to confirm the transfer.
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">
                This usually takes 1â€“10 minutes.
              </p>
            </div>
          </div>
          <div className="w-full bg-neutral-surface dark:bg-neutral-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden mb-8">
            <div className="p-5 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Bank</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-900 dark:text-slate-100 font-semibold">BCA</span>
                  <div className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-700 overflow-hidden flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-blue-600/20" />
                    <span className="text-[6px] font-bold text-blue-700 dark:text-blue-300">BCA</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">VA Number</span>
                <span className="text-slate-900 dark:text-slate-100 font-semibold font-mono tracking-wide">**** 1234</span>
              </div>
              <div className="h-px w-full bg-slate-50 dark:bg-slate-800 my-1" />
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-500 dark:text-slate-400 text-sm">Amount</span>
                <span className="text-primary dark:text-primary-400 text-lg font-bold">Rp49.900</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 w-full">
            <button className="text-sm font-semibold text-slate-900 dark:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 py-3 px-6 rounded-lg w-full transition-colors flex items-center justify-center gap-2 group">
              <span className="material-symbols-outlined text-[18px] text-slate-500 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-white transition-colors">arrow_back</span>
              Havenâ€™t transferred yet?
            </button>
            <button className="text-xs text-primary font-medium hover:text-primary-dark transition-colors flex items-center gap-1.5 py-2">
              <span className="material-symbols-outlined text-[14px]">refresh</span>
              Refresh status
            </button>
          </div>
          <div className="hidden absolute inset-0 bg-background-light dark:bg-surface-dark z-50 flex flex-col items-center justify-center p-6" id="error-state">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6 text-red-600 dark:text-red-400">
              <span className="material-symbols-outlined text-3xl">error_outline</span>
            </div>
            <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-2">Payment not detected</h3>
            <p className="text-slate-500 dark:text-slate-400 text-center text-sm mb-8">We couldn't find your payment yet. Please check your banking app or try again.</p>
            <div className="w-full space-y-3">
              <button className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 rounded-lg transition-colors">
                Check again
              </button>
              <button className="w-full bg-transparent border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium py-3.5 rounded-lg">
                Back to instructions
              </button>
            </div>
          </div>
        </main>
        <div className="h-6 w-full shrink-0" />
        <div className="fixed top-[-20%] right-[-10%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="fixed bottom-[-10%] left-[-10%] w-[250px] h-[250px] bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      </div>
    </>
  );
}


