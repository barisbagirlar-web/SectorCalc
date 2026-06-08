/**
 * First controlled patch batch selector — Phase 5H-E read-only planning.
 */

import type {
  BatchMigrationPlan,
  ToolMigrationPlanItem,
} from "@/lib/formula-governance/input-design-audit/migration-plan/migration-plan-types";

const PATCH_LEVEL_PRIORITY: Record<ToolMigrationPlanItem["recommendedPatchLevel"], number> = {
  input_design_only: 0,
  report_trace_patch: 1,
  fixture_ontology: 2,
  metadata_only: 3,
  smart_form_patch: 4,
  controlled_input_patch: 5,
  none: 6,
  blocked: 7,
};

const PRIORITY_ORDER: Record<ToolMigrationPlanItem["migrationPriority"], number> = {
  immediate: 0,
  high: 1,
  medium: 2,
  low: 3,
  defer: 4,
};

const RISK_ORDER: Record<ToolMigrationPlanItem["migrationRiskLevel"], number> = {
  low: 0,
  medium: 1,
  high: 2,
  critical: 3,
};

function isFirstPatchCandidate(item: ToolMigrationPlanItem): boolean {
  if (item.inputDesignPatchCompleted) {
    return false;
  }
  if (item.recommendedPatchLevel === "blocked") {
    return false;
  }
  if (item.currentStatus === "blocked" || item.blockedBy.length > 0) {
    return false;
  }
  if (item.migrationRiskLevel === "high" || item.migrationRiskLevel === "critical") {
    return false;
  }
  if (!item.hasFullGovernanceCoverage) {
    return false;
  }
  if (item.migrationPriority === "defer") {
    return false;
  }
  return true;
}

function scoreFirstPatchCandidate(item: ToolMigrationPlanItem): number {
  let score = 0;

  if (item.currentStatus === "professional_ready") {
    score += 40;
  } else if (item.currentStatus === "usable") {
    score += 25;
  }

  if (item.recommendedPatchLevel === "input_design_only") {
    score += 30;
  } else if (item.recommendedPatchLevel === "report_trace_patch") {
    score += 20;
  } else if (item.recommendedPatchLevel === "fixture_ontology") {
    score += 15;
  } else if (item.recommendedPatchLevel === "smart_form_patch") {
    score += 10;
  }

  if (item.canPatchWithoutUIBreak) {
    score += 15;
  }

  score += Math.min(20, Math.floor(item.inputSufficiencyScore / 5));
  score += Math.min(10, Math.floor(item.professionalDepthScore / 10));
  score -= RISK_ORDER[item.migrationRiskLevel] * 8;
  score -= PRIORITY_ORDER[item.migrationPriority] * 3;
  score -= PATCH_LEVEL_PRIORITY[item.recommendedPatchLevel];

  return score;
}

function compareFirstPatchCandidates(
  left: ToolMigrationPlanItem,
  right: ToolMigrationPlanItem,
): number {
  const scoreDiff = scoreFirstPatchCandidate(right) - scoreFirstPatchCandidate(left);
  if (scoreDiff !== 0) {
    return scoreDiff;
  }

  const priorityDiff = PRIORITY_ORDER[left.migrationPriority] - PRIORITY_ORDER[right.migrationPriority];
  if (priorityDiff !== 0) {
    return priorityDiff;
  }

  const riskDiff = RISK_ORDER[left.migrationRiskLevel] - RISK_ORDER[right.migrationRiskLevel];
  if (riskDiff !== 0) {
    return riskDiff;
  }

  return left.slug.localeCompare(right.slug);
}

export function selectFirstControlledPatchBatch(
  plan: BatchMigrationPlan,
  maxItems = 3,
): readonly ToolMigrationPlanItem[] {
  const candidates = plan.items.filter(isFirstPatchCandidate).sort(compareFirstPatchCandidates);

  const minItems = Math.min(1, candidates.length);
  const targetCount = Math.max(minItems, Math.min(maxItems, candidates.length));

  return candidates.slice(0, targetCount);
}
