"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthPageLayout from "../../components/auth/page_layout";
import AuthInputComponent from "../../components/auth/input_column";
import { forgot_password } from "@/services/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function validateEmail(emailValue: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValue.trim()) {
      setErrors("Email wajib diisi");
      return false;
    }

    if (!emailRegex.test(emailValue)) {
      setErrors("Format email tidak valid");
      return false;
    }

    setErrors("");
    return true;
  }

  async function handleSubmit(e: React.MouseEvent) {
    e.preventDefault();

    if (!validateEmail(email)) {
      return;
    }

    try {
      setIsLoading(true);
      await forgot_password(email);

      // Store email for next step
      sessionStorage.setItem("reset_email", email);

      // Show success message then redirect
      setSubmitted(true);
      setTimeout(() => {
        router.push("/verify-reset-otp");
      }, 2000);
    } catch (error: any) {
      console.error("Forgot password error:", error);
      setErrors(
        error?.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthPageLayout
      title="Reset Password"
      subtitle="Enter your email address to receive reset instructions"
      back_url="/login"
      footer_text="Remember your password?"
      footer_url="/login"
      footer_button="Back to Login"
    >
      <div className="flex flex-col gap-5 flex-1">
        {submitted && (
          <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-600">
            ✓ OTP telah dikirim ke email Anda. Silakan periksa inbox Anda.
          </div>
        )}

        <AuthInputComponent
          error={errors}
          label="Email"
          name="email"
          placeholder="Enter your email"
          onChange={(key, value) => {
            if (key === "email") {
              setEmail(value as string);
              setErrors("");
            }
          }}
          value={email}
          type="email"
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || submitted}
          className="mt-4 w-full bg-primary text-white h-12 rounded-lg font-semibold text-base shadow-none transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Sending OTP…
            </>
          ) : submitted ? (
            "Redirecting…"
          ) : (
            "Send Reset Code"
          )}
        </button>
      </div>
    </AuthPageLayout>
  );
}
