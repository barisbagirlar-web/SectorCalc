import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds (Warm, Light)
        "bg-primary": "#FAFAF9",
        "bg-card": "#FFFFFF",
        "bg-subtle": "#F5F5F4",
        
        // Text (Warm, Readable)
        "text-primary": "#292524",
        "text-secondary": "#57534E",
        "text-muted": "#A8A29E",
        
        // Accents (Natural, Engineering)
        "accent-teal": {
          DEFAULT: "#0D9488",
          light: "#CCFBF1",
        },
        "accent-emerald": "#059669",
        "accent-amber": "#D97706",
        
        // Borders (Minimal)
        "border-subtle": "#E7E5E4",
        "border-focus": "#0D9488",
        
        // Status
        success: "#059669",
        warning: "#D97706",
        error: "#DC2626",
        
        // Legacy compat (will be removed)
        cyan: "#06B6D4",
        emerald: "#10B981",
        amber: "#F59E0B",
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 3px rgba(41, 37, 36, 0.05), 0 1px 2px rgba(41, 37, 36, 0.03)",
        "card-hover": "0 4px 12px rgba(41, 37, 36, 0.08), 0 2px 4px rgba(41, 37, 36, 0.04)",
        "card-premium": "0 1px 3px rgba(41, 37, 36, 0.05), 0 1px 2px rgba(41, 37, 36, 0.03)",
      },
      borderRadius: {
        "card": "16px",
      },
    },
  },
  plugins: [],
};

export default config;