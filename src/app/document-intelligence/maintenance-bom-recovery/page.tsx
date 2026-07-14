/**
 * Maintenance BOM Recovery — Product Landing Page
 *
 * Route: /document-intelligence/maintenance-bom-recovery
 * Sections 96–109 compliance: hero, problem/solution, workflow, deliverables,
 * sample, validation, traceability, pricing, FAQ, final CTA.
 * Server component with interactive sample sub-component.
 */
import Link from "next/link";
import type { Metadata } from "next";
import { DiBreadcrumbs } from "@/components/document-intelligence/DiBreadcrumbs";
import SampleBomViewer from "@/components/document-intelligence/SampleBomViewer";

export const metadata: Metadata = {
  title: "Maintenance BOM Recovery — Spare-Parts Data from Legacy Manuals | SectorCalc",
  description:
    "Upload an eligible machine manual or spare-parts PDF and receive a validated, ERP-ready BOM with source-page traceability and a procurement exception report. Free diagnostic — 149 credits per accepted job.",
  openGraph: {
    title: "Maintenance BOM Recovery | SectorCalc",
    description:
      "Recover spare-parts data from legacy machine manuals. Validated, ERP-ready BOM with source traceability.",
    url: "/document-intelligence/maintenance-bom-recovery",
    siteName: "SectorCalc",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maintenance BOM Recovery | SectorCalc",
    description:
      "Recover spare-parts data from legacy machine manuals. Validated, ERP-ready BOM with source traceability.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/document-intelligence/maintenance-bom-recovery" },
};

const ACCENT = "#BD5D3A";
const TEXT = "#1A1915";
const MUTED = "#696764";
const BG = "#F0EEE6";
const CARD_BG = "#FFFFFF";
const BORDER = "rgba(26,25,21,0.10)";
const CLEAN = "#2D8132";
const WARN = "#C45A1A";

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <h2
      style={{
        fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
        fontWeight: 600,
        color: TEXT,
        marginBottom: "1rem",
        letterSpacing: "-0.01em",
      }}
    >
      <span style={{ color: ACCENT, marginRight: "0.5rem" }}>{number}.</span>
      {title}
    </h2>
  );
}

const FAQ_DATA = [
  { q: "What types of documents are supported?", a: "Native digital PDF machine manuals, OEM spare-parts catalogs, maintenance manuals, equipment BOM tables, and assembly parts lists in English, up to 50 pages and 500 expected BOM rows." },
  { q: "What is the free diagnostic?", a: "Upload your PDF and the system analyzes the first 3 pages (up to 10 preview rows) to determine eligibility. No credits are consumed during the diagnostic." },
  { q: "When are my credits consumed?", a: "Credits are reserved when you confirm the 149-credit job after receiving an eligible diagnostic result. They are spent only after successful output generation. Rejected or unsupported documents never consume credits." },
  { q: "What happens if my document is rejected?", a: "You are not charged. The diagnostic shows the reason — unsupported format, password protection, no identifiable parts table, or limits exceeded." },
  { q: "What outputs will I receive?", a: "A delivery ZIP (SectorCalc_Maintenance_BOM_Delivery_{jobId}.zip) containing the validated BOM Excel workbook, procurement exception report, source map CSV, data dictionary, import readiness checklist, output manifest JSON, processing summary, and README_FIRST.txt." },
  { q: "Is the output ERP-ready?", a: "The workbook includes a Generic ERP Import Template and a Generic CMMS Spare Parts Template. SectorCalc does not provide certified direct integration with any named ERP. Final import validation remains your responsibility." },
  { q: "Can I use this with SAP, Oracle, or Maximo?", a: "The Generic ERP Import Template provides a flat schema you can map to your target system. SectorCalc has not tested or certified compatibility with any specific ERP vendor." },
  { q: "How are duplicates handled?", a: "Seven duplicate classes are detected (exact normalized, conflicting description, conflicting revision, conflicting manufacturer, probable formatting, same description different part, duplicate source row). Duplicate groups show all affected records and recommended disposition." },
  { q: "How are revision conflicts handled?", a: "Conflicts are detected when the same normalized part number has multiple revisions. The system reports all observed revisions with source pages but never infers which revision is current without explicit source evidence." },
  { q: "What is source traceability?", a: "Every exported row is linked to its source document, page number, table identifier, and evidence reference. You can verify any row against the original source." },
  { q: "Can you process scanned PDFs?", a: "Only native digital PDFs are supported for automatic 149-credit processing. Scanned documents without extractable text may be marked manual-review-required or rejected." },
  { q: "How long does processing take?", a: "The free diagnostic completes within a few minutes. Full processing time depends on document size; typical eligible documents (50 pages, 500 rows) complete within the configured service window." },
  { q: "Will you include my source PDF in the delivery?", a: "No. Source documents are deleted within 24 hours after successful output generation. The delivery package contains only the generated artifacts." },
  { q: "How long are my outputs retained?", a: "Outputs are retained for 7 days by default. You can download them during this period. After expiry, outputs are deleted and are no longer accessible." },
  { q: "Do you train models on my documents?", a: "No. Source documents and extracted content are not used for model training, and are never shared with third parties beyond the configured processing provider." },
  { q: "What counts as a product defect?", a: "Missing mandatory artifacts, corrupted workbook, absent source traceability, silently lost rows, wrong normalization caused by product rules, or omitted duplicate/revision exceptions despite clear source evidence." },
  { q: "What happens if processing fails?", a: "Retryable failures automatically retry with exponential backoff. Terminal failures before usable output release the reserved 149 credits and allow a replacement job or refund." },
  { q: "If a retry is needed, are more credits charged?", a: "No. Retries of the same paid job consume 0 additional credits. Regeneration for a confirmed product defect also consumes 0 additional credits." },
  { q: "What are low-confidence records and how are they handled?", a: "Records where the extraction confidence is below threshold are blocked from clean export and moved to Review Required. They remain source-traceable and can be reviewed." },
  { q: "Does this replace engineering or purchasing approval?", a: "No. SectorCalc outputs support data preparation. The customer must review flagged and business-critical records before ERP import, RFQ issuance, purchasing, maintenance, or engineering use." },
];

