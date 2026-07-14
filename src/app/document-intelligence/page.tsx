/**
 * Document Intelligence — Category Landing Page
 *
 * Server Component (English only)
 * Route: /document-intelligence
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Document Intelligence — SectorCalc",
  description:
    "Convert unstructured engineering documents into controlled, traceable operational outputs — validated BOMs, structured data, and exception reports.",
  openGraph: {
    title: "Document Intelligence — SectorCalc",
    description:
      "Convert unstructured engineering documents into controlled, traceable operational outputs.",
    url: "/document-intelligence",
    siteName: "SectorCalc",
    type: "website",
  },
  twitter: {
    title: "Document Intelligence — SectorCalc",
    description:
      "Convert unstructured engineering documents into controlled, traceable operational outputs.",
    card: "summary_large_image",
  },
  alternates: { canonical: "/document-intelligence" },
};

export default function DocumentIntelligencePage() {
  return (
    <main className="min-h-screen" style={{ background: "#F0EEE6", color: "#1A1915" }}>
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Breadcrumb */}
        <nav className="text-sm mb-8" style={{ color: "#696764" }}>
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">›</span>
          <span>Document Intelligence</span>
        </nav>

        <h1 className="text-4xl font-bold mb-6 tracking-tight">
          Document Intelligence
        </h1>

        <p className="text-lg mb-12 leading-relaxed" style={{ color: "#696764" }}>
          Document Intelligence converts unstructured engineering documents —
          machine manuals, spare-parts PDFs, technical drawings — into controlled,
          traceable operational outputs. No chatbots. No generic OCR. Structured
          data you can use.
        </p>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/document-intelligence/maintenance-bom-recovery"
            className="block p-8 border" style={{ background: "#FAF8F2", borderColor: "rgba(26,25,21,0.10)" }}
          >
            <h2 className="text-xl font-semibold mb-3">
              Maintenance BOM Recovery
            </h2>
            <p className="mb-4" style={{ color: "#696764" }}>
              Recover spare-parts data from legacy machine manuals and export a
              validated, ERP-ready maintenance BOM with traceable exceptions.
            </p>
            <span className="inline-flex items-center gap-1 font-medium" style={{ color: "#BD5D3A" }}>
              Learn more
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
