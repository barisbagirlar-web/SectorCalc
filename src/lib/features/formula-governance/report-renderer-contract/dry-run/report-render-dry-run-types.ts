/**
 * Report render dry-run types — Phase 5I-I (no file output).
 */

import type { ReportRendererContract, ReportRendererFormat } from "@/lib/features/formula-governance/report-renderer-contract/report-renderer-types";

export type ReportRenderDryRunStatus = "dry_run_ready" | "needs_data" | "blocked";

export type ReportRenderDryRun = {
  readonly slug: string;
  readonly sourceRendererContract: Pick<ReportRendererContract, "slug" | "status">;
  readonly format: ReportRendererFormat;
  readonly sections: readonly string[];
  readonly syntheticRows: readonly Record<string, string | number>[];
  readonly missingFields: readonly string[];
  readonly redactedFields: readonly string[];
  readonly prohibitedFieldViolations: readonly string[];
  readonly estimatedPageCount: number;
  readonly estimatedSheetCount: number;
  readonly estimatedWordSections: number;
  readonly canRenderWithoutFileOutput: boolean;
  readonly fileOutputGenerated: false;
  readonly status: ReportRenderDryRunStatus;
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
};

export type BatchReportRenderDryRunAuditResult = {
  readonly totalDryRuns: number;
  readonly dryRunReady: number;
  readonly needsData: number;
  readonly blocked: number;
  readonly fileOutputGeneratedCount: number;
  readonly dryRuns: readonly ReportRenderDryRun[];
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
};
