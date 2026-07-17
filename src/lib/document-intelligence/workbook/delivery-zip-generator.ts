/**
 * Delivery ZIP Generator
 *
 * Produces a consolidated, malware-safe delivery ZIP containing all
 * Maintenance BOM Recovery output artefacts plus a README_FIRST guide.
 *
 * Security properties:
 *  - No executable extensions admitted — blocked extensions rejected at entry
 *  - All entries use forward-slash paths (no directory traversal possible)
 *  - SHA-256 hash computed over the final ZIP buffer for integrity verification
 *
 * Async contract: archiver streams asynchronously; callers await the result.
 *
 * Dependencies: archiver (MIT), Node crypto (built-in)
 */

import archiver from "archiver";
import { createHash } from "node:crypto";
import type { ProcessingSummary } from "@/types/document-intelligence";

/* ── Constants ────────────────────────────────────────────────── */

const BLOCKED_EXTENSIONS = new Set([
  ".exe", ".com", ".bat", ".cmd", ".msi", ".scr", ".pif",
  ".vbs", ".vbe", ".js", ".jse", ".wsf", ".wsh", ".ps1",
  ".psm1", ".psd1", ".dll", ".sys", ".bin", ".sh", ".bash",
]);

const ALLOWED_EXTENSIONS = new Set([
  ".xlsx", ".csv", ".txt", ".json", ".html",
]);

/* ── Input Contract ───────────────────────────────────────────── */

export interface DeliveryZipInput {
  jobId: string;
  bomXlsx: Buffer;
  exceptionReportXlsx: Buffer;
  sourceMapCsv: Buffer;
  summaryHtml: Buffer;
  dataDictionaryHtml: Buffer;
  importChecklistHtml: Buffer;
  manifestJson: Buffer;
  summary: ProcessingSummary;
  retentionDays: number;
  engineVersion: string;
  validatorVersion: string;
  schemaVersion: string;
  supportContact: string;
}

/* ── Output Contract ──────────────────────────────────────────── */

export interface DeliveryZipOutput {
  zipBuffer: Buffer;
  sha256: string;
}

/* ── Internal Helpers ─────────────────────────────────────────── */

function validateContentType(filename: string): void {
  const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    if (BLOCKED_EXTENSIONS.has(ext)) {
      throw new Error(
        `Malware-safe guard: refused to archive blocked extension "${ext}" in "${filename}"`,
      );
    }
    throw new Error(
      `Unrecognised file extension "${ext}" in "${filename}". ` +
      `Only ${Array.from(ALLOWED_EXTENSIONS).join(", ")} are permitted.`,
    );
  }
}

