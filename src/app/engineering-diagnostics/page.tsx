// SectorCalc V5.4 — Engineering Diagnostics Landing Page
// Conversion-optimized: outcome-driven hero, complete sections, upgrade triggers

import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Engineering Diagnostics — Upload Photos, Identify Root Causes, Generate Reports | SectorCalc",
  description:
    "Capture field photos, identify probable root causes, confirm key measurements, and generate engineering-grade diagnostic reports with AI-assisted analysis, PDF export, and verification.",
  robots: { index: true, follow: true },
};

/* ── Reusable sub-components ── */

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.4rem 1rem",
        background: "#1A1915",
        color: "#D6D4CC",
        borderRadius: "20px",
        fontSize: "0.7rem",
        fontWeight: 600,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}

const SECTION_HEADING: React.CSSProperties = {
  fontSize: "1.4rem",
  fontWeight: 600,
  marginBottom: "0.5rem",
  color: "#1A1915",
  textAlign: "center",
};

const SECTION_SUBTITLE: React.CSSProperties = {
  fontSize: "0.9rem",
  color: "#6B6B68",
  textAlign: "center",
  marginBottom: "2.5rem",
  maxWidth: "600px",
  margin: "0 auto 2.5rem",
};

const CARD_BASE: React.CSSProperties = {
  padding: "1.25rem",
  background: "#F0EEE6",
  borderRadius: "8px",
  border: "1px solid #D6D4CC",
};

