/**
 * Post-launch growth backlog scoring - pure model for sprint candidate selection.
 * No PII; aligns with docs/growth-backlog-scoring-model.md
 */

export type GrowthBacklogCategory =
  | "revenue"
  | "seo"
  | "conversion_ux"
  | "premium_report_value"
  | "payment_entitlement"
  | "beta_partner_proof"
  | "technical_debt"
  | "localization"
  | "content_authority"
  | "new_product_surface"
  | "analytics"
  | "retention"
  | "data_product"
  | "growth";

export type GrowthBacklogStatus =
  | "new"
  | "needs_data"
  | "candidate"
  | "approved"
  | "in_progress"
  | "shipped"
  | "rejected"
  | "parked";

export type GrowthBacklogPriority = "P0" | "P1" | "P2" | "P3" | "P4";

export type GrowthBacklogEffort = "S" | "M" | "L";

export type GrowthBacklogRisk = "low" | "medium" | "high";

export type GrowthBacklogScoreInput = {
  readonly revenueImpact: number;
  readonly trafficImpact: number;
  readonly conversionImpact: number;
  readonly userPainEvidence: number;
  readonly seoEvidence: number;
  readonly implementationEffort: number;
  readonly technicalRisk: number;
  readonly maintenanceCost: number;
};

export type GrowthBacklogItem = {
  readonly id: string;
  readonly title: string;
  readonly category: GrowthBacklogCategory;
  readonly priority: GrowthBacklogPriority;
  readonly status: GrowthBacklogStatus;
  readonly effort: GrowthBacklogEffort;
  readonly risk: GrowthBacklogRisk;
  readonly isBlocker: boolean;
  readonly isIndexingBlocker: boolean;
  readonly hasEvidence: boolean;
  readonly scores: GrowthBacklogScoreInput;
};

export type GrowthBacklogScoreBand = "candidate" | "needs_review" | "backlog" | "parked";

export type GrowthBacklogScoreResult = {
  readonly totalScore: number;
  readonly band: GrowthBacklogScoreBand;
  readonly recommendedStatus: GrowthBacklogStatus;
  readonly sprintEligible: boolean;
  readonly effectivePriority: GrowthBacklogPriority;
};

const POSITIVE_MIN = 0;
const POSITIVE_MAX = 5;
const NEGATIVE_MIN = -5;
const NEGATIVE_MAX = -1;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function clampPositive(value: number): number {
  return clamp(value, POSITIVE_MIN, POSITIVE_MAX);
}

function clampNegative(value: number): number {
  return clamp(value, NEGATIVE_MIN, NEGATIVE_MAX);
}

export function normalizeGrowthBacklogScores(
  scores: GrowthBacklogScoreInput
): GrowthBacklogScoreInput {
  return {
    revenueImpact: clampPositive(scores.revenueImpact),
    trafficImpact: clampPositive(scores.trafficImpact),
    conversionImpact: clampPositive(scores.conversionImpact),
    userPainEvidence: clampPositive(scores.userPainEvidence),
    seoEvidence: clampPositive(scores.seoEvidence),
    implementationEffort: clampNegative(scores.implementationEffort),
    technicalRisk: clampNegative(scores.technicalRisk),
    maintenanceCost: clampNegative(scores.maintenanceCost),
  };
}

export function calculateGrowthBacklogTotalScore(scores: GrowthBacklogScoreInput): number {
  const normalized = normalizeGrowthBacklogScores(scores);
  return (
    normalized.revenueImpact +
    normalized.trafficImpact +
    normalized.conversionImpact +
    normalized.userPainEvidence +
    normalized.seoEvidence +
    normalized.implementationEffort +
    normalized.technicalRisk +
    normalized.maintenanceCost
  );
}

export function getGrowthBacklogScoreBand(totalScore: number): GrowthBacklogScoreBand {
  if (totalScore >= 15) {
    return "candidate";
  }
  if (totalScore >= 10) {
    return "needs_review";
  }
  if (totalScore >= 5) {
    return "backlog";
  }
  return "parked";
}

function statusFromBand(band: GrowthBacklogScoreBand): GrowthBacklogStatus {
  switch (band) {
    case "candidate":
      return "candidate";
    case "needs_review":
      return "needs_data";
    case "backlog":
      return "new";
    case "parked":
      return "parked";
  }
}

function effectivePriority(item: GrowthBacklogItem, totalScore: number): GrowthBacklogPriority {
  if (item.isBlocker || item.isIndexingBlocker) {
    return "P0";
  }
  if (totalScore >= 15 && item.hasEvidence) {
    return item.priority === "P0" ? "P0" : "P1";
  }
  if (item.priority !== "P3" && item.priority !== "P4") {
    return item.priority;
  }
  if (totalScore >= 10) {
    return "P2";
  }
  return item.priority;
}

export function isGrowthBacklogSprintEligible(
  item: GrowthBacklogItem,
  result: Pick<GrowthBacklogScoreResult, "band" | "effectivePriority">
): boolean {
  if (item.status === "needs_data" || item.status === "parked" || item.status === "rejected") {
    return false;
  }

  if (!item.hasEvidence && !item.isBlocker && !item.isIndexingBlocker) {
    return false;
  }

  if (item.isBlocker || item.isIndexingBlocker) {
    return true;
  }

  if (item.category === "new_product_surface") {
    return false;
  }

  return result.band === "candidate" && (result.effectivePriority === "P0" || result.effectivePriority === "P1");
}

export function scoreGrowthBacklogItem(item: GrowthBacklogItem): GrowthBacklogScoreResult {
  const totalScore = calculateGrowthBacklogTotalScore(item.scores);
  const band = getGrowthBacklogScoreBand(totalScore);
  const effectivePriorityValue = effectivePriority(item, totalScore);

  const recommendedStatus: GrowthBacklogStatus = item.isBlocker || item.isIndexingBlocker
    ? "candidate"
    : !item.hasEvidence
      ? "needs_data"
      : item.category === "new_product_surface"
        ? "parked"
        : statusFromBand(band);

  const result: GrowthBacklogScoreResult = {
    totalScore,
    band,
    recommendedStatus,
    sprintEligible: false,
    effectivePriority: effectivePriorityValue,
  };

  return {
    ...result,
    sprintEligible: isGrowthBacklogSprintEligible(item, result),
  };
}

export function effortToScorePenalty(effort: GrowthBacklogEffort): number {
  switch (effort) {
    case "S":
      return -1;
    case "M":
      return -3;
    case "L":
      return -5;
  }
}

export function riskToScorePenalty(risk: GrowthBacklogRisk): number {
  switch (risk) {
    case "low":
      return -1;
    case "medium":
      return -3;
    case "high":
      return -5;
  }
}
