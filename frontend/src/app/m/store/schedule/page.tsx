"use client";

import React, { useEffect, useRef, useState } from "react";

// Sesuaikan sendiri lokasi import Supabase client kamu
import { supabase } from "../../../../lib/supabase";

type PickupScheduleState = {
  same_day_pickup: boolean;
  pickup_open: string;
  pickup_close: string;
  max_prep_time: string;
};

const defaultSchedule: PickupScheduleState = {
  same_day_pickup: false,
  pickup_open: "00:00",
  pickup_close: "00:00",
  max_prep_time: "0",
};

function format_time_label(time: string) {
  if (!time) return "";

  const [hourString, minute] = time.split(":");
  const hour = Number(hourString);

  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour.toString().padStart(2, "0")}:${minute} ${period}`;
}

export default function PickupSchedulePolishedStylePage() {
  const [same_day_pickup, set_same_day_pickup] = useState(
    defaultSchedule.same_day_pickup
  );
  const [pickup_open, set_pickup_open] = useState(
    defaultSchedule.pickup_open
  );
  const [pickup_close, set_pickup_end_time] = useState(
    defaultSchedule.pickup_close
  );
  const [max_prep_time, set_maximum_preparation_time] = useState(
    defaultSchedule.max_prep_time
  );

  const [is_saving, set_is_saving] = useState(false);
  const [is_loading, set_is_loading] = useState(true);

  const startTimeInputRef = useRef<HTMLInputElement | null>(null);
  const endTimeInputRef = useRef<HTMLInputElement | null>(null);

  async function get_current_user_id(): Promise<string | null> {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error("Failed to get user:", error);
      return null;
    }

    return user.id;
  }

  async function get_merchant_schedule() {
    try {
      set_is_loading(true);

      const user_id = await get_current_user_id();

      if (!user_id) {
        return;
      }

      const { data, error } = await supabase
        .from("merchants")
        .select(
          "same_day_pickup, pickup_open, pickup_close, max_prep_time"
        )
        .eq("user_id", user_id)
        .maybeSingle();

      if (error) {
        console.error("Failed to fetch merchant schedule:", error);
        return;
      }

      if (!data) {
        return;
      }

      set_same_day_pickup(data.same_day_pickup ?? defaultSchedule.same_day_pickup);
      set_pickup_open(
        data.pickup_open?.slice(0, 5) ?? defaultSchedule.pickup_open
      );
      set_pickup_end_time(
        data.pickup_close?.slice(0, 5) ?? defaultSchedule.pickup_close
      );
      set_maximum_preparation_time(
        data.max_prep_time?.toString() ??
          defaultSchedule.max_prep_time
      );
    } catch (error) {
      console.error("Unexpected error while fetching schedule:", error);
    } finally {
      set_is_loading(false);
    }
  }

  async function handle_submit_schedule() {
    try {
      set_is_saving(true);

      const user_id = await get_current_user_id();

      if (!user_id) {
        alert("User belum login.");
        return;
      }

      if (!pickup_open || !pickup_close) {
        alert("Pickup window cannot be empty.");
        return;
      }

      if (pickup_open >= pickup_close) {
        alert("Pickup start time must be earlier than pickup end time.");
        return;
      }

      const update_payload = {
        same_day_pickup: same_day_pickup,
        pickup_open: pickup_open,
        pickup_close: pickup_close,
        max_prep_time: Number(max_prep_time),
      };

      console.log("user_id:", user_id);
      console.log("update_payload:", update_payload);

      const { data, error } = await supabase
        .from("merchants")
        .update(update_payload)
        .eq("user_id", user_id)
        .select()
        .maybeSingle();

      console.log("updated data:", data);
      console.log("update error:", error);

      if (error) {
        console.error("Failed to save pickup schedule:", error);
        alert(error.message);
        return;
      }

      if (!data) {
        alert("Tidak ada data merchant yang berhasil diupdate. Cek RLS atau user_id.");
        return;
      }

      alert("Pickup schedule saved successfully.");
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Something went wrong while saving schedule.");
    } finally {
      set_is_saving(false);
    }
  }

  function handle_cancel() {
    get_merchant_schedule();
  }

  useEffect(() => {
    get_merchant_schedule();
  }, []);

  return (
    <>
      <title>SaveBite Merchant - Pickup Schedule</title>
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script
        id="tailwind-config"
        dangerouslySetInnerHTML={{
          __html: `tailwind.config = {
                  darkMode: "class",
                  theme: {
                      extend: {
                          "colors": {
                              "primary-emerald": "#16C47F",
                              "sb-bg": "#F7FAF8",
                              "sb-primary-text": "#111827",
                              "sb-secondary-text": "#6B7280",
                              "sb-border": "#EAEAEA"
                          },
                          "borderRadius": {
                              "DEFAULT": "0.25rem",
                              "lg": "0.5rem",
                              "xl": "0.75rem",
                              "2xl": "1rem",
                              "3xl": "1.5rem",
                              "full": "9999px"
                          },
                          "fontFamily": {
                              "sans": ["Plus Jakarta Sans", "sans-serif"]
                          }
                      }
                  }
              }`,
        }}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `body { 
              font-family: 'Plus Jakarta Sans', sans-serif; 
              -webkit-tap-highlight-color: transparent;
          }
          .material-symbols-outlined {
              font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
          .no-scrollbar::-webkit-scrollbar {
              display: none;
          }
          .no-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
          }
          body {
            min-height: max(884px, 100dvh);
          }
          .form-checkbox:checked, .form-radio:checked {
              background-color: #16C47F;
              border-color: #16C47F;
          }`,
        }}
      />
      <meta charSet="utf-8" />
      <meta
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        name="viewport"
      />
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&amp;display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap"
        rel="stylesheet"
      />

      <div
        className={
          "text-sb-primary-text min-h-screen flex justify-center antialiased bg-white"
        }
      >
        <div className="w-full max-w-[448px] bg-white relative flex flex-col min-h-screen shadow-xl pb-[80px]">
          {/* TopAppBar */}
          <header className="bg-white/95 sticky top-0 w-full max-w-[448px] z-50 backdrop-blur-md border-b border-sb-border flex flex-col">
            <div className="flex items-center justify-between px-6 h-16 w-full mx-auto">
              <div className="flex items-center gap-3">
                <button
                  aria-label="Go back"
                  className="text-sb-secondary-text hover:bg-slate-50 p-2 -ml-2 rounded-full transition-colors active:scale-95 flex items-center justify-center shrink-0"
                >
                  <span
                    className="material-symbols-outlined text-2xl"
                    data-icon="arrow_back"
                  >
                    arrow_back
                  </span>
                </button>
                <h1 className="font-bold text-[20px] text-sb-primary-text tracking-tight leading-tight truncate">
                  Pickup Schedule
                </h1>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 px-6 py-4 overflow-y-auto no-scrollbar flex flex-col space-y-6 bg-white pb-[104px]">
            {/* Pickup Availability Card */}
            <section className="border border-sb-border rounded-3xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col gap-4 bg-white">
              <header className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary-emerald/10 flex items-center justify-center text-primary-emerald shrink-0">
                  <span
                    className="material-symbols-outlined text-[18px]"
                    data-icon="schedule"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    schedule
                  </span>
                </div>
                <div className="flex flex-col">
                  <h2 className="text-[15px] font-bold text-sb-primary-text tracking-tight">
                    Pickup Availability
                  </h2>
                  <p className="text-[12px] text-sb-secondary-text font-medium mt-0.5">
                    Set when customers can collect orders
                  </p>
                </div>
              </header>

              <div className="flex flex-col gap-5 pt-1">
                {/* Same Day Toggle */}
                <div className="flex items-center justify-between py-1 group">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-sb-primary-text transition-colors group-hover:text-primary-emerald">
                      Same day pickup
                    </span>
                    <span className="text-[11px] text-sb-secondary-text font-medium pr-4">
                      Allow customers to pick up orders on the same day they are
                      placed.
                    </span>
                  </div>
                  <button
                    aria-checked={same_day_pickup}
                    onClick={() => set_same_day_pickup((value) => !value)}
                    className={`w-10 h-5 rounded-full relative cursor-pointer shadow-inner shrink-0 transition-colors ${
                      same_day_pickup ? "bg-primary-emerald" : "bg-slate-300"
                    }`}
                    role="switch"
                    type="button"
                  >
                    <span
                      className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-all pointer-events-none ${
                        same_day_pickup ? "right-0.5" : "left-0.5"
                      }`}
                    ></span>
                  </button>
                </div>

                {/* Time Window Inputs */}
                <div className="rounded-2xl p-4 border border-sb-border flex flex-col gap-3 bg-slate-50">
                  <h3 className="text-[11px] font-bold text-sb-secondary-text uppercase tracking-wider">
                    Pickup Window
                  </h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => startTimeInputRef.current?.showPicker?.()}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-sb-border bg-white hover:bg-slate-50 transition-colors shadow-sm text-sb-primary-text relative"
                      type="button"
                    >
                      <span
                        className="material-symbols-outlined text-[18px] text-primary-emerald"
                        data-icon="schedule"
                      >
                        schedule
                      </span>
                      <span className="text-[13px] font-bold">
                        {format_time_label(pickup_open)}
                      </span>
                      <input
                        ref={startTimeInputRef}
                        className="absolute opacity-0 pointer-events-none w-0 h-0"
                        type="time"
                        value={pickup_open}
                        onChange={(event) =>
                          set_pickup_open(event.target.value)
                        }
                      />
                    </button>

                    <span className="text-sb-secondary-text font-bold">—</span>

                    <button
                      onClick={() => endTimeInputRef.current?.showPicker?.()}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-sb-border bg-white hover:bg-slate-50 transition-colors shadow-sm text-sb-primary-text relative"
                      type="button"
                    >
                      <span
                        className="material-symbols-outlined text-[18px] text-primary-emerald"
                        data-icon="schedule"
                      >
                        schedule
                      </span>
                      <span className="text-[13px] font-bold">
                        {format_time_label(pickup_close)}
                      </span>
                      <input
                        ref={endTimeInputRef}
                        className="absolute opacity-0 pointer-events-none w-0 h-0"
                        type="time"
                        value={pickup_close}
                        onChange={(event) =>
                          set_pickup_end_time(event.target.value)
                        }
                      />
                    </button>
                  </div>
                </div>

                {/* Preparation Time Dropdown */}
                <div className="flex flex-col gap-2 mt-2">
                  <label
                    className="text-[13px] font-bold text-sb-primary-text"
                    htmlFor="prep-time"
                  >
                    Maximum preparation time
                  </label>
                  <div className="relative">
                    <select
                      className="w-full bg-white border border-sb-border rounded-xl px-4 py-3 text-[13px] font-medium text-sb-primary-text appearance-none focus:ring-2 focus:ring-primary-emerald focus:border-primary-emerald transition-shadow cursor-pointer shadow-sm"
                      id="prep-time"
                      value={max_prep_time}
                      onChange={(event) =>
                        set_maximum_preparation_time(event.target.value)
                      }
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                    </select>
                    <span
                      className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-sb-secondary-text pointer-events-none"
                      data-icon="expand_more"
                    >
                      expand_more
                    </span>
                  </div>
                  <p className="text-[11px] text-sb-secondary-text font-medium mt-1 px-1">
                    Preparation time determines the earliest pickup option shown
                    to customers.
                  </p>
                  <p className="text-[11px] text-sb-secondary-text font-medium flex items-center gap-1.5 mt-1 px-1">
                    <span
                      className="material-symbols-outlined text-[14px] text-amber-500"
                      data-icon="info"
                    >
                      info
                    </span>
                    Customers can only select pickup during available times.
                  </p>
                </div>
              </div>
            </section>

            {/* Customer Preview */}
            <section className="border rounded-3xl p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col gap-2 bg-emerald-50 border-emerald-100">
              <div className="flex items-center gap-2 text-sb-primary-text font-bold">
                <span className="text-[16px]">📦</span>
                <span className="text-[13px]">Customer Preview</span>
              </div>
              <p className="text-[12px] text-sb-secondary-text font-medium leading-relaxed">
                Customers can select pickup between:{" "}
                <span className="font-bold text-sb-primary-text">
                  {format_time_label(pickup_open)} —{" "}
                  {format_time_label(pickup_close)}
                </span>
              </p>
            </section>
          </main>

          {/* Fixed Bottom Action Button */}
          <footer className="bg-white fixed bottom-0 w-full max-w-[448px] z-50 border-t border-sb-border py-4 px-6 flex justify-center pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex gap-3 w-full">
              <button
                onClick={handle_cancel}
                disabled={is_saving || is_loading}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-sb-primary-text text-[14px] font-bold rounded-xl py-3.5 px-6 transition-colors active:scale-[0.98]"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handle_submit_schedule}
                disabled={is_saving || is_loading}
                className="flex-[2] bg-primary-emerald hover:bg-emerald-500 text-white text-[14px] font-bold rounded-xl py-3.5 px-6 shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                type="button"
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  data-icon="check_circle"
                >
                  check_circle
                </span>
                Save Schedule
              </button>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}