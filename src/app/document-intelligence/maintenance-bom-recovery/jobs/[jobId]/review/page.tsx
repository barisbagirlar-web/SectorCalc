/**
 * Maintenance BOM Recovery — Job Review
 *
 * Route: /document-intelligence/maintenance-bom-recovery/jobs/[jobId]/review
 * Client component for reviewing exception rows before ERP import.
 *
 * Read-only view with filterable table, raw-vs-normalized comparison,
 * and source-page traceability links.
 *
 * No client-side mutation of results — disposition is authoritative
 * from the server-side export engine.
 */

"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type {
  BomRow,
  ProcessingSummary,
  ExceptionSeverity,
} from "@/types/document-intelligence";

/* ── Design Tokens ─────────────────────────────────────────────── */

const ACCENT = "#BD5D3A";
const TEXT = "#1A1915";
const MUTED = "#696764";
const BG = "#F0EEE6";
const CARD_BG = "#FFFFFF";
const CARD_BG_ALT = "#FAF8F2";
const BORDER = "rgba(26,25,21,0.10)";

/* ── Mock Data ─────────────────────────────────────────────────── */

type ReviewRecord = {
  itemNumber: number;
  partNumberRaw: string | null;
  partNumberNormalized: string | null;
  descriptionRaw: string | null;
  descriptionNormalized: string | null;
  exceptionType: string;
  exceptionDetail: string;
  severity: ExceptionSeverity;
  sourcePage: number;
  sourceTable: string;
  sourceRow: number;
  suggestedAction: string;
  reviewRequired: boolean;
};

