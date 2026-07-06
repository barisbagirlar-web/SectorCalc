// SectorCalc V5.4 — Engineering Diagnostics Landing Page
// Root route: /engineering-diagnostics

import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Engineering Diagnostics — AI-Assisted Industrial Screening | SectorCalc",
  description:
    "Capture problems, find root causes and generate action reports with AI-assisted preliminary screening. All results require manual verification.",
  robots: { index: true, follow: true },
};

export default function EngineeringDiagnosticsPage() {
  return (
    <PageLayout>
      <section
        className="sc-pro-section sc-pro-section--border"
        style={{ padding: "6rem 1.5rem" }}
      >
        <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "2.5rem",
              marginBottom: "1rem",
            }}
          >
            🔍
          </span>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 600,
              marginBottom: "1rem",
              color: "#1A1915",
            }}
          >
            Engineering Diagnostics
          </h1>
          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.6,
              color: "#4A4A48",
              maxWidth: "600px",
              margin: "0 auto 2rem",
            }}
          >
            Capture problems, find root causes and generate action reports.
            AI-assisted preliminary screening for industrial diagnostics.
            All results are decision-support only and require manual verification.
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              maxWidth: "400px",
              margin: "0 auto",
            }}
          >
            <Link
              href="/engineering-diagnostics/start"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.9rem 2rem",
                backgroundColor: "#BD5D3A",
                color: "#fff",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "1rem",
                transition: "background 0.13s",
              }}
            >
              Start New Diagnostic
            </Link>
            <Link
              href="/dashboard/engineering-diagnostics"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.9rem 2rem",
                backgroundColor: "#F0EEE6",
                color: "#1A1915",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: "1rem",
                border: "1px solid #D6D4CC",
                transition: "background 0.13s",
              }}
            >
              My Diagnostics Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Engine Overview */}
      <section
        className="sc-pro-section sc-pro-section--border"
        style={{ padding: "4rem 1.5rem" }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "1.4rem",
              fontWeight: 600,
              marginBottom: "2rem",
              color: "#1A1915",
              textAlign: "center",
            }}
          >
            Diagnostic Engine Overview
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            {[
              {
                title: "Industrial Context Engine",
                desc: "Captures operating environment, equipment specs, and process parameters.",
              },
              {
                title: "Visual Observation Engine",
                desc: "Structured documentation of observable symptoms and field conditions.",
              },
              {
                title: "Engineering Diagnosis Engine",
                desc: "Systematic root-cause analysis based on observable evidence.",
              },
              {
                title: "Decision Engine",
                desc: "Evaluates options and recommends action paths. Manual review required.",
              },
              {
                title: "Action Planning Engine",
                desc: "Generates structured corrective and preventive action plans.",
              },
              {
                title: "Engineering Language Engine",
                desc: "Drafts NCR, CAPA, executive summaries, and action narratives.",
              },
              {
                title: "Report Engine",
                desc: "Compiles audit-ready documentation with full traceability.",
              },
              {
                title: "Evidence & Verify Engine",
                desc: "Manages evidence attachments and verification checkpoints.",
              },
            ].map((engine) => (
              <div
                key={engine.title}
                style={{
                  padding: "1.25rem",
                  backgroundColor: "#F0EEE6",
                  borderRadius: "8px",
                  border: "1px solid #D6D4CC",
                }}
              >
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: "#BD5D3A",
                    marginBottom: "0.5rem",
                  }}
                >
                  {engine.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.85rem",
                    lineHeight: 1.5,
                    color: "#4A4A48",
                    margin: 0,
                  }}
                >
                  {engine.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal disclaimer */}
      <section style={{ padding: "2rem 1.5rem 4rem" }}>
        <div
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            padding: "1.5rem",
            backgroundColor: "#FFF9F0",
            border: "1px solid #E8D5B5",
            borderRadius: "8px",
            fontSize: "0.85rem",
            color: "#6B6B68",
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: "#1A1915" }}>Important Notice</strong>
          <br />
          Engineering Diagnostics provides AI-assisted preliminary screening and
          decision-support only. All observations, diagnoses, and action plans
          must be reviewed and verified by qualified professionals before use.
          This tool provides AI-assisted preliminary screening and
          decision-support only — every result requires manual verification
          by qualified professionals.
        </div>
      </section>
    </PageLayout>
  );
}
