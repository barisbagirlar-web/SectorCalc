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
        "deep-navy": "#0F172A",
        "dark-navy": "#071527",
        "professional-blue": "#2563EB",
        cyan: "#06B6D4",
        emerald: "#10B981",
        amber: "#F59E0B",
        "soft-red": "#EF4444",
        slate: "#64748B",
        "off-white": "#F8FAFC",
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
        card: "0 4px 24px -4px rgba(15, 23, 42, 0.12)",
        "card-dark": "0 8px 32px -8px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
