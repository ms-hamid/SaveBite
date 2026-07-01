import { supabase } from "@/lib/supabase";
import api from "../lib/api";
import { deleteDeviceToken } from "./notification";

export async function login(
  email: string,
  password: string
) {
  console.log(api.defaults.baseURL)
  
  const response = await api.post(
    "/auth/login",
    {
      email,
      password,
    }
  );

  const data = response.data;

  localStorage.setItem(
    "sb_access_token",
    data.token
  );

  localStorage.setItem(
    "role",
    data.role
  )

  localStorage.setItem(
    "kyc_status",
    data.kyc_status
  )

  return data;
}

type RegisterPayload = {
  email: string;
  password: string;
  full_name: string;
  role: "CUSTOMER" | "MERCHANT";

  merchant_name?: string;
  address?: string;
  category?: string;
};

export async function register(
  payload: RegisterPayload
) {
  const {
    email,
    password,
    full_name,
    role,
  } = payload;

  // 1. Register ke Supabase Auth
  const {
    data,
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "http://localhost:3000/email-verification/success"
    }
  }, );

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error(
      "Gagal membuat akun."
    );
  }

  // 2. Kirim ke backend
  const response = await api.post(
    "/auth/reg",
    {
      user_id: data.user.id,
      full_name,
      role,
      merchant_name:
        payload.merchant_name,
      address: payload.address,
      category: payload.category,
    }
  );
  return response.data;
}

export async function resend_email_verif(email: string){
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
  });

  console.log("error", error)
  return error;
}

/**
 * Initiate password reset by sending OTP to email
 * @param email
 * @returns { success: true, message: string }
 */
export async function forgot_password(email: string) {
  const response = await api.post(
    "/auth/forgot-password",
    { email }
  );

  return response.data;
}

/**
 * Verify OTP and get reset token
 * @param email
 * @param otp - 6-digit code
 * @returns { success: true, resetToken: string, message: string }
 */
export async function verify_reset_otp(email: string, otp: string) {
  const response = await api.post(
    "/auth/verify-reset-otp",
    { email, otp }
  );

  return response.data;
}

/**
 * Reset password using reset token
 * @param resetToken - JWT token from verify_reset_otp
 * @param password - new password
 * @param confirmPassword - password confirmation
 * @returns { success: true, message: string }
 */
export async function reset_password(
  resetToken: string,
  password: string,
  confirmPassword: string
) {
  const response = await api.post(
    "/auth/reset-password",
    { resetToken, password, confirmPassword }
  );

  return response.data;
}

export async function logout() {
  const token = localStorage.getItem("fcm_token");
  if (token) {
    try {
      await deleteDeviceToken(token);
    } catch (e) {
      console.error("Failed to delete FCM token on logout:", e);
    }
    localStorage.removeItem("fcm_token");
  }
  return await api.post("/auth/logout");
}