"use client";

import { useState } from "react";
import { login } from "@/services/auth";
import { Role } from "@/types";
import { enablePushNotification } from "../../lib/firebase/messaging";
import { useRouter } from "next/navigation";
import api, { getApiErrorMessage } from "../../lib/api";
import AuthPageLayout from "../../components/auth/page_layout";
import AuthInputComponent from "../../components/auth/input_column";

/**
 * Shape of the login form state.
 */
type LoginFormData = {
  email: string;
  password: string;
};

/**
 * POST /auth/login — Login Page (ADR-002 compliant)
 *
 * Authentication flow:
 *  1. POST credentials to backend-core's /auth/login endpoint via Axios singleton.
 *  2. On success, store the returned HS256 JWT in localStorage as "sb_access_token".
 *  3. Read `user.role` from the response to decide the redirect target.
 *
 * Previously this used supabase.auth.signInWithPassword() which was removed
 * in compliance with ADR-002 (Custom JWT over Supabase JWT).
 */
export default function LoginPage() {

  const router = useRouter();
  
  const [is_loading, set_is_loading] = useState(false)
  
  const [input_data, set_input_data] = useState<LoginFormData>({
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

  function update_input(
  key: string,
  value: any
) : void{
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
    <AuthPageLayout
      title="Welcome back"
      subtitle="Sign in to continue rescuing food."
      back_url="/sign-up"
      footer_text="Don't have an account?"
      footer_url="/sign-up"
      footer_button="Sign up"
    >
      <form
        id="login-form"
        // onSubmit={handle_submit}
        className="flex flex-col gap-5 flex-1"
        noValidate
      >
          <AuthInputComponent error={errors.email} label="Email" name="email" placeholder="Enter your email" onChange={update_input} value={input_data.email} type="email"/>
          
          <AuthInputComponent error={errors.password} label="Password" name="password" placeholder="Enter your password" onChange={update_input} value={input_data.password} type="password"/>
          

        {/* Forgot password link */}
        <div className="flex justify-end -mt-2">
          <a
            href="/forgot-password"
            id="forgot-password-link"
            className="text-sm text-primary font-medium hover:underline"
          >
            Forgot password?
          </a>
        </div>

        {/* Error message */}
        {errors.general && (
          <p
            id="login-error-msg"
            role="alert"
            className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
          >
            {errors.general}
          </p>
        )}

        {/* Sign in button */}
        <button
          onClick={ (e) =>
            handle_submit(e)
          }
          id="login-submit-btn"
          type="submit"
          disabled={is_loading}
          className="mt-100 w-full bg-primary text-white h-12 rounded-lg font-semibold text-base shadow-none transition-all flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {is_loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Signing in…
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </AuthPageLayout>
  );
}
