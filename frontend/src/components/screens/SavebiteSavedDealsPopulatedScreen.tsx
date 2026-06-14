export function SavebiteSavedDealsPopulatedScreen() {
  return (
    <>
      <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden max-w-md mx-auto bg-white dark:bg-surface-dark shadow-2xl">
        <header className="sticky top-0 z-10 flex items-center justify-between bg-white/95 dark:bg-surface-dark/95 px-4 pt-4 pb-2 backdrop-blur-md border-b border-slate-100 dark:border-gray-800">
          <div className="w-8" />
          <h2 className="text-base font-bold text-center text-slate-900 dark:text-white">Saved</h2>
          <div className="w-8 flex justify-end" />
        </header>
        <main className="flex-1 overflow-y-auto scrollbar-hide pb-24 px-4 pt-4 space-y-4">
          <div className="group relative flex flex-col gap-2">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800 shadow-sm">
              <img alt="Fresh bakery assortment in a basket" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMMffwUlXgIkSwtlpH4O6QI1arOLB9l2ShPzr0T0tjbZCx6VFxL0Xp-m3fe8m3gZlRyLDrr0F2U9-DMjDKHfJtYslUtDex3tV5kLBX5EsKmgtXeS8v3pxgTlTlIR5Pxw7p0HwNITzefmmGTChP_fVKrimylK5TbIU-_CtUqVxAR7kzVTaiXIjiQzWaB45Jm46XlFFVkJc5NMZFHRx_cz-bhPKIL1Du1SebnIIRS8lyp_WPN9cnhClRNqYj5a63eA1eBWRIwG-8XCiw" />
              <div className="absolute left-2 top-2 flex gap-1.5">
                <span className="inline-flex items-center rounded bg-primary/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm">
                  Save 60%
                </span>
                <span className="inline-flex items-center rounded bg-white/70 dark:bg-black/50 px-2 py-0.5 text-[10px] font-bold text-slate-800 dark:text-white shadow-sm backdrop-blur-sm">
                  3 left
                </span>
              </div>
              <button className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm transition active:scale-90 tap-target-44">
                <span className="material-symbols-outlined material-fill-1 text-[18px] text-primary">favorite</span>
              </button>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-baseline">
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight truncate pr-2">Surprise Bag - Bakery</h3>
                <div className="flex items-baseline gap-1.5 shrink-0">
                  <span className="text-xs text-slate-400 line-through decoration-slate-400">$15.00</span>
                  <span className="text-base font-extrabold text-primary">$5.99</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="material-symbols-outlined text-[14px]">storefront</span>
                <span className="truncate">Golden Crust Bakery</span>
                <span className="mx-0.5 text-slate-300">•</span>
                <span>1.2 km</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                <span className="inline-flex items-center rounded bg-orange-50 dark:bg-orange-900/20 px-1.5 py-0.5 text-[10px] font-semibold text-orange-700 dark:text-orange-300 border border-orange-100 dark:border-orange-800/30">
                  <span className="material-symbols-outlined mr-0.5 text-[12px]">timer</span>
                  Ends in 45 min
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Pickup 4:30 PM - 5:30 PM</span>
              </div>
            </div>
          </div>
          <div className="group relative flex flex-col gap-2">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800 shadow-sm">
              <img alt="Colorful sushi platter on a dark table" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuTYeUsGff3ih2EUVzKkojvbmWnp__cRf7wA6U5TeNyC_iAB-CbS8ZS54voiL-S7oUSOwqTd3RXoIvrVeO5v2ivQFJ7bZpqL2NKCNZjxCMPACUS6Ux-DVqe0g9Tcu6bBnbs0XpF2W3nJ9RkL_6WmQEV8SUwbYDXo-_VfMPcCOiApH8xQubUR3PaSk80u1g5QoVC8cv-mAi7wxKrK6i8ZPphnhqSVy16ZLDWpGj1Zr2oV_O6gsvwcZCbu8Tv6565RDc6qjDpIw24Fl5" />
              <div className="absolute left-2 top-2 flex gap-1.5">
                <span className="inline-flex items-center rounded bg-primary/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm">
                  Save 50%
                </span>
                <span className="inline-flex items-center rounded bg-white/70 dark:bg-black/50 px-2 py-0.5 text-[10px] font-bold text-slate-800 dark:text-white shadow-sm backdrop-blur-sm">
                  1 left
                </span>
              </div>
              <button className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm transition active:scale-90 tap-target-44">
                <span className="material-symbols-outlined material-fill-1 text-[18px] text-primary">favorite</span>
              </button>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-baseline">
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight truncate pr-2">Dinner Box</h3>
                <div className="flex items-baseline gap-1.5 shrink-0">
                  <span className="text-xs text-slate-400 line-through decoration-slate-400">$22.00</span>
                  <span className="text-base font-extrabold text-primary">$11.00</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="material-symbols-outlined text-[14px]">restaurant</span>
                <span className="truncate">Sushi Zen</span>
                <span className="mx-0.5 text-slate-300">•</span>
                <span>0.8 km</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                <span className="inline-flex items-center rounded bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 text-[10px] font-semibold text-red-700 dark:text-red-300 border border-red-100 dark:border-red-800/30">
                  <span className="material-symbols-outlined mr-0.5 text-[12px]">timer</span>
                  Ends in 20 min
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Pickup 5:00 PM - 6:00 PM</span>
              </div>
            </div>
          </div>
          <div className="group relative flex flex-col gap-2">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800 shadow-sm">
              <img alt="Fresh vegetarian pizza slice" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWhWH_1Rbcdl0JnnLyw-1QiAHXD-ZKjvtNRbuDu2LuF9Lgto0KLZhI54xQ2OCo1nW3-tYx59Sejci7XuF12tELYPHuRgiT0dACdlr52TK0rlZ7BEjoCfOppRw4FQBEKytXvzYnA8p-tVhe17Ad67wHY3v5qK4VVo2ytc4xxchRuiKIhtTVI0HOGU2Aw3mLzRa-8xHER8p7BbC2HCw6zGWOWaQusbtjAXLL6i7liiMWyrTbCdwyO26mBIjqTSPuBmddgHNVb-uByB8c" />
              <div className="absolute left-2 top-2 flex gap-1.5">
                <span className="inline-flex items-center rounded bg-primary/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm">
                  Save 40%
                </span>
                <span className="inline-flex items-center rounded bg-white/70 dark:bg-black/50 px-2 py-0.5 text-[10px] font-bold text-slate-800 dark:text-white shadow-sm backdrop-blur-sm">
                  5 left
                </span>
              </div>
              <button className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm transition active:scale-90 tap-target-44">
                <span className="material-symbols-outlined material-fill-1 text-[18px] text-primary">favorite</span>
              </button>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-baseline">
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight truncate pr-2">Vegetarian Pizza Slice</h3>
                <div className="flex items-baseline gap-1.5 shrink-0">
                  <span className="text-xs text-slate-400 line-through decoration-slate-400">$6.50</span>
                  <span className="text-base font-extrabold text-primary">$3.50</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="material-symbols-outlined text-[14px]">local_pizza</span>
                <span className="truncate">Luigi's Pizzeria</span>
                <span className="mx-0.5 text-slate-300">•</span>
                <span>0.5 km</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                <span className="inline-flex items-center rounded bg-orange-50 dark:bg-orange-900/20 px-1.5 py-0.5 text-[10px] font-semibold text-orange-700 dark:text-orange-300 border border-orange-100 dark:border-orange-800/30">
                  <span className="material-symbols-outlined mr-0.5 text-[12px]">timer</span>
                  Ends in 1 h 15 min
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Pickup 3:00 PM - 4:00 PM</span>
              </div>
            </div>
          </div>
          <div className="group relative flex flex-col gap-2">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800 shadow-sm">
              <img alt="Fresh organic grocery produce bag" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDafzpMTeS5wtbxVOtoFRW3iC-R7PVjen3tl9DITYvJhdWkk54AJpfBN-nkBI2HAn-z8Mv0lVNPDMmXu-iQveu_P-5BS-Al5I42UC9pq6P191gM1YtKpj40EOyw0sIbs_uqOuvBjnaaAHblQCOSLleUVUXMSBtnBoSznGtusZtj92p0Gu9D15vQyQWCKXInoUkFAaH_qFnsoxKLIp40yrkWRdOpITn7RMnuRmU8GC_7Uz_0W6vCdVKRZamwVF3vw0qq8DmmVbB8FA55" />
              <div className="absolute left-2 top-2 flex gap-1.5">
                <span className="inline-flex items-center rounded bg-primary/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm">
                  Save 70%
                </span>
                <span className="inline-flex items-center rounded bg-white/70 dark:bg-black/50 px-2 py-0.5 text-[10px] font-bold text-slate-800 dark:text-white shadow-sm backdrop-blur-sm">
                  2 left
                </span>
              </div>
              <button className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm transition active:scale-90 tap-target-44">
                <span className="material-symbols-outlined material-fill-1 text-[18px] text-primary">favorite</span>
              </button>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-baseline">
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight truncate pr-2">Grocery Mystery Bag</h3>
                <div className="flex items-baseline gap-1.5 shrink-0">
                  <span className="text-xs text-slate-400 line-through decoration-slate-400">$30.00</span>
                  <span className="text-base font-extrabold text-primary">$8.99</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="material-symbols-outlined text-[14px]">store</span>
                <span className="truncate">Green Valley Market</span>
                <span className="mx-0.5 text-slate-300">•</span>
                <span>2.1 km</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                <span className="inline-flex items-center rounded bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 text-[10px] font-semibold text-yellow-800 dark:text-yellow-300 border border-yellow-100 dark:border-yellow-800/30">
                  <span className="material-symbols-outlined mr-0.5 text-[12px]">timer</span>
                  Ends in 3 h
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Pickup 6:00 PM - 8:00 PM</span>
              </div>
            </div>
          </div>
        </main>
        <nav className="absolute bottom-0 left-0 right-0 z-20 border-t border-slate-200 dark:border-gray-800 bg-white dark:bg-surface-dark pb-safe pt-2">
          <div className="flex justify-between px-2 pb-5 pt-2">
            <a className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200" href="#">
              <span className="material-symbols-outlined text-[24px]">home</span>
              <span className="text-[10px] font-medium leading-none">Home</span>
            </a>
            <a className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200" href="#">
              <span className="material-symbols-outlined text-[24px]">search</span>
              <span className="text-[10px] font-medium leading-none">Search</span>
            </a>
            <a className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200" href="#">
              <span className="material-symbols-outlined text-[24px]">receipt_long</span>
              <span className="text-[10px] font-medium leading-none">Orders</span>
            </a>
            <a className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200" href="#">
              <span className="material-symbols-outlined text-[24px]">eco</span>
              <span className="text-[10px] font-medium leading-none">Impact</span>
            </a>
            <a className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200" href="#">
              <span className="material-symbols-outlined text-[24px]">account_circle</span>
              <span className="text-[10px] font-medium leading-none">Profile</span>
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}

