export function SavebiteOrderPickupqrScreen() {
  return (
    <>
      <div className="w-full max-w-md bg-background-light dark:bg-surface-dark relative flex flex-col h-screen overflow-hidden shadow-2xl">
        <header className="flex items-center gap-4 px-6 pt-12 pb-4 bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 z-10 absolute top-0 left-0 w-full">
          <button className="flex items-center justify-center -ml-2 w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-text-main dark:text-white bg-surface-light/50 dark:bg-surface-dark/50 backdrop-blur-sm">
            <span className="material-symbols-outlined font-bold">close</span>
          </button>
        </header>
        <main className="flex-1 flex flex-col justify-center items-center px-6 relative">
          <div className="w-full max-w-sm mx-auto flex flex-col items-center justify-center mt-12 mb-8">
            <h3 className="text-2xl font-bold text-text-main dark:text-white mb-8 text-center">Show this QR code at pickup</h3>
            <div className="w-64 h-64 bg-white p-4 rounded-3xl shadow-lg border border-gray-100 mb-8 flex items-center justify-center relative overflow-hidden">
              <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=SaveBiteOrderSB1042')] bg-cover bg-center opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/10 pointer-events-none" />
            </div>
            <div className="flex flex-col items-center gap-1 mb-8">
              <p className="text-xs text-text-sub font-bold uppercase tracking-wide">QR expires in</p>
              <div className="text-4xl font-bold text-primary font-mono tracking-tight tabular-nums">02:14:35</div>
            </div>
            <p className="text-[10px] text-neutral-500/85 dark:text-neutral-400/85 mb-8 flex items-center justify-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-[14px] animate-spin">refresh</span>
              QR refreshes automatically every 30s
            </p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-xl text-base flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/20 active:scale-[0.98] transform">
                <span className="material-symbols-outlined text-[20px]">download</span>
                Download QR
              </button>
              <button className="w-full bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-text-main dark:text-white font-bold py-4 px-6 rounded-xl text-base border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2 transition-colors active:scale-[0.98] transform">
                <span className="material-symbols-outlined text-[20px]">ios_share</span>
                Share
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}



