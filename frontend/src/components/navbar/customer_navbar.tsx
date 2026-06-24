export default function CustomerNavbar({active_tab = ""} : {active_tab: string}){
    return <>
          <nav className="
            fixed bottom-0 left-1/2 -translate-x-1/2
            w-full max-w-md
            border-t border-slate-100 dark:border-slate-800
            bg-white dark:bg-surface-dark
            pb-6 pt-3 px-2
            z-50 rounded-t-2xl
          ">
          <div className="flex justify-around items-end">
            <a className="flex flex-col items-center gap-1 group w-16" href="/home">
              <span className={`material-symbols-outlined ${active_tab === "home" ? "text-primary font-variation-settings-fill" : "text-slate-400 group-hover:text-primary transition-colors"} text-[24px]`}>home</span>
              <span className={`text-[10px] ${ active_tab === "home" ? "font-bold text-primary" : "font-medium text-slate-400 group-hover:text-primary transition-colors" } `}>Home</span>
            </a>
            <a className="flex flex-col items-center gap-1 group w-16" href="/search">
              <span className={`material-symbols-outlined ${active_tab === "search" ? "text-primary font-variation-settings-fill" : "text-slate-400 group-hover:text-primary transition-colors"} text-[24px]`}>search</span>
              <span className={`text-[10px] ${ active_tab === "search" ? "font-bold text-primary" : "font-medium text-slate-400 group-hover:text-primary transition-colors" } `}>Search</span>
            </a>
            <a className="flex flex-col items-center gap-1 group w-16" href="/order">
              <span className={`material-symbols-outlined ${active_tab === "order" ? "text-primary font-variation-settings-fill" : "text-slate-400 group-hover:text-primary transition-colors"} text-[24px]`}>receipt_long</span>
              <span className={`text-[10px] ${ active_tab === "order" ? "font-bold text-primary" : "font-medium text-slate-400 group-hover:text-primary transition-colors" } `}>Order</span>
            </a>
            <a className="flex flex-col items-center gap-1 group w-16" href="/history">
              <span className={`material-symbols-outlined ${active_tab === "history" ? "text-primary font-variation-settings-fill" : "text-slate-400 group-hover:text-primary transition-colors"} text-[24px]`}>favorite</span>
              <span className={`text-[10px] ${ active_tab === "history" ? "font-bold text-primary" : "font-medium text-slate-400 group-hover:text-primary transition-colors" } `}>Saved</span>
            </a>
            <a className="flex flex-col items-center gap-1 group w-16" href="/profile">
              <span className={`material-symbols-outlined ${active_tab === "profile" ? "text-primary font-variation-settings-fill" : "text-slate-400 group-hover:text-primary transition-colors"} text-[24px]`}>person</span>
              <span className={`text-[10px] ${ active_tab === "profile" ? "font-bold text-primary" : "font-medium text-slate-400 group-hover:text-primary transition-colors" } `}>Profile</span>
            </a>
          </div>
        </nav>
    </>
}
