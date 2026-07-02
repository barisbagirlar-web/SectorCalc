/**
 * Report renderer contract types - Phase 5I-F schema only; no file output.
 */

import type { TrustTraceExportContract } from "@/lib/features/formula-governance/trust-trace-report/export-contract/trust-trace-export-types";

export type ReportRendererFormat = "pdf" | "excel" | "word";

export type ReportRendererSection =
  | "cover"
  | "executive_summary"
  | "input_table"
  | "assumption_table"
  | "validation_table"
  | "calculation_trace"
  | "coverage_matrix"
  | "warnings_limitations"
  | "trust_score"
  | "audit_appendix";

export type ReportRendererStatus =
  | "renderer_contract_ready"
  | "needs_export_contract"
  | "needs_trace_data"
  | "blocked";

export type PdfFormatRules = {
  readonly pageSize: "A4";
  readonly maxTableRowsPerPage: 25;
  readonly disclaimerPosition: "footer";
};

export type ExcelFormatRules = {
  readonly sheets: readonly string[];
  readonly frozenHeader: true;
  readonly numericColumns: readonly string[];
};

export type WordFormatRules = {
  readonly headingLevels: readonly number[];
  readonly tableStyle: "sectorcalc-audit-table";
  readonly appendixStyle: "sectorcalc-audit-appendix";
};

export type ReportRendererDataContract = {
  readonly requiredFields: readonly string[];
  readonly optionalFields: readonly string[];
  readonly redactedFields: readonly string[];
  readonly prohibitedFields: readonly string[];
};

export type ReportRendererReadiness = {
  readonly pdfRendererReady: boolean;
  readonly excelRendererReady: boolean;
  readonly wordRendererReady: boolean;
};

export type ReportRendererContract = {
  readonly slug: string;
  readonly title: string;
  readonly sourceTrustTraceExportContract: Pick<TrustTraceExportContract, "slug" | "status">;
  readonly supportedFormats: readonly ReportRendererFormat[];
  readonly sections: readonly ReportRendererSection[];
  readonly formatRules: {
    readonly pdf: PdfFormatRules;
    readonly excel: ExcelFormatRules;
    readonly word: WordFormatRules;
  };
  readonly dataContract: ReportRendererDataContract;
  readonly readiness: ReportRendererReadiness;
  readonly status: ReportRendererStatus;
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
};

export type BatchReportRendererAuditResult = {
  readonly totalContracts: number;
  readonly rendererReady: number;
  readonly pdfReady: number;
  readonly excelReady: number;
  readonly wordReady: number;
  readonly blocked: number;
  readonly needsTraceData: number;
  readonly topMissingFields: readonly string[];
  readonly contracts: readonly ReportRendererContract[];
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};
