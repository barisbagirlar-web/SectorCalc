/**
 * Existing tool migration plan types — Phase 5H-E read-only migration planning.
 */

import type { BatchAlignmentStatus } from "@/lib/features/formula-governance/requirement-engine/batch-alignment-audit";
import type { ToolInputDesignAuditStatus } from "@/lib/features/formula-governance/input-design-audit/input-design-audit-types";

export type MigrationPriority = "immediate" | "high" | "medium" | "low" | "defer";

export type MigrationPatchLevel =
  | "none"
  | "metadata_only"
  | "fixture_ontology"
  | "input_design_only"
  | "controlled_input_patch"
  | "smart_form_patch"
  | "report_trace_patch"
  | "blocked";

export type MigrationRiskLevel = "low" | "medium" | "high" | "critical";

export type ToolMigrationPlanItem = {
  readonly slug: string;
  readonly currentStatus: ToolInputDesignAuditStatus;
  readonly inputSufficiencyScore: number;
  readonly professionalDepthScore: number;
  readonly alignmentStatus?: BatchAlignmentStatus;
  readonly migrationRiskScore: number;
  readonly recommendedPatchLevel: MigrationPatchLevel;
  readonly migrationPriority: MigrationPriority;
  readonly migrationRiskLevel: MigrationRiskLevel;
  readonly canPatchWithoutUIBreak: boolean;
  readonly hasFullGovernanceCoverage: boolean;
  readonly requiredActions: readonly string[];
  readonly blockedBy: readonly string[];
  readonly expectedBenefit: string;
  readonly affectedAreas: readonly string[];
  readonly testRequirements: readonly string[];
  readonly nextGate: string;
  readonly notes: readonly string[];
  readonly inputDesignPatchCompleted: boolean;
  readonly completedInputDesignPatchGate?: string;
  readonly smartFormArchitectureReady: boolean;
};

export type BatchMigrationPlan = {
  readonly totalTools: number;
  readonly immediate: number;
  readonly high: number;
  readonly medium: number;
  readonly low: number;
  readonly defer: number;
  readonly items: readonly ToolMigrationPlanItem[];
  readonly recommendedFirstPatchBatch: readonly ToolMigrationPlanItem[];
  readonly completedInputDesignPatches: readonly string[];
  readonly smartFormRenderingReadyCount: number;
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};
