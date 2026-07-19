import type { Metadata } from "next";
import Link from "next/link";

/**
 * Global 404 — DOM robots must be noindex so they never disagree with
 * middleware forceNoindex responses (industry unknown slug, legacy locales).
 */
export const metadata: Metadata = {
  title: "Page not found | SectorCalc",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function NotFoundPage() {
  return (
    <main
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        padding: "2rem",
        fontFamily: "var(--font-inter), system-ui, sans-serif",
        color: "#1A1915",
        background: "#F0EEE6",
      }}
    >
      <p style={{ margin: 0, fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        HTTP 404
      </p>
      <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 600 }}>Page not found</h1>
      <p style={{ margin: 0, maxWidth: "28rem", textAlign: "center", lineHeight: 1.5 }}>
        This URL is not part of the SectorCalc public catalog. Return to the home page or browse
        free and pro tools.
      </p>
      <Link
        href="/"
        style={{
          marginTop: "0.5rem",
          minHeight: 48,
          minWidth: 48,
          display: "inline-flex",
          alignItems: "center",
          padding: "0.75rem 1.25rem",
          background: "#BD5D3A",
          color: "#F0EEE6",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        Back to SectorCalc
      </Link>
    </main>
  );
}
