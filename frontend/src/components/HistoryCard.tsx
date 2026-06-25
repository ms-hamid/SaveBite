import Link from "next/link";

export default function OrderList ({id, name, image, date, product, order_number, status, active_tab}: {id: string, name: string, image: string, date: string, product: string, order_number: string, status:string, active_tab: string}) {
    return <>
    <div
    key={id}
    className="group bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all hover:shadow-md"
  >
    <Link href={`/order/${id}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-3">
          <div className="h-14 w-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-white/10 shrink-0">
            <img
              src={image ?? "https://upload.wikimedia.org/wikipedia/commons/6/60/No-Image-Placeholder-banner.svg"}
              alt={product}
              className="w-14 h-14 rounded-xl bg-slate-200 dark:bg-slate-700 bg-cover bg-center shrink-0"
          />
          </div>

          <div className="flex flex-col justify-center">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {name}
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-300">
              {product}
            </p>

            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mt-1">
              {order_number}
            </span>
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
          {date}
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10">
          <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {status}
          </span>
        </div>

        <div className="px-3.5 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-bold">
          {active_tab === "completed"
            ? "Order again"
            : "View details"}
        </div>
      </div>
    </Link>
  </div>
  </>;
}