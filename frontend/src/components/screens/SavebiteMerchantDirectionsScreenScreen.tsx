export function SavebiteMerchantDirectionsScreenScreen() {
  return (
    <>
      <div className="relative flex h-screen w-full flex-col overflow-hidden max-w-md mx-auto bg-white dark:bg-surface-dark shadow-2xl">
        <header className="px-6 pt-6 pb-2 bg-white dark:bg-surface-dark sticky top-0 z-20">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Search</h1>
        </header>
        <main className="flex-1 overflow-y-auto no-scrollbar pb-24 px-6">
          <div className="mt-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
            </div>
            <input className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium transition-all shadow-sm" placeholder="Search food, stores, or categories" type="text" />
          </div>
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent</h3>
              <button className="text-xs font-semibold text-primary hover:text-primary-dark">Clear all</button>
            </div>
            <div className="flex flex-col">
              <button className="flex items-center justify-between py-3 border-b border-slate-50 dark:border-slate-800/50 group">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">history</span>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Bakery nearby</span>
                </div>
                <span className="material-symbols-outlined text-slate-300 hover:text-slate-500 text-[18px]">close</span>
              </button>
              <button className="flex items-center justify-between py-3 border-b border-slate-50 dark:border-slate-800/50 group">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">history</span>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Croissants</span>
                </div>
                <span className="material-symbols-outlined text-slate-300 hover:text-slate-500 text-[18px]">close</span>
              </button>
              <button className="flex items-center justify-between py-3 border-b border-slate-50 dark:border-slate-800/50 group">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">history</span>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Vegetarian options</span>
                </div>
                <span className="material-symbols-outlined text-slate-300 hover:text-slate-500 text-[18px]">close</span>
              </button>
              <button className="flex items-center justify-between py-3 group">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">history</span>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Sushi</span>
                </div>
                <span className="material-symbols-outlined text-slate-300 hover:text-slate-500 text-[18px]">close</span>
              </button>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Explore Categories</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="relative overflow-hidden rounded-xl p-4 bg-orange-50 dark:bg-orange-900/20 hover:scale-[1.02] transition-transform duration-200 text-left h-24 flex flex-col justify-between border border-orange-100 dark:border-orange-800/30">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-orange-900/40 flex items-center justify-center text-orange-500 mb-2 shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">bakery_dining</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">Bakery</span>
              </button>
              <button className="relative overflow-hidden rounded-xl p-4 bg-amber-50 dark:bg-amber-900/20 hover:scale-[1.02] transition-transform duration-200 text-left h-24 flex flex-col justify-between border border-amber-100 dark:border-amber-800/30">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-amber-900/40 flex items-center justify-center text-amber-500 mb-2 shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">restaurant</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">Meals</span>
              </button>
              <button className="relative overflow-hidden rounded-xl p-4 bg-emerald-50 dark:bg-emerald-900/20 hover:scale-[1.02] transition-transform duration-200 text-left h-24 flex flex-col justify-between border border-emerald-100 dark:border-emerald-800/30">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-emerald-900/40 flex items-center justify-center text-emerald-500 mb-2 shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">shopping_basket</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">Groceries</span>
              </button>
              <button className="relative overflow-hidden rounded-xl p-4 bg-pink-50 dark:bg-pink-900/20 hover:scale-[1.02] transition-transform duration-200 text-left h-24 flex flex-col justify-between border border-pink-100 dark:border-pink-800/30">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-pink-900/40 flex items-center justify-center text-pink-500 mb-2 shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">icecream</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">Desserts</span>
              </button>
              <button className="relative overflow-hidden rounded-xl p-4 bg-lime-50 dark:bg-lime-900/20 hover:scale-[1.02] transition-transform duration-200 text-left h-24 flex flex-col justify-between border border-lime-100 dark:border-lime-800/30">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-lime-900/40 flex items-center justify-center text-lime-600 mb-2 shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">spa</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">Vegan</span>
              </button>
              <button className="relative overflow-hidden rounded-xl p-4 bg-blue-50 dark:bg-blue-900/20 hover:scale-[1.02] transition-transform duration-200 text-left h-24 flex flex-col justify-between border border-blue-100 dark:border-blue-800/30">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-blue-900/40 flex items-center justify-center text-blue-500 mb-2 shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">local_cafe</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">Beverages</span>
              </button>
            </div>
          </div>
          <div className="h-8" />
        </main>
        <nav className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-surface-dark px-8 py-3 pb-8 absolute bottom-0 w-full z-30">
          <a className="flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-slate-600 transition-colors w-14" href="#">
            <span className="material-symbols-outlined text-[24px]">home</span>
            <span className="text-[10px] font-medium">Home</span>
          </a>
          <a className="flex flex-col items-center justify-center gap-1.5 text-primary transition-colors w-14" href="#">
            <span className="material-symbols-outlined text-[24px] font-semibold" style={{fontVariationSettings: '"FILL" 1'}}>search</span>
            <span className="text-[10px] font-bold">Search</span>
          </a>
          <a className="flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-slate-600 transition-colors w-14" href="#">
            <span className="material-symbols-outlined text-[24px]">receipt_long</span>
            <span className="text-[10px] font-medium">Orders</span>
          </a>
          <a className="flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-slate-600 transition-colors w-14" href="#">
            <span className="material-symbols-outlined text-[24px]">bookmark</span>
            <span className="text-[10px] font-medium">Saved</span>
          </a>
          <a className="flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-slate-600 transition-colors w-14" href="#">
            <span className="material-symbols-outlined text-[24px]">person</span>
            <span className="text-[10px] font-medium">Profile</span>
          </a>
        </nav>
      </div>
    </>
  );
}

