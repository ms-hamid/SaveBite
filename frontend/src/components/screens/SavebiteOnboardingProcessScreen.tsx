export function SavebiteOnboardingProcessScreen() {
  return (
    <>
      <div>
        <div className="h-12 w-full shrink-0" />
        <main className="flex-1 flex flex-col items-center justify-between px-6 pb-8 pt-4 w-full max-w-md mx-auto h-full">
          <div className="w-full flex-1 flex items-center justify-center relative">
            <div className="absolute w-[120%] h-[80%] bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            <div className="relative w-64 h-[480px] bg-white dark:bg-slate-800 rounded-[2.5rem] border-[8px] border-slate-900 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col items-center justify-center">
              <div className="absolute top-0 w-32 h-6 bg-slate-900 dark:bg-slate-700 rounded-b-xl z-20" />
              <div className="flex flex-col items-center justify-center w-full h-full bg-slate-50 dark:bg-slate-800 p-6 space-y-6">
                <div className="w-full flex justify-between items-center opacity-50">
                  <div className="h-2 w-12 bg-slate-300 dark:bg-slate-600 rounded-full" />
                  <div className="h-6 w-6 rounded-full bg-slate-300 dark:bg-slate-600" />
                </div>
                <div className="w-40 h-40 bg-white dark:bg-slate-900 rounded-xl border-2 border-primary/20 p-3 shadow-sm flex items-center justify-center relative">
                  <div className="grid grid-cols-4 grid-rows-4 gap-1 w-full h-full">
                    <div className="bg-slate-900 dark:bg-primary col-span-2 row-span-2 rounded-sm" />
                    <div className="bg-slate-900 dark:bg-primary col-start-4 rounded-sm" />
                    <div className="bg-slate-900 dark:bg-primary row-start-2 col-start-3 rounded-sm" />
                    <div className="bg-slate-900 dark:bg-primary row-start-3 col-start-1 rounded-sm" />
                    <div className="bg-slate-900 dark:bg-primary col-start-4 row-start-4 rounded-sm" />
                    <div className="bg-slate-900 dark:bg-primary col-span-2 row-span-2 col-start-2 row-start-3 rounded-sm opacity-50" />
                    <div className="bg-slate-900 dark:bg-primary col-start-4 row-start-2 rounded-sm opacity-80" />
                    <div className="bg-slate-900 dark:bg-primary col-start-1 row-start-4 rounded-sm opacity-40" />
                  </div>
                  <div className="absolute w-full h-0.5 bg-primary top-1/2 shadow-[0_0_10px_rgba(16,183,127,0.8)]" />
                </div>
                <div className="space-y-2 w-full text-center">
                  <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-600 rounded-full mx-auto" />
                  <div className="h-2 w-1/2 bg-slate-200 dark:bg-slate-600 rounded-full mx-auto" />
                </div>
                <div className="absolute -right-4 bottom-12 bg-white dark:bg-slate-700 p-3 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-600 transform rotate-6">
                  <span className="material-symbols-outlined text-primary text-3xl">qr_code_scanner</span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col items-center text-center space-y-4 mb-6 z-10">
            <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight leading-tight">
              Reserve &amp; pick up easily.
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-relaxed max-w-xs mx-auto">
              Reserve in the app and show your QR code at pickup.
            </p>
          </div>
          <div className="w-full flex flex-col gap-6 z-10 items-center">
            <div className="flex flex-row items-center justify-center gap-2">
              <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700 transition-colors" />
              <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700 transition-colors" />
              <div className="h-2 w-8 rounded-full bg-primary transition-all" />
            </div>
            <div className="w-full flex flex-col gap-4">
              <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-xl flex items-center justify-center transition-all active:scale-[0.98] shadow-lg shadow-primary/20">
                <span className="text-lg">Get Started</span>
              </button>
              <button className="w-full py-2 text-slate-500 dark:text-slate-400 font-medium text-sm flex items-center justify-center gap-1 hover:text-slate-800 dark:hover:text-white transition-colors">
                Already have an account? 
                <span className="text-primary font-bold hover:underline">Sign In</span>
              </button>
            </div>
          </div>
        </main>
        <div className="h-6 w-full shrink-0" />
      </div>
    </>
  );
}
