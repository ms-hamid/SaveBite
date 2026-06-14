export function SavebiteOrdersCompletedStateScreen() {
  return (
    <>
      <div className="relative flex h-full w-full max-w-md flex-col bg-white dark:bg-surface-dark overflow-hidden shadow-xl sm:rounded-xl">
        <header className="flex flex-col px-4 pt-[24px] pb-4 bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-0">
            <h1 className="text-[32px] font-bold tracking-tight text-slate-900 dark:text-white leading-none">Orders</h1>
            <button className="h-[40px] w-[40px] rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20 transition-colors">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>
          <div className="flex p-1 bg-slate-100 dark:bg-white/5 rounded-lg mt-[16px]">
            <button className="flex-1 py-1.5 px-3 text-sm font-medium text-slate-500 dark:text-slate-400 rounded-md transition-colors hover:text-slate-700 dark:hover:text-slate-200">
              Upcoming
            </button>
            <button className="flex-1 py-1.5 px-3 text-sm font-bold text-primary bg-white dark:bg-white/10 shadow-sm rounded-md ring-1 ring-black/5 dark:ring-white/10">
              Completed
            </button>
            <button className="flex-1 py-1.5 px-3 text-sm font-medium text-slate-500 dark:text-slate-400 rounded-md transition-colors hover:text-slate-700 dark:hover:text-slate-200">
              Cancelled
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-4 scrollbar-hide bg-slate-50 dark:bg-[#0d1c17]">
          <div className="group bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-3">
                <div className="h-14 w-14 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                  <img alt="Fresh artisan bread loaf" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCq5qkW3Z-EcdMlezYegEqT3WuM9jNtjyol_KHNtDwV-B4bNivBadpsMCIST_gb18cmk1bE_--3f7T7iZ45Boz9U3hE-EaHDBxsi_drKzd_-37wn5u6NSyGiYKvkS3CnIrapv0QeX9nubCwG-LDPzQXsP4NhjtQEH7iJzqO0W7cSCSLLxg2oY4IDY-H3vyWZ0eVzG1q3D2hCFR8UJGL5vbB8DqK6bnVaxqqyIS8-BRCGdeFptli-7PZGn66d0IiqPjABZEUqK7YFkQr" />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight">The Daily Knead</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Artisan Bread Bag</p>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mt-0.5">#SB-1043</span>
                </div>
              </div>
              <div className="text-right pt-1 flex flex-col items-end gap-1">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Oct 12</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5 mt-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 w-fit">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Completed</span>
              </div>
              <button className="px-3.5 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 active:bg-primary/25 transition-colors">
                Order again
              </button>
            </div>
          </div>
          <div className="group bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-3">
                <div className="h-14 w-14 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                  <img alt="Assorted sushi platter box" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAU-8NOLu--MZbFuN2Ri4Hh3foLwMA0vA4J7FQAIEbqznZNXDuZ10hXSuv5-s8A2JsS04FY5yp0JAuIaK980ziTEJv5ntDEtvMjS9wmTZAft2t468OdMXkK0yeobuVssY-y3z4LuVLERVFY-gBCOHrTgbb0hmWjpp12ELxrawyBqpkX7X8sizSlVCoF0Pg2FfaOn_IVZ1D0oQUi7o4MY8HvUyLAqrVIXipg_XImWCneOCYZsFOW9nanwvBbAAmI_fBuj2jzqWEjY0BD" />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight">Ocean Blue Fish Market</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Sushi Surprise Box</p>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mt-0.5">#SB-1029</span>
                </div>
              </div>
              <div className="text-right pt-1 flex flex-col items-end gap-1">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Oct 08</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5 mt-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 w-fit">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Completed</span>
              </div>
              <button className="px-3.5 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 active:bg-primary/25 transition-colors">
                Order again
              </button>
            </div>
          </div>
          <div className="group bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-3">
                <div className="h-14 w-14 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                  <img alt="Gourmet cupcake selection" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsyKWJhn3Kt-lfQg_DYL2X-fGEuUv9eynMLdXcsZ8JNdiHvWTjNV-2vrFw1R19TAdh4_PYq37VL1dDwsKuHTPcjf5gL-0oOtMfAluTHhiBtiOAk9BNA18_AwBti0Sdtg45IUgizBkX1rLigVyAgKQYC6LT4VrblRPbY3kOf0tVOi1YBnpxglJ21Ko9aYaNwbp2m96W91dra0CHPofyA0jTIiEVnjZOoYVPeSoCTBLq-r1MBWBKYujjM7rUn1vTN0uvkkawrnCoaYzI" />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight">Sugar Rush Bakery</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Sweet Tooth Pack</p>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mt-0.5">#SB-0982</span>
                </div>
              </div>
              <div className="text-right pt-1 flex flex-col items-end gap-1">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Sep 28</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5 mt-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 w-fit">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Completed</span>
              </div>
              <button className="px-3.5 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 active:bg-primary/25 transition-colors">
                Order again
              </button>
            </div>
          </div>
          <div className="group bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-3">
                <div className="h-14 w-14 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                  <img alt="Vegetable medley grocery box" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuClfSR8d_G0vTs5F7cMOEGFzwmlV3_PRKcS81aC5SvrcK59GP2AdpJX3laNY0l2PPfyqNErwchSdimVvJmvGtAVeJtOtjTPXF2EyFOinMhQIwUMFfX1vztThY11R1b-UKeQgSxrXEW2KfH1t_oPQTFHQd1QeD41CbL_wSiAIlsEFHlo6PgQv5xtYLMUJ4kSG2DQUB4hhUm9XECq0V2xbY7onxDGkeNiNGLDTn_kTYNOd_No6uyR94C6u4b-3NxzKefQHJev3P9Eqy5P" />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight">Green Fields Grocer</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Veggie Rescue Box</p>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mt-0.5">#SB-0855</span>
                </div>
              </div>
              <div className="text-right pt-1 flex flex-col items-end gap-1">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Sep 15</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5 mt-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 w-fit">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Completed</span>
              </div>
              <button className="px-3.5 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 active:bg-primary/25 transition-colors">
                Order again
              </button>
            </div>
          </div>
        </main>
        <nav className="flex-none bg-white dark:bg-surface-dark border-t border-slate-200 dark:border-white/10 px-4 pb-6 pt-3">
          <div className="flex justify-between items-center">
            <a className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors" href="#">
              <span className="material-symbols-outlined text-[24px]">home</span>
              <p className="text-[10px] font-medium leading-none">Home</p>
            </a>
            <a className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors" href="#">
              <span className="material-symbols-outlined text-[24px]">search</span>
              <p className="text-[10px] font-medium leading-none">Search</p>
            </a>
            <a className="flex flex-1 flex-col items-center justify-center gap-1 text-primary" href="#">
              <span className="material-symbols-outlined text-[24px] fill-current" style={{fontVariationSettings: '"FILL" 1'}}>receipt_long</span>
              <p className="text-[10px] font-bold leading-none">Orders</p>
            </a>
            <a className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors" href="#">
              <span className="material-symbols-outlined text-[24px]">bookmark</span>
              <p className="text-[10px] font-medium leading-none">Saved</p>
            </a>
            <a className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors" href="#">
              <span className="material-symbols-outlined text-[24px]">account_circle</span>
              <p className="text-[10px] font-medium leading-none">Profile</p>
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}

