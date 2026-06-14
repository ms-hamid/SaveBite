"use client";

import { useState } from "react";
import { RegisterData } from "../../app/sign-up/page";

type SelectOption = {
  value: string;
  label: string;
};

type AuthInputProps = {
  label: string;
  name: keyof RegisterData;
  placeholder: string;
  onChange: <K extends keyof RegisterData>(
    key: K,
    value: RegisterData[K]
  ) => void;
  value: any;
  type: string;
  error?: string;
  selectOptions?: SelectOption[];
};

export default function AuthInputComponent({
  label,
  name,
  placeholder,
  onChange,
  value,
  type,
  error,
  selectOptions = [],
}: AuthInputProps) {
  const [pw_toggle, set_pw_toggle] = useState(true);

  const input_type =
    type === "password" ? (pw_toggle ? "password" : "text") : type;

  return (
    <div className="flex flex-col gap-2">
      <label
        className="text-slate-900 dark:text-white text-sm font-semibold leading-normal"
        htmlFor={name}
      >
        {label}
      </label>

      <div className="relative">
      {type === "select" ? (
  <select
    id={name}
    name={name}
    value={value}
    onChange={(e) =>
      onChange(name, e.target.value as RegisterData[typeof name])
    }
    className="form-select flex w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary/50 h-14 px-4 text-base font-normal leading-normal transition-all"
  >
    <option value="">{placeholder}</option>

    {selectOptions.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
) : type === "textarea" ? (
  <textarea
    id={name}
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={(e) =>
      onChange(name, e.target.value as RegisterData[typeof name])
    }
    className="form-textarea flex w-full min-h-32 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary/50 placeholder:text-slate-400 px-4 py-3 text-base font-normal leading-normal transition-all resize-none"
  />
) : (
  <input
    className="form-input flex w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary/50 h-14 placeholder:text-slate-400 px-4 text-base font-normal leading-normal transition-all"
    id={name}
    placeholder={placeholder}
    type={input_type}
    value={value}
    name={name}
    onChange={(e) =>
      onChange(name, e.target.value as RegisterData[typeof name])
    }
  />
)}
{ type === "password" ? 
  <button onClick={() => set_pw_toggle(v => !v)} className="absolute right-0 top-0 h-full px-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" type="button">
    <span className="material-symbols-outlined text-[20px]">{pw_toggle ? "visibility_off": "visibility"}</span>
  </button> : ""}

      </div>

      {error && <p className="text-error text-xs font-normal px-1">{error}</p>}
    </div>
  );
}