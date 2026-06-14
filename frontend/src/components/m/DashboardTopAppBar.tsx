import Link from "next/link";

export default function DashboardTopAppBar() {
  return (
    <>
      {/* TopAppBar */}
      <header className="sticky top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="flex justify-between items-center px-5 h-16 max-w-[448px] mx-auto">
          <div className="flex items-center gap-3">
            <Link
              href={'/m/store'}
              className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200">
              <img alt="Store Logo" className="w-full h-full object-cover"
                data-alt="close up of artisan bakery store logo with warm lighting and rustic wood background"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAchRez08YbFql4FUTObOWELeu8mRxdl4DdsWEpaWBfPGGIwHCTBgfBLIO01PCBpvD82nQOYetNlbqdlb2IR43b8dVP17EJtXnBT6zfyiucGJx_9wHO83ysEamQolTmHxqRyGimrHF1tLakUmPNE3_d03NtiRGvEEEIBdvqAClm6Q6edBRL9g7oGCHirajTrE5Hl-IUVuWryPn6DZJZTrK3m-3IPZ7o3bQC0RCFQRVLpWSDLm6WgefgFflvogOinmoTDrGmb0ayoZsx" />
            </Link>
            <h1 className="font-semibold text-lg text-slate-900 tracking-tight">SaveBite Merchant</h1>
          </div>
          <Link
            href={'/m/order'}
            className="text-slate-600 hover:bg-slate-50 transition-colors active:scale-95 duration-200 p-2 rounded-full relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </Link>
        </div>
      </header>
    </>
  );
}
