"use client";

/**
 * MerchantChooseLocation Component
 *
 * Dependensi yang perlu diinstall:
 *   npm install leaflet react-leaflet leaflet-defaulticon-compatibility
 *   npm install @types/leaflet --save-dev
 *
 * Cara penggunaan di page signup (page.tsx):
 *
 *   import MerchantChooseLocation from "../../components/sign-up/location_merchant";
 *
 *   // Di dalam merchant_steps array, step ke-4 (index 3):
 *   {
 *     head: "Where is your store located?",
 *     desc: "Customers will use this to find your store.",
 *     component: (
 *       <MerchantChooseLocation
 *         latitude={input_data.latitude}
 *         longitude={input_data.longitude}
 *         address={input_data.address}
 *         update_function={update_input}
 *         errors={errors}
 *       />
 *     ),
 *   }
 *
 * Perubahan pada RegisterData type (types.ts):
 *   latitude: number | null;
 *   longitude: number | null;
 *
 * Perubahan pada state awal (page.tsx):
 *   latitude: null,
 *   longitude: null,
 */

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

// ─── Lazy-load Leaflet components (SSR-safe) ───────────────────────────────
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

// ─── LocationPicker – inner map event handler ──────────────────────────────
// Wrapped in its own dynamic import so useMapEvents runs client-side only
const LocationPickerInner = dynamic(
  () =>
    import("react-leaflet").then((m) => {
      const { useMapEvents } = m;

      function LocationPickerInnerComponent({
        onLocationSelect,
      }: {
        onLocationSelect: (lat: number, lng: number) => void;
      }) {
        useMapEvents({
          click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
          },
        });
        return null;
      }

      return LocationPickerInnerComponent;
    }),
  { ssr: false }
);

// ─── MapRecenter – fly to a coordinate ────────────────────────────────────
const MapRecenter = dynamic(
  () =>
    import("react-leaflet").then((m) => {
      const { useMap } = m;

      function MapRecenterComponent({ lat, lng }: { lat: number; lng: number }) {
        const map = useMap();
        useEffect(() => {
          map.flyTo([lat, lng], 16, { duration: 1.2 });
        }, [lat, lng, map]);
        return null;
      }

      return MapRecenterComponent;
    }),
  { ssr: false }
);

// ─── Props ─────────────────────────────────────────────────────────────────
interface MerchantChooseLocationProps {
  latitude: number | null | undefined;
  longitude: number | null | undefined;
  address: string;
  update_function: (key: string, value: any) => void;
  errors?: Partial<Record<string, string>>;
}

// ─── Default center: Batam, Indonesia ─────────────────────────────────────
const DEFAULT_CENTER: [number, number] = [1.0828, 104.0305];

// ─── Reverse geocode via Nominatim ─────────────────────────────────────────
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      { headers: { "Accept-Language": "id" } }
    );
    const data = await res.json();
    return data.display_name ?? "";
  } catch {
    return "";
  }
}

