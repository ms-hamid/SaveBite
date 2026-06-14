"use client";

import { useEffect, useState } from "react";

// Sesuaikan path import ini sendiri
import { supabase } from "../../../../lib/supabase";

export default function PickupInstructionsRefinedStylePage() {
  const [instructions, set_instructions ] = useState(
    ""
  );

  const [contactless_pickup, set_contactless_pickup] = useState();
  const [notify_staff_upon_arrival, set_notify_staff_upon_arrival] = useState();
  const [is_saving, set_is_saving] = useState<boolean>(false);
  const [user_id, set_user_id] = useState<string>("");

  async function handle_save_instructions() {
    try {
      set_is_saving(true);

      if (!instructions.trim()) {
        alert("Instructions cannot be empty.");
        return;
      }

      const insert_payload = {
        pickup_instruction: instructions,
        contactless_pickup: contactless_pickup,
        notify_staff_upon_arrival: notify_staff_upon_arrival,
      };

      const { data, error } = await supabase
        .from("merchants") // ganti sesuai nama tabel kamu
        .update(insert_payload)
        .eq("user_id", user_id).select();

        console.log(data)

      if (error) {
        console.error("Failed to save pickup instructions:", error);
        alert(error.message);
        return;
      }

      console.log("Pickup instructions saved:", data);
      alert("Pickup instructions saved successfully.");
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Something went wrong while saving instructions.");
    } finally {
      set_is_saving(false);
    }
  }

  useEffect(() => {
    async function get_user_id() {
      const {data, error} = await supabase.auth.getUser();
      if (error) {
        console.log(error);
        return null;
      }
      set_user_id(data.user?.id);

      
      const merchant = await supabase.from("merchants").select("*").eq("user_id", data.user.id).single();
      console.log(merchant.data.notify_staff_upon_arrival)
      set_notify_staff_upon_arrival(merchant.data.notify_staff_upon_arrival);
      set_contactless_pickup(merchant.data.contacless_pickup);
      set_instructions(merchant.data.pickup_instruction); 
    }

    get_user_id();
  }, []);

  return (
    <>
      <title>Pickup Instructions</title>
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      <script
        id="tailwind-config"
        dangerouslySetInnerHTML={{
          __html: `tailwind.config = {
                darkMode: "class",
                theme: {
                  extend: {
                    "colors": {
                            "secondary-fixed": "#d5e3fd",
                            "inverse-primary": "#50dea3",
                            "surface-container-highest": "#dde4dd",
                            "on-primary-container": "#00402a",
                            "on-secondary-fixed-variant": "#3a485c",
                            "on-primary-fixed-variant": "#005236",
                            "background": "#f4fbf4",
                            "surface-variant": "#dde4dd",
                            "outline-variant": "#bbcabf",
                            "tertiary-container": "#f97a77",
                            "secondary-container": "#d5e3fd",
                            "surface": "#f4fbf4",
                            "on-surface-variant": "#3c4a42",
                            "secondary-fixed-dim": "#b9c7e0",
                            "on-tertiary-container": "#6f1218",
                            "primary": "#006c49",
                            "tertiary": "#a43a3b",
                            "on-tertiary": "#ffffff",
                            "on-primary-fixed": "#002113",
                            "surface-container-low": "#eef6ee",
                            "error": "#ba1a1a",
                            "surface-dim": "#d4dcd5",
                            "tertiary-fixed-dim": "#ffb3af",
                            "on-surface": "#161d19",
                            "error-container": "#ffdad6",
                            "on-secondary-container": "#57657b",
                            "surface-container": "#e8f0e9",
                            "on-error-container": "#93000a",
                            "surface-tint": "#006c49",
                            "surface-container-high": "#e3eae3",
                            "surface-bright": "#f4fbf4",
                            "primary-fixed": "#70fbbd",
                            "on-secondary-fixed": "#0d1c2f",
                            "on-tertiary-fixed": "#410006",
                            "secondary": "#515f74",
                            "on-tertiary-fixed-variant": "#842325",
                            "primary-fixed-dim": "#50dea3",
                            "primary-container": "#10b77f",
                            "tertiary-fixed": "#ffdad7",
                            "inverse-on-surface": "#ebf3eb",
                            "on-error": "#ffffff",
                            "outline": "#6c7a71",
                            "surface-container-lowest": "#ffffff",
                            "inverse-surface": "#2b322d",
                            "on-primary": "#ffffff",
                            "on-secondary": "#ffffff",
                            "on-background": "#161d19"
                    },
                    "borderRadius": {
                            "DEFAULT": "0.25rem",
                            "lg": "0.5rem",
                            "xl": "0.75rem",
                            "full": "9999px"
                    },
                    "spacing": {
                            "stack-gap-sm": "0.5rem",
                            "section-gap": "2rem",
                            "stack-gap-md": "1rem",
                            "container-padding": "1.25rem",
                            "card-gap": "0.75rem",
                            "inline-gap": "0.5rem"
                    },
                    "fontFamily": {
                            "headline-section": ["Plus Jakarta Sans"],
                            "body-base": ["Plus Jakarta Sans"],
                            "display-metric": ["Plus Jakarta Sans"],
                            "label-small": ["Plus Jakarta Sans"],
                            "label-caps": ["Plus Jakarta Sans"]
                    },
                    "fontSize": {
                            "headline-section": ["18px", {"lineHeight": "1.4", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                            "body-base": ["14px", {"lineHeight": "1.5", "fontWeight": "400"}],
                            "display-metric": ["20px", {"lineHeight": "1.2", "fontWeight": "700"}],
                            "label-small": ["10px", {"lineHeight": "1", "fontWeight": "500"}],
                            "label-caps": ["11px", {"lineHeight": "1", "letterSpacing": "0.05em", "fontWeight": "600"}]
                    }
                  }
                }
              }`,
        }}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `body {
                  background-color: #f4fbf4; /* background */
                  color: #161d19; /* on-background */
                  font-family: 'Plus Jakarta Sans', sans-serif;
                  -webkit-tap-highlight-color: transparent;
              }
              
              /* Subtle scrollbar for textareas */
              ::-webkit-scrollbar {
                  width: 6px;
              }
              ::-webkit-scrollbar-track {
                  background: transparent;
              }
              ::-webkit-scrollbar-thumb {
                  background-color: #dde4dd;
                  border-radius: 10px;
              }`,
        }}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `body {
            min-height: max(884px, 100dvh);
          }`,
        }}
      />

      <meta charSet="utf-8" />
      <meta
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        name="viewport"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&amp;display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap"
        rel="stylesheet"
      />

      <div
        className={
          "antialiased w-full max-w-[448px] mx-auto min-h-screen relative flex flex-col bg-background selection:bg-primary-container/30 !bg-white !text-neutral-900"
        }
      >
        {/* TopAppBar JSON Component */}
        <header className="fixed top-0 left-0 w-full z-50 flex items-center px-container-padding h-16 bg-white border-b border-gray-100 max-w-[448px] mx-auto left-1/2 -translate-x-1/2">
          <button
            aria-label="Go back"
            className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-surface-container-highest/50 dark:hover:bg-surface-container-highest/20 transition-all active:scale-95 duration-200 text-on-surface-variant dark:text-on-surface-variant !text-neutral-900"
          >
            <span className="material-symbols-outlined" data-icon="arrow_back">
              arrow_back
            </span>
          </button>

          <h1 className="font-headline-section text-headline-section text-primary dark:text-primary-fixed-dim ml-2 flex-1 truncate !text-neutral-900">
            Pickup Instructions
          </h1>
        </header>

        {/* Main Content Canvas */}
        <main className="flex-1 pt-24 pb-32 px-container-padding overflow-y-auto flex flex-col gap-section-gap">
          {/* Instructional Header (Optional but good for UX) */}
          <div className="flex flex-col gap-stack-gap-sm">
            <p className="font-body-base text-body-base text-on-surface-variant !text-neutral-600">
              Help customers easily find and collect their surplus orders by
              providing clear instructions.
            </p>
          </div>

          {/* Pickup Guide Card */}
          <section className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-stack-gap-md relative overflow-hidden">
            {/* Decorative accent */}
            <div className="flex items-center gap-inline-gap">
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary !bg-emerald-50">
                <span
                  className="material-symbols-outlined text-[18px] !text-[#10b77f]"
                  data-icon="directions_walk"
                >
                  directions_walk
                </span>
              </div>

              <h2 className="font-headline-section text-headline-section text-on-surface">
                Pickup Guide
              </h2>
            </div>

            <div className="flex flex-col gap-stack-gap-sm">
              <label
                className="font-label-caps text-label-caps text-on-surface-variant uppercase"
                htmlFor="instructions"
              >
                Instructional Text
              </label>

              <div className="relative group">
                <textarea
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 font-body-base text-body-base text-neutral-900 focus:ring-2 focus:ring-[#10b77f] focus:border-[#10b77f] transition-all resize-none shadow-sm"
                  id="instructions"
                  maxLength={300}
                  placeholder="e.g., Please enter through the side entrance..."
                  rows={4}
                  value={instructions}
                  onChange={(event) => set_instructions (event.target.value)}
                ></textarea>

                <div
                  className={`absolute bottom-2 right-3 font-label-small text-label-small pointer-events-none ${
                    instructions.length >= 300
                      ? "text-error"
                      : "text-on-surface-variant/70"
                  }`}
                  id="char-count"
                >
                  {instructions.length}/300
                </div>
              </div>

              <p className="font-label-small text-label-small text-on-surface-variant/80 mt-1">
                These instructions will be visible to the customer immediately
                after purchase.
              </p>
            </div>
          </section>

          {/* Preferences Card */}
          <section className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-stack-gap-md relative overflow-hidden">
            <div className="flex items-center gap-inline-gap">
              <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed !bg-emerald-50">
                <span
                  className="material-symbols-outlined text-[18px] !text-[#10b77f]"
                  data-icon="tune"
                >
                  tune
                </span>
              </div>

              <h2 className="font-headline-section text-headline-section text-on-surface">
                Preferences
              </h2>
            </div>

            <div className="flex flex-col gap-stack-gap-sm">
              {/* Checkbox 1 */}
              <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer border border-transparent hover:border-surface-container-highest">
                <div className="flex items-center h-5">
                  <input
                    checked={contactless_pickup}
                    onChange={(event) =>
                      set_contactless_pickup(event.target.checked)
                    }
                    className="w-5 h-5 rounded text-[#10b77f] border-gray-300 focus:ring-[#10b77f] focus:ring-offset-white bg-white shadow-sm"
                    type="checkbox"
                  />
                </div>

                <div className="flex flex-col">
                  <span className="font-body-base text-body-base text-on-surface font-medium">
                    Allow contactless pickup
                  </span>
                  <span className="font-label-small text-label-small text-on-surface-variant mt-1">
                    Customer can collect without speaking to staff.
                  </span>
                </div>
              </label>

              {/* Checkbox 2 */}
              <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer border border-transparent hover:border-surface-container-highest">
                <div className="flex items-center h-5">
                  <input
                    checked={notify_staff_upon_arrival}
                    onChange={(event) =>
                      set_notify_staff_upon_arrival(event.target.checked)
                    }
                    className="w-5 h-5 rounded text-[#10b77f] border-gray-300 focus:ring-[#10b77f] focus:ring-offset-white bg-white shadow-sm"
                    type="checkbox"
                  />
                </div>

                <div className="flex flex-col">
                  <span className="font-body-base text-body-base text-on-surface font-medium">
                    Call customer upon arrival
                  </span>
                  <span className="font-label-small text-label-small text-on-surface-variant mt-1">
                    Notify staff to bring order outside.
                  </span>
                </div>
              </label>
            </div>
          </section>
        </main>

        {/* Fixed Footer Action */}
        <div className="fixed bottom-0 left-0 w-full z-40 bg-white/90 backdrop-blur-md border-t border-gray-100 px-container-padding py-4 max-w-[448px] mx-auto left-1/2 -translate-x-1/2">
          <button
            onClick={handle_save_instructions}
            disabled={is_saving}
            className="w-full bg-[#10b77f] hover:bg-[#0da371] text-white font-headline-section text-headline-section py-3.5 rounded-lg shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]" data-icon="save">
              save
            </span>
            Save Instructions
          </button>
        </div>

        {/* Script for character count interaction */}
      </div>
    </>
  );
}