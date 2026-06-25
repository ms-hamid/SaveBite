import Link from "next/link";

export default function CancelledCard ({id, name, image, date, product, order_number, product_pid}: {id: string, name: string, image: string, date: string | null, product: string, order_number: string, product_pid: string}) {
    
    return (<div
        className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex items-start justify-between mb-3">
            <div className="flex gap-4">
                <img className="w-14 h-14 rounded-xl bg-slate-200 dark:bg-slate-700 bg-cover bg-center shrink-0"
                    data-alt="Fresh vegetables in a basket"
                    src={image ?? "https://upload.wikimedia.org/wikipedia/commons/6/60/No-Image-Placeholder-banner.svg"}
                />
                <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">{name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">{product}
                    </p>
                </div>
            </div>
            <span
                className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/30 px-2.5 py-1 text-[10px] font-bold text-red-600 dark:text-red-400 tracking-wide uppercase">
                Cancelled
            </span>
        </div>
        <div className="flex flex-col gap-1 mb-4">
            <span className="text-xs text-slate-400 dark:text-slate-500">Order {order_number}</span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Cancelled on {date}</span>
        </div>
        <div className="flex gap-3">
            <Link
            href={`/order/${id}`}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                View details
            </Link>
            <Link
                href={`/product/${product_pid}`}
                className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm hover:bg-primary/90 transition-colors shadow-primary/20">
                Reserve again
            </Link>
        </div>
    </div>);
}