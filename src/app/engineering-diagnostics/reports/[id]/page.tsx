// SectorCalc V5.4 — Engineering Diagnostics Report View Page
// Route: /engineering-diagnostics/reports/[id]

import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";

export const dynamic = "force-dynamic";

interface ReportPageParams {
  id: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ReportPageParams>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Diagnostic Report — Engineering Diagnostics | SectorCalc`,
    description: `View engineering diagnostic report ${id}. Audit-ready documentation with full traceability.`,
    robots: { index: false, follow: false },
  };
}

export default async function EngineeringDiagnosticsReportPage({
  params,
}: {
  params: Promise<ReportPageParams>;
}) {
  const { id } = await params;
  return (
    <PageLayout>
      <section
        className="sc-pro-section sc-pro-section--border"
        style={{ padding: "4rem 1.5rem" }}
      >
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <Link
            href="/dashboard/engineering-diagnostics"
            style={{
              fontSize: "0.85rem",
              color: "#BD5D3A",
              textDecoration: "none",
              display: "inline-block",
              marginBottom: "1.5rem",
            }}
          >
            &larr; Back to Diagnostics Dashboard
          </Link>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              marginBottom: "0.75rem",
              color: "#1A1915",
            }}
          >
            Diagnostic Report
          </h1>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#6B6B68",
              fontFamily: "monospace",
              marginBottom: "2rem",
            }}
          >
            Report ID: {id}
          </p>

          {/* Placeholder report content */}
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
              Full diagnostic report view will be available in the next phase.
            </p>
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem" }}>
              Report sections will include: Executive Summary, Observations,
              Root-Cause Analysis, Risk Assessment, Action Plan, Evidence Log,
              and Audit Trail.
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
