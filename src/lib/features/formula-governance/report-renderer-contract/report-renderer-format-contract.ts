/**
 * Report renderer format rules — Phase 5I-F deterministic format contracts.
 */

import type {
  ExcelFormatRules,
  PdfFormatRules,
  WordFormatRules,
} from "@/lib/features/formula-governance/report-renderer-contract/report-renderer-types";

export function buildPdfFormatRules(): PdfFormatRules {
  return {
    pageSize: "A4",
    maxTableRowsPerPage: 25,
    disclaimerPosition: "footer",
  };
}

export function buildExcelFormatRules(slug: string): ExcelFormatRules {
  return {
    sheets: ["Summary", "Inputs", "Coverage", "Audit"],
    frozenHeader: true,
    numericColumns: ["trustScore", "inputCount", "coveragePassCount"],
  };
}

export function buildWordFormatRules(): WordFormatRules {
  return {
    headingLevels: [1, 2, 3],
    tableStyle: "sectorcalc-audit-table",
    appendixStyle: "sectorcalc-audit-appendix",
  };
}

export function buildFormatRules(slug: string): {
  readonly pdf: PdfFormatRules;
  readonly excel: ExcelFormatRules;
  readonly word: WordFormatRules;
} {
  return {
    pdf: buildPdfFormatRules(),
    excel: buildExcelFormatRules(slug),
    word: buildWordFormatRules(),
  };
}
