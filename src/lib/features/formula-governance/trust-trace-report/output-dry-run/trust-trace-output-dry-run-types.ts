/**
 * Trust trace output dry-run types - Phase 5I-M (structured JSON only).
 */

export type TrustTraceOutputSection =
  | "executive_summary"
  | "input_trace"
  | "assumptions"
  | "limitations"
  | "audit_appendix";

export type TrustTraceOutputDryRun = {
  readonly slug: string;
  readonly sections: Readonly<Record<TrustTraceOutputSection, Record<string, unknown>>>;
  readonly missingSections: readonly string[];
  readonly redactionViolations: readonly string[];
  readonly reportNarrativeReady: boolean;
  readonly auditAppendixReady: boolean;
  readonly fileOutputGenerated: false;
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
};

export type TrustTraceOutputDryRunAuditResult = {
  readonly totalOutputs: number;
  readonly outputDryRunReady: number;
  readonly missingSections: readonly string[];
  readonly redactionViolations: number;
  readonly reportNarrativeReady: number;
  readonly auditAppendixReady: number;
  readonly outputs: readonly TrustTraceOutputDryRun[];
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
};
