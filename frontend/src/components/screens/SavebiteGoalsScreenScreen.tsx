export function SavebiteGoalsScreenScreen() {
  return (
    <>
      <div>
        <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-surface-dark/80 backdrop-blur-md px-4 pt-6 pb-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between h-12">
            <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Goals</h2>
            <div className="w-10 h-10" />
          </div>
        </header>
        <main className="flex-1 px-4 py-2 space-y-6 pb-24 overflow-x-hidden">
          <section className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Your Monthly Goals</h3>
              <button className="flex items-center gap-1 bg-primary/10 hover:bg-primary/20 text-slate-900 dark:text-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 px-3 py-1.5 rounded-full transition-colors">
                <span className="text-xs font-bold">Oct 2023</span>
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">lunch_dining</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Food Saved</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">6.6 kg left</span>
                </div>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" style={{width: '73.6%'}} />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">18.4 kg</span>
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 opacity-80">Target: 25 kg</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">co2</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">CO₂ Avoided</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">23.2 kg left</span>
                </div>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" style={{width: '61.3%'}} />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">36.8 kg</span>
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 opacity-80">Target: 60 kg</span>
              </div>
            </div>
          </section>
          <section className="bg-primary/5 dark:bg-slate-800/50 rounded-xl p-4 border border-primary/10 shadow-sm flex items-start gap-3">
            <div className="bg-white dark:bg-slate-700 p-2 rounded-full shadow-sm shrink-0 w-8 h-8 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[18px]">spa</span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">You’re on track!</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                If you save 2kg per week, you’ll exceed your goal by 3kg.
              </p>
            </div>
          </section>
          <section className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Adjust your monthly targets</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-surface-dark/50 rounded-lg border border-slate-100 dark:border-slate-700">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Food Target</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide">kg / month</span>
                </div>
                <div className="flex items-center gap-3">
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition">
                    <span className="material-symbols-outlined text-[18px]">remove</span>
                  </button>
                  <span className="w-8 text-center font-extrabold text-lg text-slate-900 dark:text-slate-100">25</span>
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-slate-900 shadow-sm shadow-primary/30 hover:bg-primary-dark active:scale-95 transition border border-transparent">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-surface-dark/50 rounded-lg border border-slate-100 dark:border-slate-700">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">CO₂ Target</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide">kg / month</span>
                </div>
                <div className="flex items-center gap-3">
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition">
                    <span className="material-symbols-outlined text-[18px]">remove</span>
                  </button>
                  <span className="w-8 text-center font-extrabold text-lg text-slate-900 dark:text-slate-100">60</span>
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-slate-900 shadow-sm shadow-primary/30 hover:bg-primary-dark active:scale-95 transition border border-transparent">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                  </button>
                </div>
              </div>
              <div className="pt-2">
                <button className="w-full bg-primary hover:bg-primary-dark text-slate-900 font-bold py-3.5 rounded-full shadow-lg shadow-primary/20 active:scale-[0.98] transition-all">
                  Save Goals
                </button>
              </div>
            </div>
          </section>
          <section>
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Milestones</h3>
              <a className="text-xs font-semibold text-primary hover:underline" href="#">View All</a>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 snap-x snap-mandatory">
              <div className="snap-center shrink-0 w-32 h-36 bg-white dark:bg-slate-800 p-3 rounded-xl border border-primary/50 shadow-sm flex flex-col items-center justify-center gap-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-1.5">
                  <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">eco</span>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">10kg Saver</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Unlocked</p>
                </div>
              </div>
              <div className="snap-center shrink-0 w-32 h-36 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500">
                  <span className="material-symbols-outlined">emoji_events</span>
                </div>
                <div className="text-center w-full">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">25kg Saver</p>
                  <div className="w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="w-[70%] h-full bg-primary rounded-full" />
                  </div>
                  <p className="text-[10px] text-primary font-medium mt-1">In Progress</p>
                </div>
              </div>
              <div className="snap-center shrink-0 w-32 h-36 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-2 opacity-50 grayscale">
                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300">
                  <span className="material-symbols-outlined">workspace_premium</span>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">50kg Saver</p>
                  <p className="text-[10px] text-slate-400">Locked</p>
                </div>
              </div>
              <div className="snap-center shrink-0 w-32 h-36 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-2 opacity-50 grayscale">
                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300">
                  <span className="material-symbols-outlined">trophy</span>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">100kg Saver</p>
                  <p className="text-[10px] text-slate-400">Locked</p>
                </div>
              </div>
            </div>
          </section>
        </main>
        <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 px-4 pb-safe pt-1 z-50">
          <div className="flex justify-between items-center h-16">
            <a className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors group" href="#">
              <span className="material-symbols-outlined text-[24px] group-hover:scale-105 transition-transform">home</span>
              <span className="text-[10px] font-medium">Home</span>
            </a>
            <a className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors group" href="#">
              <span className="material-symbols-outlined text-[24px] group-hover:scale-105 transition-transform">search</span>
              <span className="text-[10px] font-medium">Search</span>
            </a>
            <a className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors group" href="#">
              <span className="material-symbols-outlined text-[24px] group-hover:scale-105 transition-transform">receipt_long</span>
              <span className="text-[10px] font-medium">Orders</span>
            </a>
            <a className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors group" href="#">
              <span className="material-symbols-outlined text-[24px] group-hover:scale-105 transition-transform">eco</span>
              <span className="text-[10px] font-medium">Impact</span>
            </a>
            <a className="flex flex-1 flex-col items-center justify-center gap-1 text-primary transition-colors group" href="#">
              <span className="material-symbols-outlined text-[24px] fill-current">person</span>
              <span className="text-[10px] font-bold">Profile</span>
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}


