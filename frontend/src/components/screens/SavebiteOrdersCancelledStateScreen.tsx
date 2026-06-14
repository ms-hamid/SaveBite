export function SavebiteOrdersCancelledStateScreen() {
  return (
    <>
      <div className="w-full max-w-md bg-background-light dark:bg-surface-dark flex flex-col h-screen relative overflow-hidden shadow-2xl">
        <header className="pt-[24px] px-6 pb-4 bg-surface-light dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Orders</h1>
          <button className="w-[40px] h-[40px] rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
        </header>
        <div className="px-6 pb-4 bg-surface-light dark:bg-surface-dark z-10 border-b border-slate-100 dark:border-slate-800">
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg relative">
            <button className="flex-1 py-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 rounded-md transition-colors text-center relative z-10">
              Upcoming
            </button>
            <button className="flex-1 py-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 rounded-md transition-colors text-center relative z-10">
              Completed
            </button>
            <button className="flex-1 py-1.5 text-sm font-semibold text-primary dark:text-primary bg-white dark:bg-slate-700 shadow-sm rounded-md transition-all text-center relative z-10 ring-1 ring-black/5 dark:ring-white/10">
              Cancelled
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto hide-scrollbar px-6 py-6 space-y-4 bg-background-light dark:bg-surface-dark">
          <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-start justify-between mb-3">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-xl bg-slate-200 dark:bg-slate-700 bg-cover bg-center shrink-0" data-alt="Fresh vegetables in a basket" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCof9DoThR4aqz8qFuyg_8NdjffixR8Cr3tfDuwBRtzhio4TQpbzcjtMBXmGuVW7W6gd_oynINr3eBMDSMHfn7Arm1tGDH8-O-cuGjPOJCzR5FG1-0hns4NAnpWK6gTrgr5ZM9p1DNRTCb50vkDRRhQ5p9OZ1a001l6jANndEC5PeoTi5OCLuaSjVf23SO3aqT4ruyCPzq304O3FcMtxhSLT42MRN81mtaCfDCEWazzggclvd8_bCuL3LGLCGwivnzbYQfNwdy25M4V")'}} />
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">Daily Market</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Grocery Surplus Box</p>
                </div>
              </div>
              <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/30 px-2.5 py-1 text-[10px] font-bold text-red-600 dark:text-red-400 tracking-wide uppercase">
                Cancelled
              </span>
            </div>
            <div className="flex flex-col gap-1 mb-4">
              <span className="text-xs text-slate-400 dark:text-slate-500">Order #SB-1044</span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Cancelled on Oct 10</span>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                View details
              </button>
              <button className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm hover:bg-primary/90 transition-colors shadow-primary/20">
                Reserve again
              </button>
            </div>
          </div>
          <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-start justify-between mb-3">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-xl bg-slate-200 dark:bg-slate-700 bg-cover bg-center shrink-0" data-alt="Bakery bread and pastries" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDG5EuOxMzPvYJPLrqBD7_eMJvl8IafZT5dzy8hKo3xwWcuX6BaKsFUfOeglEyJSLjZkxtEfW6bAycPL5jEGqAw87G-2hzG2z3daitVg_fro8JEiregAmEy6lS9GT_oBAZ6pXbz9Pza5xqfTRwlCLfFY3MDvuJpbZ9B6AeAp0Q59tEmxHc98iBSKUEmG6iSadOS7H040QLuraOSz48XAY5BDT_rPW7iVlSYSH9OSbShLfelzqhowRPX3qKVXTs3VysiiVeHVJ3vnQ7b")'}} />
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">Main St Bakery</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Bakery Surprise Bag</p>
                </div>
              </div>
              <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/30 px-2.5 py-1 text-[10px] font-bold text-red-600 dark:text-red-400 tracking-wide uppercase">
                Cancelled
              </span>
            </div>
            <div className="flex flex-col gap-1 mb-4">
              <span className="text-xs text-slate-400 dark:text-slate-500">Order #SB-1029</span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Cancelled on Oct 08</span>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                View details
              </button>
              <button className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm hover:bg-primary/90 transition-colors shadow-primary/20">
                Reserve again
              </button>
            </div>
          </div>
          <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-start justify-between mb-3">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-xl bg-slate-200 dark:bg-slate-700 bg-cover bg-center shrink-0" data-alt="Sushi platter assortment" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDmXbipjrSbvo8GrVbrNobJK6ayjO-4jQT3G5SdET0z7XW-Mte_E-EB6w19sROFcN0rUNBJvQiAd7psNQZYxBB86L5jHxQBG0MSdiPPgUJOXF7LbJZ5RS-cHZDu35OY4C9uJXyn6Wkc7wb2XFc7XKnyT3i7QPE3L34toi5msEnF1TnxoeKVX4JWdFO_oRrTNcpFcTtg2Wq2r7TWfnrKKkvEek2QUb5SZBubFFbKRL_q6YHc_zaayWLvW4P8wAQ-dmvjjeWPrN3eyfYE")'}} />
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">Sushi Haven</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Lunch Special Box</p>
                </div>
              </div>
              <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/30 px-2.5 py-1 text-[10px] font-bold text-red-600 dark:text-red-400 tracking-wide uppercase">
                Cancelled
              </span>
            </div>
            <div className="flex flex-col gap-1 mb-4">
              <span className="text-xs text-slate-400 dark:text-slate-500">Order #SB-0992</span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Cancelled on Oct 01</span>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                View details
              </button>
              <button className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm hover:bg-primary/90 transition-colors shadow-primary/20">
                Reserve again
              </button>
            </div>
          </div>
          <div className="h-20" />
        </div>
        <nav className="bg-surface-light dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 px-6 pb-6 pt-3 w-full z-30 shrink-0">
          <div className="flex justify-between items-end">
            <a className="flex flex-1 flex-col items-center justify-center gap-1 group" href="#">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-[24px]">home</span>
              <span className="text-[10px] font-medium text-slate-400 group-hover:text-primary transition-colors">Home</span>
            </a>
            <a className="flex flex-1 flex-col items-center justify-center gap-1 group" href="#">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-[24px]">search</span>
              <span className="text-[10px] font-medium text-slate-400 group-hover:text-primary transition-colors">Search</span>
            </a>
            <a className="flex flex-1 flex-col items-center justify-center gap-1 group" href="#">
              <span className="material-symbols-outlined text-primary font-variation-settings-FILL text-[24px]">receipt_long</span>
              <span className="text-[10px] font-bold text-primary">Orders</span>
            </a>
            <a className="flex flex-1 flex-col items-center justify-center gap-1 group" href="#">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-[24px]">favorite</span>
              <span className="text-[10px] font-medium text-slate-400 group-hover:text-primary transition-colors">Saved</span>
            </a>
            <a className="flex flex-1 flex-col items-center justify-center gap-1 group" href="#">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-[24px]">person</span>
              <span className="text-[10px] font-medium text-slate-400 group-hover:text-primary transition-colors">Profile</span>
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}