function buildReadmeText(input: DeliveryZipInput): string {
  const lines: string[] = [];
  const push = (s: string) => lines.push(s);
  const sep = () => lines.push("─".repeat(72));

  push("SectorCalc Maintenance BOM Recovery — Delivery Package");
  sep();
  push(`Job ID:         ${input.jobId}`);
  push(`Generated:      ${input.summary.generatedAt}`);
  push(`Engine Version: ${input.engineVersion}`);
  push(`Schema Version: ${input.schemaVersion}`);
  push(`Validator:      ${input.validatorVersion}`);
  push(`Support:        ${input.supportContact}`);
  sep();
  push("");
  push("PACKAGE CONTENTS");
  sep();
  push("");
  push(" 1. SectorCalc_Maintenance_BOM_{jobId}.xlsx");
  push("    Clean BOM worksheet, review-required records, duplicate groups,");
  push("    missing-field exceptions, revision-conflict details, source-row map,");
  push("    processing summary, and an ERP-ready import template.");
  push("");
  push(" 2. SectorCalc_Exception_Report_{jobId}.xlsx");
  push("    Procurement-focused view: executive summary, critical exceptions,");
  push("    duplicate candidates, missing required data, revision conflicts,");
  push("    recommended review sequence.");
  push("");
  push(" 3. SectorCalc_Source_Map_{jobId}.csv");
  push("    Machine-readable source-to-canonical mapping for every extracted row.");
  push("");
  push(" 4. SectorCalc_Processing_Summary_{jobId}.html");
  push("    Human-readable processing run summary with per-page metrics.");
  push("");
  push(" 5. SectorCalc_Data_Dictionary_{jobId}.html");
  push("    Definitive reference for every field in the output schema — meaning,");
  push("    data type, required/optional, validation rules, blocking behaviour,");
  push("    and known limitations.");
  push("");
  push(" 6. SectorCalc_Import_Checklist_{jobId}.html");
  push("    Step-by-step readiness checklist for ERP import, purchasing, and");
  push("    engineering review.");
  push("");
  push(" 7. SectorCalc_Manifest_{jobId}.json");
  push("    Machine-readable output manifest — lists every delivered file with");
  push("    content type, size, SHA-256, and storage path for audit traceability.");
  push("");
  push(" 8. README_FIRST_{jobId}.txt");
  push("    This file.");
  sep();
  push("");
  push("RECORDS REQUIRING REVIEW");
  sep();
  push("");
  push(`  ● Rows flagged "review_required": ${input.summary.reviewRows}`);
  push(`  ● Rows flagged "blocked":       ${input.summary.blockedRows}`);
  push(`  ● Duplicate groups detected:     ${input.summary.duplicateGroups}`);
  push(`  ● Missing field exceptions:      ${input.summary.missingFieldCount}`);
  push(`  ● Revision conflicts:            ${input.summary.revisionConflictCount}`);
  push(`  ● Low confidence records:        ${input.summary.lowConfidenceCount}`);
  push("");
  push("  These records appear in the Review Required worksheet and the");
  push("  Exception Report. All flagged records MUST be resolved before");
  push("  ERP import or purchasing action.");
  sep();
  push("");
  push("RETENTION & REMEDIATION");
  sep();
  push("");
  push(`  Output files are retained for ${input.retentionDays} days from generation.`);
  push("  After this period the files may be deleted from SectorCalc storage.");
  push("  Download and archive this package locally before the deadline.");
  push("");
  push("  If errors are found in the extraction or normalisation output:");
  push("   1. Review the flagged records against the original PDF source.");
  push("   2. Apply corrections in your ERP system after import.");
  push("   3. Contact support for extraction accuracy issues — include the Job ID.");
  push("");
  push("REMEDIATION ROUTE");
  sep();
  push("");
  push("  1. Open the Import Checklist (file 6) and work through each step.");
  push("  2. Resolve all review_required records against original source.");
  push("  3. Consolidate or remove duplicate part entries.");
  push("  4. Fill in missing fields from engineering / procurement records.");
  push("  5. Normalise revision references to a single scheme.");
  push("  6. Run a pilot import on a subset before full ERP import.");
  push("");
  push("SUPPORT");
  sep();
  push("");
  push(`  Contact: ${input.supportContact}`);
  push(`  Include Job ID "${input.jobId}" in all correspondence.`);
  push("");
  push("  DISCLAIMER: This output is a technical extraction aid. It does not");
  push("  constitute financial, legal, or engineering advice. Verify all data");
  push("  before making business decisions.");

  return lines.join("\n");
}

/* ── Main Generator ───────────────────────────────────────────── */

export async function generateDeliveryZip(input: DeliveryZipInput): Promise<DeliveryZipOutput> {
  const { jobId } = input;

  const archive = archiver("zip", {
    zlib: { level: 9 },
    forceLocalTime: true,
  });

  // Validate every content type before archiving
  const fileEntries: { name: string; buffer: Buffer }[] = [
    { name: `SectorCalc_Maintenance_BOM_${jobId}.xlsx`, buffer: input.bomXlsx },
    { name: `SectorCalc_Exception_Report_${jobId}.xlsx`, buffer: input.exceptionReportXlsx },
    { name: `SectorCalc_Source_Map_${jobId}.csv`, buffer: input.sourceMapCsv },
    { name: `SectorCalc_Processing_Summary_${jobId}.html`, buffer: input.summaryHtml },
    { name: `SectorCalc_Data_Dictionary_${jobId}.html`, buffer: input.dataDictionaryHtml },
    { name: `SectorCalc_Import_Checklist_${jobId}.html`, buffer: input.importChecklistHtml },
    { name: `SectorCalc_Manifest_${jobId}.json`, buffer: input.manifestJson },
  ];

  for (const entry of fileEntries) {
    validateContentType(entry.name);
    archive.append(entry.buffer, { name: entry.name });
  }

  // README_FIRST
  const readmeContent = buildReadmeText(input);
  archive.append(Buffer.from(readmeContent, "utf-8"), { name: `README_FIRST_${jobId}.txt` });

  // Stream promise: collect all emitted data chunks, reject on error
  const chunks: Buffer[] = await new Promise<Buffer[]>((resolve, reject) => {
    const collected: Buffer[] = [];

    archive.on("data", (chunk: Buffer) => collected.push(chunk));
    archive.on("error", (err: Error) => reject(err));
    archive.on("end", () => resolve(collected));

    // finalize() signals archiver that no more entries will be added
    archive.finalize();
  });

  const zipBuffer = Buffer.concat(chunks);

  // Compute SHA-256 over the final ZIP for integrity verification
  const sha256 = createHash("sha256").update(zipBuffer).digest("hex");

  return { zipBuffer, sha256 };
}