const MOCK_REVIEW_EXCEPTIONS: Array<{
  row: Partial<BomRow>;
  exception: { type: string; detail: string; severity: ExceptionSeverity; suggestedAction: string };
}> = [
  {
    row: {
      itemNumber: 1,
      partNumberRaw: "ABC-123 ",
      partNumberNormalized: "ABC-123",
      descriptionRaw: "Bearing, Ball  ",
      descriptionNormalized: "Bearing, Ball",
      sourcePage: 5,
      sourceTable: "Table 3",
      sourceRow: 12,
      reviewRequired: true,
    },
    exception: {
      type: "Trailing Whitespace",
      detail: "Part number and description contain trailing spaces; normalized values cleaned.",
      severity: "low",
      suggestedAction: "Use normalized values. No further action required.",
    },
  },
  {
    row: {
      itemNumber: 2,
      partNumberRaw: "DEF.456",
      partNumberNormalized: "DEF-456",
      descriptionRaw: "Seal, Oil",
      descriptionNormalized: "Seal, Oil",
      sourcePage: 5,
      sourceTable: "Table 3",
      sourceRow: 14,
      reviewRequired: true,
    },
    exception: {
      type: "Formatting Inconsistency",
      detail: "Part number uses '.' separator instead of '-'.",
      severity: "low",
      suggestedAction: "Normalized format applied automatically.",
    },
  },
  {
    row: {
      itemNumber: 3,
      partNumberRaw: "GHI-789",
      partNumberNormalized: "GHI-789",
      descriptionRaw: null,
      descriptionNormalized: null,
      sourcePage: 7,
      sourceTable: "Table 5",
      sourceRow: 3,
      reviewRequired: true,
    },
    exception: {
      type: "missing_description",
      detail: "Description field is missing. Export-blocking — cannot export to clean BOM without description.",
      severity: "critical",
      suggestedAction: "Look up part number GHI-789 in the source manual and enter the correct description.",
    },
  },
  {
    row: {
      itemNumber: 4,
      partNumberRaw: "JKL-012",
      partNumberNormalized: "JKL-012",
      descriptionRaw: "Gasket Set",
      descriptionNormalized: "Gasket Set",
      sourcePage: 8,
      sourceTable: "Table 6",
      sourceRow: 7,
      reviewRequired: true,
    },
    exception: {
      type: "missing_quantity",
      detail: "Quantity field is empty. All rows require a valid quantity for clean export.",
      severity: "critical",
      suggestedAction: "Check source page 8, Table 6, Row 7 for the quantity value.",
    },
  },
  {
    row: {
      itemNumber: 5,
      partNumberRaw: "MNO-345",
      partNumberNormalized: "MNO-345",
      descriptionRaw: "Pump Impeller",
      descriptionNormalized: "Pump Impeller",
      sourcePage: 10,
      sourceTable: "Table 8",
      sourceRow: 22,
      reviewRequired: true,
    },
    exception: {
      type: "conflicting_description",
      detail: "Part number MNO-345 appears with description 'Pump Impeller' on page 10 and 'Impeller, Pump' on page 12. Manual verification needed.",
      severity: "high",
      suggestedAction: "Verify the correct description from both source locations and reconcile.",
    },
  },
  {
    row: {
      itemNumber: 6,
      partNumberRaw: "PQR-678",
      partNumberNormalized: "PQR-678",
      descriptionRaw: "Spring, Compression",
      descriptionNormalized: "Spring, Compression",
      sourcePage: 12,
      sourceTable: "Table 9",
      sourceRow: 5,
      reviewRequired: true,
    },
    exception: {
      type: "conflicting_revision",
      detail: "Part number PQR-678 has revision 'C' on page 12 and 'Rev 3' on page 14. Mixed revision schemes.",
      severity: "critical",
      suggestedAction: "Resolve revision conflict before ERP import. Verify with equipment maintenance records.",
    },
  },
  {
    row: {
      itemNumber: 7,
      partNumberRaw: null,
      partNumberNormalized: null,
      descriptionRaw: "O-Ring Kit",
      descriptionNormalized: "O-Ring Kit",
      sourcePage: 14,
      sourceTable: "Table 10",
      sourceRow: 9,
      reviewRequired: true,
    },
    exception: {
      type: "missing_part_number",
      detail: "Part number is missing. Cannot export — all clean rows require a part number.",
      severity: "critical",
      suggestedAction: "Check the source document for the part number. If unavailable, assign a temporary tracking number.",
    },
  },
  {
    row: {
      itemNumber: 8,
      partNumberRaw: "STU-901",
      partNumberNormalized: "STU-901",
      descriptionRaw: "Filter Element",
      descriptionNormalized: "Filter Element",
      sourcePage: 15,
      sourceTable: "Table 11",
      sourceRow: 2,
      reviewRequired: true,
    },
    exception: {
      type: "low_confidence",
      detail: "Extraction confidence is 0.45 (threshold: 0.70). Text may be misread due to OCR quality on this page.",
      severity: "medium",
      suggestedAction: "Visually verify all values for this row against the source document.",
    },
  },
  {
    row: {
      itemNumber: 9,
      partNumberRaw: "VWX-234",
      partNumberNormalized: "VWX-234",
      descriptionRaw: "Hydraulic Hose",
      descriptionNormalized: "Hydraulic Hose",
      sourcePage: 18,
      sourceTable: "Table 14",
      sourceRow: 16,
      reviewRequired: true,
    },
    exception: {
      type: "duplicate_source_row",
      detail: "This row appears to be extracted from the same source cell as another entry. Possible duplicate extraction.",
      severity: "medium",
      suggestedAction: "Compare both entries. If identical, remove the duplicate. Verify quantity consolidation.",
    },
  },
  {
    row: {
      itemNumber: 10,
      partNumberRaw: "YZA-567",
      partNumberNormalized: "YZA-567",
      descriptionRaw: "Pressure Gauge",
      descriptionNormalized: "Pressure Gauge",
      sourcePage: 20,
      sourceTable: "Table 16",
      sourceRow: 4,
      reviewRequired: true,
    },
    exception: {
      type: "missing_manufacturer",
      detail: "Manufacturer field is empty. Other rows in this document include manufacturer data.",
      severity: "low",
      suggestedAction: "Add manufacturer if known. Not export-blocking but recommended for procurement traceability.",
    },
  },
];

