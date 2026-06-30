/**
 * Smart form production rollout governance types — Phase 5I-L.
 */

export type ProductionRolloutToolStatus = "live_pilot" | "staging_only" | "preview_only" | "blocked";

export type ProductionRolloutToolEntry = {
  readonly governanceSlug: string;
  readonly routeSlug: string;
  readonly status: ProductionRolloutToolStatus;
  readonly humanApprovalRequired: true;
  readonly deployRequired: false;
};

export type ProductionRolloutGovernanceAuditResult = {
  readonly livePilotCount: number;
  readonly candidateCount: number;
  readonly stagingOnlyCount: number;
  readonly previewOnlyCount: number;
  readonly productionRolloutApproved: false;
  readonly deployRequired: false;
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
  readonly entries: readonly ProductionRolloutToolEntry[];
};
