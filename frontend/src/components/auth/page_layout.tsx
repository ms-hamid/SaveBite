"use client";

import ArrowBack from "../ArrowBack";

export default function AuthPageLayout({title, subtitle, back_url="", footer_text, footer_url, footer_button, children }: {title: string, subtitle: string, back_url:string, footer_text: string, footer_url: string, footer_button: string, children: React.ReactNode}) {

  return (
    <>
      <div className="relative flex flex-col w-full max-w-md mx-auto min-h-screen bg-white dark:bg-surface-dark shadow-sm">
        <ArrowBack back_url={back_url} />
        <main className="flex-1 flex flex-col px-6 pb-6 overflow-y-auto">
          <div className="mb-8 mt-2">
            <h1 className="text-slate-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight mb-2">{title}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">{subtitle}</p>
          </div>
          <div className="flex flex-col gap-5">
            {children}
            </div>
          <div className="flex-1 flex items-end justify-center py-6 mt-auto">
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
              {footer_text} <a className="text-primary hover:text-primary/80 font-bold ml-1 hover:underline" href={footer_url}>{footer_button}</a>
            </p>
          </div>
        </main>
      </div>
    </>)
}
