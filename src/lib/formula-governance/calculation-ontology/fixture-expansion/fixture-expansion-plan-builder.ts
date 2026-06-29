/**
 * Fixture expansion plan builder — Phase 5I-K plan only, no file writes.
 */

import type { FixtureExpansionCandidate } from "@/lib/formula-governance/calculation-ontology/fixture-expansion/fixture-expansion-candidate-selector";
import type { FixtureExpansionPlan } from "@/lib/formula-governance/calculation-ontology/fixture-expansion/fixture-expansion-types";

const DEFAULT_REQUIRED_INPUTS = ["primaryInput", "secondaryInput", "rateInput"] as const;
const DEFAULT_DIMENSIONS = ["currency", "percent", "hours"] as const;

export function buildFixtureExpansionPlan(candidate: FixtureExpansionCandidate): FixtureExpansionPlan {
  const slug = candidate.item.slug;
  const blockers: string[] = [...candidate.item.blockers];
  const warnings: string[] = [...candidate.item.warnings];

  const missingInputs =
    candidate.plan?.status === "needs_fixture" || candidate.plan?.patchType === "fixture_ontology"
      ? [...DEFAULT_REQUIRED_INPUTS]
      : [];

  const expectedInputDesignLift = Math.min(
    40,
    10 + missingInputs.length * 5 + (candidate.plan?.patchType === "fixture_ontology" ? 15 : 0),
  );

  let status: FixtureExpansionPlan["status"] = "ready_for_fixture_draft";
  if (blockers.length > 0) {
    status = "blocked";
  } else if (candidate.item.oracleStatus !== "PASS") {
    status = "needs_manual_review";
    warnings.push(`${slug}: oracle status not PASS — manual review required.`);
  }

  return {
    slug,
    targetOutput: `${slug}_result`,
    alignmentAlias: candidate.item.hasFormulaContract ? slug : null,
    dimensionCoverage: [...DEFAULT_DIMENSIONS],
    requiredInputCoverage: [...DEFAULT_REQUIRED_INPUTS],
    missingInputs,
    expectedInputDesignLift,
    status,
    blockers,
    warnings,
  };
}
