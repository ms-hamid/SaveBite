export function SavebiteConsumerLoginScreen1Screen() {
  

  return (
    <>
      <div className="relative w-full max-w-md h-full min-h-screen flex flex-col bg-background-light dark:bg-surface-dark p-6 sm:p-8">
        <nav className="w-full flex items-center pt-2 pb-6">
          <button aria-label="Go back" className="text-slate-900 dark:text-white p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
        </nav>
        <header className="flex flex-col pb-8">
          <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight mb-2">Welcome back</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Sign in to continue rescuing food.</p>
        </header>
        <div className="flex flex-col gap-5 flex-1">
          <div className="flex flex-col gap-2">
            <label className="text-slate-900 dark:text-white text-sm font-medium" htmlFor="email">Email</label>
            <input className="form-input w-full rounded-lg border border-red-300 dark:border-red-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 h-12 px-4 focus:ring-2 focus:ring-error focus:border-error transition-all outline-none" id="email" placeholder="Enter your email" type="email" defaultValue="jane@example" />
            <span className="text-error text-xs font-medium mt-0.5">Invalid email address</span>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-slate-900 dark:text-white text-sm font-medium" htmlFor="password">Password</label>
            <div className="relative flex items-center">
              <input className="form-input w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 h-12 pl-4 pr-12 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" id="password" placeholder="Enter your password" type="password" />
              <button aria-label="Toggle password visibility" className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">visibility</span>
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <a className="text-primary hover:text-primary-dark dark:hover:text-primary font-medium text-sm transition-colors" href="#">Forgot password?</a>
            </div>
          </div>
          <button className="mt-4 w-full bg-primary/50 cursor-not-allowed text-white h-12 rounded-lg font-semibold text-base shadow-none transition-all flex items-center justify-center" disabled>
            Sign In
          </button>
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-700" />
            <span className="flex-shrink-0 mx-4 text-slate-400 dark:text-slate-500 text-sm">or</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-700" />
          </div>
          <button className="w-full bg-white dark:bg-transparent border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white h-12 rounded-lg font-medium text-base transition-colors flex items-center justify-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
        </div>
        <footer className="mt-auto pt-8 pb-4 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Don't have an account? 
            <a className="text-primary hover:text-primary-dark font-semibold ml-1" href="#">Sign Up</a>
          </p>
        </footer>
      </div>
    </>
  );
}


