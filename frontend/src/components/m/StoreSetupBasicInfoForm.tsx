"use client";

import React from "react";

type StoreSetupBasicInfoFormProps = {
  variant?: "refined" | "placeholder";
};

export default function StoreSetupBasicInfoForm({ variant = "refined" }: StoreSetupBasicInfoFormProps) {
  const isPlaceholder = variant === "placeholder";
  const selectClassName = isPlaceholder
    ? "form-select flex w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-400 dark:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary/50 h-14 appearance-none px-4 text-base font-normal leading-normal transition-all"
    : "form-select flex w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary/50 h-14 appearance-none px-4 text-base font-normal leading-normal transition-all";
  const optionClassName = isPlaceholder ? "text-slate-900 dark:text-white" : undefined;

  return (
    <>
      {/* Form */}
      <form className="flex flex-col gap-5" onSubmit={(event) => event.preventDefault()}>
      {/* Store Name */}
      <div className="flex flex-col gap-2">
      <label className="text-slate-900 dark:text-white text-sm font-semibold leading-normal" htmlFor="storeName">Store Name</label>
      <input className="form-input flex w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary/50 h-14 placeholder:text-slate-400 px-4 text-base font-normal leading-normal transition-all" id="storeName" placeholder="e.g. The Green Bakery" type="text" />
      </div>
      {/* Category */}
      <div className="flex flex-col gap-2">
      <label className="text-slate-900 dark:text-white text-sm font-semibold leading-normal" htmlFor="storeCategory">Category</label>
      <div className="relative">
      <select className={selectClassName} id="storeCategory" defaultValue="">
      <option className="text-slate-400" disabled value="">Select a category (e.g., Bakery, Restaurant, Cafe)</option>
      <option className={optionClassName} value="bakery">Bakery</option>
      <option className={optionClassName} value="restaurant">Restaurant</option>
      <option className={optionClassName} value="cafe">Cafe</option>
      <option className={optionClassName} value="grocery">Grocery Store</option>
      <option className={optionClassName} value="other">Other</option>
      </select>
      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">expand_more</span>
      </div>
      </div>
      {/* Short Description */}
      <div className="flex flex-col gap-2">
      <label className="text-slate-900 dark:text-white text-sm font-semibold leading-normal" htmlFor="storeDescription">Short Description</label>
      <textarea className="form-textarea flex w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary/50 placeholder:text-slate-400 px-4 py-3 text-base font-normal leading-normal transition-all resize-none" id="storeDescription" placeholder="e.g. Fresh bread and pastries made daily" rows={4}></textarea>
      <div className="flex justify-end">
      <span className="text-slate-400 dark:text-slate-500 text-xs font-normal px-1">0/150</span>
      </div>
      </div>
      </form>
    </>
  );
}
