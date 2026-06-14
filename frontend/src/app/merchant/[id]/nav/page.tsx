"use client";

export default function SaveBiteDirections() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display antialiased overflow-hidden h-screen flex flex-col relative">
      <div className="fixed inset-0 w-full h-full bg-gray-100 z-0">
        <img
          alt="City map view with streets and buildings"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC8HvC0isMo0LEbIUR5b5-h45oXRa4t5DN204IRf5Hkg77hzh72y_ywpus0G_uyDN4jro3na7VnxyLPbjnPsIytJ_8F6hXyKdMYjHDv_rxR8PZL8mdwPdeFK-e0lbvVHt5uMaWNNiJi4FcqPxJUO-PPJrSdPV4OGC69cFL1KCkcUsQRN3pVTnPMM2SKIXZsYS8DNX3rmlJjj9KX9rFsjIPYsP5yspEdBCSdwuyvZOzdlAm7PqKbV7aGUJ7MYbWPgrUcKIqRXbkyZMl"
        />

        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <path
            className="drop-shadow-sm"
            d="M 120 600 Q 180 450 150 350 T 220 250"
            fill="none"
            stroke="#2563EB"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>

          <circle
            cx="120"
            cy="600"
            r="4"
            fill="#2563EB"
            stroke="white"
            strokeWidth="2"
          ></circle>
        </svg>

        <div className="absolute bottom-[40%] left-[25%] transform -translate-x-1/2 translate-y-1/2 z-10">
          <div className="w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-sm pulse-ring absolute"></div>

          <div className="w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-sm relative z-10"></div>
        </div>

        <div className="absolute top-[28%] left-[55%] transform -translate-x-1/2 -translate-y-full z-10 flex flex-col items-center group">
          <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm text-slate-900 dark:text-slate-100 px-2.5 py-1 rounded-md shadow-sm mb-1.5 whitespace-nowrap text-[11px] font-semibold border border-gray-100 dark:border-slate-700/50 transform transition-transform">
            Green Leaf Bakery
          </div>

          <div className="relative">
            <span
              className="material-symbols-outlined text-4xl text-primary drop-shadow-md"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              location_on
            </span>

            <div className="absolute top-2.5 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-[1px]">
              <span className="material-symbols-outlined text-primary text-[10px]">
                storefront
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 right-0 z-30 pt-safe-top pointer-events-none">
        <div className="flex items-center justify-between px-4 py-3">
          <button className="flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors pointer-events-auto">
            <span className="material-symbols-outlined text-slate-700 dark:text-slate-200 text-[20px]">
              arrow_back
            </span>
          </button>
        </div>
      </div>

      <div className="absolute top-20 right-3 flex flex-col gap-2 z-30 pointer-events-auto">
        <button className="bg-white dark:bg-slate-800 w-9 h-9 flex items-center justify-center rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
          <span className="material-symbols-outlined text-[20px]">
            my_location
          </span>
        </button>

        <button className="bg-white dark:bg-slate-800 w-9 h-9 flex items-center justify-center rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
          <span className="material-symbols-outlined text-[20px]">
            layers
          </span>
        </button>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 flex flex-col pointer-events-none h-screen justify-end">
        <div className="bg-white dark:bg-slate-900 w-full rounded-t-[1.25rem] shadow-[0_-4px_24px_rgba(0,0,0,0.06)] pointer-events-auto flex flex-col max-h-[85vh]">
          <div className="w-full flex justify-center pt-2.5 pb-2 cursor-grab active:cursor-grabbing">
            <div className="w-9 h-1 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
          </div>

          <div className="flex-1 overflow-y-auto hide-scrollbar px-5 pb-safe-bottom">
            <div className="flex justify-between items-start mb-3">
              <div className="w-full">
                <h2 className="text-[1.15rem] font-bold text-slate-900 dark:text-white flex items-center gap-1.5 leading-tight">
                  Green Leaf Bakery

                  <span
                    className="material-symbols-outlined text-blue-500 text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                </h2>

                <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-0.5">
                    <span
                      className="text-system-green text-[16px] material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>

                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      4.6
                    </span>
                  </div>

                  <span className="text-xs text-slate-400 font-medium">
                    (128)
                  </span>

                  <span className="text-slate-300 dark:text-slate-600">
                    •
                  </span>

                  <span className="text-slate-600 dark:text-slate-400">
                    Bakery
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                <div className="w-5 h-5 mt-0.5 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-slate-400 text-[14px]">
                    location_on
                  </span>
                </div>

                <span className="text-[13px] font-medium leading-tight">
                  123 Baker Street, Downtown
                </span>
              </div>

              <div className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                <div className="w-5 h-5 mt-0.5 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-slate-400 text-[14px]">
                    schedule
                  </span>
                </div>

                <div className="text-[13px] flex flex-col leading-tight">
                  <span className="font-medium text-system-green">
                    Open Now

                    <span className="text-slate-500 dark:text-slate-400 font-normal ml-1">
                      Closes 7:00 PM
                    </span>
                  </span>
                </div>
              </div>

              <button className="flex items-start gap-3 text-slate-600 dark:text-slate-300 w-full text-left active:bg-gray-50 dark:active:bg-slate-800/50 rounded-lg -ml-1.5 p-1.5 transition-colors">
                <div className="w-5 h-5 mt-0.5 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center shrink-0 ml-px">
                  <span className="material-symbols-outlined text-slate-400 text-[14px]">
                    call
                  </span>
                </div>

                <span className="text-[13px] font-medium leading-tight mt-0.5">
                  +62 812-3456-7890
                </span>
              </button>
            </div>

            <div className="h-px bg-gray-100 dark:bg-slate-800 w-full mb-4"></div>

            <div className="flex items-center justify-between gap-2 mb-5 p-1 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
              <button className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
                <span className="material-symbols-outlined mb-1 text-[20px]">
                  directions_walk
                </span>

                <span className="text-[10px] font-semibold">12 min</span>
              </button>

              <button className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-white dark:bg-slate-700 text-primary shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-black/5 dark:ring-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10"></div>

                <span className="material-symbols-outlined mb-1 text-[20px] relative z-10">
                  directions_car
                </span>

                <span className="text-[10px] font-bold relative z-10">
                  5 min
                </span>
              </button>

              <button className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
                <span className="material-symbols-outlined mb-1 text-[20px]">
                  two_wheeler
                </span>

                <span className="text-[10px] font-semibold">6 min</span>
              </button>
            </div>

            <div className="flex items-center justify-between mb-6 px-1">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                  Distance
                </span>

                <span className="text-[15px] font-bold text-slate-900 dark:text-white mt-0.5">
                  1.2 km
                </span>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                  Route
                </span>

                <span className="text-[15px] font-bold text-slate-900 dark:text-white mt-0.5">
                  Via Main St.
                </span>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-slate-900 pt-2 pb-6 z-20">
              <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-white dark:to-slate-900 -translate-y-full pointer-events-none"></div>

              <button className="w-full bg-primary hover:bg-primary-dark text-slate-900 font-bold text-[15px] py-3.5 px-6 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
                <span className="material-symbols-outlined text-[20px]">
                  navigation
                </span>

                Start Navigation
              </button>

              <button onClick={()=>{
                    window.open(
                      "https://www.google.com/maps/search/?api=1&query=123+Baker+Street",
                      "_blank"
                    );
              }} className="w-full mt-3 bg-transparent text-slate-500 dark:text-slate-400 font-semibold text-[13px] py-1 flex items-center justify-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors">
                Open in Google Maps
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}