export function SavebitePaymentNotDetectedScreenScreen() {
  return (
    <>
      <div className="relative w-full max-w-[430px] h-full min-h-screen flex flex-col bg-white dark:bg-gray-900 overflow-hidden shadow-2xl mx-auto">
        <div className="flex items-center justify-between p-4 pt-8">
          <div className="w-10 h-10" />
          <div className="flex-1" /> 
          <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-slate-900 dark:text-slate-100">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
        <div className="flex-1 flex flex-col px-6 pb-6 overflow-y-auto">
          <div className="flex flex-col items-center mt-2 mb-8 text-center animate-fade-in-up">
            <div className="w-24 h-24 rounded-full bg-amber-soft dark:bg-amber-900/30 flex items-center justify-center mb-6 ring-8 ring-amber-50 dark:ring-amber-900/10 relative">
              <span className="material-symbols-outlined text-amber-icon text-5xl">schedule</span>
              <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-sm border border-amber-100 dark:border-amber-900">
                <span className="material-symbols-outlined text-amber-icon text-xl animate-spin-slow">autorenew</span>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
              Payment Not Found
            </h2>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold tracking-wider uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              Checking Status
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed max-w-[280px]">
              We couldn’t confirm your transfer yet. Please ensure you have completed the transaction.
            </p>
          </div>
          <div className="bg-background-light dark:bg-gray-800 rounded-2xl p-5 mb-6 w-full shadow-soft border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Bank</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold" title="BCA Logo">
                    B
                  </div>
                  <span className="text-slate-900 dark:text-white font-bold text-base">BCA</span>
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 group cursor-pointer" title="Copy VA Number">
                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">VA Number</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-900 dark:text-white font-bold text-base tracking-wide">**** 1234</span>
                  <span className="material-symbols-outlined text-slate-400 text-[16px] group-hover:text-primary transition-colors">content_copy</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Amount</span>
                <span className="text-slate-900 dark:text-white font-bold text-xl tracking-tight">Rp49.900</span>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800/50 rounded-xl p-5 mb-6 w-full border border-gray-100 dark:border-gray-700">
            <h3 className="text-slate-900 dark:text-white font-bold text-sm mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400 text-lg">info</span>
              How to verify payment?
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 mt-2 flex-shrink-0" />
                <span className="text-slate-600 dark:text-slate-300 text-sm leading-snug">Check your bank balance to confirm deduction.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 mt-2 flex-shrink-0" />
                <span className="text-slate-600 dark:text-slate-300 text-sm leading-snug">Ensure the Virtual Account (VA) number entered is correct.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 mt-2 flex-shrink-0" />
                <span className="text-slate-600 dark:text-slate-300 text-sm leading-snug">Wait 5-10 minutes for bank processing delays.</span>
              </li>
            </ul>
          </div>
          <div className="flex-1" />
          <div className="flex flex-col gap-3 w-full mt-2">
            <button className="w-full bg-primary hover:bg-[#25d36b] active:scale-[0.98] transition-all duration-200 text-slate-900 text-base font-bold h-14 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="mr-2">Check again</span>
              <span className="material-symbols-outlined text-[20px]">refresh</span>
            </button>
            <button className="w-full bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 active:scale-[0.98] transition-all duration-200 text-slate-600 dark:text-slate-300 text-base font-bold h-14 rounded-xl flex items-center justify-center">
              Back to payment instructions
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
