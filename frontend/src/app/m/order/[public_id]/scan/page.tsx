"use client";

import { useCallback, useState } from "react";
import QRPickupScanner from "../../../../../components/m/QRPIckupScanner";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { pickupOrder } from "@/services/order";
import { getApiErrorMessage } from "@/lib/api";

export default function ScanPickupCodeRefinedMinimalistPage() {
  const params = useParams();
  const router = useRouter();
  const [message, setMessage] = useState("Arahkan QR code customer ke dalam frame");
  const [status, setStatus] = useState<"idle" | "success" | "error" | "loading">(
    "idle"
  );

  // Menggunakan pickupOrder dari API (sesuai ADR-001 — backend-only mutation)
  // qrToken = Order.qr_token (schema: orders.qr_token)
  // order_public_id = params.public_id (schema: orders.public_id)
  const updateOrderToCompleted = useCallback(async (qrToken: string) => {
    try {
      setStatus("loading");
      setMessage("Memeriksa kode pickup...");

      // pickupOrder mengirim { pickup_code, order_public_id } ke POST /order/pickup
      // pickup_code = Order.order_code (schema) yang di-embed dalam QR token
      await pickupOrder(qrToken, params.public_id as string);

      setStatus("success");
      setMessage("Pickup dikonfirmasi. Pesanan selesai.");

      // Redirect ke daftar order setelah sukses
      setTimeout(() => router.push("/m/order"), 1500);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage(getApiErrorMessage(error) || "Gagal memverifikasi pickup.");
    }
  }, [params.public_id, router]);

  return (
    <div className="bg-background text-text-primary h-full font-sans antialiased">
      <style>{`
        .scanner-line {
          animation: scan 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        #pickup-qr-reader {
          width: 100% !important;
          height: 100% !important;
          border: none !important;
        }

        #pickup-qr-reader video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }

        #pickup-qr-reader__dashboard_section {
          display: none !important;
        }
      `}</style>

      <div className="max-w-[448px] mx-auto min-h-full flex flex-col relative bg-background">
        <header className="fixed top-0 w-full max-w-[448px] z-50 bg-surface/95 backdrop-blur-md border-b border-border flex items-center justify-between px-6 h-16 transition-colors">
          <button className="flex items-center justify-center p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-[0.98] transition-transform duration-200 text-text-primary">
            <span className="material-symbols-outlined" data-icon="arrow_back">
              arrow_back
            </span>
          </button>

          <h1 className="font-bold text-lg text-text-primary tracking-tight">
            Scan Pickup Code
          </h1>

          <div className="w-10"></div>
        </header>

        <main className="flex-1 mt-16 px-6 py-6 flex flex-col items-center relative">
          <div className="w-full text-center mb-8 mt-4">
            <p
              className={`text-sm flex items-center justify-center gap-2 ${
                status === "success"
                  ? "text-emerald-600"
                  : status === "error"
                  ? "text-red-500"
                  : status === "loading"
                  ? "text-slate-500"
                  : "text-slate-500"
              }`}
            >
              <span
                className="material-symbols-outlined text-primary text-xl"
                data-icon="qr_code_scanner"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {status === "success" ? "check_circle" : status === "error" ? "error" : "qr_code_scanner"}
              </span>

              {message}
            </p>
          </div>

          <div className="relative w-full aspect-square max-w-[280px] bg-gray-50/50 overflow-hidden flex items-center justify-center mb-8 rounded-xl">
            <div className="absolute inset-0">
              <QRPickupScanner onScanSuccess={updateOrderToCompleted} />
            </div>

            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg z-10"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg z-10"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg z-10"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg z-10"></div>

            {status === "idle" && (
              <div className="absolute left-0 w-full h-[2px] bg-primary scanner-line shadow-[0_0_8px_2px_rgba(16,185,129,0.5)] z-10"></div>
            )}
          </div>

          <Link href={`/m/order/${params.public_id}/pickup_input`} className="w-full max-w-[280px] py-3 px-4 rounded-xl border border-border bg-surface text-text-primary hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 text-sm font-semibold shadow-sm">
            <span
              className="material-symbols-outlined text-text-secondary text-lg"
              data-icon="keyboard"
            >
              keyboard
            </span>
            Enter code manually
          </Link>

          <div className="mt-auto pt-6 w-full text-center mb-6">
            <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-[14px]" data-icon="info">info</span>
              Hanya scan QR dari order berstatus Ready.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}