export function OrderDetailCompletedWithImpactScreen() {
  return (
    <>
      <div className="w-full max-w-md bg-background-light dark:bg-surface-dark flex flex-col h-screen relative overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-surface-light dark:bg-surface-dark shadow-sm z-10">
          <button className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined text-text-main-light dark:text-text-main-dark">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold text-center flex-1 pr-10">Order Details</h1>
        </div>
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="p-4">
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center gap-3 border border-gray-100 dark:border-gray-800">
              <div className="relative mb-1 group">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl transform scale-110 group-hover:scale-125 transition-transform duration-700" />
                <div className="relative w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-soft">
                  <span className="material-symbols-outlined text-white text-[40px] font-bold">check</span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-text-main-light dark:text-text-main-dark">Order Completed</h2>
              <p className="text-text-sub-light dark:text-text-sub-dark font-medium">Picked up today at 5:12 PM</p>
            </div>
          </div>
          <div className="px-4 pb-4">
            <div className="relative overflow-hidden bg-primary/5 dark:bg-primary/10 border border-primary/10 rounded-xl p-5">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary-dark dark:text-primary filled text-[20px]">eco</span>
                  <h4 className="text-xs font-bold text-primary-dark dark:text-primary uppercase tracking-wider">Your Impact</h4>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between border-b border-primary/10 pb-3 last:border-0 last:pb-0 border-dashed">
                    <span className="text-sm font-medium text-text-sub-light dark:text-text-sub-dark">Food saved</span>
                    <span className="text-lg font-extrabold text-text-main-light dark:text-text-main-dark text-right">1.2 kg</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-medium text-text-sub-light dark:text-text-sub-dark">COâ‚‚ avoided</span>
                    <span className="text-lg font-extrabold text-text-main-light dark:text-text-main-dark text-right">2.4 kg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 pb-4">
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 shadow-sm flex items-start gap-4 border border-gray-100 dark:border-gray-800">
              <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0 bg-cover bg-center" data-alt="Fresh bakery storefront display" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBeC4tX_BiA9ttwlC9kUMUfRbIR95HPB2xz22f8Iz7G8QJoUCH649kdUZifPb2VpmMbyjHFBws8b12W77Is-s6ldHqaKLL5J4BNbxhwkgbXKKLBnneOrgb_bA2u3gpyiglzQN_5nP82UkIJKQXFz85Ec-OlfPXMLqxCGncZHWaFTp-lZnxnSSIdMr_EgZVGtTyNe7Yk5fmksTi8I0ywO52Tx9NOJevrLIe7dlPcSMfg-lcJzkAb3IRQ3AJoE0waweXmMADpIvSp5RWh")'}} />
              <div className="flex-1">
                <h3 className="font-bold text-lg text-text-main-light dark:text-text-main-dark">Sweet Delights Bakery</h3>
                <p className="text-text-sub-light dark:text-text-sub-dark text-sm mt-1">123 Market Street, Downtown</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs bg-primary/10 text-primary-dark px-2 py-0.5 rounded font-medium">Pastry</span>
                  <span className="text-xs text-text-sub-light dark:text-text-sub-dark">â€¢ Order #2891</span>
                </div>
              </div>
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-primary">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
          <div className="px-4 pb-6">
            <h3 className="text-lg font-bold mb-3 px-1">Receipt Breakdown</h3>
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between py-2">
                <span className="text-text-sub-light dark:text-text-sub-dark">Subtotal</span>
                <span className="font-medium">$12.50</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-text-sub-light dark:text-text-sub-dark">Tax</span>
                <span className="font-medium">$1.00</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-text-sub-light dark:text-text-sub-dark">Service fee</span>
                <span className="font-medium">$0.50</span>
              </div>
              <div className="flex justify-between py-4">
                <span className="font-bold text-lg">Total Paid</span>
                <span className="font-bold text-lg text-primary-dark dark:text-primary">$14.00</span>
              </div>
            </div>
          </div>
          <div className="px-4 flex flex-col gap-3">
            <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 text-[15px]">
              <span className="material-symbols-outlined filled text-[20px]">star</span>
              Rate This Store
            </button>
            <button className="w-full bg-transparent border border-gray-200 dark:border-gray-700 text-text-main-light dark:text-text-main-dark hover:bg-gray-50 dark:hover:bg-white/5 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm text-[15px]">
              <span className="material-symbols-outlined">storefront</span>
              Browse More Deals
            </button>
          </div>
          <div className="h-8" />
        </div>
        <div className="bg-surface-light dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800 px-4 pb-safe pt-2 absolute bottom-0 w-full z-20">
          <div className="flex justify-between items-end h-16 pb-2">
            <a className="flex flex-1 flex-col items-center justify-end gap-1 text-text-sub-light dark:text-text-sub-dark hover:text-primary transition-colors group" href="#">
              <span className="material-symbols-outlined text-2xl group-hover:text-primary transition-colors">home</span>
              <p className="text-[10px] font-medium leading-normal tracking-wide">Home</p>
            </a>
            <a className="flex flex-1 flex-col items-center justify-end gap-1 text-text-sub-light dark:text-text-sub-dark hover:text-primary transition-colors group" href="#">
              <span className="material-symbols-outlined text-2xl group-hover:text-primary transition-colors">search</span>
              <p className="text-[10px] font-medium leading-normal tracking-wide">Search</p>
            </a>
            <a className="flex flex-1 flex-col items-center justify-end gap-1 text-primary-dark dark:text-primary font-semibold" href="#">
              <span className="material-symbols-outlined text-2xl filled">receipt_long</span>
              <p className="text-[10px] font-medium leading-normal tracking-wide">Orders</p>
            </a>
            <a className="flex flex-1 flex-col items-center justify-end gap-1 text-text-sub-light dark:text-text-sub-dark hover:text-primary transition-colors group" href="#">
              <span className="material-symbols-outlined text-2xl group-hover:text-primary transition-colors">bookmark</span>
              <p className="text-[10px] font-medium leading-normal tracking-wide">Saved</p>
            </a>
            <a className="flex flex-1 flex-col items-center justify-end gap-1 text-text-sub-light dark:text-text-sub-dark hover:text-primary transition-colors group" href="#">
              <span className="material-symbols-outlined text-2xl group-hover:text-primary transition-colors">person</span>
              <p className="text-[10px] font-medium leading-normal tracking-wide">Profile</p>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

