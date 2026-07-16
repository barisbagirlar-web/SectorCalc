/**
 * CSV Source Map Generator
 *
 * Generates SectorCalc_Source_Map_{jobId}.csv with row-level
 * source traceability information.
 */

import type { BomRow } from "@/types/document-intelligence";

const FORMULA_CHARS = ["=", "+", "-", "@", "\t", "\r"];

function csvEscape(value: unknown): string {
  if (value == null) return "";
  const str = String(value);
  const escaped = str.replace(/"/g, '""');
  const needsQuoting = str.includes(",") || str.includes('"') || str.includes("\n") || FORMULA_CHARS.some((c) => str.startsWith(c));
  return needsQuoting ? `"${escaped}"` : escaped;
}

function csvRow(values: unknown[]): string {
  return values.map(csvEscape).join(",") + "\n";
}

export interface SourceMapInput {
  rows: BomRow[];
  sourceDocument: string;
}

export function generateSourceMapCsv(input: SourceMapInput): string {
  let csv = "";

  // Header
  csv += csvRow([
    "Row ID",
    "Source Document",
    "Source Page",
    "Source Table",
    "Source Row",
    "Evidence Reference",
    "Part Number",
    "Description",
    "Quantity",
    "Revision",
    "Confidence",
    "Validation Status",
    "Export Disposition",
  ]);

  // Data rows
  for (let i = 0; i < input.rows.length; i++) {
    const r = input.rows[i];
    csv += csvRow([
      r.itemNumber,
      input.sourceDocument,
      r.sourcePage,
      r.sourceTable,
      r.sourceRow,
      `${input.sourceDocument}#p${r.sourcePage}t${r.sourceTable}r${r.sourceRow}`,
      r.partNumberNormalized,
      r.descriptionNormalized,
      r.quantity,
      r.revision,
      r.confidence,
      r.validationStatus,
      r.exportDisposition,
    ]);
  }

  return csv;
}

export function generateProcurementExceptionCsv(
  exceptions: Array<{
    type: string;
    severity: string;
    description: string;
    partNumber: string | null;
    sourcePage: number;
    recommendation: string;
  }>
): string {
  let csv = "";

  csv += csvRow([
    "Exception Type",
    "Severity",
    "Description",
    "Part Number",
    "Source Page",
    "Recommendation",
  ]);

  for (const ex of exceptions) {
    csv += csvRow([
      ex.type,
      ex.severity,
      ex.description,
      ex.partNumber,
      ex.sourcePage,
      ex.recommendation,
    ]);
  }

  return csv;
}
