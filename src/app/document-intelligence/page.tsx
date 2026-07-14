/**
 * Document Intelligence — Category Landing Page
 *
 * Route: /document-intelligence
 * Section 95 compliance: five-second clarity, 10 required sections.
 * Server component — no client JS dependency for SEO content.
 */
import Link from "next/link";
import type { Metadata } from "next";
import { DiBreadcrumbs } from "@/components/document-intelligence/DiBreadcrumbs";

export const metadata: Metadata = {
  title: "Document Intelligence — Turn Engineering Documents into Controlled Operational Data | SectorCalc",
  description:
    "Convert legacy manuals, parts catalogs, and technical PDFs into structured, traceable outputs for maintenance, procurement, and ERP preparation. The first available product is Maintenance BOM Recovery.",
  openGraph: {
    title: "Document Intelligence | SectorCalc",
    description:
      "Convert engineering documents into structured, traceable operational data for maintenance, procurement, and ERP preparation.",
    url: "/document-intelligence",
    siteName: "SectorCalc",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Document Intelligence | SectorCalc",
    description:
      "Convert engineering documents into structured, traceable operational data for maintenance, procurement, and ERP preparation.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/document-intelligence" },
};

const ACCENT = "#BD5D3A";
const TEXT = "#1A1915";
const MUTED = "#696764";
const BG = "#F0EEE6";
const CARD_BORDER = "rgba(26,25,21,0.10)";

