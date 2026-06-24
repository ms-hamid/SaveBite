"use client";

import { useState } from "react";
import AuthPageLayout from "../../components/auth/page_layout";
import { useRouter } from "next/navigation";
import AuthInputComponent from "../../components/auth/input_column";
import { login } from "@/services/auth";
import { Role } from "@/types";
import { enablePushNotification } from "../../lib/firebase/messaging";

type LoginPageProps = {
  email: string;
  password: string;
};

type RegisterData = {
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

export default function LoginPage() {

  const router = useRouter();
  
  const [is_loading, set_is_loading] = useState(false)
  
  const [input_data, set_input_data] = useState<LoginPageProps>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  // valid email akan kosong ketika belum ada input dan juga ketika email sudah memenuhi syarat valid
  // valid email akan terisi ketika button submit button ditekan dan email tidak memenuhi syarat valid
  // const is_email_valid = input_data.email.includes("@") && input_data.email.includes(".");

  async function handle_submit(
    e: React.MouseEvent
  ) {
    e.preventDefault();
  
    const valid = validateForm();
  
    if (!valid) return;
  
    try {
      set_is_loading(true)

      const login_data = await login(
        input_data.email,
        input_data.password
      );

      localStorage.setItem("email", input_data.email);

      // Enable push notification sync with user account
      try {
        enablePushNotification();
      } catch (err) {
        console.error("Failed to enable push notifications on login:", err);
      }

      if (login_data.role === "CUSTOMER") router.push("/home");
      else if (login_data.role === "MERCHANT") router.push("/m");
      else router.push("/admin");
      
    } catch (error: any) {
      console.log(error)
      setErrors((prev) => ({
        ...prev,
        general:
          error?.response?.data?.message ||
          "Email atau password salah",
      }));
    }finally{
      set_is_loading(false)
    }
  }

  function update_input<
  K extends keyof RegisterData
>(
  key: K,
  value: RegisterData[K]
) {
  set_input_data((prev) => ({
    ...prev,
    [key]: value,
  }));

  if (key === "email") {
    setErrors((prev) => ({
      ...prev,
      email: "",
      general: "",
    }));
  }

  if (key === "password") {
    setErrors((prev) => ({
      ...prev,
      password: "",
      general: "",
    }));
  }
}

function validateForm() {
  const newErrors = {
    email: "",
    password: "",
    general: "",
  };

  let isValid = true;

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!input_data.email.trim()) {
    newErrors.email = "Email wajib diisi";
    isValid = false;
  } else if (!emailRegex.test(input_data.email)) {
    newErrors.email =
      "Format email tidak valid";
    isValid = false;
  }

  if (!input_data.password.trim()) {
    newErrors.password =
      "Password wajib diisi";
    isValid = false;
  } else if (input_data.password.length < 6) {
    newErrors.password =
      "Password minimal 6 karakter";
    isValid = false;
  }

  setErrors(newErrors);

  return isValid;
}
  return (
    <>

      <AuthPageLayout title="Welcome back" subtitle="Sign in to continue rescuing food." back_url="/sign-up" footer_text="Don't have an account?" footer_url="/sign-up" footer_button="Sign-up">
 
        <div className="flex flex-col gap-5 flex-1">

          <AuthInputComponent error={errors.email} label="Email" name="email" placeholder="Enter your email" onChange={update_input} value={input_data.email} type="email"/>
          
          <AuthInputComponent error={errors.password} label="Password" name="password" placeholder="Enter your password" onChange={update_input} value={input_data.password} type="password"/>
          
          {errors.general && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {errors.general}
            </div>
          )}

          <button type="button" onClick={(e) => {
              handle_submit(e)
            
            }} className="mt-4 w-full bg-primary text-white h-12 rounded-lg font-semibold text-base shadow-none transition-all flex items-center justify-center" >
            
            {is_loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </button>
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-700" />
            <span className="flex-shrink-0 mx-4 text-slate-400 dark:text-slate-500 text-sm">or</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-700" />
          </div>
          <a href="/" className="w-full bg-white dark:bg-transparent border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white h-12 rounded-lg font-medium text-base transition-colors flex items-center justify-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </a>
        </div>
      </AuthPageLayout>

      
    </>
  );
}

