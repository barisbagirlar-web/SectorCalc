/**
 * Input design audit types — Phase 5H-C read-only tool input design audit.
 */

import type { BatchAlignmentStatus } from "@/lib/formula-governance/requirement-engine/batch-alignment-audit";

export type ToolInputDesignAuditStatus =
  | "professional_ready"
  | "usable"
  | "shallow"
  | "unsafe"
  | "blocked";

export type RecommendedPatchLevel =
  | "none"
  | "metadata_only"
  | "minor_input_patch"
  | "major_input_redesign"
  | "blocked";

export type AuditScoreBand = {
  readonly professional_ready: { readonly min: 85; readonly max: 100 };
  readonly usable: { readonly min: 70; readonly max: 84 };
  readonly shallow: { readonly min: 50; readonly max: 69 };
  readonly unsafe: { readonly min: 0; readonly max: 49 };
  readonly blocked: "blocker_present";
};

export const INPUT_DESIGN_AUDIT_SCORE_BANDS: AuditScoreBand = {
  professional_ready: { min: 85, max: 100 },
  usable: { min: 70, max: 84 },
  shallow: { min: 50, max: 69 },
  unsafe: { min: 0, max: 49 },
  blocked: "blocker_present",
};

export type ToolInputDesignAuditResult = {
  readonly slug: string;
  readonly status: ToolInputDesignAuditStatus;
  readonly inputSufficiencyScore: number;
  readonly professionalDepthScore: number;
  readonly missingRequiredInputs: readonly string[];
  readonly missingRiskDrivers: readonly string[];
  readonly missingAdvancedInputs: readonly string[];
  readonly derivedInputMisuse: readonly string[];
  readonly defaultAssumptionGaps: readonly string[];
  readonly validationGaps: readonly string[];
  readonly dimensionGaps: readonly string[];
  readonly alignmentStatus?: BatchAlignmentStatus;
  readonly migrationRiskScore: number;
  readonly recommendedPatchLevel: RecommendedPatchLevel;
  readonly canPatchWithoutUIBreak: boolean;
  readonly nextAction: string;
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};

export type BatchInputDesignAuditResult = {
  readonly totalContracts: number;
  readonly evaluatedContracts: number;
  readonly professionalReady: number;
  readonly usable: number;
  readonly shallow: number;
  readonly unsafe: number;
  readonly blocked: number;
  readonly contractOnlyAnalysis: number;
  readonly summaries: readonly ToolInputDesignAuditResult[];
  readonly topRisks: readonly string[];
  readonly recommendedNextBatch: readonly string[];
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};
