"use client";

import { Role } from "@/types";

export default function SignUpRole({
  choosed_role,
  change_role,
}: {
  choosed_role: Role;
  change_role: (new_role: "MERCHANT" | "CUSTOMER") => void;
}) {

  const is_customer = choosed_role === "CUSTOMER";

  return (
    <>
      {/* Customer Card */}
      <button
        type="button"
        className={`w-full text-left bg-white rounded-xl p-5 border ${
          is_customer
            ? "border-primary ring-1 ring-primary/20"
            : "border-slate-200 hover:border-slate-300"
        } transition-all flex items-start gap-4 active:scale-99 group shadow-sm`}
        onClick={() => {
          change_role("CUSTOMER");
        }}
      >
        <div
          className={`bg-slate-50 p-3 rounded-full ${
            is_customer
              ? "text-primary"
              : "text-slate-600 group-hover:bg-slate-100"
          } flex-shrink-0 transition-colors`}
        >
          <span className="material-symbols-outlined text-[24px]">
            shopping_bag
          </span>
        </div>

        <div className="pt-1">
          <h3 className="text-lg font-bold text-slate-900 mb-1 font-display">
            Customer
          </h3>

          <p className="text-sm text-slate-500 pr-4">
            Find and save surplus food near you
          </p>
        </div>
      </button>

      {/* Merchant Card */}
      <button
        type="button"
        className={`w-full text-left bg-white rounded-xl p-5 border ${
          !is_customer
            ? "border-primary ring-1 ring-primary/20"
            : "border-slate-200 hover:border-slate-300"
        } transition-all flex items-start gap-4 active:scale-99 group shadow-sm`}
        onClick={() => {
          change_role("MERCHANT");
        }}
      >
        <div
          className={`bg-slate-50 p-3 rounded-full ${
            !is_customer
              ? "text-primary"
              : "text-slate-600 group-hover:bg-slate-100"
          } flex-shrink-0 transition-colors`}
        >
          <span className="material-symbols-outlined text-[24px]">
            storefront
          </span>
        </div>

        <div className="pt-1 pr-4">
          <h3 className="text-lg font-bold text-slate-900 mb-1 font-display">
            Merchant
          </h3>

          <p className="text-sm text-slate-500 mb-2">
            Sell surplus food and reduce waste
          </p>

          <p
            className={`text-[10px] font-bold ${
              is_customer ? "text-slate-600" : "text-primary"
            } uppercase tracking-wide`}
          >
            Best for businesses
          </p>
        </div>
      </button>
    </>
  );
}