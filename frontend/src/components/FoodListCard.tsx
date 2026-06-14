export default function FoodCard({name, image_url, actual_price, discount_price, discount_count, stock_left, pickup_open, pickup_close}
    : {name: string, image_url: string, actual_price: number, discount_price: number, discount_count: number, stock_left: number, pickup_open: string, pickup_close: string}){
    return (
        <button className="w-full text-left flex flex-col sm:flex-row gap-0 sm:gap-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#162b25] shadow-sm overflow-hidden group hover:shadow-md transition-all active:scale-[0.98] active:bg-slate-50 dark:active:bg-[#1f3a32]">
        <div className="h-40 sm:h-auto sm:w-32 bg-slate-200 relative shrink-0 w-full sm:w-auto">
            <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
                backgroundImage:image_url
            }}
            />

            <div className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
            SAVE {discount_count}%
            </div>

            <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
            <span className="material-symbols-outlined text-[10px]">
                inventory_2
            </span>
            {stock_left} left
            </div>
        </div>

        <div className="flex flex-col flex-1 p-4 justify-between w-full">
            <div>
            <h4 className="font-bold text-base mb-1">
                {name}
            </h4>

            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs mb-3">
                <span className="material-symbols-outlined text-base">
                schedule
                </span>

                <span>Pickup: {pickup_open} - {pickup_close}</span>
            </div>
            </div>

            <div className="flex items-end justify-between mt-2 w-full">
            <div className="flex flex-col">
                <span className="text-xs text-slate-400 line-through">
                ${actual_price.toFixed(2)}
                </span>

                <span className="text-lg font-bold text-[#10b77f]">
                ${discount_price.toFixed(2)}
                </span>
            </div>

            <div className="bg-[#10b77f]/10 dark:bg-[#10b77f]/20 text-[#10b77f] w-7 h-7 flex items-center justify-center rounded-full group-hover:bg-[#10b77f] group-hover:text-white transition-colors shadow-sm">
                <span className="material-symbols-outlined text-[18px]">
                add
                </span>
            </div>
            </div>
        </div>
        </button>
    );
}