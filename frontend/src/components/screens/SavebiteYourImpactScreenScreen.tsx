export function SavebiteYourImpactScreenScreen() {
  return (
    <>
      <div>
        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="px-6 pt-12 pb-6 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary p-2 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">eco</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">Your Impact</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-base font-medium leading-relaxed pl-1">
              See how you’re helping reduce food waste.
            </p>
          </div>
          <div className="px-6 mb-8">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#12a875] via-[#0e8a60] to-[#065038] text-white p-6 shadow-lg shadow-primary/25">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-black/20 rounded-full blur-xl" />
              <div className="relative z-10 flex flex-col gap-8">
                <div>
                  <p className="text-white text-[11px] font-bold uppercase tracking-widest mb-4 opacity-95">Total Impact</p>
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-5xl font-extrabold tracking-tight text-white drop-shadow-md">18.4</h2>
                    <span className="text-[14px] font-medium opacity-90 text-white/90">kg Food Saved</span>
                  </div>
                </div>
                <div className="w-full h-[0.5px] bg-white/15" />
                <div className="flex items-end justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-2xl font-bold text-white drop-shadow-sm">36.8</h3>
                      <span className="text-sm font-medium text-white/60">kg CO<sub>2</sub> Avoided</span>
                    </div>
                  </div>
                  <div className="bg-emerald-800/20 backdrop-blur-md rounded-md py-0.5 px-2 flex items-center gap-1 border border-white/10">
                    <span className="text-xs">🌳</span>
                    <span className="text-[9px] font-semibold text-white/90">= 12 Trees</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Your Progress</h3>
              <span className="text-primary text-sm font-semibold cursor-pointer">View Goals</span>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-100 dark:border-slate-700 flex flex-col gap-6 shadow-sm shadow-slate-200/50 dark:shadow-none">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Food Saved Goal</span>
                  <span className="text-sm font-bold text-primary">75%</span>
                </div>
                <div className="h-[20px] w-full bg-slate-100/70 dark:bg-slate-700/30 rounded-full overflow-hidden border border-slate-100 dark:border-slate-700/50">
                  <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out shadow-sm" style={{width: '75%'}} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">CO<sub>2</sub> Avoided Goal</span>
                  <span className="text-sm font-bold text-primary">60%</span>
                </div>
                <div className="h-[20px] w-full bg-slate-100/70 dark:bg-slate-700/30 rounded-full overflow-hidden border border-slate-100 dark:border-slate-700/50">
                  <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out shadow-sm" style={{width: '60%'}} />
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 mb-8">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">This Month</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm shadow-slate-200/40 dark:shadow-none flex flex-col items-start h-full justify-between">
                <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-500 dark:text-orange-400 p-1.5 rounded-lg mb-3">
                  <span className="material-symbols-outlined text-[20px]">lunch_dining</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white leading-none">2.3 <span className="text-sm font-medium text-slate-400 ml-2">kg</span></span>
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Food Saved</span>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm shadow-slate-200/40 dark:shadow-none flex flex-col items-start h-full justify-between">
                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 p-1.5 rounded-lg mb-3">
                  <span className="material-symbols-outlined text-[20px]">cloud</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white leading-none">4.6 <span className="text-sm font-medium text-slate-400 ml-2">kg</span></span>
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">CO<sub>2</sub> Avoided</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-8">
            <div className="px-6 flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Achievements</h3>
              <button className="text-primary/80 text-sm font-medium hover:text-primary transition-colors">See All</button>
            </div>
            <div className="flex overflow-x-auto gap-3 px-6 pb-4 scrollbar-hide snap-x snap-mandatory">
              <div className="snap-start min-w-[72px] flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-50 to-amber-100 flex items-center justify-center shadow-sm shadow-amber-100/50 border-2 border-white dark:border-slate-800 relative overflow-hidden">
                  <span className="material-symbols-outlined text-amber-500 text-[22px]">emoji_events</span>
                </div>
                <span className="text-[10px] font-bold text-center text-slate-600 dark:text-slate-300 w-20 leading-tight mt-1">First Rescue</span>
              </div>
              <div className="snap-start min-w-[72px] flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-50 to-primary/20 flex items-center justify-center shadow-sm shadow-emerald-100/50 border-2 border-white dark:border-slate-800 relative overflow-hidden">
                  <span className="material-symbols-outlined text-primary text-[22px]">workspace_premium</span>
                </div>
                <span className="text-[10px] font-bold text-center text-slate-600 dark:text-slate-300 w-20 leading-tight mt-1">10kg Hero</span>
              </div>
              <div className="snap-start min-w-[72px] flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center shadow-sm shadow-purple-100/50 border-2 border-white dark:border-slate-800 relative overflow-hidden">
                  <span className="material-symbols-outlined text-purple-500 text-[22px]">local_mall</span>
                </div>
                <span className="text-[10px] font-bold text-center text-slate-600 dark:text-slate-300 w-20 leading-tight mt-1">5 Orders</span>
              </div>
              <div className="snap-start min-w-[72px] flex flex-col items-center gap-2 group cursor-pointer grayscale opacity-30">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center border-2 border-white dark:border-slate-800 relative overflow-hidden">
                  <span className="material-symbols-outlined text-slate-400 text-[22px]">calendar_month</span>
                </div>
                <span className="text-[10px] font-bold text-center text-slate-600 dark:text-slate-300 w-20 leading-tight mt-1">Weekly Saver</span>
              </div>
              <div className="snap-start min-w-[72px] flex flex-col items-center gap-2 group cursor-pointer grayscale opacity-30">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center border-2 border-white dark:border-slate-800 relative overflow-hidden">
                  <span className="material-symbols-outlined text-slate-400 text-[22px]">forest</span>
                </div>
                <span className="text-[10px] font-bold text-center text-slate-600 dark:text-slate-300 w-20 leading-tight mt-1">Tree Planter</span>
              </div>
            </div>
          </div>
          <div className="px-6 pb-6">
            <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-4 border border-primary/5 flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm text-primary mb-1">
                <span className="material-symbols-outlined text-xl">trending_up</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-0.5">Top Saver!</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-tight px-4 tracking-tight">
                  You’re in the top <span className="font-bold text-primary">20%</span> of savers in <span className="font-semibold text-slate-800 dark:text-slate-200">Batam</span>.
                </p>
              </div>
              <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-xl shadow-sm shadow-primary/20 transition-all active:scale-[0.98] mt-2 text-sm border-0">
                Browse more deals
              </button>
            </div>
          </div>
        </main>
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50 pb-[env(safe-area-inset-bottom)]">
          <div className="flex items-center justify-between px-0">
            <a className="flex flex-col items-center justify-center gap-1 py-3 flex-1 group text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors h-[60px]" href="#">
              <span className="material-symbols-outlined text-[24px]">home</span>
              <span className="text-[10px] font-medium">Home</span>
            </a>
            <a className="flex flex-col items-center justify-center gap-1 py-3 flex-1 group text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors h-[60px]" href="#">
              <span className="material-symbols-outlined text-[24px]">search</span>
              <span className="text-[10px] font-medium">Search</span>
            </a>
            <a className="flex flex-col items-center justify-center gap-1 py-3 flex-1 group text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors h-[60px]" href="#">
              <span className="material-symbols-outlined text-[24px]">receipt_long</span>
              <span className="text-[10px] font-medium">Orders</span>
            </a>
            <a className="flex flex-col items-center justify-center gap-1 py-3 flex-1 group text-primary h-[60px]" href="#">
              <span className="material-symbols-outlined text-[24px] fill-current" style={{fontVariationSettings: '"FILL" 1'}}>eco</span>
              <span className="text-[10px] font-bold">Impact</span>
            </a>
            <a className="flex flex-col items-center justify-center gap-1 py-3 flex-1 group text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors h-[60px]" href="#">
              <span className="material-symbols-outlined text-[24px]">person</span>
              <span className="text-[10px] font-medium">Profile</span>
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