// ─── Component ─────────────────────────────────────────────────────────────
export default function MerchantChooseLocation({
  latitude,
  longitude,
  address,
  update_function,
  errors = {},
}: MerchantChooseLocationProps) {
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError]     = useState<string | null>(null);
  const [addrLoading, setAddrLoading] = useState(false);
  const [mapReady, setMapReady]     = useState(false);
  const [recenterKey, setRecenterKey] = useState(0);

  const hasPosition = latitude !== null && longitude !== null;
  const markerPos: [number, number] | null = hasPosition
    ? [latitude!, longitude!]
    : null;

  // ── Ensure Leaflet default icons render correctly ──────────────────────
  useEffect(() => {
    import("leaflet-defaulticon-compatibility").catch(() => {
      // fallback: manually fix icon paths
      import("leaflet").then((L) => {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        });
      });
    });
    setMapReady(true);
  }, []);

  // ── Handler: pick location from map click ─────────────────────────────
  const handleLocationSelect = useCallback(
    async (lat: number, lng: number) => {
      update_function("latitude", lat);
      update_function("longitude", lng);

      setAddrLoading(true);
      const addr = await reverseGeocode(lat, lng);
      if (addr) update_function("address", addr);
      setAddrLoading(false);
    },
    [update_function]
  );

  // ── Handler: use current GPS position ─────────────────────────────────
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation tidak didukung oleh browser Anda.");
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        update_function("latitude", lat);
        update_function("longitude", lng);
        setRecenterKey((k) => k + 1); // trigger map fly

        setAddrLoading(true);
        const addr = await reverseGeocode(lat, lng);
        if (addr) update_function("address", addr);
        setAddrLoading(false);

        setGeoLoading(false);
      },
      (err) => {
        setGeoLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setGeoError("Izin lokasi ditolak. Aktifkan izin lokasi di browser.");
            break;
          case err.POSITION_UNAVAILABLE:
            setGeoError("Informasi lokasi tidak tersedia.");
            break;
          case err.TIMEOUT:
            setGeoError("Permintaan lokasi timeout. Coba lagi.");
            break;
          default:
            setGeoError("Gagal mengambil lokasi.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-5">

      {/* ── "Use My Location" button ── */}
      <button
        type="button"
        onClick={handleUseCurrentLocation}
        disabled={geoLoading}
        className="
          w-full h-14 rounded-xl border-2 border-primary
          flex items-center justify-center gap-3
          font-semibold text-primary text-sm
          transition-all active:scale-[0.98]
          hover:bg-primary/5
          disabled:opacity-60 disabled:cursor-not-allowed
        "
      >
        {geoLoading ? (
          <>
            <SpinnerIcon />
            Mendapatkan lokasi…
          </>
        ) : (
          <>
            <LocationPinIcon />
            Gunakan Lokasi Saya
          </>
        )}
      </button>

      {geoError && (
        <p className="text-sm text-red-500 -mt-2">{geoError}</p>
      )}

      {/* ── Divider ── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          atau pilih di peta
        </span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* ── Map ── */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm" style={{ height: 280 }}>
        {mapReady && (
          // @ts-ignore – dynamic import typing quirk
          <MapContainer
            center={markerPos ?? DEFAULT_CENTER}
            zoom={markerPos ? 16 : 12}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
          >
            {/* @ts-ignore */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            {/* @ts-ignore */}
            <LocationPickerInner onLocationSelect={handleLocationSelect} />

            {markerPos && (
              <>
                {/* @ts-ignore */}
                <MapRecenter key={recenterKey} lat={markerPos[0]} lng={markerPos[1]} />
                {/* @ts-ignore */}
                <Marker position={markerPos}>
                  {/* @ts-ignore */}
                  <Popup>Lokasi toko Anda</Popup>
                </Marker>
              </>
            )}
          </MapContainer>
        )}

        {!mapReady && (
          <div className="h-full flex items-center justify-center bg-slate-50">
            <SpinnerIcon className="text-primary" />
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 -mt-2 text-center">
        Klik pada peta untuk memilih lokasi toko Anda
      </p>

      {/* ── Lat / Lng read-only display ── */}
      <div className="grid grid-cols-2 gap-3">
        <CoordField
          label="Latitude"
          value={latitude !== null ? latitude?.toFixed(6) : ""}
          placeholder="-0.000000"
        />
        <CoordField
          label="Longitude"
          value={longitude !== null ? longitude?.toFixed(6) : ""}
          placeholder="000.000000"
        />
      </div>

      {(errors.latitude || errors.longitude) && (
        <p className="text-sm text-red-500 -mt-2">
          {errors.latitude ?? errors.longitude}
        </p>
      )}

      {/* ── Address (auto-filled, editable) ── */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Alamat Toko
        </label>
        <div className="relative">
          <textarea
            value={address}
            onChange={(e) => update_function("address", e.target.value)}
            placeholder="Alamat akan terisi otomatis setelah memilih lokasi…"
            rows={3}
            className="
              w-full rounded-xl border border-slate-200 p-4
              text-sm text-slate-900 leading-relaxed
              outline-none resize-none
              focus:ring-2 focus:ring-primary focus:border-transparent
              transition-all
            "
          />
          {addrLoading && (
            <div className="absolute right-3 top-3">
              <SpinnerIcon className="text-slate-400" />
            </div>
          )}
        </div>
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address}</p>
        )}
      </div>

    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function CoordField({
  label,
  value,
  placeholder,
}: {
  label: string | undefined;
  value: string | undefined;
  placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {label}
      </label>
      <div
        className="
          h-12 rounded-xl border border-slate-200 bg-slate-50
          px-4 flex items-center
          text-sm font-mono text-slate-700
          select-all
        "
      >
        {value || (
          <span className="text-slate-300 font-sans">{placeholder}</span>
        )}
      </div>
    </div>
  );
}

function LocationPinIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function SpinnerIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin h-5 w-5 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  );
}