export function SavebiteEmailVerifiedSuccessScreenScreen() {
  return (
    <>
      <div>
        <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 w-full max-w-md mx-auto">
          <div className="mb-6 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/10 rounded-full scale-150 animate-pulse" />
            <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-primary/20 text-primary">
              <span className="material-symbols-outlined text-6xl font-bold">check_circle</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-center max-w-[320px]">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Email verified!
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-medium leading-relaxed">
              Your account has been successfully activated. You can now start discovering surplus food near you.
            </p>
          </div>
        </main>
        <footer className="flex-none px-6 pb-8 pt-4 w-full max-w-md mx-auto bg-white dark:bg-surface-dark">
          <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary h-14 px-6 text-white text-lg font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform duration-100 hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/30">
            <span>Explore nearby food</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </footer>
      </div>
    </>
  );
}

