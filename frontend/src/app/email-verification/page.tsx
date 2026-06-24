"use client";

import { resend_email_verif } from "@/services/auth";
import { useEffect, useState } from "react";

export default function EmailVerificationPage() {
  const [countdown, setCountdown] = useState(10);
  const [canResend, setCanResend] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [email, set_email] = useState("");

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    const verification_email = localStorage.getItem("verification_email");

    set_email(verification_email || "")
  });
  
  async function handleResendEmail() {
    // TODO: API resend verification email
    // console.log(resend_email_verif(email ?? "code67717@gmail.com"))
    console.log(email);

    console.log(await resend_email_verif(email));

    

    setShowSuccess(true);
    setCanResend(false);
    setCountdown(10);

    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  }

  return (
    <>

        <div className="flex-1 flex flex-col h-screen justify-center px-6 w-full max-w-md mx-auto bg-white">
          <div className="@container w-full mb-8 flex justify-center">
            <div className="relative flex items-center justify-center w-32 h-32 rounded-full bg-emerald-50 dark:bg-emerald-900/20">
              <span
                className="material-symbols-outlined text-primary"
                style={{ fontSize: 64 }}
              >
                mail
              </span>

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
                <span className="font-bold text-slate-900 dark:text-white">
                  {email}
                </span>
              </p>

              <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">
                Please verify your email address to activate your account.
              </p>
            </div>
          </div>

          {showSuccess && (
            <div className="w-full mb-8 flex justify-center animate-fade-in-up">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50/60 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium rounded-full border border-emerald-100/80 dark:border-emerald-800">
                <span
                  className="material-symbols-outlined text-base fill-1"
                  style={{ fontVariationSettings: '"FILL" 1' }}
                >
                  check_circle
                </span>

                Verification email sent again.
              </div>
            </div>
          )}

          <div className="w-full">
            <a href={`https://mail.google.com/`} className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-12 rounded-lg flex items-center justify-center transition-all active:scale-[0.98] shadow-sm shadow-emerald-200 dark:shadow-none">
              Open Email App
            </a>
          </div>

          <div className="w-full mt-8 space-y-8 flex flex-col items-center">
            <div className="text-center">
              {!canResend ? (
                <span className="text-slate-400 dark:text-slate-500 font-medium text-sm select-none">
                  You can resend in{" "}
                  <span className="font-bold text-slate-500 dark:text-slate-400">
                    {countdown} s
                  </span>
                </span>
              ) : (
                <button
                  onClick={handleResendEmail}
                  className="text-primary hover:text-primary/80 font-semibold text-sm transition-colors"
                >
                  Resend verification email
                </button>
              )}
            </div>

            <a href="/sign-up" className="text-slate-400 dark:text-slate-500 text-xs hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              Wrong email?
              <span className="text-primary hover:text-primary-dark ml-1">
                Change email address
              </span>
            </a>
          </div>
      </div>
    </>
  );
}