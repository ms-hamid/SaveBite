import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { PWA_CONFIG } from "../lib/pwa/pwa-config";
import { PWAProvider } from "../components/pwa/PWAProvider";
import "./globals.css"

export const metadata: Metadata = {
  applicationName: PWA_CONFIG.appName,
  title: {
    default: PWA_CONFIG.appName,
    template: `%s | ${PWA_CONFIG.appName}`,
  },
  description: PWA_CONFIG.appDescription,
  appleWebApp: {
    capable: true,
    title: PWA_CONFIG.appName,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: PWA_CONFIG.themeColor,
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`light ${inter.variable} ${plusJakartaSans.variable}`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
          rel="stylesheet"
        />

      </head>

      <body className="bg-surface-bright text-on-background antialiased">
        <PWAProvider/>
        {children}
      </body>
    </html>
  );
}