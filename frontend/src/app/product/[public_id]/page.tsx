"use client";

import Head from "next/head";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { format_price, get_close_text, ListingProps } from "../../page";
import { useListing } from "../../../components/providers/ListingProvider";
import { Order, useOrder } from "../../../components/providers/OrderProvider";

export type OrderInput = {
  qty: number |undefined;
  total_amount: number | undefined;
  listing_id: number | undefined;
  customer_id: string |undefined;
};

function getTimeLimit30MinutesFromNow(): string {
  const now = new Date();
  const timeLimit = new Date(now.getTime() + 30 * 60 * 1000);

  return timeLimit.toISOString();
}

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [isFavorite, setIsFavorite] = useState(false);

  const {listing} = useListing();
  const stock_left = listing?.others?.stock_left;


  function handleFavorite() {
    setIsFavorite((prev) => !prev);
  }

  async function create_order(user_id: string) {
    const {data, error} = await supabase.from("orders").insert({
      qty: qty,
      total_amount: qty * (listing?.discount_price || 1),
      listing_id: listing?.id,
      customer_id: user_id,
      merchant_id: listing?.merchant_id
    }).select().single();
    
    console.log(data);
    console.log(error);

    return data
  }

  async function create_payment(order: Promise<Order>, user_id: string) {
    const resolve_order = await order;

    const {data, error} = await supabase.from("payments").insert({
      amount: resolve_order.total_amount,
      midtrans_trx_id: "testing",
      time_limit: getTimeLimit30MinutesFromNow(),
      order_id: resolve_order.id,
      customer_id: user_id
    }).select("*").single();

    console.log(data)
    console.log(error)

    return data
  }

  async function add_sold_total() {
    if (!listing?.id) {
      console.log("Listing ID tidak ditemukan");
      return false;
    }
  
    const buyQty = Number(qty);
  
    if (!buyQty || buyQty <= 0) {
      console.log("Qty tidak valid");
      return false;
    }
  
    const { data, error } = await supabase
      .from("listings")
      .select("id, sold_total, stock_total")
      .eq("id", listing.id)
      .single();
  

    if (error || !data) {
      console.log("Gagal mengambil listing:", error);
      return false;
    }
  
    const soldTotal = Number(data.sold_total ?? 0);
    const stockTotal = Number(data.stock_total ?? 0);
  
    if (soldTotal + buyQty > stockTotal) {
      console.log("Pembelian melebihi batas stock tersedia");
      return false;
    }
  
    const { data: updatedData, error: updateError } = await supabase
      .from("listings")
      .update({
        sold_total: soldTotal + buyQty,
        status: soldTotal + buyQty === data.stock_total ? "close" : "active"
      })
      .eq("id", data.id)
      .select("id, sold_total, stock_total")
      .single();

  
    if (updateError) {
      console.log("Gagal update listing:", updateError);
      return false;
    }
  
    console.log("Update listing berhasil:", updatedData);
  
    return true;
  }

  async function handleReserve() {
    const {user} = (await supabase.auth.getUser()).data;
    if (!user) {
      return;
    }

    if (!(await add_sold_total())) {
      console.log("gagal memesan");
      return
    }

    const order = await create_order(user.id);
    const payment = await create_payment(await order, user.id)

    router.push(`/pay/${order.public_id}/serve`);
  }

  function handleDirections() {
    router.push(`/merchant/${params.public_id}/nav`)
  }

  const [qty, setQty] = useState(1);

  const handleIncreaseQty = () => {

    setQty((prev) => {
        return prev+1
      });
  };

  const handleDecreaseQty = () => {
    setQty((prev) => {
      if (prev <= 1) return 1;
      return prev - 1;
    });
  };

  return (
    <>
      <Head>
        <title>SaveBite Listing Detail</title>

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className="bg-[#f6f8f7] dark:bg-[#10221c] font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500/30">
        <div className="flex-1 flex flex-col w-full max-w-md mx-auto bg-[#f6f8f7] dark:bg-[#10221c] pb-[100px]">
          {/* Hero */}
          <div className="relative w-full h-72">
            <img
              alt="Freshly baked artisan bread and croissants"
              className="h-full w-full object-cover rounded-b-3xl shadow-sm"
              src={listing?.img_url}
            />

            {/* Gradient */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/40 to-transparent z-0"></div>

            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="absolute top-12 left-5 h-10 w-10 bg-white/90 dark:bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center shadow-md text-slate-800 dark:text-white hover:bg-white transition-colors z-10"
            >
              <span className="material-symbols-outlined text-[24px]">
                arrow_back
              </span>
            </button>

            {/* Favorite */}
            <button
              onClick={handleFavorite}
              className="absolute top-12 right-5 h-10 w-10 bg-white/90 dark:bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center shadow-md text-slate-800 dark:text-white transition-colors z-10"
            >
              <span
                className={`material-symbols-outlined text-[24px] transition-colors ${
                  isFavorite
                    ? "text-red-500 fill-1"
                    : "hover:text-red-500"
                }`}
              >
                favorite
              </span>
            </button>

            {/* Discount Badge */}
            <div className="absolute bottom-4 left-5 bg-emerald-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
              Save {listing?.discount_percentage}%
            </div>
          </div>

          {/* Content */}
          <div className="px-5 pt-6 flex flex-col gap-6">
            {/* Product */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                    {listing?.name}
                  </h1>

                  <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                    {listing?.merchants.merchant_name}
                  </p>
                </div>
              </div>

              <div className="flex items-end justify-between mt-2">
                <div className="flex flex-col items-start gap-1">
                  <span className="text-slate-400 line-through font-medium text-sm">
                    {listing?.others?.formatted_original_price}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Save {listing?.others?.price_diff}
                    </span>
                  </div>

                  <span className="text-4xl font-extrabold text-emerald-500 mt-1">
                    {listing?.others?.formatted_discount_price}
                  </span>
                </div>

                <div className="flex flex-col items-end gap-1.5 text-right pb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>

                    <span className="text-base font-bold text-slate-800 dark:text-slate-100">
                      {listing?.others?.stock_left} bags left
                    </span>
                  </div>

                  <span className="text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-md">
                    {listing?.others?.ended_time}
                  </span>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-white dark:bg-[#1a2c26] rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-4">
                <div className="h-20 w-20 bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden flex-shrink-0 relative">
                  <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-400 text-3xl">
                      map
                    </span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Pickup Location
                  </h3>

                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    123 Baker Street, Downtown
                  </p>

                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">
                      <span className="material-symbols-outlined text-[16px]">
                        schedule
                      </span>

                      18:00–19:30
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="material-symbols-outlined text-[16px]">
                        distance
                      </span>

                      1.2 km
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDirections}
                className="w-full mt-3 text-emerald-500 text-sm font-semibold py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Get Directions
              </button>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                What's in the bag?
              </h3>

              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Enjoy a delicious surprise mix of our daily freshly baked
                goods. This bag might contain croissants, sourdough buns,
                danishes, or savory pastries that didn't find a home today.
                Perfect for tomorrow's breakfast or a late-night snack!
              </p>

              <p className="text-xs text-slate-400 mt-2 italic">
                Contents depend on daily availability.
              </p>
            </div>

            {/* Important */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">
                Important to know
              </h3>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="bg-white dark:bg-[#1a2c26] p-1 rounded-full shadow-sm text-slate-400">
                    <span className="material-symbols-outlined text-[18px]">
                      qr_code_scanner
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Show QR at counter
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Staff will scan it to confirm pickup.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="bg-white dark:bg-[#1a2c26] p-1 rounded-full shadow-sm text-slate-400">
                    <span className="material-symbols-outlined text-[18px]">
                      block
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      No refunds after pickup time
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Please arrive within the window.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1a2c26] px-5 pt-4 pb-[calc(env(safe-area-inset-bottom)+20px)] z-50 shadow-[0_-8px_20px_-5px_rgba(0,0,0,0.1)]">
  <div className="max-w-md mx-auto flex items-center justify-between gap-4 h-16 mb-2">
    <div className="flex flex-col">
      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
        Total
      </span>

      <span className="text-2xl font-bold text-slate-900 dark:text-white">
        {listing?.others?.formatted_discount_price}
      </span>
    </div>

    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl px-2 py-1">
      <button
        type="button"
        onClick={handleDecreaseQty}
        disabled={qty <= 1}
        className="w-9 h-9 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition"
      >
        -
      </button>

      <span className="w-8 text-center font-bold text-slate-900 dark:text-white">
        {qty}
      </span>

      <button
        type="button"
        onClick={handleIncreaseQty}
        disabled={qty >= (stock_left || 0)}
        className="w-9 h-9 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold flex items-center justify-center active:scale-95 transition"
      >
        +
      </button>
    </div>

    <button
      onClick={handleReserve}
      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
    >
      <span>Reserve & Pay</span>

      <span className="material-symbols-outlined text-[20px]">
        arrow_forward
      </span>
    </button>
  </div>
</div>

        {/* Global Styles */}
        <style jsx global>{`
          body {
            min-height: max(884px, 100dvh);
            font-family: "Plus Jakarta Sans", sans-serif;
          }
        `}</style>
      </main>
    </>
  );
}