const SUMMARY: ProcessingSummary = {
  inputFilename: "machine_manual_k120.pdf",
  processedPages: 12,
  extractedRows: 47,
  cleanRows: 32,
  reviewRows: 10,
  blockedRows: 5,
  duplicateGroups: 3,
  missingFieldCount: 7,
  revisionConflictCount: 2,
  lowConfidenceCount: 4,
  engineVersion: "1.0.0",
  validatorVersion: "1.0.0",
  schemaVersion: "1.0.0",
  generatedAt: new Date().toISOString(),
};

/* ── Severity helpers ──────────────────────────────────────────── */

const SEVERITY_ORDER: ExceptionSeverity[] = ["critical", "high", "medium", "low", "information"];

const SEVERITY_COLORS: Record<ExceptionSeverity, string> = {
  critical: "#EF4444",
  high: "#F97316",
  medium: "#F59E0B",
  low: "#3B82F6",
  information: "#696764",
};

const SEVERITY_BG: Record<ExceptionSeverity, string> = {
  critical: "#FEF2F2",
  high: "#FFF7ED",
  medium: "#FEFCE8",
  low: "#EFF6FF",
  information: "#F5F5F5",
};

function getExceptionTypes(): string[] {
  const types = new Set(MOCK_REVIEW_EXCEPTIONS.map((e) => e.exception.type.replace(/_/g, " ")));
  return Array.from(types).sort();
}

function getSeverities(): ExceptionSeverity[] {
  const sevs = new Set(MOCK_REVIEW_EXCEPTIONS.map((e) => e.exception.severity));
  return SEVERITY_ORDER.filter((s) => sevs.has(s));
}

/* ── Component ──────────────────────────────────────────────────── */