function SectionHeading({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
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

export default function DocumentIntelligencePage() {
  return (
    <main
      style={{
        backgroundColor: BG,
        color: TEXT,
        fontFamily:
          'Barlow, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        minHeight: "100vh",
      }}
    >
      {/* ── Breadcrumb ────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "1rem 1.5rem 0",
        }}
      >
        <DiBreadcrumbs
          items={[{ label: "Document Intelligence", href: "/document-intelligence" }]}
        />
      </div>

      {/* ── Hero — Five-second clarity (Section 95) ─────────────── */}
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
          Document Intelligence
        </p>

        <h1
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            color: TEXT,
            marginBottom: "1.25rem",
            maxWidth: 900,
            letterSpacing: "-0.02em",
          }}
        >
          Turn Engineering Documents into Controlled Operational Data
        </h1>

        <p
          style={{
            fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
            color: MUTED,
            maxWidth: 720,
            lineHeight: 1.6,
            marginBottom: "2rem",
          }}
        >
          Convert legacy manuals, parts catalogs, and technical PDFs into
          structured, traceable outputs for maintenance, procurement, and ERP
          preparation. No subscription required — pay per eligible document.
        </p>

        {/* ── CTAs ──────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <Link
            href="/document-intelligence/maintenance-bom-recovery"
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
            Explore Maintenance BOM Recovery
          </Link>

          <Link
            href="/samples/Sample_Maintenance_BOM.xlsx"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.875rem 2rem",
              border: `1px solid ${CARD_BORDER}`,
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
            View Sample Output
          </Link>
        </div>

        {/* ── Visual composition (Section 95) ────────────────────── */}
        <div
          style={{
            marginTop: "3rem",
            padding: "2rem",
            border: `1px solid ${CARD_BORDER}`,
            backgroundColor: "#FFFFFF",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: ACCENT,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "0.5rem",
              }}
            >
              Source PDF
            </p>
            <div
              style={{
                backgroundColor: BG,
                padding: "1rem",
                fontSize: "0.8rem",
                color: MUTED,
                fontFamily: "monospace",
                lineHeight: 1.5,
              }}
            >
              <div>MACHINE MANUAL</div>
              <div>Model: XLT-5000</div>
              <div style={{ marginTop: "0.5rem", opacity: 0.6 }}>
                Section 7 — Spare Parts
              </div>
              <div style={{ opacity: 0.6 }}>Page 34</div>
              <div style={{ marginTop: "0.5rem", fontSize: "0.7rem" }}>
                ITEM | PART NO | DESCRIPTION | QTY
              </div>
              <div>001 | B-101 | Bearing, Ball | 4</div>
              <div>002 | S-202 | Seal, Oil | 2</div>
              <div>003 | G-303 | Gasket Set | 1</div>
            </div>
          </div>

          <div>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: ACCENT,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "0.5rem",
              }}
            >
              Extracted BOM
            </p>
            <div
              style={{
                backgroundColor: BG,
                padding: "1rem",
                fontSize: "0.8rem",
                color: TEXT,
                fontFamily: "monospace",
                lineHeight: 1.6,
              }}
            >
              <div style={{ color: "#2D8132" }}>✓ B-101 Bearing, Ball 4 EA</div>
              <div style={{ color: "#2D8132" }}>✓ S-202 Seal, Oil 2 EA</div>
              <div style={{ color: "#2D8132" }}>✓ G-303 Gasket Set 1 EA</div>
              <div style={{ color: "#C45A1A" }}>⚠ P-404 Pump [missing qty]</div>
              <div style={{ color: "#C45A1A" }}>⚠ B-101 [duplicate candidate]</div>
            </div>
          </div>

          <div>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: ACCENT,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "0.5rem",
              }}
            >
              Exception Flags
            </p>
            <div
              style={{
                backgroundColor: BG,
                padding: "1rem",
                fontSize: "0.8rem",
                color: TEXT,
                lineHeight: 1.6,
              }}
            >
              <div style={{ color: "#C45A1A" }}>● Duplicate: B-101 (x2)</div>
              <div style={{ color: "#C45A1A" }}>
                ● Missing quantity: P-404
              </div>
              <div style={{ color: "#C45A1A" }}>● Rev conflict: V-101 (A/B)</div>
              <div style={{ color: "#2D8132" }}>● 10 clean, 3 review, 0 blocked</div>
            </div>
          </div>

          <div>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: ACCENT,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "0.5rem",
              }}
            >
              Workbook Tabs
            </p>
            <div
              style={{
                backgroundColor: BG,
                padding: "1rem",
                fontSize: "0.8rem",
                color: MUTED,
                fontFamily: "monospace",
                lineHeight: 1.6,
              }}
            >
              <div>Clean BOM</div>
              <div>Review Required</div>
              <div>Duplicate Parts</div>
              <div>Procurement Ready</div>
              <div>ERP Template</div>
              <div>Source Map</div>
              <div>Processing Summary</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 1: Category Definition ────────────────────────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "3rem 1.5rem",
          borderTop: `1px solid ${CARD_BORDER}`,
        }}
      >
        <SectionHeading number="1" title="What Is Document Intelligence?" />
        <p style={{ color: MUTED, maxWidth: 720, lineHeight: 1.7, fontSize: "1rem" }}>
          Document Intelligence is a SectorCalc product category that converts
          unstructured engineering documents — machine manuals, spare-parts
          catalogs, maintenance PDFs — into controlled, traceable operational
          data. The platform applies automated extraction, deterministic
          normalization, multi-rule validation, and structured output generation
          to produce ERP-ready workbooks, procurement exception reports, and
          source-linked delivery packages.
        </p>
      </section>

      {/* ── Section 2: Operational Problems Solved ────────────────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "3rem 1.5rem",
          borderTop: `1px solid ${CARD_BORDER}`,
        }}
      >
        <SectionHeading number="2" title="What Problems Does It Solve?" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {[
            "Spare-parts tables trapped in old PDF manuals with no export path",
            "Inconsistent part-number formatting across catalogs and revisions",
            "Repeated or conflicting rows that waste procurement time",
            "Missing quantities or descriptions that block ERP preparation",
            "Revision conflicts detected before they reach purchasing",
            "Manual copy-paste into Excel with no source traceability",
          ].map((problem) => (
            <div
              key={problem}
              style={{
                padding: "1.25rem",
                backgroundColor: "#FFFFFF",
                border: `1px solid ${CARD_BORDER}`,
                fontSize: "0.9rem",
                color: TEXT,
                lineHeight: 1.5,
              }}
            >
              {problem}
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 3: First Available Product ────────────────────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "3rem 1.5rem",
          borderTop: `1px solid ${CARD_BORDER}`,
        }}
      >
        <SectionHeading number="3" title="First Available Product" />
        <div
          style={{
            padding: "2rem",
            backgroundColor: "#FFFFFF",
            border: `1px solid ${CARD_BORDER}`,
            display: "flex",
            flexWrap: "wrap",
            gap: "2rem",
            alignItems: "flex-start",
          }}
        >
          <div style={{ flex: "1 1 280px" }}>
            <p
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: ACCENT,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "0.5rem",
              }}
            >
              Maintenance BOM Recovery
            </p>
            <h3
              style={{
                fontSize: "1.35rem",
                fontWeight: 600,
                color: TEXT,
                marginBottom: "0.75rem",
              }}
            >
              Recover Spare-Parts Data from Legacy Machine Manuals
            </h3>
            <p style={{ color: MUTED, lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Upload an eligible machine manual or spare-parts PDF and receive a
              validated, ERP-ready BOM, source map, and procurement exception
              report. Fixed price: <strong>149 credits</strong> per accepted job.
            </p>
            <Link
              href="/document-intelligence/maintenance-bom-recovery"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.75rem 1.75rem",
                backgroundColor: ACCENT,
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "0.95rem",
                textDecoration: "none",
                minHeight: 48,
                minWidth: 48,
              }}
            >
              Check My Manual Free
            </Link>
          </div>
          <div
            style={{
              flex: "1 1 200px",
              padding: "1rem",
              backgroundColor: BG,
              fontSize: "0.85rem",
              color: MUTED,
              lineHeight: 1.8,
            }}
          >
            <div>✓ Up to 50 PDF pages</div>
            <div>✓ Up to 500 BOM rows</div>
            <div>✓ Source-page traceability</div>
            <div>✓ No subscription required</div>
            <div>✓ Free diagnostic first</div>
          </div>
        </div>
      </section>

      {/* ── Section 4: Before/After Workflow ──────────────────────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "3rem 1.5rem",
          borderTop: `1px solid ${CARD_BORDER}`,
        }}
      >
        <SectionHeading number="4" title="Before / After" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div
            style={{
              padding: "1.5rem",
              backgroundColor: "#FFFFFF",
              border: `1px solid ${CARD_BORDER}`,
            }}
          >
            <p
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#C45A1A",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "0.75rem",
              }}
            >
              Before
            </p>
            <ul style={{ color: MUTED, lineHeight: 2, paddingLeft: "1.25rem" }}>
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
          <div
            style={{
              padding: "1.5rem",
              backgroundColor: "#FFFFFF",
              border: `1px solid ${CARD_BORDER}`,
            }}
          >
            <p
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#2D8132",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "0.75rem",
              }}
            >
              After
            </p>
            <ul style={{ color: MUTED, lineHeight: 2, paddingLeft: "1.25rem" }}>
              <li>Upload eligible PDF</li>
              <li>Receive free diagnostic</li>
              <li>Confirm 149-credit job</li>
              <li>Automated dual-pass extraction</li>
              <li>Critical-field reconciliation</li>
              <li>Clean and blocked-row separation</li>
              <li>Procurement and ERP sheets</li>
              <li>Source-linked delivery package</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Section 5: Output Examples ────────────────────────────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "3rem 1.5rem",
          borderTop: `1px solid ${CARD_BORDER}`,
        }}
      >
        <SectionHeading number="5" title="Output Examples" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          {[
            { label: "Validated Maintenance BOM", desc: "Clean and review-required rows with source references" },
            { label: "Procurement Exception Report", desc: "Critical, high, and medium exceptions prioritized" },
            { label: "Source Map (CSV)", desc: "Every row linked to source document, page, and table" },
            { label: "Procurement Ready Sheet", desc: "Rows passing all validators, ready for RFQ preparation" },
            { label: "ERP Import Template", desc: "Generic flat schema for controlled import trials" },
            { label: "Processing Summary", desc: "Full metrics, versions, and retention policy" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                padding: "1.25rem",
                backgroundColor: "#FFFFFF",
                border: `1px solid ${CARD_BORDER}`,
              }}
            >
              <h4 style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.35rem", color: TEXT }}>
                {item.label}
              </h4>
              <p style={{ fontSize: "0.85rem", color: MUTED, lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 6: Source Traceability ────────────────────────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "3rem 1.5rem",
          borderTop: `1px solid ${CARD_BORDER}`,
        }}
      >
        <SectionHeading number="6" title="Source Traceability" />
        <p style={{ color: MUTED, maxWidth: 720, lineHeight: 1.7, marginBottom: "1.5rem" }}>
          Every exported row is linked to its origin: source document, page number,
          table identifier, and row evidence reference. The review UI allows you
          to select a row and verify it against the original source page.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
          {["Part Number", "→", "Source Document", "→", "Source Page", "→", "Source Table", "→", "Source Row"].map(
            (item, i) => (
              <span
                key={i}
                style={{
                  padding: "0.4rem 0.75rem",
                  backgroundColor: i % 2 === 1 ? "transparent" : "#FFFFFF",
                  border: i % 2 === 1 ? "none" : `1px solid ${CARD_BORDER}`,
                  color: i % 2 === 1 ? ACCENT : TEXT,
                  fontWeight: i % 2 === 1 ? 700 : 400,
                  fontSize: "0.85rem",
                }}
              >
                {item}
              </span>
            ),
          )}
        </div>
      </section>

      {/* ── Section 7: Validation Controls ────────────────────────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "3rem 1.5rem",
          borderTop: `1px solid ${CARD_BORDER}`,
        }}
      >
        <SectionHeading number="7" title="Validation Controls" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          {[
            "Part Number Normalization",
            "Duplicate Detection (7 classes)",
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
                backgroundColor: "#FFFFFF",
                border: `1px solid ${CARD_BORDER}`,
                fontSize: "0.9rem",
                color: TEXT,
              }}
            >
              {ctrl}
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 8: Security and Deletion ──────────────────────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "3rem 1.5rem",
          borderTop: `1px solid ${CARD_BORDER}`,
        }}
      >
        <SectionHeading number="8" title="Security and Deletion" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.25rem" }}>
          {[
            "Authenticated upload only",
            "Tenant-isolated private storage",
            "Content and MIME validation",
            "Signed download URLs",
            "No public source files",
            "No document content in analytics",
            "Automatic source deletion (24h)",
            "Auditable processing events",
          ].map((item) => (
            <div
              key={item}
              style={{
                padding: "1rem",
                backgroundColor: "#FFFFFF",
                border: `1px solid ${CARD_BORDER}`,
                fontSize: "0.9rem",
                color: TEXT,
              }}
            >
              ✓ {item}
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 9: Supported Documents ────────────────────────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "3rem 1.5rem",
          borderTop: `1px solid ${CARD_BORDER}`,
        }}
      >
        <SectionHeading number="9" title="Supported Documents" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div>
            <h4 style={{ fontWeight: 600, color: "#2D8132", marginBottom: "0.75rem" }}>
              Supported (Automatic Processing)
            </h4>
            <ul style={{ color: MUTED, lineHeight: 2, paddingLeft: "1.25rem" }}>
              <li>Native digital machine manuals</li>
              <li>OEM spare-parts catalogs</li>
              <li>Maintenance manuals</li>
              <li>Equipment BOM tables</li>
              <li>Assembly parts lists</li>
              <li>English-language PDFs</li>
              <li>Up to 50 pages and 500 rows</li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, color: "#C45A1A", marginBottom: "0.75rem" }}>
              Not Supported (Automatic Flow)
            </h4>
            <ul style={{ color: MUTED, lineHeight: 2, paddingLeft: "1.25rem" }}>
              <li>Handwritten documents</li>
              <li>Photographs of pages</li>
              <li>Password-protected PDFs</li>
              <li>Unreadable scans</li>
              <li>Documents without parts tables</li>
              <li>Documents exceeding limits</li>
              <li>Exploded drawings without tables</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Section 10: Final CTA ─────────────────────────────────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "4rem 1.5rem",
          borderTop: `1px solid ${CARD_BORDER}`,
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
          href="/document-intelligence/maintenance-bom-recovery"
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
        <p style={{ color: MUTED, fontSize: "0.85rem", marginTop: "0.75rem" }}>
          Unsupported documents are not charged.
        </p>
      </section>
    </main>
  );
}
