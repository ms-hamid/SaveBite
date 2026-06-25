import type { MetadataRoute } from "next";
import { PWA_CONFIG } from "@/lib/pwa/pwa-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: PWA_CONFIG.appName,
    short_name: PWA_CONFIG.appShortName,
    description: PWA_CONFIG.appDescription,
    start_url: PWA_CONFIG.startUrl,
    scope: "/",
    display: "standalone",
    background_color: PWA_CONFIG.backgroundColor,
    theme_color: PWA_CONFIG.themeColor,
    orientation: "portrait",
    icons: [
      // {
      //   src: "/icons/icon-192x192.png",
      //   sizes: "192x192",
      //   type: "image/png",
      // },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      // {
      //   src: "/icons/maskable-icon-512x512.png",
      //   sizes: "512x512",
      //   type: "image/png",
      //   purpose: "maskable",
      // },
    ],
  };
}