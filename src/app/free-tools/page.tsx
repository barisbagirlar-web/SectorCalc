import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Free Industrial Calculators — Under Rebuild | SectorCalc",
  description: "Free industrial calculators are currently being rebuilt with production-grade formulas. Subscribe to updates or explore our PRO industrial decision-support analyzers.",
  robots: { index: false, follow: false },
};

export default function FreeToolsCatalogPage() {
  return (
    <PageLayout>
      <section className="sc-pro-section sc-pro-section--border" style={{ textAlign: "center", padding: "6rem 1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 600, marginBottom: "1rem", color: "#1A1915" }}>
          Free Industrial Calculators
        </h1>
        <p style={{ fontSize: "1rem", lineHeight: 1.6, color: "#4A4A48", maxWidth: "600px", margin: "0 auto 2rem" }}>
          V5.4 Core production recovery is in progress. Our verified Free pilot is available now.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "480px", margin: "0 auto" }}>
          <Link
            href="/tools/free/break-even-and-margin-of-safety-analysis"
            style={{
              display: "block",
              padding: "1.25rem",
              backgroundColor: "#F0EEE6",
              border: "1px solid #D6D4CC",
              borderRadius: "8px",
              textDecoration: "none",
              color: "#1A1915",
              textAlign: "left",
            }}
          >
            <strong style={{ fontSize: "1.1rem", color: "#BD5D3A" }}>Break-Even &amp; Margin of Safety Analysis</strong>
            <p style={{ fontSize: "0.9rem", margin: "0.5rem 0 0", color: "#6B6B68" }}>
              Determine the production volume needed to break even and the safety margin above it.
            </p>
          </Link>
        </div>
        <p style={{ fontSize: "0.85rem", lineHeight: 1.5, color: "#6B6B68", maxWidth: "540px", margin: "2rem auto 0" }}>
          More free tools are being rebuilt with production-grade formulas. Explore our{" "}
          <a href="/pro-tools" style={{ color: "#BD5D3A", fontWeight: 500, textDecoration: "underline" }}>
            PRO industrial analyzers
          </a>{" "}
          for deterministic, audit-ready decision support.
        </p>
      </section>
    </PageLayout>
  );
}
