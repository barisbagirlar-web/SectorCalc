/**
 * Fixture expansion audit — Phase 5I-K read-only plan generation.
 */

import { FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts";
import { runFullExistingToolAudit } from "@/lib/formula-governance/full-tool-audit/full-tool-audit-runner";
import { selectFixtureExpansionCandidates } from "@/lib/formula-governance/calculation-ontology/fixture-expansion/fixture-expansion-candidate-selector";
import { buildFixtureExpansionPlan } from "@/lib/formula-governance/calculation-ontology/fixture-expansion/fixture-expansion-plan-builder";
import { aggregateExpectedLift } from "@/lib/formula-governance/calculation-ontology/fixture-expansion/fixture-expansion-risk-gate";
import type { FixtureExpansionAuditResult } from "@/lib/formula-governance/calculation-ontology/fixture-expansion/fixture-expansion-types";
import { runBatchPatchPlanAudit } from "@/lib/formula-governance/tool-factory-orchestrator/patch-plan/batch-patch-plan-audit";

export function runFixtureExpansionAudit(): FixtureExpansionAuditResult {
  const fullToolAudit = runFullExistingToolAudit(FORMULA_CONTRACTS);
  const patchPlanAudit = runBatchPatchPlanAudit(fullToolAudit);
  const candidates = selectFixtureExpansionCandidates(fullToolAudit.items, patchPlanAudit.plans);
  const plans = candidates.map(buildFixtureExpansionPlan);

  const top10FixtureCandidates = plans
    .filter((plan) => plan.status === "ready_for_fixture_draft")
    .slice(0, 10)
    .map((plan) => plan.slug);

  return {
    totalCandidates: plans.length,
    readyForFixtureDraft: plans.filter((p) => p.status === "ready_for_fixture_draft").length,
    needsManualReview: plans.filter((p) => p.status === "needs_manual_review").length,
    blocked: plans.filter((p) => p.status === "blocked").length,
    top10FixtureCandidates,
    expectedInputDesignLift: aggregateExpectedLift(plans),
    plans,
    blockers: [...new Set(plans.flatMap((p) => p.blockers))],
    warnings: [...new Set(plans.flatMap((p) => p.warnings))],
  };
}

export function formatFixtureExpansionReport(result: FixtureExpansionAuditResult): string {
  return [
    "Fixture Ontology Expansion Audit",
    `Total candidates: ${result.totalCandidates}`,
    `Ready for fixture draft: ${result.readyForFixtureDraft}`,
    `Needs manual review: ${result.needsManualReview}`,
    `Blocked: ${result.blocked}`,
    `Expected input design lift: ${result.expectedInputDesignLift}`,
    "",
    "Top 10 fixture candidates:",
    ...result.top10FixtureCandidates.map((slug) => `- ${slug}`),
  ].join("\n");
}
