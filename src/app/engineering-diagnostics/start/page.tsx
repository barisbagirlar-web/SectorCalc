// SectorCalc V5.4 — Engineering Diagnostics Start Page
// Route: /engineering-diagnostics/start

import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Start New Diagnostic — Engineering Diagnostics | SectorCalc",
  description:
    "Begin a new engineering diagnostic workflow. AI-assisted preliminary screening for industrial problem analysis.",
  robots: { index: true, follow: true },
};

export default function EngineeringDiagnosticsStartPage() {
  return (
    <PageLayout>
      <section
        className="sc-pro-section sc-pro-section--border"
        style={{ padding: "4rem 1.5rem" }}
      >
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <Link
            href="/engineering-diagnostics"
            style={{
              fontSize: "0.85rem",
              color: "#BD5D3A",
              textDecoration: "none",
              display: "inline-block",
              marginBottom: "1.5rem",
            }}
          >
            &larr; Back to Engineering Diagnostics
          </Link>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              marginBottom: "0.75rem",
              color: "#1A1915",
            }}
          >
            Start New Diagnostic
          </h1>
          <p
            style={{
              fontSize: "0.95rem",
              lineHeight: 1.6,
              color: "#4A4A48",
              marginBottom: "2rem",
            }}
          >
            Describe the problem you are investigating. The engineering
            diagnostic workflow will guide you through observation,
            root-cause analysis, and action planning.
          </p>

          {/* Placeholder form area */}
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
            <p style={{ margin: 0 }}>
              Diagnostic input form will be available in the next phase.
            </p>
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem" }}>
              The workflow will include: Industrial Context &rarr; Visual
              Observation &rarr; Engineering Diagnosis &rarr; Decision &rarr;
              Action Planning &rarr; Report Generation.
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
