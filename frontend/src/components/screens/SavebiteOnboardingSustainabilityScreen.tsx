export function SavebiteOnboardingSustainabilityScreen() {
  return (
    <>
      <div className="relative w-full h-full max-w-md mx-auto bg-white dark:bg-surface-dark shadow-2xl overflow-hidden flex flex-col justify-between">
        <div className="flex justify-end items-center px-6 pt-12 pb-4 z-10 w-full mt-safe-top">
          <button className="text-slate-500 opacity-60 hover:opacity-100 hover:text-primary dark:text-slate-400 font-medium text-base transition-all duration-200">
            Skip
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-8 pb-8">
          <div className="relative w-full aspect-square max-w-[320px] mb-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl transform scale-90" />
            <div className="relative w-full h-full flex items-center justify-center z-10 transform hover:scale-105 transition-transform duration-500 ease-in-out">
              <svg className="w-full h-full" fill="none" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                <circle className="fill-primary/5 dark:fill-primary/10" cx={200} cy={200} r={160} />
                <path className="fill-primary/20" d="M120 280 C120 280 150 240 200 240 C250 240 280 280 280 280 L120 280 Z" />
                <g transform="translate(200, 260)">
                  <path d="M0 0 L0 -100" stroke="#10b981" strokeLinecap="round" strokeWidth={8} />
                  <path d="M0 -60 Q-40 -80 -50 -40 Q-40 -20 0 -40 Z" fill="#34d399" />
                  <path d="M0 -80 Q40 -100 50 -60 Q40 -40 0 -60 Z" fill="#10b981" />
                  <path d="M0 -100 Q-20 -130 0 -150 Q20 -130 0 -100 Z" fill="#059669" />
                </g>
                <circle className="fill-primary/40 animate-pulse" cx={100} cy={150} r={8} style={{animationDuration: '3s'}} />
                <circle className="fill-primary/30 animate-pulse" cx={300} cy={120} r={12} style={{animationDuration: '4s'}} />
                <circle className="fill-primary/20" cx={280} cy={250} r={6} />
              </svg>
            </div>
          </div>
          <div className="text-center max-w-xs mx-auto space-y-4">
            <h1 className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold leading-tight">
              Reduce food waste.
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-relaxed">
              Every rescued meal reduces waste and lowers emissions.
            </p>
          </div>
        </div>
        <div className="w-full px-8 pb-12 pt-4 flex flex-col gap-8 items-center mb-safe-bottom">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors" />
            <div className="h-2.5 w-8 rounded-full bg-primary shadow-sm shadow-primary/30 transition-all duration-300" />
            <div className="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors" />
          </div>
          <button className="w-full group bg-primary hover:bg-primary-dark active:scale-[0.98] text-white py-4 rounded-2xl font-semibold text-lg shadow-lg shadow-primary/25 transition-all duration-200 flex items-center justify-center gap-2">
            Continue
          </button>
        </div>
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/5 to-transparent -z-10 pointer-events-none" />
      </div>
    </>
  );
}

