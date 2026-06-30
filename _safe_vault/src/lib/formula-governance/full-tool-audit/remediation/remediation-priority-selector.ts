/**
 * Remediation priority selector — Phase 5I-D deterministic ranking.
 */

import type { FullToolAuditItem } from "@/lib/formula-governance/full-tool-audit/full-tool-audit-types";
import { isEligibleForRemediationBatch1, estimateScoreLift } from "@/lib/formula-governance/full-tool-audit/remediation/remediation-risk-gate";
import type { PatchPlan } from "@/lib/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-types";

export type RemediationCandidate = {
  readonly item: FullToolAuditItem;
  readonly plan: PatchPlan;
  readonly scoreLift: number;
  readonly priorityScore: number;
};

export function rankRemediationCandidates(
  items: readonly FullToolAuditItem[],
  plans: readonly PatchPlan[],
  maxTools: number = 8,
): {
  readonly selected: readonly RemediationCandidate[];
  readonly excluded: readonly { readonly slug: string; readonly reason: string }[];
  readonly nextBatchCandidates: readonly string[];
} {
  const planBySlug = new Map(plans.map((plan) => [plan.slug, plan]));
  const excluded: { slug: string; reason: string }[] = [];
  const candidates: RemediationCandidate[] = [];

  for (const item of items) {
    const plan = planBySlug.get(item.slug);
    const eligibility = isEligibleForRemediationBatch1(item, plan);

    if (!eligibility.eligible || !plan) {
      excluded.push({ slug: item.slug, reason: eligibility.reason });
      continue;
    }

    const scoreLift = estimateScoreLift(item);
    const priorityScore = scoreLift + item.score * 0.1 - (plan.riskLevel === "medium" ? 5 : 0);

    candidates.push({ item, plan, scoreLift, priorityScore });
  }

  const selected = [...candidates]
    .sort((left, right) => {
      const liftDiff = right.scoreLift - left.scoreLift;
      if (liftDiff !== 0) {
        return liftDiff;
      }
      const priorityDiff = right.priorityScore - left.priorityScore;
      if (priorityDiff !== 0) {
        return priorityDiff;
      }
      return left.item.slug.localeCompare(right.item.slug);
    })
    .slice(0, maxTools);

  const selectedSlugs = new Set(selected.map((entry) => entry.item.slug));
  const nextBatchCandidates = candidates
    .filter((entry) => !selectedSlugs.has(entry.item.slug))
    .sort((left, right) => right.priorityScore - left.priorityScore)
    .slice(0, 10)
    .map((entry) => entry.item.slug);

  return { selected, excluded, nextBatchCandidates };
}
