/**
 * Roadmap debt register types - Phase 5I-Q.
 */

export type DebtSeverity = "critical" | "high" | "medium";

export type DebtRegisterEntry = {
  readonly id: string;
  readonly category: string;
  readonly severity: DebtSeverity;
  readonly description: string;
  readonly batchSuggestion: string;
};

export type RoadmapBatchSuggestion = {
  readonly batchId: string;
  readonly title: string;
  readonly debtItems: readonly string[];
};

export type RoadmapDebtAuditResult = {
  readonly totalRemainingDebt: number;
  readonly criticalDebt: number;
  readonly highDebt: number;
  readonly mediumDebt: number;
  readonly next3Batches: readonly RoadmapBatchSuggestion[];
  readonly investorDemoMinimumPath: readonly string[];
  readonly fullProductizationPath: readonly string[];
  readonly entries: readonly DebtRegisterEntry[];
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
};