export default function EngineeringDiagnosticsPage() {
  return (
    <PageLayout>
      {/* ═══ HERO ═══ */}
      <section
        style={{
          padding: "5rem 1.5rem",
          background: "linear-gradient(180deg, #F5F3ED 0%, #E8E6DE 100%)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Badge>Professional Diagnostic Package</Badge>

          <h1
            style={{
              fontSize: "2.2rem",
              fontWeight: 700,
              lineHeight: 1.2,
              color: "#1A1915",
              margin: "1.5rem 0 1rem",
            }}
          >
            Upload Photos.
            <br />
            Identify Root Causes.
            <br />
            <span style={{ color: "#BD5D3A" }}>Generate Engineering Reports.</span>
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
            Capture field conditions with your phone, describe the problem,
            and let our deterministic engines evaluate measurement confidence,
            tolerance compliance, and cost exposure. AI assists with root cause
            hypotheses, NCR/CAPA drafts, and engineering interpretation.
          </p>

          {/* Package highlight */}
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
            <div style={{ fontSize: "0.8rem", color: "#6B6B68", marginBottom: "0.25rem" }}>
              Package &mdash; One-Time Purchase
            </div>
            <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1A1915" }}>
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
              }}
            >
              Start Engineering Diagnosis
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
              }}
            >
              My Diagnostics Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 7-STEP WORKFLOW ═══ */}
      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={SECTION_HEADING}>How It Works</h2>
          <p style={SECTION_SUBTITLE}>
            From field photo to professional engineering report in seven structured steps.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            {[
              { n: "1", t: "Capture Photos", d: "Take field photos using your phone camera or upload from desktop. Include overall views, close-ups, and the measurement tool when visible." },
              { n: "2", t: "Describe the Problem", d: "Select your domain and describe the issue with relevant process details and symptoms." },
              { n: "3", t: "Confirm Measurements", d: "Enter engineering measurements with tool details and calibration status. Domain-specific fields adapt to your industry." },
              { n: "4", t: "Review Free Preview", d: "See the detected domain, risk band, and a brief assessment. No credit required." },
              { n: "5", t: "Unlock Full Diagnostic", d: "Use Diagnostic Credits to generate the complete report with AI interpretation, PDF, and verification." },
              { n: "6", t: "Export & Verify", d: "Download the professional PDF report. Every report is cryptographically hashed for verification." },
              { n: "7", t: "Save to Dashboard", d: "All diagnostics are saved to your account dashboard for comparison, export, and history." },
            ].map((s) => (
              <div key={s.n} style={CARD_BASE}>
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
                  {s.n}
                </div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#1A1915", marginBottom: "0.5rem" }}>{s.t}</h3>
                <p style={{ fontSize: "0.85rem", lineHeight: 1.5, color: "#4A4A48", margin: 0 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PHOTO CAPTURE GUIDELINES ═══ */}
      <section style={{ padding: "4rem 1.5rem", background: "#F5F3ED" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={SECTION_HEADING}>Photo Guidelines</h2>
          <p style={SECTION_SUBTITLE}>
            Good photos lead to better AI-assisted observations. Follow these guidelines for best results.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            {[
              { t: "What to Capture", good: true, items: ["Overall view of the affected area", "Close-up of the defect or issue", "Multiple angles for context", "Measurement tool visible when possible", "Good lighting conditions"] },
              { t: "What to Avoid", good: false, items: ["Blurry or out-of-focus images", "Dark or shadowed areas", "Glare or reflections", "Obstructed or covered damage", "Low resolution or cropped context"] },
              { t: "Technical Requirements", good: true, items: ["JPEG, PNG, or WebP format", "Max 8 photos per diagnostic", "Max 8 MB per photo", "Mobile camera or desktop upload", "Drag and drop supported"] },
            ].map((col) => (
              <div key={col.t} style={CARD_BASE}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: col.good ? "#238A23" : "#A12323", marginBottom: "0.75rem" }}>
                  {col.t}
                </h3>
                <ul style={{ margin: 0, paddingLeft: "1.1rem", lineHeight: 1.8, fontSize: "0.85rem", color: "#4A4A48" }}>
                  {col.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "0.85rem", color: "#6B6B68", textAlign: "center", marginTop: "1.5rem" }}>
            Photos are processed server-side: EXIF data is stripped and a cryptographic hash is stored.
            Raw images are not retained after processing.
          </p>
        </div>
      </section>

      {/* ═══ WHAT YOU RECEIVE (premium features, locked) ═══ */}
      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={SECTION_HEADING}>What You Receive with a Full Diagnostic</h2>
          <p style={SECTION_SUBTITLE}>
            The free preview shows domain detection and risk band only. Unlock the full picture.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {[
              "Photo AI Interpretation", "Deterministic Risk Scoring", "Cost-at-Risk Analysis",
              "Root Cause Hypotheses", "Engineering Interpretation", "Engineering Recommendations",
              "Required Manual Checks", "Containment Actions", "Temporary Fix Plan",
              "Permanent Corrective Action", "NCR Draft", "CAPA Draft",
              "Professional PDF Export", "Verification Record", "Dashboard History",
              "Image Hashes & Audit Trail",
            ].map((f) => (
              <div
                key={f}
                style={{
                  ...CARD_BASE,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.5rem",
                }}
              >
                <span style={{ fontSize: "0.85rem", color: "#4A4A48" }}>{f}</span>
                <span
                  style={{
                    fontSize: "0.65rem",
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

      {/* ═══ EXAMPLE REPORT PREVIEW ═══ */}
      <section style={{ padding: "4rem 1.5rem", background: "#F5F3ED" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={SECTION_HEADING}>Example Report Output</h2>
          <p style={SECTION_SUBTITLE}>
            Every Full Engineering Diagnostic generates a structured report with these sections.
          </p>
          <div
            style={{
              padding: "1.5rem",
              background: "#fff",
              borderRadius: "12px",
              border: "1px solid #D6D4CC",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              fontSize: "0.9rem",
              lineHeight: 1.6,
              color: "#3A3A38",
            }}
          >
            {/* Executive Summary */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontWeight: 700, color: "#1A1915", marginBottom: "0.5rem", fontSize: "1rem" }}>
                Executive Summary
              </div>
              <p style={{ fontSize: "0.85rem", color: "#6B6B68", fontStyle: "italic", margin: 0 }}>
                An engineering assessment was performed on [component] in [process].
                Visual observations indicate [finding]. Measurement confidence is [class].
                Estimated cost exposure: [amount]. Recommended action: [plan].
                <span style={{ display: "inline-block", marginLeft: "0.5rem", padding: "0.15rem 0.4rem", background: "#E8D5B5", borderRadius: "3px", fontSize: "0.7rem", color: "#8A7A23", fontWeight: 600 }}>Full Diagnostic</span>
              </p>
            </div>

            {/* Visible Observations */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontWeight: 700, color: "#1A1915", marginBottom: "0.5rem", fontSize: "1rem" }}>
                Visible Observations
              </div>
              <ul style={{ fontSize: "0.85rem", color: "#6B6B68", margin: 0, paddingLeft: "1.1rem", lineHeight: 1.8 }}>
                <li>Surface discoloration observed in the weld heat-affected zone<span style={{ marginLeft: "0.4rem", padding: "0.15rem 0.4rem", background: "#E8D5B5", borderRadius: "3px", fontSize: "0.65rem", color: "#8A7A23", fontWeight: 600 }}>Full Diagnostic</span></li>
                <li>Misalignment detected at joint interface based on photo analysis<span style={{ marginLeft: "0.4rem", padding: "0.15rem 0.4rem", background: "#E8D5B5", borderRadius: "3px", fontSize: "0.65rem", color: "#8A7A23", fontWeight: 600 }}>Full Diagnostic</span></li>
              </ul>
            </div>

            {/* Engineering Interpretation */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontWeight: 700, color: "#1A1915", marginBottom: "0.5rem", fontSize: "1rem" }}>
                Engineering Interpretation
              </div>
              <p style={{ fontSize: "0.85rem", color: "#6B6B68", fontStyle: "italic", margin: 0 }}>
                The observed pattern is consistent with thermal distortion during the welding cycle. The misalignment may indicate inadequate fixturing or uneven heat distribution. Further investigation is required.
                <span style={{ display: "inline-block", marginLeft: "0.5rem", padding: "0.15rem 0.4rem", background: "#E8D5B5", borderRadius: "3px", fontSize: "0.7rem", color: "#8A7A23", fontWeight: 600 }}>Full Diagnostic</span>
              </p>
            </div>

            {/* Root Cause Hypotheses */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontWeight: 700, color: "#1A1915", marginBottom: "0.5rem", fontSize: "1rem" }}>
                Root Cause Hypotheses
              </div>
              <ul style={{ fontSize: "0.85rem", color: "#6B6B68", margin: 0, paddingLeft: "1.1rem", lineHeight: 1.8 }}>
                <li>Thermal distortion from excessive heat input<span style={{ marginLeft: "0.4rem", padding: "0.15rem 0.4rem", background: "#E8D5B5", borderRadius: "3px", fontSize: "0.65rem", color: "#8A7A23", fontWeight: 600 }}>Full Diagnostic</span></li>
                <li>Inadequate fixturing or clamping pressure<span style={{ marginLeft: "0.4rem", padding: "0.15rem 0.4rem", background: "#E8D5B5", borderRadius: "3px", fontSize: "0.65rem", color: "#8A7A23", fontWeight: 600 }}>Full Diagnostic</span></li>
              </ul>
            </div>

            {/* Cost-at-Risk */}
            <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: "#1A1915", marginBottom: "0.25rem", fontSize: "1rem" }}>
                  Cost-at-Risk
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#A12323" }}>
                  $XX,XXX
                </div>
              </div>
              <span style={{ padding: "0.3rem 0.6rem", background: "#E8D5B5", borderRadius: "4px", fontSize: "0.7rem", color: "#8A7A23", fontWeight: 600 }}>Full Diagnostic</span>
            </div>

            {/* NCR + CAPA */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ padding: "1rem", background: "#F5F3ED", borderRadius: "8px" }}>
                <div style={{ fontWeight: 600, color: "#1A1915", marginBottom: "0.25rem", fontSize: "0.9rem" }}>
                  NCR Draft
                  <span style={{ marginLeft: "0.4rem", padding: "0.15rem 0.4rem", background: "#E8D5B5", borderRadius: "3px", fontSize: "0.65rem", color: "#8A7A23", fontWeight: 600 }}>Full Diagnostic</span>
                </div>
                <p style={{ fontSize: "0.8rem", color: "#6B6B68", margin: "0.5rem 0 0", fontStyle: "italic" }}>
                  Non-conformance detected in [process]. Affected quantity: [N] units. Reference: [specification].
                </p>
              </div>
              <div style={{ padding: "1rem", background: "#F5F3ED", borderRadius: "8px" }}>
                <div style={{ fontWeight: 600, color: "#1A1915", marginBottom: "0.25rem", fontSize: "0.9rem" }}>
                  CAPA Draft
                  <span style={{ marginLeft: "0.4rem", padding: "0.15rem 0.4rem", background: "#E8D5B5", borderRadius: "3px", fontSize: "0.65rem", color: "#8A7A23", fontWeight: 600 }}>Full Diagnostic</span>
                </div>
                <p style={{ fontSize: "0.8rem", color: "#6B6B68", margin: "0.5rem 0 0", fontStyle: "italic" }}>
                  Corrective action: [action]. Preventive measure: [measure]. Target completion: [date].
                </p>
              </div>
            </div>

            {/* PDF + Verification */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.75rem 1rem",
                background: "#F0EEE6",
                borderRadius: "8px",
              }}
            >
              <span style={{ fontSize: "0.85rem", color: "#4A4A48" }}>
                Download Professional PDF Report
              </span>
              <span style={{ fontSize: "0.75rem", color: "#6B6B68", fontFamily: "monospace" }}>
                SHA-256: a1b2...c3d4
              </span>
              <span style={{ marginLeft: "auto", padding: "0.15rem 0.4rem", background: "#E8D5B5", borderRadius: "3px", fontSize: "0.65rem", color: "#8A7A23", fontWeight: 600 }}>
                Full Diagnostic
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ROI / VALUE SECTION ═══ */}
      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={SECTION_HEADING}>How Engineering Diagnostics Saves Time and Reduces Risk</h2>
          <p style={SECTION_SUBTITLE}>
            Stop relying on spreadsheets and guesswork. Turn field observations into documented engineering evidence.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            {[
              { t: "Reduce Investigation Time", d: "AI-assisted observations accelerate initial diagnosis. Go from field photo to structured findings in minutes instead of hours." },
              { t: "Avoid Repeated Rework Discussions", d: "Document evidence with measurement confidence scores and deterministic risk assessment. No more debating what the data says." },
              { t: "Document Issues Before Escalation", d: "Capture field conditions with photo evidence, measurement data, and hashed verification records before the issue is resolved." },
              { t: "Create NCR / CAPA Drafts Faster", d: "AI-drafted non-conformance reports and corrective action plans cut documentation time significantly." },
              { t: "Preserve Evidence with Verification Hash", d: "Every report is cryptographically hashed. Verify report integrity at any time. Defensible documentation for quality audits." },
              { t: "Support Internal Quality Reviews", d: "Structured reports with audit trail, methodology section, and limitations statement. Ready for management review." },
            ].map((r) => (
              <div key={r.t} style={CARD_BASE}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#BD5D3A", marginBottom: "0.5rem" }}>{r.t}</h3>
                <p style={{ fontSize: "0.85rem", lineHeight: 1.5, color: "#4A4A48", margin: 0 }}>{r.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INDUSTRIES COVERED ═══ */}
      <section style={{ padding: "4rem 1.5rem", background: "#F5F3ED" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={SECTION_HEADING}>Industries Covered</h2>
          <p style={SECTION_SUBTITLE}>
            Domain-specific diagnostics for core engineering and operational environments.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {[
              { d: "CNC Machining", cat: "Core" },
              { d: "Welding & Fabrication", cat: "Core" },
              { d: "Steel Construction", cat: "Core" },
              { d: "Concrete & Civil", cat: "Core" },
              { d: "Electrical Systems", cat: "Core" },
              { d: "Mechanical Systems", cat: "Core" },
              { d: "Logistics & Supply Chain", cat: "Advisory" },
              { d: "Facility Management", cat: "Advisory" },
              { d: "Agriculture", cat: "Advisory" },
              { d: "Textile Manufacturing", cat: "Advisory" },
              { d: "Warehouse Operations", cat: "Advisory" },
              { d: "Commercial Food Service", cat: "Advisory" },
            ].map((ind) => (
              <div
                key={ind.d}
                style={{
                  ...CARD_BASE,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "0.9rem", color: "#1A1915", fontWeight: 500 }}>{ind.d}</span>
                <span
                  style={{
                    fontSize: "0.65rem",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "4px",
                    fontWeight: 600,
                    background: ind.cat === "Core" ? "#D6F5D6" : "#FFF8D6",
                    color: ind.cat === "Core" ? "#238A23" : "#8A7A23",
                  }}
                >
                  {ind.cat}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRUST / AUDIT TRAIL ═══ */}
      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={SECTION_HEADING}>Trust &amp; Audit Trail</h2>
          <p style={SECTION_SUBTITLE}>
            Every diagnostic report is designed for defensibility and traceability.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1rem",
            }}
          >
            {[
              { t: "Cryptographic Hashing", d: "Every report generates a SHA-256 hash. Verify report integrity at any time using the public verification endpoint." },
              { t: "Image Hashing", d: "Uploaded photos are hashed. The original image is not stored, but its hash provides a tamper-evident link to the evidence." },
              { t: "Full Audit Log", d: "Every deterministic calculation step is logged with timestamps. Review the complete decision chain." },
              { t: "Engine Versioning", d: "All reports include engine version metadata. Results are reproducible and attributable to specific engine builds." },
              { t: "Owner-Scoped Access", d: "Reports are visible only to the owner. Dashboard and report routes enforce strict access control." },
              { t: "Verification Records", d: "Verification records contain only minimal non-sensitive metadata (hash, decision, risk score, timestamps)." },
            ].map((tr) => (
              <div key={tr.t} style={CARD_BASE}>
                <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "#1A1915", marginBottom: "0.4rem" }}>{tr.t}</h3>
                <p style={{ fontSize: "0.85rem", lineHeight: 1.5, color: "#4A4A48", margin: 0 }}>{tr.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ARCHITECTURE ═══ */}
      <section style={{ padding: "4rem 1.5rem", background: "#F5F3ED" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={SECTION_HEADING}>Engine Architecture</h2>
          <p style={SECTION_SUBTITLE}>
            A hybrid approach: deterministic engines for critical metrics, AI assistance for observation and reasoning.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            {[
              { t: "Deterministic Risk Scoring", d: "Measurement confidence, tolerance status, and cost exposure are evaluated through server-side deterministic engines. No AI hallucination on critical metrics." },
              { t: "AI-Assisted Observations", d: "OpenAI Vision analyzes uploaded photos for visible conditions. All AI output is clearly labeled and never overrides deterministic calculations." },
              { t: "Server-Side Processing", d: "All calculations, AI calls, and report generation run server-side. Photos are EXIF-stripped and hashed. No sensitive data is exposed to the client." },
              { t: "AI Guardrails", d: "AI output is validated against strict guardrails. Forbidden claims, numeric overrides, and deterministic field names are rejected with safe fallback." },
            ].map((arch) => (
              <div key={arch.t} style={CARD_BASE}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#BD5D3A", marginBottom: "0.5rem" }}>{arch.t}</h3>
                <p style={{ fontSize: "0.85rem", lineHeight: 1.5, color: "#4A4A48", margin: 0 }}>{arch.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2 style={SECTION_HEADING}>Frequently Asked Questions</h2>
          <p style={SECTION_SUBTITLE}>
            Everything you need to know about Engineering Diagnostics.
          </p>
          {[
            { q: "How much does a Full Engineering Diagnostic cost?", a: "A Full Diagnostic uses 1 of 3 uses in the 5-credit package. Credits are purchased once through Paddle and never auto-renew. The price depends on which credit pack you choose." },
            { q: "Can I try before I buy?", a: "Yes. The free preview shows domain detection, risk band, and a brief explanation. No credit required. You only pay when you need the full report with AI interpretation, PDF, and verification." },
            { q: "What happens to my photos?", a: "Photos are processed server-side: EXIF metadata is stripped, a cryptographic hash is stored for verification, and the raw image is not retained. Only image hashes, report metadata, and verification records are stored." },
            { q: "Can the AI make engineering decisions?", a: "No. AI may only describe observations, propose root-cause hypotheses, and draft NCR/CAPA language. All numerical values (measurements, tolerances, uncertainty, cost-at-risk, risk scores) come from deterministic SectorCalc engines or user input." },
            { q: "Do I need a subscription?", a: "No. Credits are a one-time purchase valid for 12 months. No auto-renewal. Use them when you need them." },
            { q: "Can I share reports with my team?", a: "Reports are owner-scoped by default. Department and Enterprise credit packs support team credit sharing. Contact us for multi-user setup." },
            { q: "Is the PDF report legally valid?", a: "The PDF is a professional engineering report with full audit trail, methodology, and limitations. It is not a substitute for a licensed professional engineer's judgment. All results require manual verification by qualified professionals." },
            { q: "What industries are supported?", a: "12 domains across core engineering (CNC, welding, steel, concrete, electrical, mechanical) and advisory operations (logistics, facility, agriculture, textile, warehouse, food service)." },
          ].map((faq) => (
            <div
              key={faq.q}
              style={{
                padding: "1rem 0",
                borderBottom: "1px solid #D6D4CC",
              }}
            >
              <div style={{ fontWeight: 600, color: "#1A1915", fontSize: "0.9rem", marginBottom: "0.4rem" }}>
                {faq.q}
              </div>
              <p style={{ fontSize: "0.85rem", color: "#6B6B68", lineHeight: 1.5, margin: 0 }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section
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
              }}
            >
              Start Engineering Diagnosis
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
