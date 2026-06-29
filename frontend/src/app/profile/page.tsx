"use client"
import { useRouter } from "next/navigation";
import CustomerNavbar from "../../components/navbar/customer_navbar";
import { logout } from "@/services/auth";
import { useState } from "react";

export default function ProfilePage() {
  const router = useRouter()
  const [loadingPasswordReset, setLoadingPasswordReset] = useState(false);
  const [resetError, setResetError] = useState("");
  
  async function handleLogout() {
    await logout()
    router.push("/login")
  } 

  async function handleChangePassword() {
    setLoadingPasswordReset(true);
    setResetError("");
    try {
      const { getMyProfile } = await import("@/services/user");
      const profileRes = await getMyProfile();
      const email = profileRes?.data?.email;
      
      if (!email) {
        throw new Error("Email tidak ditemukan pada profil Anda.");
      }

      const { forgot_password } = await import("@/services/auth");
      await forgot_password(email);

      sessionStorage.setItem("reset_email", email);
      router.push("/verify-reset-otp");
    } catch (err: any) {
      console.error("Change password error:", err);
      setResetError(err.message || err.response?.data?.message || "Gagal memproses ganti password");
    } finally {
      setLoadingPasswordReset(false);
    }
  }
  
  return (
    <>
      <div>
        <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 pt-6 pb-6 border-b border-transparent">
          <div className="flex items-center justify-between h-12">
            <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Settings</h2>
            <div className="w-10 h-10" />
          </div>
        </header>
        <main className="flex-1 px-4 pt-1 pb-32 overflow-y-auto no-scrollbar max-w-md mx-auto w-full">
          {resetError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs font-semibold text-center">
              {resetError}
            </div>
          )}
          {loadingPasswordReset && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-[#16C47F] rounded-xl p-3 text-xs font-semibold text-center animate-pulse">
              Mengirim kode OTP ke email Anda...
            </div>
          )}
          <section className="mb-6">
            <h3 className="text-[10px] font-bold text-slate-400/50 dark:text-slate-500/50 uppercase tracking-[0.2em] mb-1.5 ml-1">Profile &amp; Security</h3>
            <div className="bg-white dark:bg-slate-800 rounded-[20px] overflow-hidden shadow-soft border border-slate-100 dark:border-slate-700/50">
              <button 
                onClick={() => router.push("/profile/edit-profile")}
                className="w-full h-14 px-4 flex items-center justify-between active:bg-slate-50 dark:active:bg-slate-700 transition-colors border-b border-slate-50 dark:border-slate-700/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-[30px] h-[30px] rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <span className="material-icons-round text-[18px]">person</span>
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Edit Profile</span>
                </div>
                <span className="material-icons-round text-slate-300/60 dark:text-slate-600">chevron_right</span>
              </button>
              <button 
                onClick={handleChangePassword}
                disabled={loadingPasswordReset}
                className="w-full h-14 px-4 flex items-center justify-between active:bg-slate-50 dark:active:bg-slate-700 transition-colors border-b border-slate-50 dark:border-slate-700/50 disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-[30px] h-[30px] rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <span className="material-icons-round text-[18px]">lock</span>
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {loadingPasswordReset ? "Processing..." : "Change Password"}
                  </span>
                </div>
                <span className="material-icons-round text-slate-300/60 dark:text-slate-600">chevron_right</span>
              </button>
              <button className="w-full h-14 px-4 flex items-center justify-between active:bg-slate-50 dark:active:bg-slate-700 transition-colors border-b border-slate-50 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-[30px] h-[30px] rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <span className="material-icons-round text-[18px]">credit_card</span>
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Payment Methods</span>
                </div>
                <span className="material-icons-round text-slate-300/60 dark:text-slate-600">chevron_right</span>
              </button>
              <button className="w-full h-14 px-4 flex items-center justify-between active:bg-slate-50 dark:active:bg-slate-700 transition-colors border-b border-slate-50 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-[30px] h-[30px] rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <span className="material-icons-round text-[18px]">shopping_bag</span>
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Pickup Preferences</span>
                </div>
                <span className="material-icons-round text-slate-300/60 dark:text-slate-600">chevron_right</span>
              </button>
              <button className="w-full h-14 px-4 flex items-center justify-between active:bg-slate-50 dark:active:bg-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-[30px] h-[30px] rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <span className="material-icons-round text-[18px]">language</span>
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Language</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">English (US)</span>
                  <span className="material-icons-round text-slate-300/60 dark:text-slate-600">chevron_right</span>
                </div>
              </button>
            </div>
          </section>
          <section className="mb-6">
            <h3 className="text-[10px] font-bold text-slate-400/50 dark:text-slate-500/50 uppercase tracking-[0.2em] mb-1.5 ml-1">Notifications</h3>
            <div className="bg-white dark:bg-slate-800 rounded-[20px] overflow-hidden shadow-soft border border-slate-100 dark:border-slate-700/50">
              <button className="w-full h-14 px-4 flex items-center justify-between active:bg-slate-50 dark:active:bg-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-[30px] h-[30px] rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <span className="material-icons-round text-[18px]">notifications</span>
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Notifications</span>
                </div>
                <span className="material-icons-round text-slate-300/60 dark:text-slate-600">chevron_right</span>
              </button>
            </div>
          </section>
          <section className="mb-6">
            <h3 className="text-[10px] font-bold text-slate-400/50 dark:text-slate-500/50 uppercase tracking-[0.2em] mb-1.5 ml-1">Support &amp; Legal</h3>
            <div className="bg-white dark:bg-slate-800 rounded-[20px] overflow-hidden shadow-soft border border-slate-100 dark:border-slate-700/50">
              <button className="w-full h-14 px-4 flex items-center justify-between active:bg-slate-50 dark:active:bg-slate-700 transition-colors border-b border-slate-50 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-[30px] h-[30px] rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <span className="material-icons-round text-[18px]">help</span>
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Help Center</span>
                </div>
                <span className="material-icons-round text-slate-300/60 dark:text-slate-600">chevron_right</span>
              </button>
              <button className="w-full h-14 px-4 flex items-center justify-between active:bg-slate-50 dark:active:bg-slate-700 transition-colors border-b border-slate-50 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-[30px] h-[30px] rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <span className="material-icons-round text-[18px]">contact_support</span>
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Contact Support</span>
                </div>
                <span className="material-icons-round text-slate-300/60 dark:text-slate-600">chevron_right</span>
              </button>
              <button className="w-full h-14 px-4 flex items-center justify-between active:bg-slate-50 dark:active:bg-slate-700 transition-colors border-b border-slate-50 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-[30px] h-[30px] rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <span className="material-icons-round text-[18px]">policy</span>
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Privacy Policy</span>
                </div>
                <span className="material-icons-round text-slate-300/60 dark:text-slate-600">chevron_right</span>
              </button>
              <button className="w-full h-14 px-4 flex items-center justify-between active:bg-slate-50 dark:active:bg-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-[30px] h-[30px] rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <span className="material-icons-round text-[18px]">description</span>
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Terms &amp; Conditions</span>
                </div>
                <span className="material-icons-round text-slate-300/60 dark:text-slate-600">chevron_right</span>
              </button>
            </div>
          </section>
          <section className="mb-12">
            <h3 className="text-[10px] font-bold text-rose-400/50 dark:text-rose-500/50 uppercase tracking-[0.2em] mb-1.5 ml-1">Danger Zone</h3>
            <div className="bg-white dark:bg-slate-800 rounded-[20px] overflow-hidden shadow-soft border border-slate-100 dark:border-slate-700/50">
              <button className="w-full h-14 px-4 flex items-center justify-between active:bg-rose-50 dark:active:bg-rose-900/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-[30px] h-[30px] rounded-full bg-rose-50/50 dark:bg-rose-900/10 flex items-center justify-center text-rose-300 dark:text-rose-400">
                    <span className="material-icons-round text-[18px]">delete</span>
                  </div>
                  <span className="font-bold text-sm text-rose-400 dark:text-rose-400">Delete Account</span>
                </div>
                <span className="material-icons-round text-rose-300/40 dark:text-rose-400/40">chevron_right</span>
              </button>
            </div>
          </section>
          <div className="text-center pb-8 flex flex-col items-center gap-6 mt-8">
            <button 
            onClick={handleLogout}
            className="w-full border border-rose-200 dark:border-rose-900/30 text-rose-400 hover:text-rose-500 hover:bg-rose-50 dark:text-rose-400/80 dark:hover:text-rose-300 dark:hover:bg-rose-900/10 transition-colors py-3 px-8 rounded-xl font-bold text-sm">
              Log Out
            </button>
            <p className="text-[10px] text-slate-300/60 dark:text-slate-600/60 font-medium tracking-wide scale-90">Version 2.4.0 (184)</p>
          </div>
        </main>
        <CustomerNavbar active_tab="profile"/>
      </div>
    </>
  );
}
