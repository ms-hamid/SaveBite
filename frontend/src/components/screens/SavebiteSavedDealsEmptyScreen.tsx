export function SavebiteSavedDealsEmptyScreen() {
  return (
    <>
      <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-white dark:bg-surface-dark shadow-xl">
        <header className="flex items-center justify-between px-4 py-4 sticky top-0 bg-white dark:bg-surface-dark z-10">
          <div className="w-12" /> 
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center">Saved</h2>
          <div className="w-12" /> 
        </header>
        <main className="flex-1 flex flex-col items-center justify-center px-6 pt-4 pb-24">
          <div className="mb-6 relative">
            <div className="relative bg-white dark:bg-slate-800 rounded-full p-6 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
              <div className="relative">
                <span className="material-symbols-outlined text-primary text-[64px]">shopping_bag</span>
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-1">
                  <span className="material-symbols-outlined text-slate-900 dark:text-white text-[24px] fill-1">favorite</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 mb-8 max-w-[280px]">
            <h3 className="text-slate-900 dark:text-white text-2xl font-extrabold leading-tight text-center">No saved deals yet</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-tight text-center opacity-80">
              Tap the heart icon to save your favorite food and help reduce waste.
            </p>
          </div>
          <button className="w-[85%] bg-primary hover:bg-primary/90 text-slate-900 text-base font-bold h-12 rounded-lg flex items-center justify-center transition-colors shadow-md hover:shadow-lg">
            Browse Deals
          </button>
        </main>
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto border-t border-[#f0f4f3] dark:border-slate-800 bg-white dark:bg-surface-dark px-4 pb-6 pt-2 z-20">
          <div className="flex justify-between items-end text-slate-400">
            <a className="flex flex-1 flex-col items-center justify-end gap-1 hover:text-slate-600 transition-colors group" href="#">
              <div className="flex h-8 items-center justify-center transition-transform group-hover:-translate-y-0.5">
                <span className="material-symbols-outlined text-[24px]">home</span>
              </div>
              <p className="text-xs font-medium leading-normal tracking-[0.015em]">Home</p>
            </a>
            <a className="flex flex-1 flex-col items-center justify-end gap-1 hover:text-slate-600 transition-colors group" href="#">
              <div className="flex h-8 items-center justify-center transition-transform group-hover:-translate-y-0.5">
                <span className="material-symbols-outlined text-[24px]">search</span>
              </div>
              <p className="text-xs font-medium leading-normal tracking-[0.015em]">Search</p>
            </a>
            <a className="flex flex-1 flex-col items-center justify-end gap-1 hover:text-slate-600 transition-colors group" href="#">
              <div className="flex h-8 items-center justify-center transition-transform group-hover:-translate-y-0.5">
                <span className="material-symbols-outlined text-[24px]">receipt_long</span>
              </div>
              <p className="text-xs font-medium leading-normal tracking-[0.015em]">Orders</p>
            </a>
            <a className="flex flex-1 flex-col items-center justify-end gap-1 hover:text-slate-600 transition-colors group" href="#">
              <div className="flex h-8 items-center justify-center transition-transform group-hover:-translate-y-0.5">
                <span className="material-symbols-outlined text-[24px]">public</span>
              </div>
              <p className="text-xs font-medium leading-normal tracking-[0.015em]">Impact</p>
            </a>
            <a className="flex flex-1 flex-col items-center justify-end gap-1 hover:text-slate-600 transition-colors group" href="#">
              <div className="flex h-8 items-center justify-center transition-transform group-hover:-translate-y-0.5">
                <span className="material-symbols-outlined text-[24px]">account_circle</span>
              </div>
              <p className="text-xs font-medium leading-normal tracking-[0.015em]">Profile</p>
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}

