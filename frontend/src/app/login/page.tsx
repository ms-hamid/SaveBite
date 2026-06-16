"use client";

import { useState } from "react";
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

  const [form_data, set_form_data] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [error_message, set_error_message] = useState<string>("");
  const [is_loading, set_is_loading] = useState(false);

  // ── Input handler ──────────────────────────────────────────────────────────

  function update_input<K extends keyof LoginFormData>(
    key: K,
    value: LoginFormData[K]
  ) {
    set_form_data((prev) => ({ ...prev, [key]: value }));
    // Clear error on any input change
    if (error_message) set_error_message("");
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  async function handle_submit(e: React.MouseEvent | React.FormEvent) {
    e.preventDefault();

    if (is_loading) return;

    // Basic client-side guard before hitting the network
    if (!form_data.email.trim() || !form_data.password.trim()) {
      set_error_message("Please enter your email and password.");
      return;
    }

    set_is_loading(true);
    set_error_message("");

    try {
      /**
       * POST /auth/login — custom Express endpoint (ADR-002).
       * Response shape: { message, token, user: { id, email, full_name, role } }
       */
      const { data } = await api.post("/auth/login", {
        email: form_data.email.trim().toLowerCase(),
        password: form_data.password,
      });

      // ── Store the custom JWT (ADR-002) ────────────────────────────────────
      if (data.token) {
        localStorage.setItem("sb_access_token", data.token);
      }

      // ── Role-based redirect ───────────────────────────────────────────────
      const role: string = data.user?.role ?? "CONSUMER";

      if (role === "MERCHANT") {
        router.push("/m");
      } else if (role === "ADMIN") {
        router.push("/admin");
      } else {
        // CONSUMER (default)
        router.push("/home");
      }
    } catch (err) {
      // getApiErrorMessage extracts the user-facing message from Axios error shapes
      set_error_message(getApiErrorMessage(err));
    } finally {
      set_is_loading(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

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
        onSubmit={handle_submit}
        className="flex flex-col gap-5 flex-1"
        noValidate
      >
        <AuthInputComponent
          label="Email"
          name="email"
          placeholder="Enter your email"
          onChange={update_input}
          value={form_data.email}
          type="email"
        />

        <AuthInputComponent
          label="Password"
          name="password"
          placeholder="Enter your password"
          onChange={update_input}
          value={form_data.password}
          type="password"
        />

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
        {error_message && (
          <p
            id="login-error-msg"
            role="alert"
            className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
          >
            {error_message}
          </p>
        )}

        {/* Sign in button */}
        <button
          id="login-submit-btn"
          type="submit"
          disabled={is_loading}
          className="mt-4 w-full bg-primary text-white h-12 rounded-lg font-semibold text-base shadow-none transition-all flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
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
