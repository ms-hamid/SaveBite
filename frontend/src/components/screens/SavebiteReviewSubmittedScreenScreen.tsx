export function SavebiteReviewSubmittedScreenScreen() {
  return (
    <>
      <div>
        <header className="flex items-center justify-between px-4 py-3 bg-background-light dark:bg-surface-dark sticky top-0 z-10">
          <button aria-label="Close" className="flex items-center justify-center size-10 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-900 dark:text-slate-100">
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
          <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-8">Review Submitted</h2>
          <div className="w-0" /> 
        </header>
        <main className="flex-1 flex flex-col px-6 overflow-y-auto justify-center pb-20">
          <div className="flex flex-col items-center justify-center text-center gap-4 mb-8">
            <div className="animate-pop-in flex items-center justify-center size-20 rounded-full bg-primary/5 text-primary mb-1">
              <span className="material-symbols-outlined text-[56px]" style={{fontVariationSettings: '"FILL" 1, "wght" 700'}}>check_circle</span>
            </div>
            <div className="space-y-2 max-w-xs mx-auto">
              <h1 className="text-2xl font-extrabold leading-normal tracking-tight text-slate-900 dark:text-slate-50">
                Thank you for your feedback!
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-base font-medium leading-relaxed">
                Your review helps others rescue food confidently.
              </p>
            </div>
          </div>
          <div className="w-full max-w-sm mx-auto bg-neutral-surface dark:bg-neutral-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-3 mb-10">
            <div className="flex items-start gap-3">
              <div className="shrink-0">
                <div className="w-16 h-16 rounded-lg bg-slate-200 dark:bg-slate-700 bg-cover bg-center" data-alt="Fresh artisan bread and pastries on display" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAEN3_a0BcBLlSlWM9Qv2oilxg1NH1AY2Gu_iruSXJXU_4zm7M7lIaibpeLawL-MHMQ0jpyjVBmY19a-PTUD1xoGtHW6IdItA0iRzFrJ5qhPSZ0aoeRWHkgV_AyxsaOVlCKBO5e7n175YCXJ3NeD1OXoMwiXyKfSatzenPK-aHAdTOD-gLpsqRMROiKgYhxl5jJJB7vtTwm-2uD7rrgDLWltj5Yy4E02uMFif3CkWmZyv00feZWEiB_vOMkC11VMV7gZxw5WRZTFvxl")'}}>
                </div>
              </div>
              <div className="flex flex-col flex-1 min-w-0 justify-center h-16">
                <h3 className="text-slate-900 dark:text-slate-100 text-base font-bold leading-tight truncate">
                  Green Leaf Bakery
                </h3>
                <div className="flex items-center gap-1 my-0.5">
                  <div className="flex">
                    <span className="text-primary material-symbols-outlined text-xs" style={{fontVariationSettings: '"FILL" 1'}}>star</span>
                    <span className="text-primary material-symbols-outlined text-xs" style={{fontVariationSettings: '"FILL" 1'}}>star</span>
                    <span className="text-primary material-symbols-outlined text-xs" style={{fontVariationSettings: '"FILL" 1'}}>star</span>
                    <span className="text-primary material-symbols-outlined text-xs" style={{fontVariationSettings: '"FILL" 1'}}>star</span>
                    <span className="text-slate-300 dark:text-slate-600 material-symbols-outlined text-xs" style={{fontVariationSettings: '"FILL" 1'}}>star</span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">(4.0)</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-normal leading-snug line-clamp-2 italic">
                  "Great pastries and very friendly staff. Loved the surprise bag!"
                </p>
              </div>
            </div>
          </div>
        </main>
        <div className="flex flex-col gap-4 px-6 pb-8 pt-4 bg-background-light dark:bg-surface-dark mt-auto safe-area-bottom">
          <button className="w-full h-14 bg-primary hover:bg-primary-dark active:scale-[0.98] transition-all rounded-xl flex items-center justify-center text-white text-base font-bold tracking-wide shadow-md shadow-primary/10">
            Back to Orders
          </button>
          <button className="w-full h-14 bg-transparent border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-all rounded-xl flex items-center justify-center text-slate-900 dark:text-slate-100 text-base font-bold tracking-wide">
            Browse more deals
          </button>
        </div>
      </div>
    </>
  );
}

