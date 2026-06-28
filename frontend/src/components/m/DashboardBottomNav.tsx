import React from "react";

type DashboardBottomNavProps = {
  page?: string;
};

export default function DashboardBottomNav({page}: DashboardBottomNavProps) {
  
  return (<> 
        <nav
          className="
            fixed bottom-0 inset-x-0
            mx-auto
            w-full max-w-[448px]
            z-50
            border-t border-slate-100
            bg-white/95 backdrop-blur-md
            pb-safe
          "
        >
        <div className="flex justify-around items-center h-16 w-full px-2">
          <a className={`flex flex-col items-center justify-center active:scale-90 transition-transform duration-200 w-16 ${page === "home" ? "text-primary" : "hover:text-slate-600 text-slate-400"}`} href="/m/">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: page === "home" ? "'FILL' 1" : "" }}>home</span>
            <span className="text-[10px] font-semibold mt-1">Home</span>
          </a>
    
          <a className={`flex flex-col items-center justify-center active:scale-90 transition-transform duration-200 w-16 ${page === "listing" ? "text-primary" : "hover:text-slate-600 text-slate-400"}`} href="/m/listing">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: page === "listing" ? "'FILL' 1" : "" }}>inventory_2</span>
            <span className="text-[10px] font-medium mt-1">Listings</span>
          </a>
    
          <a className={`flex flex-col items-center justify-center active:scale-90 transition-transform duration-200 w-16 ${page === "ai" ? "text-primary" : "hover:text-slate-600 text-slate-400"}`} href="/m/ai">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: page === "ai" ? "'FILL' 1" : "" }}>psychology</span>
            <span className="text-[10px] font-medium mt-1">AI Hub</span>
          </a>
    
          <a className={`flex flex-col items-center justify-center active:scale-90 transition-transform duration-200 w-16 ${page === "order" ? "text-primary" : "hover:text-slate-600 text-slate-400"}`} href="/m/order">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: page === "order" ? "'FILL' 1" : "" }}>receipt_long</span>
            <span className="text-[10px] font-medium mt-1">Orders</span>
          </a>
          <a className={`flex flex-col items-center justify-center active:scale-90 transition-transform duration-200 w-16 ${page === "store" ? "text-primary" : "hover:text-slate-600 text-slate-400"}`} href="/m/store">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: page === "store" ? "'FILL' 1" : "" }}>storefront</span>
            <span className="text-[10px] font-medium mt-1">Store</span>
          </a>
        </div>
      </nav>
      
    </>)
  
  ;
}
