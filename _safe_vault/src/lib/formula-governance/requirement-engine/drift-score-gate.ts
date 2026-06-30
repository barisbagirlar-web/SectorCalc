/**
 * Drift score gate — migration risk thresholds for requirement alignment (Phase 5H-B-6).
 */

import type { OntologyAliasMap } from "@/lib/formula-governance/calculation-ontology/ontology-alias-types";

export type DriftGateStatus = "low_risk" | "needs_review" | "blocked";

export type DriftScoreGateResult = {
  readonly status: DriftGateStatus;
  readonly reasons: readonly string[];
  readonly recommendedAction: string;
};

export type EvaluateDriftScoreGateParams = {
  readonly migrationRiskScore: number;
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
  readonly aliasMap: OntologyAliasMap;
};

const MANUAL_REVIEW_HIGH_THRESHOLD = 3;
const REVIEW_BAND_MIN = 35;
const BLOCKED_BAND_MIN = 70;

function hasTargetAliasBlocker(blockers: readonly string[]): boolean {
  return blockers.some((blocker) => blocker.includes("No alias for contract target"));
}

function hasRoleOrDimensionBlocker(blockers: readonly string[]): boolean {
  return blockers.some(
    (blocker) =>
      blocker.includes("Role mismatch blocker") ||
      blocker.includes("Dimension mismatch blocker"),
  );
}

function countManualReviewAliases(aliasMap: OntologyAliasMap): number {
  return aliasMap.aliases.filter((alias) => alias.confidence === "manual_review").length;
}

export function evaluateDriftScoreGate(
  params: EvaluateDriftScoreGateParams,
): DriftScoreGateResult {
  const { migrationRiskScore, blockers, aliasMap } = params;
  const reasons: string[] = [];

  if (hasTargetAliasBlocker(blockers)) {
    reasons.push("Contract target variable has no fixture alias.");
    return {
      status: "blocked",
      reasons,
      recommendedAction:
        "Add semantic alias for contract target output before using fixture ontology for migration planning.",
    };
  }

  if (hasRoleOrDimensionBlocker(blockers)) {
    reasons.push("Role or dimension mismatch blocker detected in alias map.");
    return {
      status: "blocked",
      reasons,
      recommendedAction:
        "Resolve role/dimension blockers in contract vs fixture variable mapping before alignment.",
    };
  }

  if (migrationRiskScore >= BLOCKED_BAND_MIN) {
    reasons.push(`Migration risk score ${migrationRiskScore} is at or above ${BLOCKED_BAND_MIN}.`);
    return {
      status: "blocked",
      reasons,
      recommendedAction:
        "Treat contract–fixture drift as launch-blocking; review alias map and contract metadata.",
    };
  }

  const manualReviewCount = countManualReviewAliases(aliasMap);
  const hasCompositeAliases = aliasMap.compositeAliases.length > 0;

  if (hasCompositeAliases) {
    reasons.push(
      `${aliasMap.compositeAliases.length} composite alias(es) require manual shape review.`,
    );
  }

  if (manualReviewCount >= MANUAL_REVIEW_HIGH_THRESHOLD) {
    reasons.push(
      `${manualReviewCount} manual_review alias(es) exceed threshold (${MANUAL_REVIEW_HIGH_THRESHOLD}).`,
    );
  }

  if (migrationRiskScore >= REVIEW_BAND_MIN) {
    reasons.push(
      `Migration risk score ${migrationRiskScore} is in review band (${REVIEW_BAND_MIN}–${BLOCKED_BAND_MIN - 1}).`,
    );
  }

  if (
    migrationRiskScore >= REVIEW_BAND_MIN ||
    hasCompositeAliases ||
    manualReviewCount >= MANUAL_REVIEW_HIGH_THRESHOLD
  ) {
    return {
      status: "needs_review",
      reasons,
      recommendedAction:
        "Review alias confidence, composite mappings and fixture-only variables before ontology migration.",
    };
  }

  return {
    status: "low_risk",
    reasons: reasons.length > 0 ? reasons : ["Migration risk score is below review threshold."],
    recommendedAction: "Contract ontology remains source of truth; fixture drift is manageable.",
  };
}
