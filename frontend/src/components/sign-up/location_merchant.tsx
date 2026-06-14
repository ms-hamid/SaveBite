export default function MerchantChooseLocation() {
    return (

  
        <main className="flex-1 flex flex-col px-6 pb-24 overflow-y-auto max-w-[448px] w-full mx-auto">
  
          <div className="mb-6">
            <p className="text-sm font-semibold leading-normal text-slate-900 mb-2">
              Confirm pin location on map
            </p>
  
            <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-sm border border-slate-200">
              <img
                alt="Map view showing streets and city blocks in London with a soft, clean UI aesthetic"
                className="w-full h-full object-cover"
                data-location="London"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnodFcij8DJl7__mdbq7TT_WanmbG9thDLUg44_YBAuMNfpVLcQGuastenCX4WJai-edpZR38G90nTKQRh8lt5QZfKocUfyCT17dNXAD2O7h_4fJWx7Jzs9TmCc48C7w3unmsm9ceUKUUjR8rctaDVEPt4viaRO1bSGIXLFGPQUbZYan_oPbFM9pyfGX966dJY2K2jeBTlGpX9PddbkKefi85blKAj_TNc6YjagebGI6MFUv0IpdeePAg21rNXfd1uUIXO2DsCGORk"
              />
  
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative">
                  <span
                    className="material-symbols-outlined text-primary text-[40px] drop-shadow-md"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    location_on
                  </span>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-black/20 rounded-full blur-[2px]"></div>
                </div>
              </div>
  
              <div className="absolute bottom-3 right-3 flex flex-col gap-2">
                <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 0" }}
                  >
                    my_location
                  </span>
                </button>
              </div>
            </div>
          </div>
  
          <button className="w-full flex items-center justify-center gap-2 h-14 rounded-xl bg-white text-primary border border-slate-200 hover:bg-slate-50 transition-colors mb-8 font-semibold text-base shadow-sm">
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              near_me
            </span>
            Use current location
          </button>
  
          <div className="flex flex-col gap-5 mb-8">
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-semibold leading-normal text-slate-900"
                htmlFor="address-search"
              >
                Search Address
              </label>
  
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-[20px] text-slate-400">
                    search
                  </span>
                </div>
  
                <input
                  className="form-input flex w-full rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary/50 h-14 placeholder:text-slate-400 pl-12 pr-4 text-base font-normal leading-normal transition-all"
                  id="address-search"
                  placeholder="Enter street name or building..."
                  type="text"
                />
              </div>
            </div>
  
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-semibold leading-normal text-slate-900"
                htmlFor="unit"
              >
                Apt, Suite, Unit (Optional)
              </label>
  
              <input
                className="form-input flex w-full rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary/50 h-14 placeholder:text-slate-400 px-4 text-base font-normal leading-normal transition-all"
                id="unit"
                placeholder="e.g. Unit 4B"
                type="text"
              />
            </div>
          </div>
  
        </main>
    );
  }