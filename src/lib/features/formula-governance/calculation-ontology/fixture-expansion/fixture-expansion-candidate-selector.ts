/**
 * Fixture expansion candidate selector - Phase 5I-K contract_only / needs_fixture tools.
 */

import type { FullToolAuditItem } from "@/lib/features/formula-governance/full-tool-audit/full-tool-audit-types";
import type { PatchPlan } from "@/lib/features/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-types";

export type FixtureExpansionCandidate = {
  readonly item: FullToolAuditItem;
  readonly plan: PatchPlan | null;
  readonly priorityScore: number;
};

export function selectFixtureExpansionCandidates(
  items: readonly FullToolAuditItem[],
  plans: readonly PatchPlan[],
): FixtureExpansionCandidate[] {
  const planBySlug = new Map(plans.map((plan) => [plan.slug, plan]));

  return items
    .filter(
      (item) =>
        item.recommendedAction === "fixture_ontology" ||
        planBySlug.get(item.slug)?.patchType === "fixture_ontology" ||
        planBySlug.get(item.slug)?.status === "needs_fixture",
    )
    .map((item) => {
      const plan = planBySlug.get(item.slug) ?? null;
      const priorityScore =
        (item.score ?? 0) +
        (plan?.patchType === "fixture_ontology" ? 20 : 0) +
        (plan?.status === "needs_fixture" ? 10 : 0);

      return { item, plan, priorityScore };
    })
    .sort((left, right) => right.priorityScore - left.priorityScore);
}
