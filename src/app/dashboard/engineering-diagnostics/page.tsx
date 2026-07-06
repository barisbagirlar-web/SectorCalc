// SectorCalc V5.4 — Engineering Diagnostics Dashboard Page
// Route: /dashboard/engineering-diagnostics

import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Engineering Diagnostics Dashboard | SectorCalc",
  description:
    "Manage your engineering diagnostic reports, track ongoing analyses, and review completed action plans.",
  robots: { index: false, follow: false },
};

export default function EngineeringDiagnosticsDashboardPage() {
  return (
    <PageLayout>
      <section
        className="sc-pro-section sc-pro-section--border"
        style={{ padding: "4rem 1.5rem" }}
      >
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              marginBottom: "0.75rem",
              color: "#1A1915",
            }}
          >
            Engineering Diagnostics Dashboard
          </h1>
          <p
            style={{
              fontSize: "0.95rem",
              lineHeight: 1.6,
              color: "#4A4A48",
              marginBottom: "2rem",
            }}
          >
            View and manage your diagnostic reports, track ongoing analyses,
            and review completed action plans.
          </p>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "2rem",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/engineering-diagnostics/start"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.75rem 1.5rem",
                backgroundColor: "#BD5D3A",
                color: "#fff",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              + New Diagnostic
            </Link>
          </div>

          {/* Placeholder reports list */}
          <div
            style={{
              padding: "2rem",
              backgroundColor: "#F0EEE6",
              border: "1px dashed #D6D4CC",
              borderRadius: "8px",
              textAlign: "center",
              color: "#6B6B68",
              fontSize: "0.9rem",
            }}
          >
            <p style={{ margin: 0 }}>No diagnostic reports yet.</p>
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem" }}>
              Start a new diagnostic to generate your first report.
            </p>
            <Link
              href="/engineering-diagnostics/start"
              style={{
                display: "inline-block",
                marginTop: "1rem",
                color: "#BD5D3A",
                fontWeight: 600,
                textDecoration: "underline",
                fontSize: "0.9rem",
              }}
            >
              Start New Diagnostic &rarr;
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
