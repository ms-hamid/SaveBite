"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type ArrowProps = {
  back_url? : string;
  title?: string;
  back_function?: () => void | undefined;
}

export default function TopNavBack({back_url="", title, back_function} : ArrowProps) {
    
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
        <header
            className="fixed top-0 w-full max-w-[448px] z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 flex justify-between items-center h-16 px-5 mx-auto">
            <div className="flex items-center gap-3">
                <button
                    onClick={back_to}
                    className="text-slate-600 hover:bg-slate-50 active:scale-95 transition-transform p-2 -ml-2 rounded-full">
                    <span className="material-symbols-outlined" data-icon="arrow_back">arrow_back</span>
                </button>
                <h1 className="font-semibold text-lg text-slate-900 tracking-tight">{title}</h1>
            </div>
            <Link
                href={'/m/order'}
                className="text-slate-600 hover:bg-slate-50 transition-colors active:scale-95 duration-200 p-2 -mr-2 rounded-full relative">
                <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
            </Link>
        </header>   
    </>
}