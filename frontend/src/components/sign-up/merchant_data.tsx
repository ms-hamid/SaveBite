"use client";

import { useState } from "react";

export default function MerchantRegisterPage() {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display antialiased text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">

      {/* Mobile Constraint Container */}
      <div className="relative flex flex-col w-full max-w-md mx-auto min-h-screen bg-white dark:bg-background-dark shadow-sm">

        {/* Header / Progress Area */}
        <div className="flex items-center px-4 pt-4 pb-2 justify-between sticky top-0 bg-white dark:bg-background-dark z-50">

          <button
            aria-label="Go back"
            className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors -ml-2"
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">
              arrow_back
            </span>
          </button>
        </div>

        {/* Main Content Canvas */}
        <main className="flex-1 px-6 pb-6 pt-4 flex flex-col z-10 overflow-y-auto">

          {/* Progress */}
          <div className="mb-6 mt-2">

            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-400">
                Step 2 of 4
              </span>

              <span className="text-xs font-semibold text-primary">
                Account
              </span>
            </div>

            <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full w-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-1/2"></div>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="tracking-tight text-[32px] font-bold leading-tight text-slate-900 dark:text-white mb-2">
              Create your merchant account
            </h1>

            <p className="text-base font-normal leading-normal text-slate-500 dark:text-slate-400">
              Start selling surplus food
            </p>
          </div>

          {/* Registration Form */}
          <form
            action="#"
            method="POST"
            className="flex flex-col gap-5"
          >

            {/* Full Name */}
            <div className="flex flex-col gap-2">

              <label
                htmlFor="fullName"
                className="text-slate-900 dark:text-white text-sm font-semibold leading-normal"
              >
                Full Name
              </label>

              <div className="relative">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  defaultValue="Jane Doe"
                  placeholder="e.g. Jane Doe"
                  className="form-input flex w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary/50 h-14 placeholder:text-slate-400 px-4 text-base font-normal leading-normal transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">

              <label
                htmlFor="email"
                className="text-slate-900 dark:text-white text-sm font-semibold leading-normal"
              >
                Email
              </label>

              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  defaultValue="invalid-email"
                  placeholder="merchant@example.com"
                  className="form-input flex w-full rounded-xl border border-error bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-error focus:ring-1 focus:ring-error/50 h-14 placeholder:text-slate-400 px-4 text-base font-normal leading-normal transition-all"
                />
              </div>

              <p className="text-error text-xs font-normal px-1">
                Please enter a valid email address.
              </p>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">

              <label
                htmlFor="password"
                className="text-slate-900 dark:text-white text-sm font-semibold leading-normal"
              >
                Password
              </label>

              <div className="relative">

                <input
                  id="password"
                  name="password"
                  required
                  placeholder="Create a strong password"
                  type={showPassword ? "text" : "password"}
                  className="form-input flex w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary/50 h-14 placeholder:text-slate-400 pl-4 pr-12 text-base font-normal leading-normal transition-all"
                />

                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-full px-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>

              <p className="text-slate-400 dark:text-slate-500 text-xs font-normal px-1">
                Use at least 8 characters including a number
              </p>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">

              <label
                htmlFor="confirmPassword"
                className="text-slate-900 dark:text-white text-sm font-semibold leading-normal"
              >
                Confirm Password
              </label>

              <div className="relative">

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  placeholder="Repeat your password"
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-input flex w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary/50 h-14 placeholder:text-slate-400 pl-4 pr-12 text-base font-normal leading-normal transition-all"
                />

                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-0 top-0 h-full px-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showConfirmPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 pb-4 flex flex-col gap-4 mt-auto">

              <button
                type="submit"
                className="w-full h-14 bg-primary text-white font-bold text-base rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-sm hover:shadow-md"
              >
                Continue
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="flex items-end justify-center py-4">

            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
              Already have an account?

              <a
                href="#"
                className="text-primary hover:text-primary/80 font-bold ml-1 hover:underline"
              >
                Sign In
              </a>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}