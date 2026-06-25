import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";
import containerQueries from "@tailwindcss/container-queries";

const config: Config = {
  darkMode: "class",

  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        /* =========================
         * Config 2 - Diutamakan
         * ========================= */

        /* Brand */
        primary: "#10b77f",
        "primary-emerald": "#10b77f",
        "primary-dark": "#0fb880",
        "primary-desaturated": "#4b9f83",
        "primary-content": "#0f5a2e",

        /* Semantic */
        error: "#e11d48",
        "error-light": "#fff1f2",

        /* Surfaces */
        "background-light": "#f6f8f7",
        "background-dark": "#10221c",
        "surface-light": "#ffffff",
        "surface-dark": "#183028",
        "text-main-light": "#111816",
        "text-main-dark": "#e0e7e5",
        "text-sub-light": "#61897c",
        "text-sub-dark": "#8faeb3",

        "amber-soft": "#FEF3C7",
        "amber-icon": "#D97706",

        slate: {
          200: "#e2e8f0",
          500: "#64748b",
          900: "#0f172a",
        },
          border: "#e5e7eb",
          "border-light": "#e5e7eb",

          "brand-purple": "#8b5cf6",
          "brand-purple-light": "#f5f3ff",

          "custom-bg": "#ffffff",
          "custom-card-border": "#e5e7eb",
          "custom-primary": "#10b981",
          "custom-text-primary": "#111827",
          "custom-text-secondary": "#6b7280",

          "gray-50": "#f9fafb",

          "sb-bg": "#f7faf8",
          "sb-border": "#eaeaea",
          "sb-primary-text": "#111827",
          "sb-secondary-text": "#6b7280",

          "success-green": "#10b981",
          "success-light": "#ecfdf5",

          "text-primary": "#111827",
          "text-secondary": "#6b7280",

        /* =========================
         * Config 1 - Tambahan
         * ========================= */

        background: "#f8f9ff",

        "error-container": "#ffdad6",
        highlight: "#dff7ec",

        "inverse-on-surface": "#eaf1ff",
        "inverse-primary": "#4edea3",
        "inverse-surface": "#213145",

        "on-background": "#0b1c30",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",

        "on-primary": "#ffffff",
        "on-primary-container": "#00422b",
        "on-primary-fixed": "#002113",
        "on-primary-fixed-variant": "#005236",

        "on-secondary": "#ffffff",
        "on-secondary-container": "#536960",
        "on-secondary-fixed": "#0a1f19",
        "on-secondary-fixed-variant": "#364b43",

        "on-surface": "#0b1c30",
        "on-surface-variant": "#3c4a42",

        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#00367a",
        "on-tertiary-fixed": "#001a42",
        "on-tertiary-fixed-variant": "#004395",

        "on-warning-container": "#713f12",

        outline: "#6c7a71",
        "outline-variant": "#bbcabf",

        "primary-container": "#10b981",
        "primary-fixed": "#6ffbbe",
        "primary-fixed-dim": "#4edea3",

        secondary: "#4d635b",
        "secondary-container": "#d0e8dd",
        "secondary-fixed": "#d0e8dd",
        "secondary-fixed-dim": "#b4ccc1",

        surface: "#f8f9ff",
        "surface-bright": "#f8f9ff",
        "surface-container": "#e5eeff",
        "surface-container-high": "#dce9ff",
        "surface-container-highest": "#d3e4fe",
        "surface-container-low": "#eff4ff",
        "surface-container-lowest": "#ffffff",
        "surface-dim": "#cbdbf5",
        "surface-tint": "#006c49",
        "surface-variant": "#d3e4fe",

        tertiary: "#005ac2",
        "tertiary-container": "#71a1ff",
        "tertiary-fixed": "#d8e2ff",
        "tertiary-fixed-dim": "#adc6ff",

        "warning-container": "#fef08a",
      },

      borderRadius: {
        // Config 2 diutamakan
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",

        // Tambahan dari config 1
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },

      spacing: {
        "unit-xs": "4px",
        "unit-sm": "8px",
        "unit-md": "16px",
        "unit-lg": "24px",
        "unit-xl": "32px",

        gutter: "24px",
        "margin-mobile": "16px",
        "margin-tablet": "24px",
        "margin-desktop": "40px",

        "container-max": "1440px",
        "sidebar-width": "280px",
        sidebar_width: "280px",

        section_gap: "32px",
        card_padding: "24px",
        page_padding: "32px",
        "card-gap": "16px",
        "container-padding": "1.25rem",
        "inline-gap": "0.5rem",
        "screen-px": "24px",
        "section-gap": "24px",
        "stack-gap-sm": "0.5rem",
        "stack-gap-md": "1rem",
      },

      maxWidth: {
        "container-max": "1440px",
      },

      fontFamily: {
        // Config 2 diutamakan
        display: ["Plus Jakarta Sans", "sans-serif"],

        // Tambahan dari config 1
        sans: ["Plus Jakarta Sans", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        "body-medium": ["Inter", "sans-serif"],
        "page-title-mobile": ["Inter", "sans-serif"],
        "page-title": ["Inter", "sans-serif"],
        caption: ["Inter", "sans-serif"],
        "section-title-sm": ["Inter", "sans-serif"],
        "label-bold": ["Inter", "sans-serif"],
        "section-title": ["Inter", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "body-default": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "display-lg": ["Inter", "sans-serif"],
        "label-md": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
      },

      fontSize: {
        "body-medium": ["16px", { lineHeight: "24px", fontWeight: "500" }],
        "page-title-mobile": [
          "32px",
          {
            lineHeight: "40px",
            letterSpacing: "-0.02em",
            fontWeight: "700",
          },
        ],
        "page-title": [
          "40px",
          {
            lineHeight: "48px",
            letterSpacing: "-0.02em",
            fontWeight: "700",
          },
        ],
        caption: ["12px", { lineHeight: "16px", fontWeight: "400" }],
        "section-title-sm": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "label-bold": ["14px", { lineHeight: "20px", fontWeight: "600" }],
        "section-title": [
          "24px",
          {
            lineHeight: "32px",
            letterSpacing: "-0.01em",
            fontWeight: "600",
          },
        ],
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "body-default": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "display-lg": [
          "40px",
          {
            lineHeight: "48px",
            letterSpacing: "-0.02em",
            fontWeight: "700",
          },
        ],
        "label-md": ["14px", { lineHeight: "20px", fontWeight: "500" }],
        "label-sm": ["12px", { lineHeight: "16px", fontWeight: "500" }],
      },

      animation: {
        "spin-slow": "spin 1.5s linear infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },

  plugins: [
    forms,
    containerQueries
  ],
};

export default config;