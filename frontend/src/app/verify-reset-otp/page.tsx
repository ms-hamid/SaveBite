"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthPageLayout from "../../components/auth/page_layout";
import AuthInputComponent from "../../components/auth/input_column";
import { verify_reset_otp } from "@/services/auth";

export default function VerifyResetOTPPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    // Get email from sessionStorage
    const storedEmail = sessionStorage.getItem("reset_email");
    if (!storedEmail) {
      router.push("/forgot-password");
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  function validateOTP(otpValue: string): boolean {
    const otpRegex = /^\d{6}$/;

    if (!otpValue.trim()) {
      setErrors("OTP wajib diisi");
      return false;
    }

    if (!otpRegex.test(otpValue)) {
      setErrors("OTP harus 6 digit angka");
      return false;
    }

    setErrors("");
    return true;
  }

  async function handleSubmit(e: React.MouseEvent) {
    e.preventDefault();

    if (!validateOTP(otp)) {
      return;
    }

    try {
      setIsLoading(true);
      const result = await verify_reset_otp(email, otp);

      // Store reset token for next step
      sessionStorage.setItem("reset_token", result.resetToken);

      // Redirect to reset password page
      router.push("/reset-password");
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      setErrors(
        error?.response?.data?.message || "OTP tidak valid. Silakan coba lagi."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResend(e: React.MouseEvent) {
    e.preventDefault();

    if (!canResend) return;

    try {
      setIsLoading(true);
      setCountdown(60);
      setCanResend(false);

      // Call forgot_password again to resend OTP
      const { forgot_password } = await import("@/services/auth");
      await forgot_password(email);

      setErrors("");
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      setErrors("Gagal mengirim ulang OTP. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthPageLayout
      title="Verify OTP"
      subtitle="Enter the 6-digit code sent to your email"
      back_url="/forgot-password"
      footer_text="Didn't receive code?"
      footer_url="#"
      footer_button={
        canResend ? "Resend Code" : `Resend in ${countdown}s`
      }
    >
      <div className="flex flex-col gap-5 flex-1">
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-700">
          <p className="font-medium">OTP Code Sent</p>
          <p className="text-xs mt-1">
            We've sent a 6-digit code to <strong>{email}</strong>
          </p>
        </div>

        <AuthInputComponent
          error={errors}
          label="OTP Code"
          name="otp"
          placeholder="Enter 6-digit code"
          onChange={(key, value) => {
            if (key === "otp") {
              // Allow only digits
              const numericValue = (value as string).replace(/\D/g, "").slice(0, 6);
              setOtp(numericValue);
              setErrors("");
            }
          }}
          value={otp}
          type="text"
          maxLength={6}
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="mt-4 w-full bg-primary text-white h-12 rounded-lg font-semibold text-base shadow-none transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Verifying…
            </>
          ) : (
            "Verify Code"
          )}
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={!canResend || isLoading}
          className="w-full bg-white border border-slate-200 text-slate-900 h-12 rounded-lg font-medium text-base transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {canResend ? "Resend Code" : `Resend in ${countdown}s`}
        </button>
      </div>
    </AuthPageLayout>
  );
}
