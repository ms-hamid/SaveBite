"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthPageLayout from "../../components/auth/page_layout";
import AuthInputComponent from "../../components/auth/input_column";
import { reset_password } from "@/services/auth";

interface PasswordRequirements {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasDigit: boolean;
  match: boolean;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [requirements, setRequirements] = useState<PasswordRequirements>({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasDigit: false,
    match: false,
  });

  useEffect(() => {
    // Get reset token from sessionStorage
    const token = sessionStorage.getItem("reset_token");
    if (!token) {
      router.push("/forgot-password");
      return;
    }
  }, [router]);

  // Check password requirements in real-time
  useEffect(() => {
    const newRequirements = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasDigit: /\d/.test(password),
      match: password === confirmPassword && password.length > 0,
    };
    setRequirements(newRequirements);
  }, [password, confirmPassword]);

  function isPasswordValid(): boolean {
    return (
      requirements.minLength &&
      requirements.hasUppercase &&
      requirements.hasLowercase &&
      requirements.hasDigit &&
      requirements.match
    );
  }

  async function handleSubmit(e: React.MouseEvent) {
    e.preventDefault();

    if (!isPasswordValid()) {
      setErrors("Mohon periksa semua syarat password");
      return;
    }

    try {
      setIsLoading(true);
      const resetToken = sessionStorage.getItem("reset_token");

      if (!resetToken) {
        setErrors("Session expired. Please start over.");
        router.push("/forgot-password");
        return;
      }

      await reset_password(resetToken, password, confirmPassword);

      // Clear sensitive data
      sessionStorage.removeItem("reset_email");
      sessionStorage.removeItem("reset_token");

      // Redirect to login
      setTimeout(() => {
        router.push("/login?message=Password%20reset%20berhasil");
      }, 1500);
    } catch (error: any) {
      console.error("Reset password error:", error);
      setErrors(
        error?.response?.data?.message || "Gagal reset password. Silakan coba lagi."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthPageLayout
      title="Create New Password"
      subtitle="Set your new password below"
      back_url="/verify-reset-otp"
      footer_text="Remember your password?"
      footer_url="/login"
      footer_button="Back to Login"
    >
      <div className="flex flex-col gap-5 flex-1">
        {errors && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {errors}
          </div>
        )}

        <AuthInputComponent
          error=""
          label="New Password"
          name="password"
          placeholder="Enter new password"
          onChange={(key, value) => {
            if (key === "password") {
              setPassword(value as string);
              setErrors("");
            }
          }}
          value={password}
          type="password"
        />

        <AuthInputComponent
          error=""
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Confirm your password"
          onChange={(key, value) => {
            if (key === "confirmPassword") {
              setConfirmPassword(value as string);
              setErrors("");
            }
          }}
          value={confirmPassword}
          type="password"
        />

        {/* Password Requirements Checklist */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <p className="text-sm font-medium text-slate-900 mb-3">
            Password requirements:
          </p>
          <div className="space-y-2">
            <RequirementItem
              met={requirements.minLength}
              text="Minimal 8 karakter"
            />
            <RequirementItem
              met={requirements.hasUppercase}
              text="1 huruf besar (A-Z)"
            />
            <RequirementItem
              met={requirements.hasLowercase}
              text="1 huruf kecil (a-z)"
            />
            <RequirementItem met={requirements.hasDigit} text="1 angka (0-9)" />
            <RequirementItem
              met={requirements.match}
              text="Password cocok"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || !isPasswordValid()}
          className="mt-4 w-full bg-primary text-white h-12 rounded-lg font-semibold text-base shadow-none transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Resetting…
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </div>
    </AuthPageLayout>
  );
}

interface RequirementItemProps {
  met: boolean;
  text: string;
}

function RequirementItem({ met, text }: RequirementItemProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div
        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
          met
            ? "bg-green-500 border-green-500"
            : "border-slate-300 bg-white"
        }`}
      >
        {met && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
      <span className={met ? "text-green-700" : "text-slate-600"}>
        {text}
      </span>
    </div>
  );
}
