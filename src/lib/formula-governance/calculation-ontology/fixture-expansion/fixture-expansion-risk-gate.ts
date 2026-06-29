/**
 * Fixture expansion risk gate — Phase 5I-K eligibility checks.
 */

import type { FixtureExpansionPlan } from "@/lib/formula-governance/calculation-ontology/fixture-expansion/fixture-expansion-types";

export function isFixtureExpansionEligible(plan: FixtureExpansionPlan): boolean {
  return plan.status !== "blocked" && plan.alignmentAlias !== null;
}

export function aggregateExpectedLift(plans: readonly FixtureExpansionPlan[]): number {
  return plans.reduce((sum, plan) => sum + plan.expectedInputDesignLift, 0);
}
