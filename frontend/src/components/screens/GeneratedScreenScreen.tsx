export function GeneratedScreenScreen() {
  return (
    <>
      <div className="w-full max-w-md bg-white dark:bg-surface-dark h-full min-h-screen relative flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
          <button className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-slate-900 dark:text-slate-100">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Notifications</h1>
          <button className="text-slate-300 text-sm font-semibold cursor-not-allowed opacity-50">
            Mark all as read
          </button>
        </header>
        
        {/* Main Content (Empty State) */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          {/* Illustration */}
          <div className="mb-8 relative flex items-center justify-center">
            <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center opacity-60">
              <span className="material-symbols-outlined text-gray-400 dark:text-gray-600 text-6xl">notifications_none</span>
            </div>
          </div>
          
          {/* Text */}
          <div className="max-w-xs">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No notifications yet</h2>
            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
              We'll notify you when something important happens.
            </p>
          </div>
        </main>
        
        {/* Bottom Navigation */}
        <nav className="bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800 pb-6 pt-3 px-2">
          <div className="flex justify-around items-end">
            <a className="flex flex-col items-center gap-1 group w-16" href="#">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-[24px]">home</span>
              <span className="text-[10px] font-medium text-slate-400 group-hover:text-primary transition-colors">Home</span>
            </a>
            <a className="flex flex-col items-center gap-1 group w-16" href="#">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-[24px]">search</span>
              <span className="text-[10px] font-medium text-slate-400 group-hover:text-primary transition-colors">Search</span>
            </a>
            <a className="flex flex-col items-center gap-1 group w-16" href="#">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-[24px]">receipt_long</span>
              <span className="text-[10px] font-medium text-slate-400 group-hover:text-primary transition-colors">Orders</span>
            </a>
            <a className="flex flex-col items-center gap-1 group w-16" href="#">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-[24px]">favorite</span>
              <span className="text-[10px] font-medium text-slate-400 group-hover:text-primary transition-colors">Saved</span>
            </a>
            <a className="flex flex-col items-center gap-1 group w-16" href="#">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-[24px]">person</span>
              <span className="text-[10px] font-medium text-slate-400 group-hover:text-primary transition-colors">Profile</span>
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
