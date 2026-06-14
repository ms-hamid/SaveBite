import type React from 'react';

export default function PickupVerifiedRefinedMinimalistPage() {
  return (
    <div className="bg-custom-bg text-custom-text-primary min-h-screen flex flex-col items-center p-[24px]">

            <style>{`body { font-family: 'Plus Jakarta Sans', sans-serif; }`}</style>

      <main className="w-full max-w-[448px] flex-1 flex flex-col items-center justify-center gap-[24px] text-center mt-[10vh]">
      {/* Success Icon & Message */}
      <div className="flex flex-col items-center gap-[16px]">
      <span className="material-symbols-outlined text-custom-primary" style={{fontSize: "80px", fontVariationSettings: "'FILL' 1"}}>check_circle</span>
      <div>
      <h1 className="text-2xl font-bold text-custom-text-primary">Pickup Verified</h1>
      <p className="text-[15px] text-custom-text-secondary mt-[8px]">Customer verification completed successfully.</p>
      </div>
      </div>
      {/* Order Card */}
      <div className="w-full bg-white rounded-xl border border-custom-card-border p-[16px] text-left flex flex-col gap-[12px]">
      <div className="flex justify-between items-center border-b border-custom-card-border pb-[12px]">
      <span className="text-[12px] font-semibold tracking-wider text-custom-text-secondary">ORDER #1042</span>
      <span className="text-[12px] font-semibold text-custom-primary bg-emerald-50 px-[10px] py-[4px] rounded-full">VERIFIED</span>
      </div>
      <div className="flex items-center gap-[12px] py-[4px]">
      <span className="material-symbols-outlined text-custom-text-secondary">person</span>
      <span className="text-[18px] font-bold text-custom-text-primary">Sarah J.</span>
      </div>
      <div className="flex items-start justify-between py-[4px]">
      <div className="flex items-center gap-[12px]">
      <span className="material-symbols-outlined text-custom-text-secondary">bakery_dining</span>
      <span className="text-[15px] text-custom-text-primary">Artisan Sourdough</span>
      </div>
      <span className="text-[15px] text-custom-text-secondary font-bold">x2</span>
      </div>
      <div className="flex items-center gap-[12px] pt-[12px] border-t border-custom-card-border">
      <span className="material-symbols-outlined text-custom-text-secondary text-sm">schedule</span>
      <span className="text-[13px] font-medium text-custom-text-secondary">Pickup Window: 18:30-19:00</span>
      </div>
      </div>
      </main>
      {/* Actions */}
      <div className="w-full max-w-[448px] flex flex-col gap-[16px] mt-[24px]">
      <button className="w-full bg-custom-primary text-white font-bold text-[16px] py-[14px] rounded-lg active:scale-[0.98] transition-transform duration-200">
              Complete Pickup
          </button>
      <button className="w-full bg-white text-custom-text-primary border border-custom-card-border font-bold text-[16px] py-[14px] rounded-lg active:scale-[0.98] transition-transform duration-200">
              Back to Orders
          </button>
      </div>
    </div>
  );
}
