/**
 * Trust trace export contract types - Phase 5I-C (schema only; no file export).
 */

export type TrustTraceExportFormat = "pdf" | "excel" | "word";

export type TrustTraceExportSection =
  | "executive_summary"
  | "input_trace"
  | "assumptions"
  | "validation_trace"
  | "calculation_trace"
  | "oracle_scenario_property_coverage"
  | "warnings_limitations"
  | "trust_score"
  | "audit_appendix";

export type TrustTraceExportStatus =
  | "export_contract_ready"
  | "needs_trace_data"
  | "needs_report_mapping"
  | "blocked";

export type TrustTraceExportReadinessFlags = {
  readonly pdfReady: boolean;
  readonly excelReady: boolean;
  readonly wordReady: boolean;
};

export type TrustTraceRedactionRule =
  | "no_secrets"
  | "no_raw_env"
  | "no_firebase_credentials"
  | "no_user_pii_unless_allowed"
  | "no_unverified_llm_formula"
  | "no_internal_stack_traces";

export type TrustTraceExportContract = {
  readonly slug: string;
  readonly reportTitle: string;
  readonly exportFormats: readonly TrustTraceExportFormat[];
  readonly sections: readonly TrustTraceExportSection[];
  readonly requiredDataSources: readonly string[];
  readonly missingDataSources: readonly string[];
  readonly redactionRules: readonly TrustTraceRedactionRule[];
  readonly disclaimerRequired: true;
  readonly exportReadiness: TrustTraceExportReadinessFlags;
  readonly status: TrustTraceExportStatus;
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
};

export type BatchTrustTraceExportAuditResult = {
  readonly totalContracts: number;
  readonly pdfReady: number;
  readonly excelReady: number;
  readonly wordReady: number;
  readonly blocked: number;
  readonly needsTraceData: number;
  readonly needsReportMapping: number;
  readonly topMissingSections: readonly string[];
  readonly contracts: readonly TrustTraceExportContract[];
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};