export default function JobReviewPage() {
  const params = useParams();
  const jobId = params.jobId as string;

  const [filterType, setFilterType] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const formattedRecords: ReviewRecord[] = useMemo(() => {
    return MOCK_REVIEW_EXCEPTIONS.map((e) => ({
      itemNumber: e.row.itemNumber ?? 0,
      partNumberRaw: e.row.partNumberRaw ?? null,
      partNumberNormalized: e.row.partNumberNormalized ?? null,
      descriptionRaw: e.row.descriptionRaw ?? null,
      descriptionNormalized: e.row.descriptionNormalized ?? null,
      exceptionType: e.exception.type,
      exceptionDetail: e.exception.detail,
      severity: e.exception.severity,
      sourcePage: e.row.sourcePage ?? 0,
      sourceTable: e.row.sourceTable ?? "",
      sourceRow: e.row.sourceRow ?? 0,
      suggestedAction: e.exception.suggestedAction,
      reviewRequired: e.row.reviewRequired ?? false,
    }));
  }, []);

  const filteredRecords = useMemo(() => {
    return formattedRecords.filter((r) => {
      if (filterType !== "all" && r.exceptionType !== filterType) return false;
      if (filterSeverity !== "all" && r.severity !== filterSeverity) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          (r.partNumberNormalized && r.partNumberNormalized.toLowerCase().includes(q)) ||
          (r.partNumberRaw && r.partNumberRaw.toLowerCase().includes(q)) ||
          (r.descriptionNormalized && r.descriptionNormalized.toLowerCase().includes(q)) ||
          r.exceptionType.toLowerCase().includes(q) ||
          r.exceptionDetail.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [formattedRecords, filterType, filterSeverity, searchQuery]);

  const exceptionTypes = useMemo(() => getExceptionTypes(), []);

  /* ── Render: severity badge ──────────────────────────────────── */

  function renderSeverityBadge(severity: ExceptionSeverity) {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold"
        style={{
          background: SEVERITY_BG[severity],
          color: SEVERITY_COLORS[severity],
          border: `1px solid ${SEVERITY_COLORS[severity]}30`,
        }}
      >
        {/* Visual indicator dot */}
        <span
          className="w-1.5 h-1.5 rounded-full inline-block"
          style={{ background: SEVERITY_COLORS[severity] }}
          aria-hidden="true"
        />
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </span>
    );
  }

  /* ── Render: raw / normalized comparison cell ────────────────── */

  function renderComparisonCell(raw: string | null, normalized: string | null, label: string) {
    const isDifferent = raw !== normalized;
    return (
      <div className="min-w-0">
        <span className="sr-only">{label}</span>
        {normalized ? (
          <span className="block font-medium text-sm truncate" title={normalized}>
            {normalized}
          </span>
        ) : (
          <span className="block text-sm" style={{ color: "#EF4444" }}>
            (missing)
          </span>
        )}
        {isDifferent && raw && (
          <span
            className="block text-xs line-through mt-0.5 truncate"
            style={{ color: MUTED }}
            title={`Raw: ${raw}`}
          >
            {raw}
          </span>
        )}
        {isDifferent && (
          <span
            className="inline-block text-[10px] font-medium mt-0.5 px-1"
            style={{ background: `${ACCENT}15`, color: ACCENT }}
          >
            normalized
          </span>
        )}
      </div>
    );
  }

  /* ── Render: source page link ────────────────────────────────── */

  function renderSourcePageLink(page: number, table: string, row: number) {
    // In production this would link to the authenticated document viewer using
    // the job's signed access token. For now it links to a reference view.
    const url = `/api/document-intelligence/maintenance-bom/jobs/${encodeURIComponent(jobId)}/source?page=${page}`;
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
        style={{ color: ACCENT, minHeight: 44 }}
        aria-label={`Open source page ${page}, table ${table}, row ${row} in new tab`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6 M15 3h6v6 M10 14L21 3" />
        </svg>
        p.{page}
        <span className="sr-only"> (table {table}, row {row})</span>
      </a>
    );
  }

  /* ── Main Render ──────────────────────────────────────────────── */

  return (
    <main className="min-h-screen" style={{ background: BG, color: TEXT }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm mb-8" style={{ color: MUTED }}>
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/document-intelligence" className="hover:underline">Document Intelligence</Link>
          <span className="mx-2">›</span>
          <Link href="/document-intelligence/maintenance-bom-recovery" className="hover:underline">Maintenance BOM Recovery</Link>
          <span className="mx-2">›</span>
          <Link
            href={`/document-intelligence/maintenance-bom-recovery/jobs/${encodeURIComponent(jobId)}`}
            className="hover:underline"
          >
            Job {jobId}
          </Link>
          <span className="mx-2">›</span>
          <span>Review</span>
        </nav>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Exception Review
            </h1>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: MUTED }}>
              Review rows flagged by the validation engine before importing
              into your ERP system. The normalized values are recommended for
              export. Raw values are preserved for manual verification.
            </p>
          </div>
          <Link
            href={`/document-intelligence/maintenance-bom-recovery/jobs/${encodeURIComponent(jobId)}`}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border"
            style={{ borderColor: BORDER, color: TEXT, minHeight: 44 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Job
          </Link>
        </div>

        {/* Summary Bar */}
        <div
          className="p-4 mb-8 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm"
          style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
        >
          <div>
            <span style={{ color: MUTED }}>Total extracted: </span>
            <span className="font-semibold">{SUMMARY.extractedRows}</span>
          </div>
          <div>
            <span style={{ color: MUTED }}>Clean rows: </span>
            <span className="font-semibold" style={{ color: "#22C55E" }}>{SUMMARY.cleanRows}</span>
          </div>
          <div>
            <span style={{ color: MUTED }}>Review required: </span>
            <span className="font-semibold" style={{ color: "#F59E0B" }}>{SUMMARY.reviewRows}</span>
          </div>
          <div>
            <span style={{ color: MUTED }}>Blocked: </span>
            <span className="font-semibold" style={{ color: "#EF4444" }}>{SUMMARY.blockedRows}</span>
          </div>
          <div>
            <span style={{ color: MUTED }}>Duplicates: </span>
            <span className="font-semibold">{SUMMARY.duplicateGroups}</span>
          </div>
        </div>

        {/* Filters */}
        <div
          className="p-4 mb-8 flex flex-wrap items-end gap-4"
          style={{ background: CARD_BG_ALT, border: `1px solid ${BORDER}` }}
        >
          {/* Exception Type Filter */}
          <div className="flex-1 min-w-[180px]">
            <label
              htmlFor="filter-type"
              className="block text-xs font-medium mb-1.5"
              style={{ color: MUTED }}
            >
              Exception Type
            </label>
            <select
              id="filter-type"
              className="w-full px-3 py-2 text-sm"
              style={{
                background: CARD_BG,
                border: `1px solid ${BORDER}`,
                color: TEXT,
                minHeight: 44,
              }}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              {exceptionTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Severity Filter */}
          <div className="flex-1 min-w-[140px]">
            <label
              htmlFor="filter-severity"
              className="block text-xs font-medium mb-1.5"
              style={{ color: MUTED }}
            >
              Severity
            </label>
            <select
              id="filter-severity"
              className="w-full px-3 py-2 text-sm"
              style={{
                background: CARD_BG,
                border: `1px solid ${BORDER}`,
                color: TEXT,
                minHeight: 44,
              }}
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
            >
              <option value="all">All Severities</option>
              {getSeverities().map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="flex-[2] min-w-[200px]">
            <label
              htmlFor="filter-search"
              className="block text-xs font-medium mb-1.5"
              style={{ color: MUTED }}
            >
              Search Part Number or Description
            </label>
            <input
              id="filter-search"
              type="search"
              className="w-full px-3 py-2 text-sm"
              style={{
                background: CARD_BG,
                border: `1px solid ${BORDER}`,
                color: TEXT,
                minHeight: 44,
              }}
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Result count */}
          <div className="text-sm whitespace-nowrap pb-2" style={{ color: MUTED }}>
            {filteredRecords.length} of {formattedRecords.length} records
          </div>
        </div>

        {/* Table */}
        <div
          className="overflow-x-auto mb-8 border"
          style={{ background: CARD_BG, borderColor: BORDER }}
        >
          <table className="w-full text-sm border-collapse" style={{ minWidth: 800 }}>
            <caption className="sr-only">
              Review-required rows with exception details, severity, and suggested actions
            </caption>
            <thead>
              <tr className="border-b" style={{ borderColor: BORDER, background: CARD_BG_ALT }}>
                <th scope="col" className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider" style={{ color: MUTED }}>
                  Item
                </th>
                <th scope="col" className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider" style={{ color: MUTED }}>
                  Part Number
                </th>
                <th scope="col" className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider" style={{ color: MUTED }}>
                  Description
                </th>
                <th scope="col" className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider" style={{ color: MUTED }}>
                  Exception
                </th>
                <th scope="col" className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider" style={{ color: MUTED }}>
                  Severity
                </th>
                <th scope="col" className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider" style={{ color: MUTED }}>
                  Source Page
                </th>
                <th scope="col" className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider" style={{ color: MUTED }}>
                  Suggested Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-sm"
                    style={{ color: MUTED }}
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="mx-auto mb-3"
                      aria-hidden="true"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    No records match the current filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record, idx) => (
                  <tr
                    key={`${record.itemNumber}-${idx}`}
                    className="border-b align-top"
                    style={{
                      borderColor: BORDER,
                      background: idx % 2 === 0 ? "transparent" : CARD_BG_ALT,
                    }}
                  >
                    {/* Item Number */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-xs" style={{ color: MUTED }}>
                      {record.itemNumber}
                    </td>

                    {/* Part Number (Raw vs Normalized) */}
                    <td className="py-3 px-4 min-w-[140px] max-w-[200px]">
                      {renderComparisonCell(
                        record.partNumberRaw,
                        record.partNumberNormalized,
                        "Part Number"
                      )}
                    </td>

                    {/* Description (Raw vs Normalized) */}
                    <td className="py-3 px-4 min-w-[160px] max-w-[240px]">
                      {renderComparisonCell(
                        record.descriptionRaw,
                        record.descriptionNormalized,
                        "Description"
                      )}
                    </td>

                    {/* Exception */}
                    <td className="py-3 px-4 min-w-[160px] max-w-[260px]">
                      <span className="font-medium text-xs whitespace-nowrap">
                        {record.exceptionType.replace(/_/g, " ")}
                      </span>
                      <p className="text-xs mt-1 leading-relaxed" style={{ color: MUTED }}>
                        {record.exceptionDetail}
                      </p>
                    </td>

                    {/* Severity */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {renderSeverityBadge(record.severity)}
                    </td>

                    {/* Source Page */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {renderSourcePageLink(record.sourcePage, record.sourceTable, record.sourceRow)}
                    </td>

                    {/* Suggested Action */}
                    <td className="py-3 px-4 min-w-[180px] max-w-[280px]">
                      <p className="text-xs leading-relaxed">{record.suggestedAction}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Download Outputs */}
        <div
          className="p-6 mb-8 border"
          style={{ background: CARD_BG, borderColor: BORDER }}
        >
          <h3 className="font-semibold mb-4">Download Outputs</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <a
              href={`/api/document-intelligence/maintenance-bom/jobs/${encodeURIComponent(jobId)}/download/SectorCalc_Maintenance_BOM_${jobId}.xlsx`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 text-sm font-medium"
              style={{
                background: CARD_BG_ALT,
                border: `1px solid ${BORDER}`,
                color: TEXT,
                minHeight: 44,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke={ACCENT}
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M12 18v-6 M9 15l3 3 3-3" />
              </svg>
              <div className="min-w-0">
                <span className="block truncate">
                  SectorCalc_Maintenance_BOM_{jobId}.xlsx
                </span>
                <span className="block text-xs" style={{ color: MUTED }}>
                  8-sheet workbook: Clean BOM, Review Required, Duplicates, Missing Fields, Revision Conflicts, Source Map, Summary, ERP Template
                </span>
              </div>
            </a>
            <a
              href={`/api/document-intelligence/maintenance-bom/jobs/${encodeURIComponent(jobId)}/download/SectorCalc_Procurement_Exception_Report_${jobId}.xlsx`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 text-sm font-medium"
              style={{
                background: CARD_BG_ALT,
                border: `1px solid ${BORDER}`,
                color: TEXT,
                minHeight: 44,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke={ACCENT}
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M12 18v-6 M9 15l3 3 3-3" />
              </svg>
              <div className="min-w-0">
                <span className="block truncate">
                  SectorCalc_Procurement_Exception_Report_{jobId}.xlsx
                </span>
                <span className="block text-xs" style={{ color: MUTED }}>
                  7-sheet exception report with executive summary, critical exceptions, recommended review sequence
                </span>
              </div>
            </a>
            <a
              href={`/api/document-intelligence/maintenance-bom/jobs/${encodeURIComponent(jobId)}/download/SectorCalc_Source_Map_${jobId}.csv`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 text-sm font-medium"
              style={{
                background: CARD_BG_ALT,
                border: `1px solid ${BORDER}`,
                color: TEXT,
                minHeight: 44,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke={ACCENT}
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z M12 3v6h6 M12 18v-6 M9 15l3 3 3-3" />
              </svg>
              <div className="min-w-0">
                <span className="block truncate">
                  SectorCalc_Source_Map_{jobId}.csv
                </span>
                <span className="block text-xs" style={{ color: MUTED }}>
                  Row-level source traceability with page, table, and row references
                </span>
              </div>
            </a>
            <a
              href={`/api/document-intelligence/maintenance-bom/jobs/${encodeURIComponent(jobId)}/download/SectorCalc_Processing_Summary_${jobId}.html`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 text-sm font-medium"
              style={{
                background: CARD_BG_ALT,
                border: `1px solid ${BORDER}`,
                color: TEXT,
                minHeight: 44,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke={ACCENT}
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <div className="min-w-0">
                <span className="block truncate">
                  SectorCalc_Processing_Summary_{jobId}.html
                </span>
                <span className="block text-xs" style={{ color: MUTED }}>
                  Printable HTML processing summary
                </span>
              </div>
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div
          className="p-4 text-xs leading-relaxed"
          style={{ background: CARD_BG_ALT, border: `1px solid ${BORDER}`, color: MUTED }}
        >
          <strong>Important:</strong> Automated extraction and consistency checks
          support data preparation. The customer must review flagged and
          business-critical records before ERP import, RFQ issuance, purchasing,
          maintenance, or engineering use. No modifications to the underlying
          processing results are made from this interface.
        </div>
      </div>
    </main>
  );
}
