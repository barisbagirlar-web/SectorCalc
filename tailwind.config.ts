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
        /* Anthropic Kil Palette — SectorCalc */
        "kil-bg": "#F0EEE6",
        "kil-surface": "#FAF9F5",
        "kil-text": "#1A1915",
        "kil-accent": "#BD5D3A",
        "kil-border": "rgba(26, 25, 21, 0.10)",

        /* Legacy aliases → Anthropic kil mapping */
        "industrial-matte": "#F0EEE6",
        "premium-velvet": "#1A1915",
        "body-charcoal": "#696764",
        "technical-gray": "rgba(26, 25, 21, 0.10)",
        "action-orange": "#BD5D3A",
        "sc-copper": "#BD5D3A",
        "sc-navy": "#BD5D3A",

        /* Status signals — functional, kept unchanged */
        "crit-red": "#991B1B",
        "warn-amber": "#D97706",
        "safe-green": "#166534",

        /* Legacy aliases → industrial mapping */
        "base-black": "#1A1915",
        "base-white": "#FAF9F5",
        "slate-gray": "#696764",
        "light-gray": "#F0EEE6",
        "deep-navy": { DEFAULT: "#1A1915", foreground: "#FAF9F5" },
        "dark-navy": "#1A1915",
        "bg-primary": "#F0EEE6",
        "bg-card": "#FAF9F5",
        "bg-subtle": "#F0EEE6",
        "text-primary": "#1A1915",
        "text-secondary": "#696764",
        "text-muted": "#696764",
        terminal: { DEFAULT: "#1A1915", surface: "#F0EEE6", border: "rgba(26, 25, 21, 0.10)" },
        amber: { DEFAULT: "#BD5D3A", light: "#FAF9F5" },
        "accent-teal": "#1A1915",
        "accent-emerald": "#10B981",
        "accent-amber": "#BD5D3A",
        emerald: "#10B981",
        "soft-red": "#DC2626",
        cyan: "#696764",
        slate: "#696764",
        "professional-blue": "#1A1915",
        "off-white": "#FAF9F5",
        "border-subtle": "rgba(26, 25, 21, 0.10)",
        "border-focus": "#1A1915",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#DC2626",
        premium: { DEFAULT: "#1A1915", surface: "#F0EEE6", border: "rgba(26, 25, 21, 0.10)" },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        serif: [
          "Georgia",
          "'Palatino Linotype'",
          "'Book Antiqua'",
          "Palatino",
          "'Times New Roman'",
          "serif",
        ],
        display: [
          "Georgia",
          "'Palatino Linotype'",
          "'Book Antiqua'",
          "Palatino",
          "'Times New Roman'",
          "serif",
        ],
        mono: [
          "var(--font-jetbrains)",
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        card: "none",
        "card-hover": "none",
        "card-premium": "none",
        "card-dark": "none",
        sm: "none",
      },
      borderRadius: {
        none: "0",
        sm: "0",
        DEFAULT: "0",
        md: "0",
        lg: "0",
        xl: "0",
        "2xl": "0",
        "3xl": "0",
        card: "0",
      },
    },
  },
  plugins: [],
};

export default config;
