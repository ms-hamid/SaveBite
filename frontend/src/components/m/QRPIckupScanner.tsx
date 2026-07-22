"use client";

import { useEffect, useRef } from "react";
import type { Html5Qrcode } from "html5-qrcode";

type QRPickupScannerProps = {
  onScanSuccess: (decodedText: string) => void;
  selectedCameraId?: string;
  onCamerasReady?: (cameras: { id: string; label: string }[]) => void;
};

export default function QRPickupScanner({
  onScanSuccess,
  selectedCameraId,
  onCamerasReady,
}: QRPickupScannerProps) {
  const scannerId = "pickup-qr-reader";
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasStartedRef = useRef(false);
  const isRunningRef = useRef(false);
  const hasScannedRef = useRef(false);

  async function safeStop(scanner: Html5Qrcode) {
    try {
      await scanner.stop();
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : error instanceof Error
          ? error.message
          : "";
      if (message.includes("Cannot stop")) {
        return;
      }
      console.error("Stop scanner error:", error);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function startScanner() {
      try {
        if (hasStartedRef.current) return;

        const element = document.getElementById(scannerId);

        if (!element) {
          console.error("Scanner element not found");
          return;
        }

        const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import(
          "html5-qrcode"
        );
        
        const scanner = new Html5Qrcode(scannerId, {
          verbose: false,
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        });

        scannerRef.current = scanner;

        const cameras = await Html5Qrcode.getCameras();

        if (!cameras || cameras.length === 0) {
          console.error("No camera found");
          return;
        }

        console.log("CAMERAS:", cameras);

        const cameraList = cameras.map((camera) => ({
          id: camera.id,
          label: camera.label || camera.id,
        }));

        if (onCamerasReady && isMounted) {
          onCamerasReady(cameraList);
        }

        const selectedCamera =
          cameraList.find((camera) => camera.id === selectedCameraId) ?? cameraList[0];

        hasScannedRef.current = false;

        await scanner.start(
          selectedCamera.id,
          {
            fps: 10,
            qrbox: {
              width: 240,
              height: 240,
            },
            disableFlip: false,
          },
          async (decodedText) => {
            if (hasScannedRef.current) return;

            hasScannedRef.current = true;

            console.log("QR TERBACA:", decodedText);

            try {
              await safeStop(scanner);
              scanner.clear();
            } catch (error) {
              console.error("Stop scanner error:", error);
            }

            onScanSuccess(decodedText);
          },
          () => {
            // Normal. Ini terpanggil terus saat QR belum terbaca.
          }
        );

        hasStartedRef.current = true;
      } catch (error) {
        console.error("Start scanner error:", error);
      }
    }

    const timer = window.setTimeout(() => {
      startScanner();
    }, 300);

    return () => {
      isMounted = false;
      window.clearTimeout(timer);

      const scanner = scannerRef.current;

      if (scanner) {
        safeStop(scanner)
          .then(() => {
            scanner.clear();
          })
          .catch((error) => {
            console.error("Cleanup scanner error:", error);
          });
      }

      scannerRef.current = null;
      hasStartedRef.current = false;
      hasScannedRef.current = false;
    };
  }, [onScanSuccess, onCamerasReady, selectedCameraId]);

  return <div id={scannerId} className="w-full h-full" />;
}