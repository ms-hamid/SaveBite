export function SavebiteAppSplashScreenScreen() {
  return (
    <>
      <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-white dark:bg-surface-dark p-6">
        <div className="flex flex-col items-center justify-center w-full h-full animate-fade-in">
          <div className="flex flex-col items-center gap-8 mb-12"> 
            <div className="relative flex items-center justify-center">
              <span className="material-symbols-outlined text-[100px] text-primary" style={{fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 48'}}>
                eco
              </span>
              <div className="absolute -z-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl opacity-50" />
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                SaveBite
              </h1>
              <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
                Rescue surplus food near you.
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-16 flex flex-col items-center justify-center w-full">
          <div className="relative h-10 w-10"> 
            <div className="absolute inset-0 h-full w-full rounded-full border-4 border-slate-100 dark:border-slate-800" />
            <div className="absolute inset-0 h-full w-full animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </>
  );
}

