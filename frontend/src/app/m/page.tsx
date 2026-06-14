import DashboardTopAppBar from "../../components/m/DashboardTopAppBar";
import DashboardBottomNav from "../../components/m/DashboardBottomNav"; 
import AIPredictionCard from "../../components/m/AiHomeExplanation";
import ActiveListingCard, { ActiveListingData } from "../../components/m/HomeListingCard";
import Link from "next/link";

export default function MerchantDashboardActiveListingEndedPage() {

const activeListingPlaceholderData: ActiveListingData[] = [
  {
    id: 1,
    name: "Artisan Sourdough",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBZeR1aRBbkvJ-jO6ygtIIdtVZquJ0g8e4k15nMjZNWDX4k5WkC6JxUHRIeFUr5nKbu4qDJoJ8eZKuPqb6FGVSB2yf7l8TD4rovfpnBiNwugL-UtTyoIKPcvfL870jFBQkuHb0M0uce60fa6eUdPOM3AGeXz4ZKZ51U7ZaJ_t6BnDweiwQHq-aK2Zk-ily3OrVOqz9XOQKdx8yBt6zSfI-017BJLoyED5WwYNLqsbILp9kYT1abf4XCefJzGajCuRGA3H7RO_HydDzG",
    imageAlt:
      "close up of rustic artisan sourdough bread loaf on wooden cutting board with flour dusting",
    price: 45000,
    status: "selling",
    timeLabel: "Ends in 2h",
    soldTotal: 7,
    stockTotal: 10,
  },
  {
    id: 2,
    name: "Croissant Butter Pack",
    imageUrl: "https://placehold.co/600x400/png?text=Croissant+Butter+Pack",
    imageAlt: "croissant butter pack",
    price: 38000,
    status: "selling",
    timeLabel: "Ends in 1h 30m",
    soldTotal: 8,
    stockTotal: 12,
  },
  {
    id: 3,
    name: "Banana Muffin Box",
    imageUrl: "https://placehold.co/600x400/png?text=Banana+Muffin+Box",
    imageAlt: "banana muffin box",
    price: 32000,
    status: "selling",
    timeLabel: "Ends in 45m",
    soldTotal: 15,
    stockTotal: 20,
  },
  {
    id: 4,
    name: "Chicken Rice Box",
    imageUrl: "https://placehold.co/600x400/png?text=Chicken+Rice+Box",
    imageAlt: "chicken rice box",
    price: 25000,
    status: "selling",
    timeLabel: "Ends in 3h",
    soldTotal: 6,
    stockTotal: 15,
  },
  {
    id: 5,
    name: "Donut Mixed Box",
    imageUrl: "https://placehold.co/600x400/png?text=Donut+Mixed+Box",
    imageAlt: "donut mixed box",
    price: 42000,
    status: "selling",
    timeLabel: "Ends in 1h",
    soldTotal: 9,
    stockTotal: 10,
  },
  {
    id: 6,
    name: "Pasta Lunch Box",
    imageUrl: "https://placehold.co/600x400/png?text=Pasta+Lunch+Box",
    imageAlt: "pasta lunch box",
    price: 35000,
    status: "ended",
    timeLabel: "Ended 30m ago",
    soldTotal: 50,
    stockTotal: 50,
  },
  {
    id: 7,
    name: "Brownies Slice Pack",
    imageUrl: "https://placehold.co/600x400/png?text=Brownies+Slice+Pack",
    imageAlt: "brownies slice pack",
    price: 30000,
    status: "ended",
    timeLabel: "Ended 1h ago",
    soldTotal: 18,
    stockTotal: 20,
  },
  {
    id: 8,
    name: "Surplus Pastry Box",
    imageUrl: "https://placehold.co/600x400/png?text=Surplus+Pastry+Box",
    imageAlt: "surplus pastry box",
    price: 35000,
    status: "ended",
    timeLabel: "Ended 2h ago",
    soldTotal: 25,
    stockTotal: 25,
  },
  {
    id: 9,
    name: "Salad Bowl Set",
    imageUrl: "https://placehold.co/600x400/png?text=Salad+Bowl+Set",
    imageAlt: "salad bowl set",
    price: 28000,
    status: "ended",
    timeLabel: "Ended 3h ago",
    soldTotal: 12,
    stockTotal: 15,
  },
  {
    id: 10,
    name: "Nasi Ayam Paket Hemat",
    imageUrl: "https://placehold.co/600x400/png?text=Nasi+Ayam+Paket+Hemat",
    imageAlt: "nasi ayam paket hemat",
    price: 27000,
    status: "ended",
    timeLabel: "Ended yesterday",
    soldTotal: 30,
    stockTotal: 30,
  },
];
  
  
  return (
    <>

      <div className={"bg-white text-slate-900 min-h-screen pb-24 antialiased"}>
        <DashboardTopAppBar />
        <main className="max-w-[448px] mx-auto px-5 space-y-8">
          {/* Greeting (implied by design, skipping explicit block) */}
          {/* Business Overview */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">Today's Overview</h2>
            <div className="grid grid-cols-2 gap-3">
              {/* Revenue Card */}
              <div
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">payments</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500">Revenue</p>
                </div>
                <p className="text-[20px] font-bold text-slate-900 mb-1 leading-tight">Rp 1.500.000</p>
                <div className="flex items-center gap-1 text-emerald-600 font-medium">
                  <span className="material-symbols-outlined text-[12px]">arrow_upward</span>
                  <span className="text-[10px]">+25% vs yesterday</span>
                </div>
              </div>
              {/* Items Sold Card */}
              <div
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">local_mall</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500">Items Sold</p>
                </div>
                <p className="text-[20px] font-bold text-slate-900 mb-1 leading-tight">50</p>
                <div className="flex items-center gap-1 text-emerald-600 font-medium">
                  <span className="material-symbols-outlined text-[12px]">arrow_upward</span>
                  <span className="text-[10px]">+18% vs yesterday</span>
                </div>
              </div>
              {/* Surplus Saved Card */}
              <div
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">eco</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500">Surplus Saved</p>
                </div>
                <p className="text-[20px] font-bold text-slate-900 mb-1 leading-tight">15.0 kg</p>
                <div className="flex items-center gap-1 text-emerald-600 font-medium">
                  <span className="material-symbols-outlined text-[12px]">arrow_upward</span>
                  <span className="text-[10px]">+4.5 kg vs yesterday</span>
                </div>
              </div>
              {/* Waste Reduced Card */}
              <div
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500">Waste Reduced</p>
                </div>
                <p className="text-[20px] font-bold text-slate-900 mb-1 leading-tight">10.5 kg</p>
                <div className="flex items-center gap-1 text-emerald-600 font-medium">
                  <span className="material-symbols-outlined text-[12px]">arrow_upward</span>
                  <span className="text-[10px]">+1.8 kg vs yesterday</span>
                </div>
              </div>
            </div>
          </section>
          {/* AI Prediction */}
          <section>
            <AIPredictionCard confidence={100} />
          </section>
          {/* Quick Actions */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">Quick Actions</h2>
            <div className="grid grid-cols-3 gap-3">
              <Link
                href={'/m/listing/create'}
                className="flex flex-col items-center gap-2 p-3 bg-primary border border-primary rounded-2xl shadow-md active:scale-[0.98] transition-transform">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white"><span
                    className="material-symbols-outlined text-white">add</span></div>
                <span className="text-xs font-bold text-white">Add surplus</span>
              </Link>
              <Link
                href={'/m/listing'}
                className="flex flex-col items-center gap-2 p-3 bg-white border border-slate-100 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] active:scale-[0.98] transition-transform hover:bg-slate-50">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                  <span className="material-symbols-outlined">inventory_2</span>
                </div>
                <span className="text-xs font-semibold text-slate-700">Manage stock</span>
              </Link>
              <Link
                href={'/m/order'}
                className="flex flex-col items-center gap-2 p-3 bg-white border border-slate-100 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] active:scale-[0.98] transition-transform hover:bg-slate-50">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                  <span className="material-symbols-outlined">receipt_long</span>
                </div>
                <span className="text-xs font-semibold text-slate-700">View orders</span>
              </Link>
            </div>
          </section>
          {/* Insights */}

          <section>
            <div
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex items-start gap-4 relative overflow-hidden">
              <div className="absolute -right-2 -top-2 w-16 h-16 bg-emerald-50 rounded-full opacity-50 blur-xl"></div>
              <span className="text-2xl shrink-0 z-10 mt-1">✨</span>
              <div className="flex flex-col z-10 w-full">
                <strong className="text-base text-slate-900 font-bold mb-1">Start selling your surplus today</strong>
                <p className="text-sm text-slate-600 font-medium leading-relaxed mb-4">Create your first listing to
                  begin earning and reduce waste.</p>
                <div className="flex flex-col gap-2 w-full">
                  <Link
                    href={'/m/listing/create'}
                    className="w-full bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-transform text-center">
                      Add surplus
                  </Link>
                  <Link
                    href={'/m/ai'}
                    className="w-full bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-transform text-center">Upload
                    sales data
                  </Link>
                </div>
              </div>
            </div>
          </section>
          {/* Active Listings */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Active Listings</h2>
              <a className="text-sm font-semibold text-primary hover:text-emerald-700 transition-colors"
                href="#">View all</a>
            </div>
            
            { activeListingPlaceholderData.length !== 0 ?
              activeListingPlaceholderData.map((listing) => 
                <ActiveListingCard
                  key={listing.id}
                  listing={listing}
                  // onPrimaryAction={(selectedListing) => {
                  //   console.log("Primary action:", selectedListing);
                  // }}
                  // onViewDetails={(selectedListing) => {
                  //   console.log("View details:", selectedListing);
                  // }}
                />
              ) : 
              <section>
                <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Active Listings</h2>
                <a className="text-sm font-semibold text-slate-400 transition-colors" href="#">View all</a>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] p-6 flex flex-col items-center justify-center text-center h-32">
                <h3 className="font-semibold text-slate-900 mb-1">No active listings</h3>
                <p className="text-xs text-slate-500 mb-3">Start selling your surplus food today</p>
                <button className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold shadow-sm active:scale-95 transition-transform">Prepare listing</button>
                </div>
              </section>
            }

          </section>
        </main>
        <DashboardBottomNav page="home" />
      </div>
    </>
  );
}
