export default function EmptyOrder() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center px-6 w-full h-full">
        <div className="w-48 h-48 mb-6 relative flex items-center justify-center opacity-80">
            <div className="relative w-32 h-40">
                <div
                    className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 border-4 border-primary/30 rounded-full clip-top">
                </div>
                <div
                    className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border-2 border-primary/20 transform -rotate-3">
                </div>
                <div
                    className="absolute inset-0 bg-white dark:bg-slate-800 rounded-2xl border-2 border-primary/20 shadow-lg flex items-center justify-center overflow-hidden">
                    <div className="w-16 h-1 bg-slate-100 dark:bg-slate-700 rounded-full mb-2"></div>
                    <div className="w-10 h-1 bg-slate-100 dark:bg-slate-700 rounded-full"></div>
                    <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-primary/10 rounded-full"></div>
                </div>
                <div
                    className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-12 border-t-4 border-l-4 border-r-4 border-primary rounded-t-full">
                </div>
            </div>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center">No orders yet</h2>
        <p className="text-slate-500 dark:text-slate-400 text-center text-sm leading-relaxed max-w-[280px] mb-8">
            You don’t have any orders yet.
        </p>
        <button
            className="w-full bg-primary hover:bg-emerald-600 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group">
            <span
                className="material-symbols-outlined text-[20px] group-hover:-translate-y-0.5 transition-transform">search</span>
            Browse deals
        </button>
    </div>
    );
}