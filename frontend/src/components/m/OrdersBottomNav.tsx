import React from "react";

type OrdersBottomNavProps = {
  active?: "orders" | "store";
};

export default function OrdersBottomNav({ active = "orders" }: OrdersBottomNavProps) {
  return (<>
  {active === "store" ? 
    <nav className="bg-white fixed bottom-0 w-full max-w-[448px] z-50 border-t border-sb-border flex justify-around items-center h-[72px] px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
    {/* Home */}
    <button className="flex flex-col items-center justify-center text-sb-secondary-text hover:text-sb-primary-text transition-colors active:scale-90 transition-transform duration-200 w-16 h-full gap-1">
    <span className="material-symbols-outlined">home</span>
    <span className="text-[11px] font-medium">Home</span>
    </button>
    {/* Listings */}
    <button className="flex flex-col items-center justify-center text-sb-secondary-text hover:text-sb-primary-text transition-colors active:scale-90 transition-transform duration-200 w-16 h-full gap-1">
    <span className="material-symbols-outlined">list_alt</span>
    <span className="text-[11px] font-medium">Listings</span>
    </button>
    {/* AI Hub */}
    <button className="flex flex-col items-center justify-center text-sb-secondary-text hover:text-sb-primary-text transition-colors active:scale-90 transition-transform duration-200 w-16 h-full gap-1">
    <span className="material-symbols-outlined">psychology</span>
    <span className="text-[11px] font-medium">AI Hub</span>
    </button>
    {/* Orders */}
    <button className="flex flex-col items-center justify-center text-sb-secondary-text hover:text-sb-primary-text active:scale-90 transition-transform duration-200 w-16 h-full gap-1 relative">
    <span className="material-symbols-outlined">shopping_bag</span>
    <span className="text-[11px] font-medium">Orders</span>
    </button>
    {/* Store (Active) */}
    <button className="flex flex-col items-center justify-center text-primary-emerald active:scale-90 transition-transform duration-200 w-16 h-full gap-1">
    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
    <span className="text-[11px] font-bold">Store</span>
    </button>
    </nav> :
    
    <nav className="bg-white fixed bottom-0 w-full max-w-[448px] z-50 border-t border-sb-border flex justify-around items-center h-[72px] px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
    {/* Home */}
    <button className="flex flex-col items-center justify-center text-sb-secondary-text hover:text-sb-primary-text transition-colors active:scale-90 transition-transform duration-200 w-16 h-full gap-1">
    <span className="material-symbols-outlined">home</span>
    <span className="text-[11px] font-medium">Home</span>
    </button>
    {/* Listings */}
    <button className="flex flex-col items-center justify-center text-sb-secondary-text hover:text-sb-primary-text transition-colors active:scale-90 transition-transform duration-200 w-16 h-full gap-1">
    <span className="material-symbols-outlined">list_alt</span>
    <span className="text-[11px] font-medium">Listings</span>
    </button>
    {/* AI Hub */}
    <button className="flex flex-col items-center justify-center text-sb-secondary-text hover:text-sb-primary-text transition-colors active:scale-90 transition-transform duration-200 w-16 h-full gap-1">
    <span className="material-symbols-outlined">psychology</span>
    <span className="text-[11px] font-medium">AI Hub</span>
    </button>
    {/* Orders (Active) */}
    <button className="flex flex-col items-center justify-center text-primary-emerald active:scale-90 transition-transform duration-200 w-16 h-full gap-1 relative">
    <span className="absolute top-3 right-[18px] w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
    <span className="text-[11px] font-bold">Orders</span>
    </button>
    {/* Store */}
    <button className="flex flex-col items-center justify-center text-sb-secondary-text hover:text-sb-primary-text transition-colors active:scale-90 transition-transform duration-200 w-16 h-full gap-1">
    <span className="material-symbols-outlined">storefront</span>
    <span className="text-[11px] font-medium">Store</span>
    </button>
    </nav>
  
}
</>
  )
}
