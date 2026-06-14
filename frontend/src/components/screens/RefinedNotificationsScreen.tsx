export function RefinedNotificationsScreen() {
  return (
    <>
      <div className="w-full max-w-md bg-white dark:bg-surface-dark h-full min-h-screen relative flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
          <button className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-slate-900 dark:text-slate-100">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Notifications</h1>
          <button className="text-primary text-sm font-semibold hover:text-primary-dark transition-colors">
            Mark all as read
          </button>
        </header>
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
          {/* Section: Today */}
          <div className="px-4 pt-6 pb-2">
            <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Today</h2>
          </div>
          {/* Notification Item: Unread */}
          <div className="group relative flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-50 dark:border-gray-800/50">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">shopping_bag</span>
            </div>
            <div className="flex-1 pr-4">
              <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">Order Ready</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-snug">Your order from <span className="font-semibold text-slate-800 dark:text-slate-200">Green Leaf Bakery</span> is ready for pickup.</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">2m ago</p>
            </div>
            <div className="flex items-center text-slate-300 ml-2"><span className="material-symbols-outlined text-lg">chevron_right</span></div></div>
          {/* Notification Item: Unread */}
          <div className="group relative flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-50 dark:border-gray-800/50">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <span className="material-symbols-outlined">eco</span>
            </div>
            <div className="flex-1 pr-4">
              <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">Impact Update</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-snug">You saved <span className="font-semibold text-slate-800 dark:text-slate-200">2.3kg</span> of food this month! Keep up the great work.</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">2h ago</p>
            </div>
            <div className="flex items-center text-slate-300 ml-2"><span className="material-symbols-outlined text-lg">chevron_right</span></div></div>
          {/* Section: Yesterday */}
          <div className="px-4 pt-6 pb-2">
            <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Yesterday</h2>
          </div>
          {/* Notification Item: Read */}
          <div className="group relative flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-50 dark:border-gray-800/50">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <span className="material-symbols-outlined">local_offer</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">Flash Sale Alert</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-snug">50% off at <span className="font-semibold text-slate-800 dark:text-slate-200">Sushi Master</span> ending in 1 hour.</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">5:30 PM</p>
            </div>
            <div className="flex items-center text-slate-300 ml-2"><span className="material-symbols-outlined text-lg">chevron_right</span></div></div>
          {/* Notification Item: Read */}
          <div className="group relative flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-50 dark:border-gray-800/50">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <span className="material-symbols-outlined">storefront</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">New Store Added</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-snug"><span className="font-semibold text-slate-800 dark:text-slate-200">Bagel Bros</span> is now on SaveBite. Check out their surplus bags!</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">9:00 AM</p>
            </div>
            <div className="flex items-center text-slate-300 ml-2"><span className="material-symbols-outlined text-lg">chevron_right</span></div></div>
          {/* Section: Earlier */}
          <div className="px-4 pt-6 pb-2">
            <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Earlier</h2>
          </div>
          {/* Notification Item: Read */}
          <div className="group relative flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-50 dark:border-gray-800/50">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <span className="material-symbols-outlined">verified</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">Level Up!</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-snug">You've reached the "Food Saver" badge level. See your new badge.</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">Oct 24</p>
            </div>
            <div className="flex items-center text-slate-300 ml-2"><span className="material-symbols-outlined text-lg">chevron_right</span></div></div>
          {/* Notification Item: Read */}
          <div className="group relative flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-50 dark:border-gray-800/50">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400">
              <span className="material-symbols-outlined">settings</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">System Update</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-snug">We've updated our privacy policy. Tap to read more.</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">Oct 20</p>
            </div>
            <div className="flex items-center text-slate-300 ml-2"><span className="material-symbols-outlined text-lg">chevron_right</span></div></div>
          {/* Bottom spacing for nav bar */}
          <div className="h-8" />
        </main>
        {/* Bottom Navigation */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 bg-primary text-white px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-bounce-short">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span className="text-sm font-medium">All notifications marked as read</span>
        </div><nav className="absolute bottom-0 left-0 w-full bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800 px-6 pb-6 pt-3 flex justify-between items-end z-30">
          <a className="flex flex-col items-center justify-center gap-1 group w-12" href="#">
            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-[24px]">home</span>
            <span className="text-[10px] font-medium text-slate-400 group-hover:text-primary transition-colors">Home</span>
          </a>
          <a className="flex flex-col items-center justify-center gap-1 group w-12" href="#">
            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-[24px]">search</span>
            <span className="text-[10px] font-medium text-slate-400 group-hover:text-primary transition-colors">Search</span>
          </a>
          <a className="flex flex-col items-center justify-center gap-1 group w-12" href="#">
            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-[24px]">receipt_long</span>
            <span className="text-[10px] font-medium text-slate-400 group-hover:text-primary transition-colors">Orders</span>
          </a>
          <a className="flex flex-col items-center justify-center gap-1 group w-12" href="#">
            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-[24px]">recycling</span>
            <span className="text-[10px] font-medium text-slate-400 group-hover:text-primary transition-colors">Impact</span>
          </a>
          <a className="flex flex-col items-center justify-center gap-1 group w-12" href="#">
            <span className="material-symbols-outlined fill text-primary text-[24px]">person</span>
            <span className="text-[10px] font-medium text-primary">Profile</span>
          </a>
        </nav>
      </div>
    </>
  );
}
