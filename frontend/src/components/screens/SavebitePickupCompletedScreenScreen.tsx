export function SavebitePickupCompletedScreenScreen() {
  return (
    <>
      <div className="w-full max-w-md bg-white dark:bg-surface-dark min-h-screen flex flex-col shadow-2xl overflow-hidden relative">
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-surface-dark relative z-10 border-b border-gray-100 dark:border-white/5 h-[60px]">
          <button className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined text-slate-800 dark:text-white">arrow_back</span>
          </button>
          <div className="text-[17px] font-bold text-slate-900 dark:text-white absolute left-1/2 transform -translate-x-1/2">Pickup Completed</div>
          <div className="w-8" />
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-24">
          <div className="flex flex-col items-center justify-center pt-8 pb-6 text-center">
            <div className="relative mb-3 group">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl transform scale-110 group-hover:scale-125 transition-transform duration-700" />
              <div className="relative w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-soft">
                <span className="material-symbols-outlined text-white text-[40px] font-bold">check</span>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-lg font-medium">Enjoy your rescued meal ðŸŒ±</p>
          </div>
          <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-xl p-4 shadow-sm mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0 relative">
                <img alt="Fresh artisan bread and pastries" className="w-full h-full object-cover" data-alt="Close up of bakery bread" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDV-35hFVvtuYRAX2x6qreNMvjVMRyvuIXBQwczMtcqeR_qqMlW9LjSt6SZsB5bg-QZb7EbYLeaIp-Rh4LvZC-I5YNLXNtj6K4WtIWVT3yMiXLEG0YC5US0QQS0eloTcTpvKeRIQE1NFBs8YlZeft285XTDs0C-aHdh5R4c5N6XUaYvaaDPooJfZkLgARqNwZgvjHEZ9_OL8CIcs1s2u7h1vQYsG8v9Sb9ReFVqgeYQUku_QCGfidf-BGAuVddGuhgpMSgmvYfCdDG3" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center h-16">
                <div className="flex justify-between items-start mb-0.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">Green Leaf Bakery</h3>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1.5 truncate">Assorted Pastry Surprise Bag</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    <span>Today, 2:30 PM</span>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-gray-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 tracking-wide uppercase">
                    Completed
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden bg-primary/5 dark:bg-primary/10 border border-primary/10 rounded-xl p-5 mb-12">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary filled text-[20px]">eco</span>
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Your Impact</h4>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between border-b border-primary/10 pb-3 last:border-0 last:pb-0 border-dashed">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Food saved</span>
                  <span className="text-lg font-extrabold text-slate-900 dark:text-white text-right">1.2 kg</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">COâ‚‚ avoided</span>
                  <span className="text-lg font-extrabold text-slate-900 dark:text-white text-right">2.4 kg</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-4">
            <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 text-[15px]">
              <span className="material-symbols-outlined filled text-[20px]">star</span>
              Rate this store
            </button>
            <button className="w-full bg-transparent border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm text-[15px]">
              Browse more deals
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-white/5 px-2 pb-6 pt-2 z-20">
          <div className="flex justify-between items-center h-full">
            <a className="flex flex-1 flex-col items-center justify-center gap-1 group py-1" href="#">
              <div className="text-slate-400 group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[24px]">home</span>
              </div>
              <span className="text-[10px] font-medium text-slate-400 group-hover:text-primary">Home</span>
            </a>
            <a className="flex flex-1 flex-col items-center justify-center gap-1 group py-1" href="#">
              <div className="text-slate-400 group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[24px]">search</span>
              </div>
              <span className="text-[10px] font-medium text-slate-400 group-hover:text-primary">Search</span>
            </a>
            <a className="flex flex-1 flex-col items-center justify-center gap-1 group py-1" href="#">
              <div className="text-primary">
                <span className="material-symbols-outlined filled text-[24px]">receipt_long</span>
              </div>
              <span className="text-[10px] font-bold text-primary">Orders</span>
            </a>
            <a className="flex flex-1 flex-col items-center justify-center gap-1 group py-1" href="#">
              <div className="text-slate-400 group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[24px]">favorite</span>
              </div>
              <span className="text-[10px] font-medium text-slate-400 group-hover:text-primary">Saved</span>
            </a>
            <a className="flex flex-1 flex-col items-center justify-center gap-1 group py-1" href="#">
              <div className="text-slate-400 group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[24px]">person</span>
              </div>
              <span className="text-[10px] font-medium text-slate-400 group-hover:text-primary">Profile</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

