"use client";

import { useState } from "react";
import ArrowBack from "../../components/ArrowBack";
import SignUpRole from "../../components/sign-up/choose_role";
import InputUserData from "../../components/sign-up/input_user_data";
import InputAboutMerchant from "../../components/sign-up/about_merchant";
import MerchantChooseLocation from "../../components/sign-up/location_merchant";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

type Role = "MERCHANT" | "CUSTOMER";

export type RegisterData = {
  role: Role;
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  merchant_name: string;
  category: string;
  desc: string;
  location: string;
  address: string;
  phone: string;
};

type Errors = Partial<Record<keyof RegisterData | "general", string>>;

export default function HomePage() {
  const router = useRouter();

  const [step_count, set_step_count] = useState(0);
  const [errors, set_errors] = useState<Errors>({});

  const [input_data, set_input_data] = useState<RegisterData>({
    role: "CUSTOMER",
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    merchant_name: "",
    category: "",
    desc: "",
    location: "",
    address: "",
    phone: "",
  });

  function update_input<K extends keyof RegisterData>(
    key: K,
    value: RegisterData[K]
  ) {
    set_input_data((prev) => ({
      ...prev,
      [key]: value,
    }));

    set_errors((prev) => ({
      ...prev,
      [key]: "",
      general: "",
    }));
  }

  function is_email_valid(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function is_password_valid(password: string) {
    /**
     * Format password:
     * - Minimal 8 karakter
     * - Minimal 1 huruf besar
     * - Minimal 1 huruf kecil
     * - Minimal 1 angka
     */
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  }

  function validate_user_data() {
    const new_errors: Errors = {};

    if (!input_data.full_name.trim()) {
      new_errors.full_name = "Full name wajib diisi";
    }

    if (!input_data.email.trim()) {
      new_errors.email = "Email wajib diisi";
    } else if (!is_email_valid(input_data.email)) {
      new_errors.email = "Format email tidak valid";
    }

    if (!input_data.password) {
      new_errors.password = "Password wajib diisi";
    } else if (!is_password_valid(input_data.password)) {
      new_errors.password =
        "Password minimal 8 karakter, 1 huruf besar, 1 huruf kecil, dan 1 angka";
    }

    if (!input_data.confirm_password) {
      new_errors.confirm_password = "Confirm password wajib diisi";
    } else if (input_data.password !== input_data.confirm_password) {
      new_errors.confirm_password = "Password dan confirm password tidak sama";
    }

    set_errors(new_errors);
    console.log(new_errors)

    return Object.keys(new_errors).length === 0;
  }

  function validate_step() {
    const role = input_data.role;

    if (step_count === 0) {
      return true;
    }

    if (step_count === 1) {
      return validate_user_data();
    }

    if (role === "MERCHANT" && step_count === 2) {
      const new_errors: Errors = {};

      if (!input_data.merchant_name.trim()) {
        new_errors.merchant_name = "Store name wajib diisi";
      }

      if (!input_data.category.trim()) {
        new_errors.category = "Category wajib diisi";
      }

      if (!input_data.desc.trim()) {
        new_errors.desc = "Description wajib diisi";
      }

      set_errors(new_errors);


      return Object.keys(new_errors).length === 0;
    }

    // if (role === "MERCHANT" && step_count === 3) {
    //   const new_errors: Errors = {};

    //   if (!input_data.location.trim()) {
    //     new_errors.location = "Location wajib diisi";
    //   }

    //   set_errors(new_errors);

    //   return Object.keys(new_errors).length === 0;
    // }

    // if (role === "CUSTOMER" && step_count === 2) {
    //   const new_errors: Errors = {};

    //   if (!input_data.phone.trim()) {
    //     new_errors.phone = "Phone number wajib diisi";
    //   }

    //   set_errors(new_errors);

    //   return Object.keys(new_errors).length === 0;
    // }

    // if (role === "CUSTOMER" && step_count === 3) {
    //   const new_errors: Errors = {};

    //   if (!input_data.address.trim()) {
    //     new_errors.address = "Address wajib diisi";
    //   }

    //   set_errors(new_errors);

    //   return Object.keys(new_errors).length === 0;
    // }
    

    return true;
  }

  const [loading, set_loading] = useState(false);

  async function handle_next_step() {
    if (!validate_step()) return;

    if (step_count === 3) {
      if (loading) return
      set_loading(true);
      await handle_submit().then(() => {set_loading(false)});

      return;
    }

    set_step_count((prev) => prev + 1);
  }

  function handle_back_step() {
    if (step_count === 0) return;
    set_step_count((prev) => prev - 1);
  }

  async function handle_submit() {
    console.log("Final register data:", input_data);

    const {data, error} = await supabase.auth.signUp({
      email: input_data.email,
      password: input_data.password
    });
    console.log("auth regis")
    if (error) {
      console.log(error);
      return;
    }

    console.log(data.session)
    console.log(data.user)

    await profile_regis(data.user?.id)
    await role_regis(data.user?.id)

    sessionStorage.setItem("verification_email", input_data.email);

    router.push("/email-verification");
  }


  async function profile_regis (user_id: string|undefined) {
    if (user_id === undefined) return;
    const {data, error} = await supabase.from("profiles").insert({
      full_name: input_data.full_name,
      user_id: user_id
    });

    console.log("profile regis")
    if (data) {
      console.log(data)
      return true;
    } 
    console.log(error);
    return false;
  }

  async function role_regis (user_id: string|undefined) {
    if (user_id === undefined) return;
    const tabel_name = `${input_data.role}s`
    
    let user_data;
    
    console.log("role regis")
    if (tabel_name === "merchants") {
      user_data = {
        user_id: user_id,
        category: input_data.category,
        desc: input_data.desc,
        merchant_name: input_data.merchant_name
      }
    }else {
      user_data = {
        user_id: user_id
      }
    }
    
    const {data, error} = await supabase.from(tabel_name).insert(user_data);

    if (data) {
      console.log(data)
      return true;
    } 
    console.log(error);
    return false;
  }
  

  const merchant_steps = [
    {
      head: "Join SaveBite",
      desc: "Choose how you want to use SaveBite",
      component: (
        <SignUpRole
          choosed_role={input_data.role}
          change_role={(new_role) => {
            update_input("role", new_role);
            set_step_count(0);
          }}
        />
      ),
    },
    {
      head: "Create your merchant account",
      desc: "Start selling surplus product",
      component: (
        <InputUserData
          input_value={input_data}
          update_function={update_input}
          errors={errors}
        />
      ),
    },
    {
      head: "Tell us about your store",
      desc: "This will be shown to customers",
      component: (
        <InputAboutMerchant
          input_value={input_data}
          update_function={update_input}
          errors={errors}
        />
      ),
    },
    {
      head: "Where is your store located?",
      desc: "Customers will use this to find your store.",
      component: (
        <MerchantChooseLocation
          // location={input_data.location}
          // change_location={(value: string) => update_input("location", value)}
          // errors={errors}
        />
      ),
    },
  ];

  const customer_steps = [
    {
      head: "Join SaveBite",
      desc: "Choose how you want to use SaveBite",
      component: (
        <SignUpRole
          choosed_role={input_data.role}
          change_role={(new_role) => {
            update_input("role", new_role);
            set_step_count(0);
          }}
        />
      ),
    },
    {
      head: "Create your customer account",
      desc: "Create an account to buy surplus food",
      component: (
        <InputUserData
          input_value={input_data}
          update_function={update_input}
          errors={errors}
        />
      ),
    },
    {
      head: "Tell us your contact information",
      desc: "This helps merchants contact you if needed",
      component: (
        <div className="flex flex-col gap-4">
          <input
            value={input_data.phone}
            onChange={(e) => update_input("phone", e.target.value)}
            placeholder="Phone number"
            className="h-14 rounded-xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-primary"
          />

          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone}</p>
          )}

          <p className="text-sm text-slate-400">
            Nanti bagian ini bisa diganti dengan component input nomor HP
            customer.
          </p>
        </div>
      ),
    },
    {
      head: "Where should we deliver your order?",
      desc: "Add your address to make ordering easier",
      component: (
        <div className="flex flex-col gap-4">
          <textarea
            value={input_data.address}
            onChange={(e) => update_input("address", e.target.value)}
            placeholder="Your address"
            className="min-h-32 rounded-xl border border-slate-200 p-4 outline-none focus:ring-2 focus:ring-primary"
          />

          {errors.address && (
            <p className="text-sm text-red-500">{errors.address}</p>
          )}

          <p className="text-sm text-slate-400">
            Nanti bagian ini bisa diganti dengan component input alamat atau
            lokasi customer.
          </p>
        </div>
      ),
    },
  ];

  const active_steps =
    input_data.role === "MERCHANT" ? merchant_steps : customer_steps;

  const current_step = active_steps[step_count];

  return (
    <div className="bg-white text-slate-900 antialiased font-display flex flex-col min-h-screen">
      <div className="max-w-[448px] mx-auto w-full min-h-screen relative flex flex-col bg-white overflow-x-hidden pb-[100px]">
        <ArrowBack back_function={handle_back_step} />

        <main className="flex-1 px-6 flex flex-col gap-5 pt-2 pb-20">
          <div className="mb-6 mt-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-400">
                Step {step_count + 1} of {active_steps.length}
              </span>

              <span className="text-xs font-semibold text-primary">
                {input_data.role === "MERCHANT" ? "MERCHANT" : "CUSTOMER"}
              </span>
            </div>

            <div className="h-1.5 bg-slate-100 rounded-full w-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{
                  width: `${((step_count + 1) / active_steps.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="mb-8">
            <h1 className="tracking-tight text-[32px] font-bold leading-tight text-slate-900 mb-2">
              {current_step.head}
            </h1>

            <p className="text-base font-normal leading-normal text-slate-500">
              {current_step.desc}
            </p>
          </div>

          <div className="flex flex-col gap-4">{current_step.component}</div>

          {errors.general && (
            <p className="text-sm text-red-500">{errors.general}</p>
          )}
        </main>

        <div className="fixed bottom-0 w-full max-w-[448px] bg-white pt-4 pb-8 px-6 z-40">
          <button
            onClick={handle_next_step}
            className="w-full bg-gradient-to-r from-[#6AD2A2] to-[#51C795] text-white font-bold h-14 rounded-xl transition-all flex justify-center items-center gap-2 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary active:scale-[0.98]"
          >
            {step_count === active_steps.length - 1 ? "Create Account" : "Continue"}
          </button>

          <div className="flex items-end justify-center py-4">
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
              Already have an account?{" "}
              <a
                className="text-primary hover:text-primary/80 font-bold ml-1 hover:underline"
                href="/login"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}