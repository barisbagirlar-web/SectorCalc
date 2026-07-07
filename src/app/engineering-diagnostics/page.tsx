// SectorCalc V5.4 — Engineering Diagnostics Landing Page
// Conversion-focused: communicates value and pricing within 5 seconds

import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Engineering Diagnostics — Identify Root Cause & Reduce Cost Exposure | SectorCalc",
  description:
    "Capture engineering problems, detect root cause, quantify cost exposure, and generate ISO-compliant corrective action reports. AI-assisted industrial diagnostics for professionals.",
  robots: { index: true, follow: true },
};

const FEATURES = [
  {
    title: "Photo-First Intake",
    desc: "Capture field conditions with your phone camera or desktop upload. Visual evidence is analyzed alongside engineering measurements.",
  },
  {
    title: "Deterministic Risk Scoring",
    desc: "Measurement confidence, tolerance status, and cost exposure are evaluated through server-side deterministic engines. No AI hallucination on critical metrics.",
  },
  {
    title: "AI-Assisted Engineering Reasoning",
    desc: "OpenAI-powered root cause hypotheses, NCR drafts, CAPA drafts, and executive summaries. All AI output is clearly labeled and never overrides deterministic calculations.",
  },
  {
    title: "Professional Report & PDF",
    desc: "Audit-ready reports with full traceability, measurement confidence analysis, cost-at-risk breakdown, action plans, and verification records.",
  },
  {
    title: "Verification & Audit Trail",
    desc: "Every report is cryptographically hashed and verifiable. Image hashes, audit logs, and verification records provide defensible documentation.",
  },
  {
    title: "Dashboard History",
    desc: "All diagnostics are saved to your account dashboard. Compare, export, and manage your diagnostic history.",
  },
];

const PREMIUM_FEATURES = [
  {
    label: "Root Cause Hypotheses",
    locked: true,
  },
  {
    label: "Cost-at-Risk Analysis",
    locked: true,
  },
  {
    label: "Corrective Action Plan",
    locked: true,
  },
  {
    label: "NCR / CAPA Draft",
    locked: true,
  },
  {
    label: "Professional PDF Export",
    locked: true,
  },
  {
    label: "Verification Record",
    locked: true,
  },
  {
    label: "Dashboard History",
    locked: true,
  },
  {
    label: "AI Engineering Interpretation",
    locked: true,
  },
];

