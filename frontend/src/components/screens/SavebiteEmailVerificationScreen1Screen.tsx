export function SavebiteEmailVerificationScreen1Screen() {
  return (
    <>
      <div>
        <div className="h-14" />
        <div className="flex-1 flex flex-col items-center justify-center px-6 w-full max-w-md mx-auto">
          <div className="@container w-full mb-8 flex justify-center">
            <div className="relative flex items-center justify-center w-32 h-32 rounded-full bg-emerald-50 dark:bg-emerald-900/20">
              <span className="material-symbols-outlined text-primary" style={{fontSize: 64}}>mail</span>
              <div className="absolute top-2 right-4 w-4 h-4 bg-primary rounded-full border-4 border-background-light dark:border-background-dark" />
            </div>
          </div>
          <div className="text-center w-full space-y-4 mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Check your email
            </h1>
            <div className="space-y-2">
              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                We’ve sent a verification link to <br />
                <span className="font-bold text-slate-900 dark:text-white">alex.smith@example.com</span>
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">
                Please verify your email address to activate your account.
              </p>
            </div>
          </div>
          <div className="w-full mb-8 flex justify-center animate-fade-in-up">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50/60 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium rounded-full border border-emerald-100/80 dark:border-emerald-800">
              <span className="material-symbols-outlined text-base fill-1" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span>
              Verification email sent again.
            </div>
          </div>
          <div className="w-full">
            <button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-12 rounded-lg flex items-center justify-center transition-all active:scale-[0.98] shadow-sm shadow-emerald-200 dark:shadow-none">
              Open Email App
            </button>
          </div>
          <div className="w-full mt-8 space-y-8 flex flex-col items-center">
            <div className="text-center">
              <span className="text-slate-400 dark:text-slate-500 font-medium text-sm cursor-not-allowed select-none">
                You can resend in <span className="font-bold text-slate-500 dark:text-slate-400">30 s</span>
              </span>
            </div>
            <button className="text-slate-400 dark:text-slate-500 text-xs hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              Wrong email? <span className="text-primary hover:text-primary-dark ml-1">Change email address</span>
            </button>
          </div>
        </div>
        <div className="h-12 w-full" />
      </div>
    </>
  );
}
