"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CustomerNavbar from "../../components/navbar/customer_navbar";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

type FoodItem = {
  id: number;
  title: string;
  store: string;
  originalPrice: string;
  price: string;
  saveText: string;
  savePercent: string;
  pickupTime: string;
  endingText: string;
  bagsLeft: string;
  distance: string;
  image: string;
};

export type ListingProps = {
  id: number, 
  public_id:string,
  name: string, 
  open_time: string, 
  close_time: string, 
  sold_total: number, 
  stock_total: number, 
  description: string, 
  is_open: boolean, 
  original_price: number, 
  discount_price: number, 
  discount_percentage: number,
  deleted_at: string,
  merchant_id: string,
  img_url: string,
  merchants: {
    merchant_name: string;
  }
}

export function set_to_hour(timestamps: string) :string 
{
  return new Date(timestamps).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function format_price(price: number | string | null | undefined) {
  const value = Number(price ?? 0);

  return `Rp ${new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)}`;
}

export function get_close_text(close_time: string) : string {
  const now = new Date();
  const close = new Date(close_time);

  const diff_ms = close.getTime() - now.getTime();
  const diff_mnt = Math.floor((diff_ms) / 1000 / 60 + 1850);

  console.log(diff_mnt)

  if (diff_mnt <= 0) {
    return "Ended";
  }

  if (diff_mnt < 60) {
    return `Ends in ${diff_mnt}m`;
  }

  const diff_hour = Math.floor(diff_mnt / 60)
  const mnt_left = diff_mnt % 60;

  return `Ends in ${diff_hour}h ${diff_mnt}m`;
}


export default function HomePage() {
  const router = useRouter();

  const [food_items, set_food_items] = useState<ListingProps[]>([]);

  useEffect(() => {
    async function get_data() {
      const { data, error } = await supabase
        .from("listings")
        .select("*, merchants (merchant_name)")
        .returns<ListingProps[]>();

      if (error) {
        console.log("error:", error);
        return;
      }

      console.log("data dari supabase:", data);

      set_food_items(data);
    }

    get_data();
  }, []);

  useEffect(() => {
    console.log("food_items berubah:", food_items);
  }, [food_items]);

  const [selectedCategory, setSelectedCategory] = useState("Nearby");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);

  const categories = [
    "Nearby",
    "Under 20k",
    "Bakery",
    "Meals",
    "Ending soon",
  ];

  const filteredItems = food_items.filter((item) => {
      const keyword = search.toLowerCase();

      return (
        item.name.toLowerCase().includes(keyword) ||
        item.merchants.merchant_name.toLowerCase().includes(keyword)

      );
    });


  function toggleFavorite(id: number) {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((fav) => fav !== id)
        : [...prev, id]
    );
  }

  function handleOpenDetail(id: number) {
    router.push(`/product/${id}`);
  }

  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased selection:bg-primary/30">
      <div className="flex flex-col w-full max-w-md mx-auto bg-background-light dark:bg-background-dark pb-[88px]">
        {/* HEADER */}
        <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm px-5 pt-8 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Hi, Alex 👋
              </h1>

              <button className="flex items-center gap-1.5 mt-1 bg-white dark:bg-card-dark px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm text-slate-700 dark:text-slate-200 hover:border-primary transition-colors text-sm font-semibold">
                <span className="material-symbols-outlined text-[18px] text-primary">
                  location_on
                </span>

                <span>Batam, ID</span>

                <span className="material-symbols-outlined text-[18px] text-slate-400">
                  expand_more
                </span>
              </button>
            </div>

            <button className="relative p-2 rounded-full bg-white dark:bg-card-dark shadow-sm border border-slate-100 dark:border-slate-700/50">
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">
                notifications
              </span>

              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-card-dark"></span>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-slate-900 dark:text-white font-bold text-lg">
              Surplus food near you
            </p>

            <div className="flex gap-3">
              <div className="relative flex-1 group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined">search</span>
                </span>

                <input
                  type="text"
                  placeholder="Search food or store"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 rounded-full bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400 text-sm shadow-sm"
                />
              </div>

              <button className="h-12 w-12 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark transition-colors shadow-sm shadow-primary/20">
                <span className="material-symbols-outlined">tune</span>
              </button>
            </div>
          </div>
        </header>

        {/* CATEGORY */}
        <section className="pl-5 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 pr-5 scrollbar-hide snap-x">
            {categories.map((category) => {

              
              const active = selectedCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`snap-start shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-transform active:scale-95 ${
                    active
                      ? "bg-primary text-white shadow-sm shadow-primary/20"
                      : "bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </section>

        {/* LIST */}
        <section className="px-5 grid gap-4 pb-4">
          {filteredItems.map((item) => {

            // console.log(item.img_url?)

            const isFavorite = favorites.includes(item.id);

            return (
              <Link
                href={`/product/${item.public_id}`}
                key={item.id}
                onClick={() => handleOpenDetail(item.id)}

                className="bg-white dark:bg-card-dark rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-800 active:scale-[0.99] transition-transform cursor-pointer"
              >
                <div className="relative h-40 w-full mb-3 overflow-hidden rounded-lg">
                  <Image
                    src={item.img_url}
                    alt={item.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                    Save {item.discount_percentage}%
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-white hover:text-red-500 transition-colors"
                  >
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        isFavorite
                          ? "font-variation-settings-FILL-1 text-red-500"
                          : "font-variation-settings-FILL-0"
                      }`}
                    >
                      favorite
                    </span>
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">
                        {item.name}
                      </h3>

                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                        {item.merchants.merchant_name}
                      </p>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <span className="block text-xs text-slate-400 line-through font-medium mb-0.5">
                        {format_price(item.original_price)}
                      </span>

                      <span className="block text-primary font-bold text-xl leading-none">
                        {format_price(item.discount_price)}
                      </span>

                      <span className="block text-[10px] text-green-600 dark:text-green-400 font-semibold mt-0.5 bg-green-50 dark:bg-green-900/30 px-1.5 rounded-sm">
                        Save Rp {format_price(item.original_price - item.discount_price)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-300 text-xs font-medium">
                        <span className="material-symbols-outlined text-[16px]">
                          schedule
                        </span>

                        {set_to_hour(item.open_time)} - {set_to_hour(item.close_time)}
                      </div>

                      <div className="flex items-center gap-2 text-[10px] pl-1 font-medium">
                        <span className="text-orange-400/90 dark:text-orange-300">
                          {get_close_text(item.close_time)}
                        </span>

                        <span className="text-slate-400">•</span>

                        <span className="text-slate-500 dark:text-slate-400">
                          {item.stock_total - item.sold_total} left
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium self-start mt-1">
                      <span className="material-symbols-outlined text-[16px]">
                        distance
                      </span>

                      {/* {item.distance} 5km */} 5km
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
      </div>

      {/* BOTTOM NAV */}
      <CustomerNavbar active_tab="home"/>
    </main>
  );
}