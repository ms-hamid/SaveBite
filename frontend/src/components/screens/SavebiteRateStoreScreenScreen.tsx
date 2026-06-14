export function SavebiteRateStoreScreenScreen() {
  return (
    <>
      <div className="w-full max-w-md bg-white dark:bg-surface-dark h-full min-h-screen flex flex-col relative overflow-hidden shadow-2xl mx-auto">
        <header className="flex items-center justify-between px-4 py-4 pt-12 sticky top-0 z-10 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-sm">
          <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-800 dark:text-slate-200">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold tracking-tight text-center flex-1 pr-10">Rate Store</h1>
        </header>
        <main className="flex-1 overflow-y-auto px-6 pb-32 no-scrollbar">
          <div className="mt-4 bg-white dark:bg-[#152a23] border border-slate-100 dark:border-slate-800 rounded-xl p-2.5 shadow-sm flex items-center gap-4">
            <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700">
              <img alt="Fresh artisanal bread and pastries" className="w-full h-full object-cover" data-alt="Close up of bakery bread" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAscWpzkyH--AQNqXQhCA8RaP4keRWRQBnBV4Ry5HgDH5EpVRPcxUf6Dli0Jooif6n7apoof-LTlayfhCgfq8X9zdZg_ynsCO6TaKYzKJC8qeo8LX3zNlEDVeSOFuKUqIqu2-hyWX91zFFbhz-MPiJqtGcZEveKofawGvHUh0SY6-hydJJ8Zas-gd3jybzEFjfeOHchAlL8J2UQmfyTMdCupqVKlozrXXEbC4gkaqEJTO8Rf-DLDHloQCEs5DkIW-JOcloeWMDmJoVF" />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <h3 className="text-slate-900 dark:text-slate-100 font-bold text-base truncate">Green Leaf Bakery</h3>
              <p className="text-primary text-sm font-medium mt-0.5 truncate">Assorted Pastry Surprise Bag</p>
              <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">Today, 2:30 PM</p>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">How was your experience?</h2>
            <div className="flex items-center gap-3 mt-6">
              <button className="group transition-transform active:scale-95 focus:outline-none">
                <span className="material-symbols-outlined text-primary text-[40px] fill-[1]">star</span>
              </button>
              <button className="group transition-transform active:scale-95 focus:outline-none">
                <span className="material-symbols-outlined text-primary text-[40px] fill-[1]">star</span>
              </button>
              <button className="group transition-transform active:scale-95 focus:outline-none">
                <span className="material-symbols-outlined text-primary text-[40px] fill-[1]">star</span>
              </button>
              <button className="group transition-transform active:scale-95 focus:outline-none">
                <span className="material-symbols-outlined text-primary text-[40px] fill-[1]">star</span>
              </button>
              <button className="group transition-transform active:scale-95 focus:outline-none">
                <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-[40px] hover:text-primary transition-colors">star</span>
              </button>
            </div>
            <p className="mt-5 text-primary font-medium text-sm">Good!</p>
          </div>
          <div className="h-6 w-full" />
          <div className="space-y-2">
            <label className="sr-only" htmlFor="review">Write a review</label>
            <div className="relative">
              <textarea className="w-full bg-slate-50 dark:bg-[#152a23] border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-4 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-primary focus:ring-opacity-50 resize-none text-sm leading-relaxed" id="review" placeholder="Share more about your experience (optional)..." rows={4} defaultValue={""} />
              <div className="absolute bottom-3 right-4 text-[10px] font-light text-slate-300 dark:text-slate-600">0/250</div>
            </div>
          </div>
          <div className="mt-6">
            <button className="flex items-center gap-3 w-full p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                <span className="material-symbols-outlined text-xl">add_a_photo</span>
              </div>
              <div className="text-left flex-1">
                <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">Add a photo (optional)</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">Show others what you saved</span>
              </div>
              <div className="flex items-center justify-center h-full">
                <span className="material-symbols-outlined text-slate-400">chevron_right</span>
              </div>
            </button>
          </div>
        </main>
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 z-20">
          <button className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl shadow-md shadow-primary/20 transition-all active:scale-[0.98] mb-6">
            Submit Review
          </button>
          <button className="w-full text-slate-500 dark:text-slate-400 font-medium text-sm hover:text-slate-800 dark:hover:text-slate-200 transition-colors py-2">
            Skip for now
          </button>
        </div>
      </div>
    </>
  );
}

