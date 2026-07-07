"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMerchantDetail } from "@/services/user";

type TravelMode = "walk" | "car" | "motor";

export default function SaveBiteDirections() {
  const params = useParams();
  const router = useRouter();
  const merchantId = params.id as string;

  const [merchant, setMerchant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [customerLat, setCustomerLat] = useState<number | null>(null);
  const [customerLng, setCustomerLng] = useState<number | null>(null);
  const [gpsLoading, setGpsLoading] = useState(true);
  
  // Active travel mode state
  const [activeTravelMode, setActiveTravelMode] = useState<TravelMode>("car");

  // Retrieve customer GPS location
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Customer GPS:", position.coords.latitude, position.coords.longitude);
          setCustomerLat(position.coords.latitude);
          setCustomerLng(position.coords.longitude);
          setGpsLoading(false);
        },
        (err) => {
          console.error("GPS Error:", err);
          setGpsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
      setGpsLoading(false);
    }
  }, []);

  // Retrieve merchant details
  useEffect(() => {
    if (!merchantId) return;

    async function loadMerchant() {
      try {
        const res = await getMerchantDetail(merchantId);
        if (res?.success && res?.data) {
          setMerchant(res.data);
    console.log("Opening Google Maps for merchant:", res.data);
          
        } else {
          setError("Gagal memuat detail toko");
        }
      } catch (err: any) {
        console.error(err);
        setError("Gagal memuat detail toko");
      } finally {
        setLoading(false);
      }
    }
    loadMerchant();
  }, [merchantId]);

  // Haversine formula to compute distance in km
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const merchantLat = merchant?.latitude || -6.2088;
  const merchantLng = merchant?.longitude || 106.8456;

  const distance =
    customerLat !== null && customerLng !== null
      ? getDistance(customerLat, customerLng, merchantLat, merchantLng)
      : null;

  // Approximate travel times based on speed
  const walkTime = distance ? Math.round((distance / 5) * 60) : 12; // 5 km/h
  const carTime = distance ? Math.round((distance / 30) * 60) : 5; // 30 km/h
  const motorTime = distance ? Math.round((distance / 25) * 60) : 6; // 25 km/h

  // Embed map URL
  // If customer coordinates exist, show route. Otherwise center on merchant store marker.
  const mapEmbedUrl =
    customerLat !== null && customerLng !== null
      ? `https://maps.google.com/maps?saddr=${customerLat},${customerLng}&daddr=${merchantLat},${merchantLng}&output=embed&t=m&z=15`
      : `https://maps.google.com/maps?q=${merchantLat},${merchantLng}&output=embed&t=m&z=15`;

  const handleStartNavigation = () => {
    // Map travel mode to Google Maps travelmode parameter
    const travelModeMap: Record<TravelMode, string> = {
      walk: "walking",
      car: "driving",
      motor: "driving", // motorcycles use driving mode in Google Maps
    };

    const googleTravelMode = travelModeMap[activeTravelMode];

    if (customerLat !== null && customerLng !== null) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&origin=${customerLat},${customerLng}&destination=${merchantLat},${merchantLng}&travelmode=${googleTravelMode}`,
        "_blank"
      );
    } else {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${merchantLat},${merchantLng}`,
        "_blank"
      );
    }
  };

  const handleOpenGoogleMaps = () => {
    const addressQuery = encodeURIComponent(
      merchant?.address || merchant?.merchant_name || "Green Leaf Bakery"
    );
    window.open(`https://www.google.com/maps/search/?api=1&query=${addressQuery}`, "_blank");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display antialiased overflow-hidden h-screen flex flex-col relative">
      
      {/* Mobile Container Wrapper - max width 448px centered */}
      <div className="w-full max-w-[448px] mx-auto h-full relative">
        
        {/* Map view (iframe instead of static image) */}
        <div className="absolute inset-0 w-full h-full z-0 bg-gray-100 dark:bg-slate-900">
          <iframe
            title="Google Maps Route Directions"
            src={mapEmbedUrl ?? "https://upload.wikimedia.org/wikipedia/commons/6/60/No-Image-Placeholder-banner.svg"}
            className="w-full h-full border-none opacity-95"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>

        {/* Back button */}
        <div className="absolute top-0 left-0 right-0 z-30 pt-safe-top pointer-events-none">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors pointer-events-auto"
            >
              <span className="material-symbols-outlined text-slate-700 dark:text-slate-200 text-[20px]">
                arrow_back
              </span>
            </button>
          </div>
        </div>

        {/* Top right widgets */}
        <div className="absolute top-20 right-3 flex flex-col gap-2 z-30 pointer-events-auto">
          <button
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                  setCustomerLat(pos.coords.latitude);
                  setCustomerLng(pos.coords.longitude);
                });
              }
            }}
            className="bg-white dark:bg-slate-800 w-9 h-9 flex items-center justify-center rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              my_location
            </span>
          </button>
        </div>

        {/* Info card at the bottom */}
        <div className="absolute inset-x-0 bottom-0 z-40 flex flex-col pointer-events-none h-screen justify-end">
          <div className="bg-white dark:bg-slate-900 w-full rounded-t-[1.25rem] shadow-[0_-4px_24px_rgba(0,0,0,0.06)] pointer-events-auto flex flex-col max-h-[85vh]">
            
            <div className="w-full flex justify-center pt-2.5 pb-2 cursor-grab active:cursor-grabbing">
              <div className="w-9 h-1 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar px-5 pb-safe-bottom">
              <div className="flex justify-between items-start mb-3">
                <div className="w-full">
                  <h2 className="text-[1.15rem] font-bold text-slate-900 dark:text-white flex items-center gap-1.5 leading-tight">
                    {merchant?.merchant_name || "Green Leaf Bakery"}
                    <span
                      className="material-symbols-outlined text-blue-500 text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                  </h2>

                  <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-0.5">
                      <span
                        className="text-system-green text-[16px] material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {merchant?.rating ? String(merchant.rating) : "N/A"}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      ({merchant?.rating_times ? String(merchant.rating_times) : "No Ratings"})
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-slate-600 dark:text-slate-400">
                      {merchant?.category || "Bakery"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                  <div className="w-5 h-5 mt-0.5 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-slate-400 text-[14px]">
                      location_on
                    </span>
                  </div>
                  <span className="text-[13px] font-medium leading-tight">
                    {merchant?.address || "123 Baker Street, Downtown"}
                  </span>
                </div>

                <div className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                  <div className="w-5 h-5 mt-0.5 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-slate-400 text-[14px]">
                      schedule
                    </span>
                  </div>
                  <div className="text-[13px] flex flex-col leading-tight">
                    <span className="font-medium text-system-green">
                      Open Now
                      {merchant?.pickup_close && (
                        <span className="text-slate-500 dark:text-slate-400 font-normal ml-1">
                          Closes {new Date(merchant.pickup_close).toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {merchant?.auth_user?.phone && (
                  <button className="flex items-start gap-3 text-slate-600 dark:text-slate-300 w-full text-left active:bg-gray-50 dark:active:bg-slate-800/50 rounded-lg -ml-1.5 p-1.5 transition-colors">
                    <div className="w-5 h-5 mt-0.5 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center shrink-0 ml-px">
                      <span className="material-symbols-outlined text-slate-400 text-[14px]">
                        call
                      </span>
                    </div>
                    <span className="text-[13px] font-medium leading-tight mt-0.5">
                      {merchant.auth_user.phone}
                    </span>
                  </button>
                )}
              </div>

              <div className="h-px bg-gray-100 dark:bg-slate-800 w-full mb-4"></div>

              {/* Travel mode times - NOW CLICKABLE WITH ACTIVE STATE */}
              <div className="flex items-center justify-between gap-2 mb-5 p-1 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                {/* Walking */}
                <button
                  onClick={() => setActiveTravelMode("walk")}
                  className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all ${
                    activeTravelMode === "walk"
                      ? "bg-white dark:bg-slate-700 text-primary shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-black/5 dark:ring-white/5"
                      : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                  }`}
                >
                  <div className={`relative ${activeTravelMode === "walk" ? "overflow-hidden w-full h-full flex flex-col items-center justify-center" : ""}`}>
                    {activeTravelMode === "walk" && (
                      <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10"></div>
                    )}
                    <span className={`material-symbols-outlined mb-1 text-[20px] ${activeTravelMode === "walk" ? "relative z-10" : ""}`}>
                      directions_walk
                    </span>
                    <span className={`text-[10px] font-semibold ${activeTravelMode === "walk" ? "font-bold relative z-10" : ""}`}>
                      {walkTime} min
                    </span>
                  </div>
                </button>

                {/* Car */}
                <button
                  onClick={() => setActiveTravelMode("car")}
                  className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all ${
                    activeTravelMode === "car"
                      ? "bg-white dark:bg-slate-700 text-primary shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-black/5 dark:ring-white/5"
                      : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                  }`}
                >
                  <div className={`relative ${activeTravelMode === "car" ? "overflow-hidden w-full h-full flex flex-col items-center justify-center" : ""}`}>
                    {activeTravelMode === "car" && (
                      <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10"></div>
                    )}
                    <span className={`material-symbols-outlined mb-1 text-[20px] ${activeTravelMode === "car" ? "relative z-10" : ""}`}>
                      directions_car
                    </span>
                    <span className={`text-[10px] font-semibold ${activeTravelMode === "car" ? "font-bold relative z-10" : ""}`}>
                      {carTime} min
                    </span>
                  </div>
                </button>

                {/* Motorcycle */}
                <button
                  onClick={() => setActiveTravelMode("motor")}
                  className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all ${
                    activeTravelMode === "motor"
                      ? "bg-white dark:bg-slate-700 text-primary shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-black/5 dark:ring-white/5"
                      : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                  }`}
                >
                  <div className={`relative ${activeTravelMode === "motor" ? "overflow-hidden w-full h-full flex flex-col items-center justify-center" : ""}`}>
                    {activeTravelMode === "motor" && (
                      <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10"></div>
                    )}
                    <span className={`material-symbols-outlined mb-1 text-[20px] ${activeTravelMode === "motor" ? "relative z-10" : ""}`}>
                      two_wheeler
                    </span>
                    <span className={`text-[10px] font-semibold ${activeTravelMode === "motor" ? "font-bold relative z-10" : ""}`}>
                      {motorTime} min
                    </span>
                  </div>
                </button>
              </div>

              <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                    Distance
                  </span>
                  <span className="text-[15px] font-bold text-slate-900 dark:text-white mt-0.5">
                    {distance !== null ? `${distance.toFixed(2)} km` : "distance N/A"}
                    {merchant?.isPlaceholderGeo && " (Placeholder)"}
                  </span>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white dark:bg-slate-900 pt-2 pb-6 z-20">
                <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-white dark:to-slate-900 -translate-y-full pointer-events-none"></div>

                <button
                  onClick={handleStartNavigation}
                  className="w-full bg-primary hover:bg-primary-dark text-slate-900 font-bold text-[15px] py-3.5 px-6 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    navigation
                  </span>
                  Start Navigation
                </button>

                <button
                  onClick={handleOpenGoogleMaps}
                  className="w-full mt-3 bg-transparent text-slate-500 dark:text-slate-400 font-semibold text-[13px] py-1 flex items-center justify-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Open in Google Maps
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}