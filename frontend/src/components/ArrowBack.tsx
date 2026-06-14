"use client";

import { useRouter } from "next/navigation";

type ArrowProps = {
  back_url? : string;
  title?: string;
  back_function?: () => void | undefined;
}

export default function ArrowBack({back_url="", title, back_function} : ArrowProps) {
    
    const route = useRouter();

    let back_to;

    if (back_url !== "") {
      back_to = () => { route.push(back_url)};
    }else if (back_function !== undefined) {
      back_to = () => { back_function() }
    }else{
      back_to = () => { window.history.back() }
    }

    return <>
        <div className="flex items-center px-4 pt-4 pb-2 justify-between sticky top-0 bg-white dark:bg-surface-dark z-40">
          <button onClick={back_to} aria-label="Go back" className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>

          <h1></h1>
        </div>
    </>
}