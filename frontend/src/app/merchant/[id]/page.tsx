"use client";
import { useState } from "react";
import FoodCard from "../../../components/FoodListCard";
import CustomerNavbar from "../../../components/navbar/customer_navbar";

export default function MerchantPage() {
  const [product_data, set_product_data] = useState([
    {
      id: 1,
      name: "Surplus Pastry Box", 
      image_url: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB5KSVGbSuDwvYt21Wf4X_h2-tSlzcctNnomy5xM_tI3PjjPexP3qg_OZo-_sfxLTU1taS-mxG5Eo3jupq49Gehah8Rz6QhUJNpg5UAU_syhZs6siaCY2dGJLGIPc0P7o4jZgXfYuN1oMtOe7mLE7yEk4_XPMFNkURfvOg3uDoq1kdBaasTY6L7IjzTI4jnqXyH_n6ymmpYeojmyG7IRPHoPH0vuH44cfFYU8_alVdQkdlvlF_7GEUPXzkKUGrejaplq5lyFCNEPS1S')", 
      actual_price: 12.00, 
      discount_price: 4.00, 
      discount_count: 60, 
      stock_left: 3, 
      pickup_open: "4:00", 
      pickup_close: "6:00" 
    },
    {
      id: 2,
      name: "Surplus Pastry Box", 
      image_url: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB5KSVGbSuDwvYt21Wf4X_h2-tSlzcctNnomy5xM_tI3PjjPexP3qg_OZo-_sfxLTU1taS-mxG5Eo3jupq49Gehah8Rz6QhUJNpg5UAU_syhZs6siaCY2dGJLGIPc0P7o4jZgXfYuN1oMtOe7mLE7yEk4_XPMFNkURfvOg3uDoq1kdBaasTY6L7IjzTI4jnqXyH_n6ymmpYeojmyG7IRPHoPH0vuH44cfFYU8_alVdQkdlvlF_7GEUPXzkKUGrejaplq5lyFCNEPS1S')", 
      actual_price: 12.00, 
      discount_price: 4.00, 
      discount_count: 60, 
      stock_left: 3, 
      pickup_open: "4:00", 
      pickup_close: "6:00" 
    }
  ]);
  
  return (
    <>

      <div className="bg-[#f6f8f7] dark:bg-[#10221c] text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden min-h-screen">
        <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-white dark:bg-[#10221c] pb-24 shadow-2xl">
          
          {/* Header */}
          <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-white/95 dark:bg-[#10221c]/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
            <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-white">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>

            <h1 className="text-lg font-bold text-center flex-1 truncate px-2">
              Green Leaf Bakery
            </h1>

            <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-white">
              <span className="material-symbols-outlined">share</span>
            </button>
          </header>

          {/* Main */}
          <main className="flex-1 flex flex-col">

            {/* Hero */}
            <div className="relative w-full h-64 bg-slate-200">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDIPI5tN865RRE5JSbdRE_DMQ-byKbsoJK_riozafXjZOicA8IRxXgSOkrNQSe38vYVoLfD3ZwdG19f5kqqNN2qCTh7iH4mwR-F551Gtz9MvsTPqRDJSF8YTxh378mPwjawONemXQvDVZ8unJm6k3KRTGvtuC301xU7eekUlfBx7Pl-xWcCNJQTecuLL9rZo4HAVCmihPi7IjQ7HiuSa3YLw09U3uIRBM6__FNfg4tKSSC1QhaSNgKciTDiWdb2FRpQctHZp3T4kFOL')",
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <button className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-full shadow-sm text-[#10b77f] hover:text-green-600 transition-colors z-10 group active:scale-90">
                <span className="material-symbols-outlined text-[18px]">
                  favorite
                </span>
              </button>

              <div className="absolute bottom-4 left-4 flex gap-2">
                <button className="flex items-center gap-1 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full shadow active:scale-95 transition-transform border border-slate-100 dark:border-slate-800/50">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                    ⭐ 4.6
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    (128)
                  </span>
                </button>

                <button className="flex items-center gap-1 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full shadow active:scale-95 transition-transform border border-slate-100 dark:border-slate-800/50">
                  <span className="material-symbols-outlined text-[14px] text-[#10b77f]">
                    location_on
                  </span>

                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                    1.2 km
                  </span>
                </button>
              </div>
            </div>

            {/* Merchant Info */}
            <div className="px-4 py-6 bg-white dark:bg-[#10221c]">
              <div className="flex items-center gap-1.5 mb-4">
                <h2 className="text-2xl font-bold leading-tight">
                  Green Leaf Bakery
                </h2>

                <span
                  className="material-symbols-outlined text-[#10b77f] text-[18px] translate-y-[1px]"
                  title="Verified Merchant"
                >
                  verified
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5 mb-5">
                <span className="px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/80 text-xs font-medium text-slate-600 dark:text-slate-300">
                  Bakery
                </span>

                <span className="px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/80 text-xs font-medium text-slate-600 dark:text-slate-300">
                  Pastry
                </span>

                <span className="px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 text-xs font-medium text-[#10b77f]">
                  Vegan Options
                </span>
              </div>

              <div className="relative">
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-h-[4.5em] overflow-hidden">
                  Artisanal breads and pastries baked fresh daily. We are
                  committed to zero waste and saving the planet one croissant at
                  a time by offering delicious surplus food at a fraction of the
                  price.
                </p>

                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-[#10221c] to-transparent" />

                <button className="relative z-10 mt-2 font-bold text-green-700 dark:text-green-500 text-sm hover:text-green-800">
                  See more
                </button>
              </div>
            </div>

            {/* Impact */}
            <div className="px-4 pb-6">
              <div className="rounded-xl bg-green-50 dark:bg-[#10221c] border border-green-100 dark:border-green-900 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-white dark:bg-green-900/50 rounded-full shadow-sm flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#10b77f] text-[18px]">
                      eco
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-[#10b77f] uppercase tracking-wider">
                    Your Impact With This Store
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4 relative">
                  <div className="absolute left-1/2 top-2 bottom-2 w-[0.5px] bg-green-200/50 dark:bg-green-800/30 -translate-x-1/2" />

                  <div className="flex flex-col items-center justify-center text-center gap-1">
                    <div className="flex items-center gap-1.5 h-8">
                      <span className="material-symbols-outlined text-orange-400 text-[20px]">
                        restaurant
                      </span>

                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        1,284
                      </span>
                    </div>

                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Meals Saved
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center text-center gap-1">
                    <div className="flex items-center gap-1.5 h-8">
                      <span className="material-symbols-outlined text-blue-400 text-[20px]">
                        cloud
                      </span>

                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        2.3t
                      </span>
                    </div>

                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      CO₂ Prevented
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Available Today */}
            <div className="px-4 pb-8">
              <div className="flex flex-col mb-4">
                <h3 className="text-lg font-bold">Available Today</h3>

                <p className="text-xs text-slate-500">
                  Grab them before they're gone
                </p>
              </div>

              <div className="flex flex-col gap-5">

                  { product_data.map(product=> <FoodCard 
                    key={product.id} 
                    name={product.name} 
                    image_url={product.image_url}
                    discount_count={product.discount_count}
                    actual_price={product.actual_price}
                    discount_price={product.discount_price}
                    pickup_open={product.pickup_open}
                    pickup_close={product.pickup_close}
                    stock_left={product.stock_left}
                  />)}

              </div>
            </div>

            <div className="px-4 pb-10 border-t border-slate-100 dark:border-slate-800 pt-8">
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-lg font-bold">Customer Reviews</h3>

    <a
      className="text-sm font-semibold text-primary hover:text-green-700 flex items-center gap-0.5"
      href="#"
    >
      See all

      <span className="material-symbols-outlined text-sm pt-0.5">
        chevron_right
      </span>
    </a>
  </div>

  <div className="flex items-start gap-6 mb-8">
    <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 min-w-[100px] border border-slate-100 dark:border-slate-700 h-full self-stretch">
      <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        4.6
      </span>

      <div className="flex text-yellow-400 text-xs my-1.5 gap-0.5">
        <span className="material-symbols-outlined text-[16px] filled">
          star
        </span>

        <span className="material-symbols-outlined text-[16px] filled">
          star
        </span>

        <span className="material-symbols-outlined text-[16px] filled">
          star
        </span>

        <span className="material-symbols-outlined text-[16px] filled">
          star
        </span>

        <span className="material-symbols-outlined text-[16px] filled">
          star_half
        </span>
      </div>

      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
        128 ratings
      </span>
    </div>

    <div className="flex-1 flex flex-col justify-between py-1 gap-2">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold text-slate-500 w-3 text-right">
          5
        </span>

        <div className="h-3 flex-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-primary w-[75%] rounded-full"></div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold text-slate-500 w-3 text-right">
          4
        </span>

        <div className="h-3 flex-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-primary w-[15%] rounded-full"></div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold text-slate-500 w-3 text-right">
          3
        </span>

        <div className="h-3 flex-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-primary w-[5%] rounded-full"></div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold text-slate-500 w-3 text-right">
          2
        </span>

        <div className="h-3 flex-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-slate-300 dark:bg-slate-600 w-[2%] rounded-full"></div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold text-slate-500 w-3 text-right">
          1
        </span>

        <div className="h-3 flex-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-slate-300 dark:bg-slate-600 w-[3%] rounded-full"></div>
        </div>
      </div>
    </div>
  </div>

  <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
    <div className="min-w-[280px] bg-white dark:bg-[#162b25] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-bold border border-purple-200">
            SJ
          </div>

          <span className="text-sm font-bold">Sarah J.</span>
        </div>

        <span className="text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full">
          Yesterday
        </span>
      </div>

      <div className="flex text-yellow-400 text-xs mb-2">
        <span className="material-symbols-outlined text-[14px] filled">
          star
        </span>

        <span className="material-symbols-outlined text-[14px] filled">
          star
        </span>

        <span className="material-symbols-outlined text-[14px] filled">
          star
        </span>

        <span className="material-symbols-outlined text-[14px] filled">
          star
        </span>

        <span className="material-symbols-outlined text-[14px] filled">
          star
        </span>
      </div>

      <div className="h-px bg-slate-50 dark:bg-slate-700/50 w-full mb-3"></div>

      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        "Best croissants in town! So glad I could save these treats from going
        to waste. Pickup was super easy."
      </p>
    </div>

    <div className="min-w-[280px] bg-white dark:bg-[#162b25] p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold border border-blue-200">
            MK
          </div>

          <span className="text-sm font-bold">Mike K.</span>
        </div>

        <span className="text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full">
          2 days ago
        </span>
      </div>

      <div className="flex text-yellow-400 text-xs mb-2">
        <span className="material-symbols-outlined text-[14px] filled">
          star
        </span>

        <span className="material-symbols-outlined text-[14px] filled">
          star
        </span>

        <span className="material-symbols-outlined text-[14px] filled">
          star
        </span>

        <span className="material-symbols-outlined text-[14px] filled">
          star
        </span>

        <span className="material-symbols-outlined text-[14px]">
          star
        </span>
      </div>

      <div className="h-px bg-slate-50 dark:bg-slate-700/50 w-full mb-3"></div>

      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        "Great value for the price. The sourdough was still warm. Will
        definitely order again."
      </p>
    </div>
  </div>
</div>

<div className="px-4 pb-12">
  <h3 className="text-lg font-bold mb-4">Location &amp; Hours</h3>

  <button className="w-full text-left rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#162b25] shadow-sm group active:scale-[0.99] transition-transform">
    <div className="h-24 w-full bg-slate-200 relative">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90"
        data-alt="Map view of downtown area"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDD5cGmiVfHeN3uWfOWVF7gj9bpORP9TmVNUD-MVFjz2JLHDZ_j2-8r696nEJODUPHK-DbBwgJRwnSEujsjaibfPPuH5fAp2C1aXE1szRr30errYPkGl_8sUKY0DFPOPH7pAvu9fgcC1k3vnG37j910c_kfNCVk2z0Offoa43NUrC_uP55NLiIKQfjH_xtZ80mGC-Cs3YG_SYzWHTFDsNnL6BPvplkaECm0Gm9M1PntSo3TmEjDuggvkNkVok7URQzLHRj4QjAv16pz')",
        }}
      ></div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <span className="material-symbols-outlined text-4xl text-primary drop-shadow-xl filled z-10 relative">
            location_on
          </span>

          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-black/20 blur-[2px] rounded-full"></div>
        </div>
      </div>
    </div>

    <div className="p-4">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">
            storefront
          </span>
        </div>

        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            123 Baker Street, Downtown
          </p>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="material-symbols-outlined text-[14px]">
              near_me
            </span>

            <span>1.2 km away</span>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 mb-5">
        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">
            schedule
          </span>
        </div>

        <div>
          <p className="text-sm font-black text-green-600 dark:text-green-400 mb-1">
            Open Now
          </p>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Closes at 7:00 PM
          </p>
        </div>
      </div>

      <div className="w-full py-3 px-4 rounded-lg bg-slate-900 dark:bg-white group-hover:bg-slate-800 dark:group-hover:bg-slate-200 text-white dark:text-slate-900 font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-md">
        <span className="material-symbols-outlined text-lg">
          directions
        </span>

        Get Directions
      </div>
    </div>
  </button>
</div>

          </main>

          {/* Floating Button */}
          <div className="fixed bottom-[80px] left-0 right-0 p-4 max-w-md mx-auto z-40 pointer-events-none">
            <button className="w-full bg-[#10b77f] hover:bg-green-600 text-white font-bold py-3.5 px-4 rounded-full shadow-2xl flex items-center justify-between transition-all active:scale-95 pointer-events-auto transform hover:-translate-y-0.5">
              <span className="flex-1 text-center pl-6">
                View available deals
              </span>

              <span className="bg-white/20 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                2
              </span>
            </button>
          </div>

          {/* Bottom Navbar */}
          <CustomerNavbar active_tab="home"/>

        </div>
      </div>
    </>
  );
}