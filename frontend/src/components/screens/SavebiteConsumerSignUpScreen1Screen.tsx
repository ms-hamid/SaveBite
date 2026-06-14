export function SavebiteConsumerSignUpScreen1Screen() {
  return (
    <>
      <div className="relative flex flex-col w-full max-w-md mx-auto min-h-screen bg-white dark:bg-surface-dark shadow-sm">
        <div className="flex items-center px-4 pt-4 pb-2 justify-between sticky top-0 bg-white dark:bg-surface-dark z-10">
          <button aria-label="Go back" className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
        </div>
        <main className="flex-1 flex flex-col px-6 pb-6 overflow-y-auto">
          <div className="mb-8 mt-2">
            <h1 className="text-slate-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight mb-2">Create your account</h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">Join SaveBite and start rescuing food.</p>
          </div>
          <form className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-slate-900 dark:text-white text-sm font-semibold leading-normal" htmlFor="fullName">Full Name</label>
              <input className="form-input flex w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary/50 h-14 placeholder:text-slate-400 px-4 text-base font-normal leading-normal transition-all" id="fullName" placeholder="e.g. Jane Doe" type="text" defaultValue="Alex Smith" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-slate-900 dark:text-white text-sm font-semibold leading-normal" htmlFor="email">Email Address</label>
              <input className="form-input flex w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary/50 h-14 placeholder:text-slate-400 px-4 text-base font-normal leading-normal transition-all" id="email" placeholder="name@example.com" type="email" defaultValue="alex.smith@example.com" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-slate-900 dark:text-white text-sm font-semibold leading-normal" htmlFor="password">Password</label>
              <div className="relative">
                <input className="form-input flex w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary/50 h-14 placeholder:text-slate-400 pl-4 pr-12 text-base font-normal leading-normal transition-all" id="password" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" type="password" defaultValue="Password123" />
                <button className="absolute right-0 top-0 h-full px-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" type="button">
                  <span className="material-symbols-outlined text-[20px]">visibility</span>
                </button>
              </div>
              <p className="text-slate-400 dark:text-slate-500 text-xs font-normal px-1">
                Must be at least 8 characters and contain 1 number.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-slate-900 dark:text-white text-sm font-semibold leading-normal" htmlFor="confirmPassword">Confirm Password</label>
              <div className="relative">
                <input className="form-input flex w-full rounded-xl border border-rose-red bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-rose-red focus:ring-1 focus:ring-rose-red/50 h-14 placeholder:text-slate-400 pl-4 pr-12 text-base font-normal leading-normal transition-all" id="confirmPassword" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" type="password" defaultValue="Password124" />
                <button className="absolute right-0 top-0 h-full px-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" type="button">
                  <span className="material-symbols-outlined text-[20px]">visibility</span>
                </button>
              </div>
              <p className="text-rose-red text-xs font-medium px-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                Passwords do not match
              </p>
            </div>
            <div className="flex items-start gap-3 mt-2">
              <div className="flex items-center h-6">
                <input defaultChecked className="size-5 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-primary checked:bg-primary checked:border-transparent focus:ring-primary focus:ring-offset-0 cursor-pointer" id="terms" type="checkbox" />
              </div>
              <label className="text-sm text-slate-600 dark:text-slate-400 leading-normal pt-0.5" htmlFor="terms">
                I agree to the <a className="text-primary hover:text-primary/80 font-medium hover:underline" href="#">Terms</a> &amp; <a className="text-primary hover:text-primary/80 font-medium hover:underline" href="#">Privacy Policy</a>
              </label>
            </div>
            <div className="pt-4">
              <button className="w-full h-14 bg-primary text-white font-bold text-base rounded-xl transition-all opacity-65 cursor-not-allowed shadow-none" disabled>
                Create Account
              </button>
            </div>
          </form>
          <div className="flex-1 flex items-end justify-center py-6 mt-auto">
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
              Already have an account? <a className="text-primary hover:text-primary/80 font-bold ml-1 hover:underline" href="#">Sign In</a>
            </p>
          </div>
        </main>
      </div>
    </>
  );
}

