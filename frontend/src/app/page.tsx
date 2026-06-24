"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { enablePushNotification } from "../lib/firebase/messaging";

export default function OnboardingPage() {


  useEffect(()=>{

    enablePushNotification();

  },[]);

  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  /**
   * Three-state auth gate:
   *  - "checking" → spinner / blank screen while we read localStorage
   *  - "authenticated" → useEffect redirects to /home; nothing rendered
   *  - "unauthenticated" → render onboarding carousel
   */
  const [authState, setAuthState] = useState<"checking" | "authenticated" | "unauthenticated">(
    "checking"
  );

  // ── Auth guard — runs once on mount ────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("sb_access_token");
    if (token) {
      // Authenticated: skip onboarding, go straight to the dashboard
      router.replace("/home");
      setAuthState("authenticated");
    } else {
      setAuthState("unauthenticated");
    }
  }, [router]);

  // ── Onboarding navigation ──────────────────────────────────────────────────
  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      // Last slide "Get Started" → send to login
      router.push("/login");
    }
  };

  const skipOnboarding = () => {
    // Skip always routes to login — user can sign up or sign in from there
    router.push("/login");
  };

  // ── Slide definitions ──────────────────────────────────────────────────────
  const slides = [
    {
      title: (
        <>
          Save food. <br />
          <span className="text-primary">Save money.</span>
        </>
      ),
      description: "Buy surplus meals from local stores at lower prices.",
      image: (
        <div
          className="w-full h-full bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBqpekbePXWsVFC8Odz3CA1Du3GX-uGRwFwE53ld-RCG40j_BjcabXLPQCzgUYgR7hd7l0NkgVLtthi_5u7cZpdT_3Kp4K--8KGrBPBdccy8QSol2D2UqykItj18jMCeVFzD13pzfZcNaX4j3kI8MOdRLg3bujJh9QW-wI6VV6QivPcWpUiRRyK5suqGaowM_oTMeeO01IHlwa38BMSQYPI1jc5OFTxRdJ1nXpD-NZZ92m9rY3mdTOIU1nesWFX5csK0_GfJvFb-t4V")',
          }}
        />
      ),
    },
    {
      title: "Reduce food waste.",
      description: "Every rescued meal reduces waste and lowers emissions.",
      image: (
        <svg className="w-full h-full" fill="none" viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="160" className="fill-primary/5" />
          <path
            d="M120 280 C120 280 150 240 200 240 C250 240 280 280 280 280 L120 280 Z"
            className="fill-primary/20"
          />
          <g transform="translate(200, 260)">
            <path d="M0 0 L0 -100" stroke="#10b981" strokeWidth="8" strokeLinecap="round" />
            <path d="M0 -60 Q-40 -80 -50 -40 Q-40 -20 0 -40 Z" fill="#34d399" />
            <path d="M0 -80 Q40 -100 50 -60 Q40 -40 0 -60 Z" fill="#10b981" />
            <path d="M0 -100 Q-20 -130 0 -150 Q20 -130 0 -100 Z" fill="#059669" />
          </g>
        </svg>
      ),
    },
    {
      title: "Reserve & pick up easily.",
      description: "Reserve in the app and show your QR code at pickup.",
      image: (
        <div className="relative w-64 h-[480px] bg-white rounded-[2.5rem] border-[8px] border-slate-900 shadow-2xl overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute top-0 w-32 h-6 bg-slate-900 rounded-b-xl" />
          <div className="flex flex-col items-center justify-center w-full h-full bg-slate-50 p-6 space-y-6">
            <div className="w-full flex justify-between items-center opacity-50">
              <div className="h-2 w-12 bg-slate-300 rounded-full" />
              <div className="h-6 w-6 rounded-full bg-slate-300" />
            </div>
            <div className="w-40 h-40 bg-white rounded-xl border-2 border-primary/20 p-3 shadow-sm flex items-center justify-center relative">
              <div className="grid grid-cols-4 grid-rows-4 gap-1 w-full h-full">
                <div className="bg-slate-900 col-span-2 row-span-2 rounded-sm" />
                <div className="bg-slate-900 col-start-4 rounded-sm" />
                <div className="bg-slate-900 row-start-2 col-start-3 rounded-sm" />
                <div className="bg-slate-900 row-start-3 col-start-1 rounded-sm" />
                <div className="bg-slate-900 col-start-4 row-start-4 rounded-sm" />
                <div className="bg-slate-900 col-span-2 row-span-2 col-start-2 row-start-3 rounded-sm opacity-50" />
              </div>
              <div className="absolute w-full h-0.5 bg-primary top-1/2" />
            </div>
          </div>
        </div>
      ),
    },
  ];

  // ── Render guard ───────────────────────────────────────────────────────────
  // Show nothing during the auth check to avoid a flash of the onboarding UI
  // for already-authenticated users.
  if (authState === "checking" || authState === "authenticated") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Onboarding UI (unauthenticated users only) ─────────────────────────────
  return (
    <div className="relative flex h-screen w-full max-w-md mx-auto flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="flex justify-end px-6 pt-10">
        {currentSlide < slides.length - 1 && (
          <button
            id="onboarding-skip-btn"
            onClick={skipOnboarding}
            className="text-slate-500 font-medium"
          >
            Skip
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-8">
        <div className="w-full max-w-sm aspect-square flex items-center justify-center mb-8 mt-4">
          {slides[currentSlide].image}
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4 mt-4">
            {slides[currentSlide].title}
          </h1>
          <p className="text-slate-500 max-w-xs mx-auto">
            {slides[currentSlide].description}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 pb-10">
        {/* Slide indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index ? "w-8 bg-primary" : "w-2 bg-slate-300"
              }`}
            />
          ))}
        </div>

        {/* CTA button */}
        <button
          id="onboarding-next-btn"
          onClick={nextSlide}
          className="w-full h-14 rounded-2xl bg-primary text-white font-semibold"
        >
          {currentSlide === slides.length - 1 ? "Get Started" : "Continue"}
        </button>

        {currentSlide === slides.length - 1 && (
          <button
            id="onboarding-signin-btn"
            onClick={() => router.push("/login")}
            className="w-full mt-4 text-sm text-slate-500"
          >
            Already have an account?{" "}
            <span className="text-primary font-semibold">Sign In</span>
          </button>
        )}
      </div>
    </div>
  );
}