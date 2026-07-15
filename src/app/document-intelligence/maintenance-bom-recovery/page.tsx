/**
 * Maintenance BOM Recovery — Product Landing Page
 *
 * Server Component (English only)
 * Route: /document-intelligence/maintenance-bom-recovery
 * Product: Verified BOM Job — USD 149
 */

import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { DiBreadcrumbs } from "@/components/document-intelligence/DiBreadcrumbs";

export const metadata: Metadata = {
  title:
    "Maintenance BOM Recovery — Recover Spare-Parts Data from Legacy Machine Manuals | SectorCalc",
  description:
    "Convert eligible machine manuals and spare-parts PDFs into a validated, ERP-ready Excel BOM with source-page traceability and a procurement exception report. USD 149.",
  openGraph: {
    title: "Maintenance BOM Recovery — SectorCalc",
    description:
      "Recover spare-parts data from legacy machine manuals. Validated, ERP-ready Excel BOM with source-page traceability.",
    url: "/document-intelligence/maintenance-bom-recovery",
    siteName: "SectorCalc",
    type: "website",
  },
  twitter: {
    title: "Maintenance BOM Recovery — SectorCalc",
    description:
      "Recover spare-parts data from legacy machine manuals. Validated, ERP-ready Excel BOM with source-page traceability.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: "/document-intelligence/maintenance-bom-recovery",
  },
};

const HERO_STYLES = {
  bg: "#FAF8F2",
  cardBg: "#FFFFFF",
  border: "rgba(26,25,21,0.10)",
  accent: "#BD5D3A",
  text: "#1A1915",
  muted: "#696764",
};

export default function MaintenanceBomRecoveryPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Verified BOM Job",
    description:
      "Convert eligible machine manuals and spare-parts PDFs into a validated, ERP-ready Excel BOM with source-page traceability and a procurement exception report.",
    provider: { "@type": "Organization", name: "SectorCalc" },
    offers: {
      "@type": "Offer",
      price: "149",
      priceCurrency: "USD",
      description:
        "Up to 50 PDF pages, up to 500 BOM rows, native digital PDF, English documents.",
    },
  };

  return (
    <>
      <JsonLd data={schema} />
      <main
        className="min-h-screen"
        style={{ background: HERO_STYLES.bg, color: HERO_STYLES.text }}
      >
        {/* ── Hero ── */}
        <section className="max-w-5xl mx-auto px-6 pt-16 pb-12">
          <DiBreadcrumbs segments={[{ label: "Maintenance BOM Recovery" }]} />

          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
            Recover Spare-Parts Data from Legacy Machine Manuals
          </h1>

          <p
            className="text-lg md:text-xl mb-10 leading-relaxed max-w-3xl"
            style={{ color: HERO_STYLES.muted }}
          >
            Convert eligible machine manuals and spare-parts PDFs into a
            validated, ERP-ready Excel BOM with source-page traceability and a
            procurement exception report.
          </p>

          <div className="flex flex-wrap gap-4 mb-16">
            <Link
              href="/document-intelligence/maintenance-bom-recovery/new"
              className="inline-flex items-center px-6 py-3 font-semibold text-white"
              style={{ background: HERO_STYLES.accent }}
            >
              Check My Manual Free
            </Link>
            <button
              className="inline-flex items-center px-6 py-3 font-medium border"
              style={{
                borderColor: HERO_STYLES.border,
                color: HERO_STYLES.text,
              }}
              type="button"
            >
              View Sample Output
            </button>
          </div>

          {/* ── Price Card ── */}
          <div
            className="max-w-md p-8 border"
            style={{ background: HERO_STYLES.cardBg, borderColor: HERO_STYLES.border }}
          >
            <h3 className="text-lg font-semibold mb-1">Verified BOM Job</h3>
            <div className="text-3xl font-bold mb-4" style={{ color: HERO_STYLES.accent }}>
              USD 149
            </div>
            <ul className="space-y-2 text-sm" style={{ color: HERO_STYLES.muted }}>
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={HERO_STYLES.accent} strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                Up to 50 PDF pages
              </li>
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={HERO_STYLES.accent} strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                Up to 500 BOM rows
              </li>
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={HERO_STYLES.accent} strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                Native digital PDF
              </li>
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={HERO_STYLES.accent} strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                English documents
              </li>
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={HERO_STYLES.accent} strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                No subscription required
              </li>
            </ul>
          </div>
        </section>

        {/* ── Sections ── */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <div className="space-y-20">
            {/* The Problem */}
            <div>
              <h2 className="text-2xl font-bold mb-4">The Operational Problem</h2>
              <p className="leading-relaxed" style={{ color: HERO_STYLES.muted }}>
                Legacy machine manuals and spare-parts PDFs contain critical
                procurement data — but it is locked in unstructured tables,
                scanned pages, and inconsistent formats. Manually transcribing
                BOM data is slow, error-prone, and does not scale when maintaining
                a diverse machine fleet. Missing or incorrect part numbers cause
                procurement delays, wrong-part purchases, and unplanned downtime.
              </p>
            </div>

            {/* What is Included */}
            <div>
              <h2 className="text-2xl font-bold mb-4">
                What the USD 149 Job Includes
              </h2>
              <ul className="grid md:grid-cols-2 gap-3">
                {[
                  "PDF extraction of parts tables",
                  "Part-number normalization with raw-value preservation",
                  "Duplicate detection (7 classes)",
                  "Missing-field detection",
                  "Revision conflict detection",
                  "Source-page traceability",
                  "ERP-ready Excel workbook (8 sheets)",
                  "Procurement exception report",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 p-3"
                    style={{ background: HERO_STYLES.cardBg }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={HERO_STYLES.accent}
                      strokeWidth="2"
                      className="mt-0.5 flex-shrink-0"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Eligible Documents */}
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Eligible & Ineligible Documents
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 border" style={{ borderColor: HERO_STYLES.border }}>
                  <h3 className="font-semibold mb-2">Eligible</h3>
                  <ul className="space-y-1 text-sm" style={{ color: HERO_STYLES.muted }}>
                    <li>Native digital PDF with machine manual parts tables</li>
                    <li>Spare-parts catalog PDFs</li>
                    <li>1 source file, up to 50 pages, up to 500 rows</li>
                    <li>English-language documents</li>
                    <li>Clearly structured BOM or parts tables</li>
                  </ul>
                </div>
                <div className="p-6 border" style={{ borderColor: HERO_STYLES.border }}>
                  <h3 className="font-semibold mb-2">Ineligible</h3>
                  <ul className="space-y-1 text-sm" style={{ color: HERO_STYLES.muted }}>
                    <li>Password-protected or encrypted PDFs</li>
                    <li>Handwritten-only documents</li>
                    <li>No identifiable parts table</li>
                    <li>Non-English documents (v1)</li>
                    <li>Exceeds 50 pages or 500 rows</li>
                    <li>Corrupted or malicious files</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Processing Workflow */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Processing Workflow</h2>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { step: "1", title: "Upload", desc: "Submit your PDF for a free eligibility check" },
                  { step: "2", title: "Diagnostic", desc: "Automatic review of page count, structure, and language" },
                  { step: "3", title: "Pay", desc: "USD 149 one-time payment for eligible documents" },
                  { step: "4", title: "Receive", desc: "Validated workbook, exception report, and source map" },
                ].map((s) => (
                  <div key={s.step} className="p-5 text-center border" style={{ borderColor: HERO_STYLES.border, background: HERO_STYLES.cardBg }}>
                    <div className="text-2xl font-bold mb-1" style={{ color: HERO_STYLES.accent }}>{s.step}</div>
                    <h3 className="font-semibold mb-1">{s.title}</h3>
                    <p className="text-xs" style={{ color: HERO_STYLES.muted }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Output Workbook */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Output Workbook Structure</h2>
              <p className="mb-4" style={{ color: HERO_STYLES.muted }}>
                Each completed job delivers four downloadable artifacts:
              </p>
              <div className="space-y-3">
                {[
                  { name: "SectorCalc_Maintenance_BOM_{jobId}.xlsx", desc: "8-sheet workbook: Clean BOM, Review Required, Duplicates, Missing Fields, Revision Conflicts, Source Map, Processing Summary, Generic ERP Import Template" },
                  { name: "SectorCalc_Procurement_Exception_Report_{jobId}.xlsx", desc: "7-sheet exception report with executive summary, critical exceptions, recommended review sequence" },
                  { name: "SectorCalc_Source_Map_{jobId}.csv", desc: "Row-level source traceability with page, table, and row references" },
                  { name: "SectorCalc_Processing_Summary_{jobId}.html", desc: "Printable HTML processing summary (PDF download supported by browser)" },
                ].map((f) => (
                  <div key={f.name} className="p-4 border" style={{ borderColor: HERO_STYLES.border, background: HERO_STYLES.cardBg }}>
                    <code className="text-sm font-mono block mb-1">{f.name}</code>
                    <p className="text-xs" style={{ color: HERO_STYLES.muted }}>{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Validation */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Validation Controls</h2>
              <ul className="space-y-2" style={{ color: HERO_STYLES.muted }}>
                <li className="flex items-start gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={HERO_STYLES.accent} strokeWidth="2" className="mt-1 flex-shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                  Part numbers normalized deterministically with raw-value preservation
                </li>
                <li className="flex items-start gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={HERO_STYLES.accent} strokeWidth="2" className="mt-1 flex-shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                  Missing-field detection with export-blocking rules
                </li>
                <li className="flex items-start gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={HERO_STYLES.accent} strokeWidth="2" className="mt-1 flex-shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                  Low-confidence rows blocked from clean export
                </li>
                <li className="flex items-start gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={HERO_STYLES.accent} strokeWidth="2" className="mt-1 flex-shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                  Formula injection protection on all exported values
                </li>
              </ul>
            </div>

            {/* Data Security */}
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Data Security & Deletion Policy
              </h2>
              <ul className="space-y-2 text-sm" style={{ color: HERO_STYLES.muted }}>
                <li>Source documents stored in tenant-isolated Cloud Storage paths</li>
                <li>Source file deleted within 24 hours of successful output generation</li>
                <li>Output artifacts retained for 7 days, then automatically deleted</li>
                <li>Downloads via short-lived authenticated signed URLs</li>
                <li>No document content sent to analytics or logs</li>
                <li>No third-party document retention beyond processing requirements</li>
              </ul>
            </div>

            {/* Pricing */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Pricing</h2>
              <div className="max-w-md p-8 border" style={{ background: HERO_STYLES.cardBg, borderColor: HERO_STYLES.border }}>
                <h3 className="text-lg font-semibold mb-1">Verified BOM Job</h3>
                <div className="text-3xl font-bold mb-4" style={{ color: HERO_STYLES.accent }}>USD 149</div>
                <ul className="space-y-2 text-sm" style={{ color: HERO_STYLES.muted }}>
                  <li>Up to 50 PDF pages</li>
                  <li>Up to 500 BOM rows</li>
                  <li>Native digital PDF only</li>
                  <li>One job, one price</li>
                  <li>No subscription required</li>
                </ul>
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {[
                  { q: "What types of PDFs are eligible?", a: "Native digital PDFs with machine-manual or spare-parts tables. Scanned documents without clear tables may require manual review." },
                  { q: "How long does processing take?", a: "The free diagnostic completes within a few minutes. Full processing typically completes within 30 minutes for eligible documents." },
                  { q: "Is the output ready for my ERP system?", a: "The workbook uses a Generic ERP Import Template format. You should review flagged records before import. The output is not a direct SAP/Oracle/ERP integration." },
                  { q: "What if my document is rejected?", a: "You are not charged. The system clearly explains why automatic processing is unavailable." },
                  { q: "Can I delete my data?", a: "Source documents are automatically deleted within 24 hours of completion. Outputs are retained for 7 days. Contact us for early deletion requests." },
                ].map((faq) => (
                  <div key={faq.q} className="p-5 border" style={{ borderColor: HERO_STYLES.border, background: HERO_STYLES.cardBg }}>
                    <h3 className="font-semibold mb-2">{faq.q}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: HERO_STYLES.muted }}>{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Limitations */}
            <div className="p-6 border" style={{ borderColor: HERO_STYLES.border, background: HERO_STYLES.cardBg }}>
              <h2 className="text-2xl font-bold mb-4">Limitations & Disclaimer</h2>
              <p className="text-sm leading-relaxed" style={{ color: HERO_STYLES.muted }}>
                Automated extraction and consistency checks support data preparation.
                The customer must review flagged and business-critical records before
                ERP import, RFQ issuance, purchasing, maintenance, or engineering use.
              </p>
              <ul className="mt-4 space-y-1 text-xs" style={{ color: HERO_STYLES.muted }}>
                <li>v1 supports English-language native digital PDFs only</li>
                <li>Not a replacement for OEM parts verification</li>
                <li>Not a direct ERP integration</li>
                <li>Accuracy depends on source document quality</li>
                <li>This is a technical simulation, not engineering advice</li>
              </ul>
            </div>

            {/* Final CTA */}
            <div className="text-center">
              <Link
                href="/document-intelligence/maintenance-bom-recovery/new"
                className="inline-flex items-center px-8 py-4 font-semibold text-white text-lg"
                style={{ background: HERO_STYLES.accent }}
              >
                Check My Manual Free
              </Link>
              <p className="mt-3 text-xs" style={{ color: HERO_STYLES.muted }}>
                No credit card required for the diagnostic
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
