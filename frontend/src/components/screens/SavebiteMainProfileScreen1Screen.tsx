export function SavebiteMainProfileScreen1Screen() {
  return (
    <>
      <div>
        <main className="flex-1 px-4 pt-1 pb-32 overflow-y-auto no-scrollbar max-w-md mx-auto w-full">
          <header className="flex items-center justify-between mb-6 relative h-[44px]">
            <button className="w-8 h-8 flex items-center justify-center rounded-full active:bg-slate-200 dark:active:bg-slate-800 transition-colors">
              <span className="material-icons-round text-slate-800 dark:text-slate-200">arrow_back</span>
            </button>
            <h2 className="text-base font-bold tracking-tight absolute left-1/2 -translate-x-1/2">Settings</h2>
            <div className="w-8" />
          </header>
          <section className="mb-6">
            <h3 className="text-[10px] font-bold text-slate-400/50 dark:text-slate-500/50 uppercase tracking-[0.2em] mb-1.5 ml-1">Profile &amp; Security</h3>
            <div className="bg-white dark:bg-slate-800 rounded-[20px] overflow-hidden shadow-soft border border-slate-100 dark:border-slate-700/50">
              <button className="w-full h-14 px-4 flex items-center justify-between active:bg-slate-50 dark:active:bg-slate-700 transition-colors border-b border-slate-50 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-[30px] h-[30px] rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <span className="material-icons-round text-[18px]">person</span>
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Edit Profile</span>
                </div>
                <span className="material-icons-round text-slate-300/60 dark:text-slate-600">chevron_right</span>
              </button>
              <button className="w-full h-14 px-4 flex items-center justify-between active:bg-slate-50 dark:active:bg-slate-700 transition-colors border-b border-slate-50 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-[30px] h-[30px] rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <span className="material-icons-round text-[18px]">lock</span>
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Change Password</span>
                </div>
                <span className="material-icons-round text-slate-300/60 dark:text-slate-600">chevron_right</span>
              </button>
              <button className="w-full h-14 px-4 flex items-center justify-between active:bg-slate-50 dark:active:bg-slate-700 transition-colors border-b border-slate-50 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-[30px] h-[30px] rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <span className="material-icons-round text-[18px]">credit_card</span>
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Payment Methods</span>
                </div>
                <span className="material-icons-round text-slate-300/60 dark:text-slate-600">chevron_right</span>
              </button>
              <button className="w-full h-14 px-4 flex items-center justify-between active:bg-slate-50 dark:active:bg-slate-700 transition-colors border-b border-slate-50 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-[30px] h-[30px] rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <span className="material-icons-round text-[18px]">shopping_bag</span>
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Pickup Preferences</span>
                </div>
                <span className="material-icons-round text-slate-300/60 dark:text-slate-600">chevron_right</span>
              </button>
              <button className="w-full h-14 px-4 flex items-center justify-between active:bg-slate-50 dark:active:bg-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-[30px] h-[30px] rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <span className="material-icons-round text-[18px]">language</span>
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Language</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">English (US)</span>
                  <span className="material-icons-round text-slate-300/60 dark:text-slate-600">chevron_right</span>
                </div>
              </button>
            </div>
          </section>
          <section className="mb-6">
            <h3 className="text-[10px] font-bold text-slate-400/50 dark:text-slate-500/50 uppercase tracking-[0.2em] mb-1.5 ml-1">Notifications</h3>
            <div className="bg-white dark:bg-slate-800 rounded-[20px] overflow-hidden shadow-soft border border-slate-100 dark:border-slate-700/50">
              <button className="w-full h-14 px-4 flex items-center justify-between active:bg-slate-50 dark:active:bg-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-[30px] h-[30px] rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <span className="material-icons-round text-[18px]">notifications</span>
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Notifications</span>
                </div>
                <span className="material-icons-round text-slate-300/60 dark:text-slate-600">chevron_right</span>
              </button>
            </div>
          </section>
          <section className="mb-6">
            <h3 className="text-[10px] font-bold text-slate-400/50 dark:text-slate-500/50 uppercase tracking-[0.2em] mb-1.5 ml-1">Support &amp; Legal</h3>
            <div className="bg-white dark:bg-slate-800 rounded-[20px] overflow-hidden shadow-soft border border-slate-100 dark:border-slate-700/50">
              <button className="w-full h-14 px-4 flex items-center justify-between active:bg-slate-50 dark:active:bg-slate-700 transition-colors border-b border-slate-50 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-[30px] h-[30px] rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <span className="material-icons-round text-[18px]">help</span>
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Help Center</span>
                </div>
                <span className="material-icons-round text-slate-300/60 dark:text-slate-600">chevron_right</span>
              </button>
              <button className="w-full h-14 px-4 flex items-center justify-between active:bg-slate-50 dark:active:bg-slate-700 transition-colors border-b border-slate-50 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-[30px] h-[30px] rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <span className="material-icons-round text-[18px]">contact_support</span>
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Contact Support</span>
                </div>
                <span className="material-icons-round text-slate-300/60 dark:text-slate-600">chevron_right</span>
              </button>
              <button className="w-full h-14 px-4 flex items-center justify-between active:bg-slate-50 dark:active:bg-slate-700 transition-colors border-b border-slate-50 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-[30px] h-[30px] rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <span className="material-icons-round text-[18px]">policy</span>
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Privacy Policy</span>
                </div>
                <span className="material-icons-round text-slate-300/60 dark:text-slate-600">chevron_right</span>
              </button>
              <button className="w-full h-14 px-4 flex items-center justify-between active:bg-slate-50 dark:active:bg-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-[30px] h-[30px] rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <span className="material-icons-round text-[18px]">description</span>
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Terms &amp; Conditions</span>
                </div>
                <span className="material-icons-round text-slate-300/60 dark:text-slate-600">chevron_right</span>
              </button>
            </div>
          </section>
          <section className="mb-12">
            <h3 className="text-[10px] font-bold text-rose-400/50 dark:text-rose-500/50 uppercase tracking-[0.2em] mb-1.5 ml-1">Danger Zone</h3>
            <div className="bg-white dark:bg-slate-800 rounded-[20px] overflow-hidden shadow-soft border border-slate-100 dark:border-slate-700/50">
              <button className="w-full h-14 px-4 flex items-center justify-between active:bg-rose-50 dark:active:bg-rose-900/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-[30px] h-[30px] rounded-full bg-rose-50/50 dark:bg-rose-900/10 flex items-center justify-center text-rose-300 dark:text-rose-400">
                    <span className="material-icons-round text-[18px]">delete</span>
                  </div>
                  <span className="font-bold text-sm text-rose-400 dark:text-rose-400">Delete Account</span>
                </div>
                <span className="material-icons-round text-rose-300/40 dark:text-rose-400/40">chevron_right</span>
              </button>
            </div>
          </section>
          <div className="text-center pb-8 flex flex-col items-center gap-6 mt-8">
            <button className="w-full border border-rose-200 dark:border-rose-900/30 text-rose-400 hover:text-rose-500 hover:bg-rose-50 dark:text-rose-400/80 dark:hover:text-rose-300 dark:hover:bg-rose-900/10 transition-colors py-3 px-8 rounded-xl font-bold text-sm">
              Log Out
            </button>
            <p className="text-[10px] text-slate-300/60 dark:text-slate-600/60 font-medium tracking-wide scale-90">Version 2.4.0 (184)</p>
          </div>
        </main>
        <nav className="fixed bottom-0 w-full bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 safe-pb z-50 shadow-[0_-1px_2px_0_rgba(0,0,0,0.015)]">
          <div className="max-w-md mx-auto grid grid-cols-5 h-[64px] items-center">
            <a className="flex flex-col items-center justify-center gap-[4px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" href="#">
              <span className="material-icons-round text-[24px]">home</span>
              <span className="text-[10px] font-medium leading-none">Home</span>
            </a>
            <a className="flex flex-col items-center justify-center gap-[4px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" href="#">
              <span className="material-icons-round text-[24px]">search</span>
              <span className="text-[10px] font-medium leading-none">Search</span>
            </a>
            <a className="flex flex-col items-center justify-center gap-[4px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" href="#">
              <span className="material-icons-round text-[24px]">receipt_long</span>
              <span className="text-[10px] font-medium leading-none">Orders</span>
            </a>
            <a className="flex flex-col items-center justify-center gap-[4px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" href="#">
              <span className="material-icons-round text-[24px]">eco</span>
              <span className="text-[10px] font-medium leading-none">Impact</span>
            </a>
            <a className="flex flex-col items-center justify-center gap-[4px] text-emerald-savebite dark:text-emerald-500" href="#">
              <span className="material-icons-round text-[24px]">person</span>
              <span className="text-[10px] font-medium leading-none">Profile</span>
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}