function FaqItem({
  question,
  answer,
  defaultOpen,
}: {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}) {
  const id = question.replace(/\s+/g, "-").toLowerCase().replace(/[^a-z0-9-]/g, "");
  return (
    <details
      id={id}
      open={defaultOpen}
      style={{
        padding: "1rem 0",
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      <summary
        style={{
          fontWeight: 600,
          fontSize: "0.95rem",
          color: TEXT,
          cursor: "pointer",
          minHeight: 48,
          display: "flex",
          alignItems: "center",
        }}
      >
        {question}
      </summary>
      <p
        style={{
          marginTop: "0.5rem",
          color: MUTED,
          lineHeight: 1.6,
          fontSize: "0.9rem",
        }}
      >
        {answer}
      </p>
    </details>
  );
}

export default function MaintenanceBomRecoveryPage() {
  return (
    <main
      style={{
        backgroundColor: BG,
        color: TEXT,
        fontFamily: 'Barlow, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        minHeight: "100vh",
      }}
    >
      {/* ── Breadcrumb ────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1rem 1.5rem 0" }}>
        <DiBreadcrumbs
          items={[
            { label: "Document Intelligence", href: "/document-intelligence" },
            { label: "Maintenance BOM Recovery", href: "/document-intelligence/maintenance-bom-recovery" },
          ]}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         HERO — Section 96
         ═══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "2rem 1.5rem 3rem",
        }}
      >
        <p
          style={{
            fontSize: "0.8rem",
            fontWeight: 500,
            color: ACCENT,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "0.75rem",
          }}
        >
          Maintenance BOM Recovery
        </p>

        <h1
          style={{
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            color: TEXT,
            marginBottom: "1rem",
            maxWidth: 850,
            letterSpacing: "-0.02em",
          }}
        >
          Recover Spare-Parts Data from Legacy Machine Manuals
        </h1>

        <p
          style={{
            fontSize: "clamp(0.95rem, 1.4vw, 1.15rem)",
            color: MUTED,
            maxWidth: 700,
            lineHeight: 1.6,
            marginBottom: "1.5rem",
          }}
        >
          Upload an eligible machine manual or spare-parts PDF and receive a
          validated, ERP-ready BOM, source map, and procurement exception report.
        </p>

        {/* ── CTAs ──────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
          <Link
            href="/document-intelligence/maintenance-bom-recovery/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.875rem 2rem",
              backgroundColor: ACCENT,
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: "1rem",
              textDecoration: "none",
              minHeight: 48,
              minWidth: 48,
            }}
          >
            Check My Manual Free
          </Link>

          <Link
            href="/samples/Sample_Maintenance_BOM.xlsx"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.875rem 2rem",
              border: `1px solid ${BORDER}`,
              color: TEXT,
              fontWeight: 500,
              fontSize: "1rem",
              textDecoration: "none",
              minHeight: 48,
              minWidth: 48,
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Sample Delivery Package
          </Link>
        </div>

        {/* ── Price trust line + risk reversal ──────────────────── */}
        <p style={{ color: TEXT, fontWeight: 500, fontSize: "0.95rem", marginBottom: "0.35rem" }}>
          149 credits after the free diagnostic confirms eligibility.
        </p>
        <p style={{ color: MUTED, fontSize: "0.85rem", marginBottom: "1.5rem" }}>
          Unsupported documents are not charged.
        </p>

        {/* ── Hero proof chips ──────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          {[
            "Up to 50 PDF pages",
            "Up to 500 BOM rows",
            "Source-page traceability",
            "No subscription",
            "Private processing",
            "Automatic source deletion",
          ].map((chip) => (
            <span
              key={chip}
              style={{
                padding: "0.35rem 0.85rem",
                backgroundColor: CARD_BG,
                border: `1px solid ${BORDER}`,
                fontSize: "0.8rem",
                color: MUTED,
              }}
            >
              {chip}
            </span>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         Section 97 — Problem / Solution Narrative
         ═══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "3rem 1.5rem",
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        <p style={{ fontSize: "0.8rem", fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>
          The Problem
        </p>
        <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 700, color: TEXT, marginBottom: "2rem", maxWidth: 700 }}>
          Spare-Parts Data Is Trapped in Old Manuals
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div>
            <h4 style={{ color: WARN, fontWeight: 600, marginBottom: "1rem", fontSize: "0.95rem" }}>Pain Points</h4>
            <ul style={{ color: MUTED, lineHeight: 2.2, paddingLeft: "1.25rem" }}>
              <li>Spare-parts tables trapped inside old PDF manuals</li>
              <li>Inconsistent part-number formatting across catalogs</li>
              <li>Repeated or conflicting rows waste procurement time</li>
              <li>Missing quantities or descriptions block ERP preparation</li>
              <li>Revision conflicts discovered too late</li>
              <li>Fragmented equipment and subassembly context</li>
              <li>Manual copy/paste into Excel with no source traceability</li>
              <li>Repeated cleanup before every ERP or RFQ cycle</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: CLEAN, fontWeight: 600, marginBottom: "1rem", fontSize: "0.95rem" }}>Solution</h4>
            <ul style={{ color: MUTED, lineHeight: 2.2, paddingLeft: "1.25rem" }}>
              <li>Recover candidate BOM rows from eligible PDFs</li>
              <li>Preserve raw values alongside normalized display values</li>
              <li>Detect 7 duplicate classes automatically</li>
              <li>Flag missing required fields and invalid quantities</li>
              <li>Identify multi-revision conflicts with source evidence</li>
              <li>Separate clean and review-required records</li>
              <li>Build procurement and ERP preparation outputs</li>
              <li>Deliver one verified, source-linked package</li>
            </ul>
          </div>
        </div>

        <div
          style={{
            marginTop: "2rem",
            padding: "1.25rem",
            backgroundColor: CARD_BG,
            border: `1px solid ${BORDER}`,
            fontSize: "0.9rem",
            color: MUTED,
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: TEXT }}>Automated extraction and consistency checks support data preparation.</strong>
          {" "}The customer must review flagged and business-critical records before ERP import, RFQ issuance, purchasing, maintenance, or engineering use.
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         Section 98 — Before / After
         ═══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "3rem 1.5rem",
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        <SectionHeading number="98" title="Before / After" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div style={{ padding: "1.5rem", backgroundColor: CARD_BG, border: `1px solid ${BORDER}` }}>
            <p style={{ fontSize: "0.8rem", fontWeight: 600, color: WARN, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>
              Before
            </p>
            <ul style={{ color: MUTED, lineHeight: 2.2, paddingLeft: "1.25rem" }}>
              <li>Search pages manually</li>
              <li>Copy rows into Excel</li>
              <li>Repair wrapped descriptions</li>
              <li>Standardize part numbers</li>
              <li>Identify duplicate rows</li>
              <li>Compare revisions</li>
              <li>Rebuild source references</li>
              <li>Prepare import columns manually</li>
            </ul>
          </div>
          <div style={{ padding: "1.5rem", backgroundColor: CARD_BG, border: `1px solid ${BORDER}` }}>
            <p style={{ fontSize: "0.8rem", fontWeight: 600, color: CLEAN, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>
              After
            </p>
            <ul style={{ color: MUTED, lineHeight: 2.2, paddingLeft: "1.25rem" }}>
              <li>Upload eligible PDF</li>
              <li>Receive free diagnostic</li>
              <li>Confirm 149-credit job</li>
              <li>Automated dual-pass extraction</li>
              <li>Critical-field reconciliation</li>
              <li>Clean and blocked-row separation</li>
              <li>Procurement and ERP preparation sheets</li>
              <li>Source-linked delivery package</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         Section 99 — How It Works (6 steps)
         ═══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "3rem 1.5rem",
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        <SectionHeading number="99" title="How It Works" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1rem",
          }}
        >
          {[
            { step: "1", title: "Upload", desc: "Select an eligible machine manual PDF" },
            { step: "2", title: "Free Diagnostic", desc: "System analyzes first pages and detects eligibility" },
            { step: "3", title: "Review Preview", desc: "See detected columns, preview rows, and risks" },
            { step: "4", title: "Confirm 149 Credits", desc: "Approve the fixed-price job" },
            { step: "5", title: "Controlled Processing", desc: "Dual-pass extraction, reconciliation, validation" },
            { step: "6", title: "Download & Review", desc: "Receive the full delivery package" },
          ].map((item) => (
            <div
              key={item.step}
              style={{
                padding: "1.25rem",
                backgroundColor: CARD_BG,
                border: `1px solid ${BORDER}`,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: ACCENT,
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 0.75rem",
                }}
              >
                {item.step}
              </div>
              <h4 style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.35rem", color: TEXT }}>
                {item.title}
              </h4>
              <p style={{ fontSize: "0.8rem", color: MUTED, lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         Section 100 — What You Receive for 149 Credits (11 deliverables)
         ═══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "3rem 1.5rem",
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        <SectionHeading number="100" title="What You Receive for 149 Credits" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
          }}
        >
          {[
            "Validated Maintenance BOM",
            "Procurement Exception Report",
            "Source Map (CSV)",
            "Procurement Ready Sheet",
            "RFQ Preparation Sheet",
            "Generic ERP Import Template",
            "Generic CMMS Spare Parts Template",
            "Data Dictionary",
            "Import Readiness Checklist",
            "Processing Summary",
            "Delivery Manifest (JSON)",
          ].map((item) => (
            <div
              key={item}
              style={{
                padding: "1rem",
                backgroundColor: CARD_BG,
                border: `1px solid ${BORDER}`,
                fontSize: "0.9rem",
                color: TEXT,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={{ color: CLEAN }}>✓</span>
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         Section 101 — Live Sample Output Experience
         ═══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "3rem 1.5rem",
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        <SectionHeading number="101" title="Sample Output Preview" />
        <p style={{ color: MUTED, marginBottom: "1.5rem", maxWidth: 720, lineHeight: 1.6 }}>
          Explore a synthetic sample BOM. Browse the tabs below to see how clean
          rows, review-required records, duplicates, revision conflicts, and
          source mapping are organized.
        </p>
        <SampleBomViewer />
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link
            href="/document-intelligence/maintenance-bom-recovery/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.875rem 2rem",
              backgroundColor: ACCENT,
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: "1rem",
              textDecoration: "none",
              minHeight: 48,
              minWidth: 48,
            }}
          >
            Check My Manual Free
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         Section 102 — Validation Engine
         ═══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "3rem 1.5rem",
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        <SectionHeading number="102" title="Validation Controls" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {[
            "Part Number Normalization",
            "Duplicate Detection",
            "Missing Required Fields",
            "Revision Conflict Detection",
            "Quantity & Unit Integrity",
            "Manufacturer Conflict Detection",
            "Asset & Subassembly Validation",
            "Source Evidence Verification",
            "Critical Field Reconciliation",
            "Formula-Injection Protection",
            "Row-Conservation Check",
            "Output Integrity Check",
          ].map((ctrl) => (
            <div
              key={ctrl}
              style={{
                padding: "0.75rem 1rem",
                backgroundColor: CARD_BG,
                border: `1px solid ${BORDER}`,
                fontSize: "0.85rem",
                color: TEXT,
              }}
            >
              {ctrl}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         Section 103 — Source Traceability
         ═══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "3rem 1.5rem",
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        <SectionHeading number="103" title="Source Traceability" />
        <p style={{ color: MUTED, maxWidth: 720, lineHeight: 1.7, marginBottom: "1.5rem" }}>
          Every exported row is linked to its origin. Select a row in the review
          UI and verify it against the original source page.
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            alignItems: "center",
            padding: "1.5rem",
            backgroundColor: CARD_BG,
            border: `1px solid ${BORDER}`,
          }}
        >
          {["Part Number", "→", "Source Document", "→", "Source Page", "→", "Source Table", "→", "Source Row/Evidence"].map(
            (item, i) => (
              <span
                key={i}
                style={{
                  padding: "0.4rem 0.75rem",
                  backgroundColor: i % 2 === 1 ? "transparent" : BG,
                  color: i % 2 === 1 ? ACCENT : TEXT,
                  fontWeight: i % 2 === 1 ? 700 : 400,
                  fontSize: "0.85rem",
                  border: i % 2 === 1 ? "none" : `1px solid ${BORDER}`,
                }}
              >
                {item}
              </span>
            ),
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         Section 104 — Supported / Unsupported Documents
         ═══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "3rem 1.5rem",
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        <SectionHeading number="104" title="Supported Documents" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div style={{ padding: "1.5rem", backgroundColor: CARD_BG, border: `1px solid ${BORDER}` }}>
            <h4 style={{ fontWeight: 600, color: CLEAN, marginBottom: "0.75rem" }}>Supported (Automatic Processing)</h4>
            <ul style={{ color: MUTED, lineHeight: 2, paddingLeft: "1.25rem" }}>
              <li>Native digital machine manuals</li>
              <li>OEM spare-parts catalogs</li>
              <li>Maintenance manuals</li>
              <li>Equipment BOM tables</li>
              <li>Assembly parts lists</li>
              <li>English-language PDFs</li>
              <li>Up to 50 pages and 500 expected rows</li>
            </ul>
          </div>
          <div style={{ padding: "1.5rem", backgroundColor: CARD_BG, border: `1px solid ${BORDER}` }}>
            <h4 style={{ fontWeight: 600, color: WARN, marginBottom: "0.75rem" }}>Not Supported (Automatic Flow)</h4>
            <ul style={{ color: MUTED, lineHeight: 2, paddingLeft: "1.25rem" }}>
              <li>Handwritten documents</li>
              <li>Photographs of pages</li>
              <li>Password-protected PDFs</li>
              <li>Unreadable scans</li>
              <li>Documents without identifiable parts tables</li>
              <li>Documents exceeding limits</li>
              <li>Documents requiring manual engineering interpretation</li>
              <li>Exploded drawings without parts tables</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         Section 105 — 149-Credit Pricing Section
         ═══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "3rem 1.5rem",
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        <SectionHeading number="105" title="Pricing" />
        <div
          style={{
            maxWidth: 480,
            padding: "2rem",
            backgroundColor: CARD_BG,
            border: `1px solid ${BORDER}`,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: ACCENT,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "0.25rem",
            }}
          >
            Maintenance BOM Recovery
          </p>
          <p style={{ fontSize: "0.85rem", color: MUTED, marginBottom: "0.75rem" }}>
            Verified BOM Job
          </p>
          <div style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 700, color: TEXT, marginBottom: "1rem" }}>
            149 Credits
          </div>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "0 0 1.5rem",
              color: MUTED,
              fontSize: "0.85rem",
              lineHeight: 2,
              textAlign: "left",
              display: "inline-block",
            }}
          >
            <li>✓ Free eligibility diagnostic</li>
            <li>✓ One eligible PDF</li>
            <li>✓ Up to 50 pages</li>
            <li>✓ Up to 500 BOM rows</li>
            <li>✓ Full delivery package</li>
            <li>✓ Source-page traceability</li>
            <li>✓ Validation and exception reporting</li>
            <li>✓ Secure download</li>
            <li>✓ Source deletion within 24 hours</li>
            <li>✓ No subscription required</li>
          </ul>
          <Link
            href="/document-intelligence/maintenance-bom-recovery/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.875rem 2rem",
              backgroundColor: ACCENT,
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: "1rem",
              textDecoration: "none",
              minHeight: 48,
              minWidth: 48,
              width: "100%",
            }}
          >
            Check My Manual Free
          </Link>
          <p style={{ color: MUTED, fontSize: "0.8rem", marginTop: "0.75rem" }}>
            No credits are consumed for rejected or unsupported documents.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         Section 106 — Security and Trust
         ═══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "3rem 1.5rem",
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        <SectionHeading number="106" title="Security and Trust" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1rem",
          }}
        >
          {[
            "Authenticated upload only — each job is bound to your account",
            "Tenant-isolated private storage — no cross-user access",
            "Content and MIME validation on every upload",
            "Signed download URLs — outputs are never publicly accessible",
            "No document content sent to analytics or third parties",
            "Automatic source file deletion within 24 hours",
            "Auditable processing events with immutable records",
            "No model training permission — your data stays your data",
            "Retention deadline shown per job — outputs accessible for 7 days",
          ].map((item) => (
            <div
              key={item}
              style={{
                padding: "1rem",
                backgroundColor: CARD_BG,
                border: `1px solid ${BORDER}`,
                fontSize: "0.85rem",
                color: TEXT,
                lineHeight: 1.5,
              }}
            >
              ✓ {item}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         Section 107 — FAQ
         ═══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "3rem 1.5rem",
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        <SectionHeading number="107" title="Frequently Asked Questions" />
        {FAQ_DATA.map((faq, i) => (
          <FaqItem key={i} question={faq.q} answer={faq.a} defaultOpen={i === 0} />
        ))}
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         Section 108 — User-Friendly Experience (progress labels)
         ═══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "3rem 1.5rem",
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        <SectionHeading number="108" title="Processing States" />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          {[
            "Upload received",
            "Running free diagnostic",
            "Eligible for full processing",
            "Awaiting 149-credit confirmation",
            "Queued",
            "Extracting tables",
            "Reconciling critical fields",
            "Validating BOM records",
            "Generating delivery package",
            "Verifying file integrity",
            "Ready to download",
            "Quality hold",
            "Action required",
            "Expired",
          ].map((label) => (
            <span
              key={label}
              style={{
                padding: "0.4rem 0.85rem",
                backgroundColor: CARD_BG,
                border: `1px solid ${BORDER}`,
                fontSize: "0.8rem",
                color: MUTED,
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         Section 109 — Final CTA
         ═══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "4rem 1.5rem",
          borderTop: `1px solid ${BORDER}`,
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(1.35rem, 2.5vw, 1.85rem)",
            fontWeight: 600,
            color: TEXT,
            marginBottom: "0.75rem",
          }}
        >
          Ready to Recover Your Maintenance BOM?
        </h2>
        <p
          style={{
            color: MUTED,
            maxWidth: 600,
            margin: "0 auto 1.5rem",
            lineHeight: 1.6,
            fontSize: "1rem",
          }}
        >
          Run the free diagnostic first. You will see whether the document is
          eligible, what the system detected, and the fixed 149-credit scope
          before processing.
        </p>
        <Link
          href="/document-intelligence/maintenance-bom-recovery/new"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.875rem 2.5rem",
            backgroundColor: ACCENT,
            color: "#FFFFFF",
            fontWeight: 600,
            fontSize: "1rem",
            textDecoration: "none",
            minHeight: 48,
            minWidth: 48,
          }}
        >
          Check My Manual Free
        </Link>
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          <Link
            href="/samples/Sample_Maintenance_BOM.xlsx"
            style={{
              color: ACCENT,
              fontSize: "0.9rem",
              textDecoration: "underline",
              textUnderlineOffset: 2,
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Sample Delivery Package
          </Link>
        </div>
        <p style={{ color: MUTED, fontSize: "0.85rem", marginTop: "0.75rem" }}>
          Unsupported documents are not charged.
        </p>
      </section>
    </main>
  );
}