export default function EngineeringDiagnosticsPage() {
  return (
    <PageLayout>
      {/* ── Hero Section ── */}
      <section
        className="sc-pro-section sc-pro-section--border"
        style={{
          padding: "5rem 1.5rem",
          background: "linear-gradient(180deg, #F5F3ED 0%, #E8E6DE 100%)",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.4rem 1rem",
              background: "#1A1915",
              color: "#D6D4CC",
              borderRadius: "20px",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
            }}
          >
            Professional Diagnostic Package
          </div>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              lineHeight: 1.2,
              color: "#1A1915",
              marginBottom: "1rem",
            }}
          >
            Engineering Diagnostics
            <br />
            <span style={{ color: "#BD5D3A" }}>Find Root Cause. Quantify Risk. Act with Confidence.</span>
          </h1>
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.6,
              color: "#4A4A48",
              maxWidth: "640px",
              margin: "0 auto 2rem",
            }}
          >
            Upload field photos and engineering measurements. Our deterministic engines
            evaluate tolerance compliance, measurement confidence, and cost exposure.
            AI assists with root cause hypotheses, NCR/CAPA drafts, and engineering
            interpretation. Every result is auditable and verifiable.
          </p>

          {/* Pricing Highlight */}
          <div
            style={{
              display: "inline-block",
              padding: "1rem 1.5rem",
              background: "#FFF9F0",
              border: "2px solid #BD5D3A",
              borderRadius: "12px",
              marginBottom: "2rem",
            }}
          >
            <div style={{ fontSize: "0.85rem", color: "#6B6B68", marginBottom: "0.25rem" }}>
              Package
            </div>
            <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1A1915" }}>
              5 Credits &middot; 3 Full Engineering Diagnostics
            </div>
            <div style={{ fontSize: "0.85rem", color: "#BD5D3A", marginTop: "0.25rem" }}>
              Includes AI interpretation, PDF report, verification, and dashboard history
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
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
                minHeight: "48px",
                transition: "background 0.13s",
              }}
            >
              Start Free Diagnostic Preview
            </Link>
            <Link
              href="/pricing"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.9rem 2rem",
                backgroundColor: "#1A1915",
                color: "#fff",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "1rem",
                minHeight: "48px",
                transition: "background 0.13s",
              }}
            >
              Get Diagnostic Credits
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

      {/* ── How It Works ── */}
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
            How It Works
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {[
              { step: "1", title: "Describe the Problem", desc: "Select your domain, describe the issue, and upload field photos." },
              { step: "2", title: "Enter Measurements", desc: "Provide engineering measurements with tolerances and tool details." },
              { step: "3", title: "Review Free Preview", desc: "Get risk band, domain detection, and a brief assessment. No credit required." },
              { step: "4", title: "Unlock Full Diagnostic", desc: "Use Diagnostic Credits to generate the complete report with AI interpretation, PDF, and verification." },
            ].map((item) => (
              <div
                key={item.step}
                style={{
                  padding: "1.25rem",
                  background: "#F0EEE6",
                  borderRadius: "8px",
                  border: "1px solid #D6D4CC",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "#BD5D3A",
                    color: "#fff",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    marginBottom: "0.75rem",
                  }}
                >
                  {item.step}
                </div>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: "#1A1915",
                    marginBottom: "0.5rem",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.85rem",
                    lineHeight: 1.5,
                    color: "#4A4A48",
                    margin: 0,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Premium Features (locked, upgrade triggers) ── */}
      <section
        className="sc-pro-section sc-pro-section--border"
        style={{ padding: "4rem 1.5rem", background: "#F5F3ED" }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "1.4rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
              color: "#1A1915",
              textAlign: "center",
            }}
          >
            What You Get with Full Diagnostics
          </h2>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#6B6B68",
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            The free preview shows domain detection and risk band only. Unlock the full picture.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            {PREMIUM_FEATURES.map((f) => (
              <div
                key={f.label}
                style={{
                  padding: "1rem",
                  background: "#F0EEE6",
                  borderRadius: "8px",
                  border: "1px solid #D6D4CC",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.5rem",
                }}
              >
                <span style={{ fontSize: "0.9rem", color: "#4A4A48" }}>{f.label}</span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    padding: "0.2rem 0.5rem",
                    background: "#E8D5B5",
                    color: "#8A7A23",
                    borderRadius: "4px",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  Full Diagnostic
                </span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <Link
              href="/pricing"
              style={{
                display: "inline-block",
                padding: "0.8rem 2rem",
                background: "#BD5D3A",
                color: "#fff",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "1rem",
                minHeight: "48px",
                lineHeight: "48px",
              }}
            >
              Get Diagnostic Credits &mdash; 5 Credits / 3 Diagnostics
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
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
            Platform Features
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            {FEATURES.map((ft) => (
              <div
                key={ft.title}
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
                  {ft.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.85rem",
                    lineHeight: 1.5,
                    color: "#4A4A48",
                    margin: 0,
                  }}
                >
                  {ft.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section
        className="sc-pro-section sc-pro-section--border"
        style={{
          padding: "4rem 1.5rem",
          background: "#1A1915",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#fff",
              marginBottom: "1rem",
            }}
          >
            Ready to Diagnose?
          </h2>
          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.6,
              color: "#D6D4CC",
              marginBottom: "2rem",
            }}
          >
            5 Credits = 3 Full Engineering Diagnostics. No subscription required.
            Pay as you go. Includes AI interpretation, PDF, verification, and dashboard history.
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              maxWidth: "360px",
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
                minHeight: "48px",
                transition: "background 0.13s",
              }}
            >
              Try Free Preview
            </Link>
            <Link
              href="/pricing"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.9rem 2rem",
                backgroundColor: "transparent",
                color: "#D6D4CC",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: "1rem",
                border: "1px solid #4A4A48",
                transition: "background 0.13s",
              }}
            >
              View Pricing
            </Link>
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
          decision-support only &mdash; every result requires manual verification
          by qualified professionals. Photos are not stored; only hashes, report metadata,
          and verification records are retained.
        </div>
      </section>
    </PageLayout>
  );
}
