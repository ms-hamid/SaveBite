/**
 * @file src/lib/api.ts
 * @description Centralised Axios instance for all frontend ↔ backend-core communication.
 *
 * Design decisions:
 *  - Single instance (singleton) — one place to change base URL or interceptors.
 *  - Request interceptor auto-injects the JWT from localStorage.
 *  - Response interceptor handles 401 (expired token) globally — clears
 *    auth state and redirects to /sign-in without any per-component logic.
 *  - Never imports supabase for mutations — auth token is read from localStorage
 *    (set at login by the sign-in page after calling POST /auth/login).
 *
 * Usage:
 *   import api from '@/lib/api';
 *   const { data } = await api.post('/order', { listing_id, qty });
 */

import axios from "axios";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000";

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10_000, // 10 seconds — fail fast, don't hang UI
});

// ── Request interceptor: inject JWT ───────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("sb_access_token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle auth errors globally ────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Token expired or invalid — clear local state and redirect to login
      localStorage.removeItem("sb_access_token");
      window.location.href = "/sign-in";
    }
    return Promise.reject(error);
  }
);

export default api;

// ── Typed helper for common API errors ───────────────────────────────────────
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message;
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}
