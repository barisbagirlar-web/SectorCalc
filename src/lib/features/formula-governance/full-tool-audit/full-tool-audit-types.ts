/**
 * Full existing tool audit types - Phase 5H-J read-only batch classification.
 */

import type { TrustTraceStatus } from "@/lib/features/formula-governance/trust-trace-report/trust-trace-types";
import type { ToolInputDesignAuditStatus } from "@/lib/features/formula-governance/input-design-audit/input-design-audit-types";
import type { MigrationPatchLevel } from "@/lib/features/formula-governance/input-design-audit/migration-plan/migration-plan-types";
import type { FormulaToolTier } from "@/lib/features/formula-governance/types";

export type FullToolAuditReadiness = {
  readonly productionSafe: boolean;
  readonly smartFormReady: boolean;
  readonly reportReady: boolean;
  readonly factoryReady: boolean;
};

export type FullToolRecommendedAction =
  | "no_action"
  | "metadata_patch"
  | "fixture_ontology"
  | "input_design_patch"
  | "smart_form_patch"
  | "trust_trace_patch"
  | "report_layer_patch"
  | "blocked_manual_review";

export type FullToolAuditItem = {
  readonly slug: string;
  readonly title: string;
  readonly tier: FormulaToolTier;
  readonly category: string;
  readonly hasFormulaContract: boolean;
  readonly hasProductionLocator: boolean;
  readonly oracleStatus: string;
  readonly scenarioStatus: string;
  readonly propertyStatus: string;
  readonly inputDesignStatus: ToolInputDesignAuditStatus | "missing";
  readonly smartFormStatus: string;
  readonly trustTraceStatus: TrustTraceStatus | "missing";
  readonly migrationStatus: MigrationPatchLevel | "missing";
  readonly routeStatus: string;
  readonly reportStatus: string;
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
  readonly score: number;
  readonly readiness: FullToolAuditReadiness;
  readonly recommendedAction: FullToolRecommendedAction;
};

export type FullToolRecommendedBatches = {
  readonly metadataBatch: readonly string[];
  readonly smartFormBatch: readonly string[];
  readonly reportBatch: readonly string[];
  readonly fixtureBatch: readonly string[];
  readonly manualReviewBatch: readonly string[];
};

export type FullExistingToolAuditResult = {
  readonly totalTools: number;
  readonly productionSafeCount: number;
  readonly smartFormReadyCount: number;
  readonly trustTraceReadyCount: number;
  readonly reportReadyCount: number;
  readonly blockedCount: number;
  readonly recommendedBatches: FullToolRecommendedBatches;
  readonly top10Risks: readonly string[];
  readonly top10QuickWins: readonly string[];
  readonly items: readonly FullToolAuditItem[];
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};
