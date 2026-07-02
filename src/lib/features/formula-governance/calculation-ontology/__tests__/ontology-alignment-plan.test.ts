/**
 * Phase 5H-B-5 - ontology alignment plan tests.
 */

import { describe, expect, test } from "vitest";
import { getFormulaContractBySlug } from "@/lib/features/formula-governance/contracts";
import { buildOntologyDraftFromFormulaContract } from "@/lib/features/formula-governance/calculation-ontology/contract-ontology-bridge";
import { compileOntologyDraftToCalculationOntology } from "@/lib/features/formula-governance/calculation-ontology/ontology-compiler";
import { buildOntologyAliasMap } from "@/lib/features/formula-governance/calculation-ontology/ontology-alias-map";
import { buildOntologyAlignmentPlan } from "@/lib/features/formula-governance/calculation-ontology/ontology-alignment-plan";
import { ROOFING_CONTRACT_MARGIN_ONTOLOGY } from "@/lib/features/formula-governance/calculation-ontology/fixtures/roofing-contract-margin-ontology";
import { CNC_QUOTE_RISK_ONTOLOGY } from "@/lib/features/formula-governance/calculation-ontology/fixtures/cnc-quote-risk-ontology";
import { createOntology } from "@/lib/features/formula-governance/calculation-ontology/ontology-builder";

const ROOFING_SLUG = "roofing-contract-margin-guard";
const CNC_SLUG = "cnc-quote-risk-analyzer";

function contractOntologyForSlug(slug: string) {
  const contract = getFormulaContractBySlug(slug)!;
  const draft = buildOntologyDraftFromFormulaContract(contract);
  const compiled = compileOntologyDraftToCalculationOntology(draft);
  if (!compiled.ontology) {
    throw new Error(`Expected contract ontology to compile for ${slug}.`);
  }
  return compiled.ontology;
}

describe("buildOntologyAlignmentPlan", () => {
  test("produces roofing alignment plan", () => {
    const contractOntology = contractOntologyForSlug(ROOFING_SLUG);
    const aliasMap = buildOntologyAliasMap({
      contractOntology,
      fixtureOntology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
      slug: ROOFING_SLUG,
    });

    const plan = buildOntologyAlignmentPlan({
      contractOntology,
      fixtureOntology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
      aliasMap,
    });

    expect(plan.slug).toBe(ROOFING_SLUG);
    expect(["aligned", "partially_aligned"]).toContain(plan.alignmentStatus);
  });

  test("canonicalVariableMap is populated", () => {
    const contractOntology = contractOntologyForSlug(ROOFING_SLUG);
    const aliasMap = buildOntologyAliasMap({
      contractOntology,
      fixtureOntology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
      slug: ROOFING_SLUG,
    });

    const plan = buildOntologyAlignmentPlan({
      contractOntology,
      fixtureOntology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
      aliasMap,
    });

    expect(Object.keys(plan.canonicalVariableMap).length).toBeGreaterThan(0);
    expect(plan.canonicalVariableMap.minimumSafePrice).toBe("minimumSafeContractPrice");
    expect(plan.canonicalVariableMap.tearOffCost).toBe("tearOffCost");
  });

  test("requiredManualReviews includes composite alias entries", () => {
    const contractOntology = contractOntologyForSlug(ROOFING_SLUG);
    const aliasMap = buildOntologyAliasMap({
      contractOntology,
      fixtureOntology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
      slug: ROOFING_SLUG,
    });

    const plan = buildOntologyAlignmentPlan({
      contractOntology,
      fixtureOntology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
      aliasMap,
    });

    expect(
      plan.requiredManualReviews.some(
        (review) =>
          review.ontologyVariableId === "laborCostPerSquare" ||
          review.contractVariableId.includes("laborHours"),
      ),
    ).toBe(true);
  });

  test("safeToUseContractOntologyForRequirementEngine is true for roofing", () => {
    const contractOntology = contractOntologyForSlug(ROOFING_SLUG);
    const aliasMap = buildOntologyAliasMap({
      contractOntology,
      fixtureOntology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
      slug: ROOFING_SLUG,
    });

    const plan = buildOntologyAlignmentPlan({
      contractOntology,
      fixtureOntology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
      aliasMap,
    });

    expect(plan.safeToUseContractOntologyForRequirementEngine).toBe(true);
  });

  test("blocked status when target alias is missing", () => {
    const contractOntology = createOntology({
      slug: "blocked-target-tool",
      sector: "test",
      defaultAssumptions: [],
      variables: [
        {
          id: "minimumSafePrice",
          label: "Minimum safe price",
          role: "target",
          dimension: "currency",
          unit: "USD",
          knowledgeLevel: "system_derived",
          requiredForOutputs: ["minimumSafePrice"],
          description: "target",
          missingRisk: "high",
        },
      ],
      formulas: [],
      goals: [
        {
          id: "goal",
          slug: "blocked-target-tool",
          targetVariable: "minimumSafePrice",
          acceptedFormulaNodes: [],
          decisionGoal: "test",
          primaryOutput: "minimumSafePrice",
        },
      ],
    });

    const fixtureOntology = createOntology({
      slug: "blocked-target-tool",
      sector: "test",
      defaultAssumptions: [],
      variables: [
        {
          id: "minimumSafeContractPrice",
          label: "Minimum safe contract price",
          role: "target",
          dimension: "currency",
          unit: "USD",
          knowledgeLevel: "system_derived",
          requiredForOutputs: ["minimumSafeContractPrice"],
          description: "target",
          missingRisk: "high",
        },
      ],
      formulas: [],
      goals: [
        {
          id: "goal-fixture",
          slug: "blocked-target-tool",
          targetVariable: "minimumSafeContractPrice",
          acceptedFormulaNodes: [],
          decisionGoal: "test",
          primaryOutput: "minimumSafeContractPrice",
        },
      ],
    });

    const aliasMap = buildOntologyAliasMap({
      contractOntology,
      fixtureOntology,
      slug: "blocked-target-tool",
    });

    const plan = buildOntologyAlignmentPlan({
      contractOntology,
      fixtureOntology,
      aliasMap,
    });

    expect(plan.alignmentStatus).toBe("blocked");
    expect(plan.safeToUseContractOntologyForRequirementEngine).toBe(false);
  });

  test("cnc production metadata blocker cleared in contract draft", () => {
    const contract = getFormulaContractBySlug(CNC_SLUG)!;
    const draft = buildOntologyDraftFromFormulaContract(contract);
    expect(draft.blockers.some((blocker) => blocker.includes("Production:"))).toBe(false);

    const cncContractOntology = createOntology({
      slug: CNC_SLUG,
      sector: "cnc-manufacturing",
      defaultAssumptions: [],
      variables: [
        {
          id: "setupTime",
          label: "Setup time",
          role: "input",
          dimension: "time",
          unit: "hour",
          knowledgeLevel: "user_known",
          requiredForOutputs: ["minimumSafePrice"],
          description: "stub",
          missingRisk: "high",
        },
        {
          id: "minimumSafePrice",
          label: "Minimum safe price",
          role: "target",
          dimension: "currency",
          unit: "USD",
          knowledgeLevel: "system_derived",
          requiredForOutputs: ["minimumSafePrice"],
          description: "stub",
          missingRisk: "high",
        },
      ],
      formulas: [],
      goals: [
        {
          id: "cnc-goal",
          slug: CNC_SLUG,
          targetVariable: "minimumSafePrice",
          acceptedFormulaNodes: [],
          decisionGoal: "test",
          primaryOutput: "minimumSafePrice",
        },
      ],
    });

    const aliasMap = buildOntologyAliasMap({
      contractOntology: cncContractOntology,
      fixtureOntology: CNC_QUOTE_RISK_ONTOLOGY,
      slug: CNC_SLUG,
    });

    const plan = buildOntologyAlignmentPlan({
      contractOntology: cncContractOntology,
      fixtureOntology: CNC_QUOTE_RISK_ONTOLOGY,
      aliasMap,
    });

    expect(plan.blockers.some((blocker) => blocker.includes("Production:"))).toBe(false);
    expect(plan.suggestedContractMetadataImprovements.some((line) => line.includes("Production:"))).toBe(
      false,
    );
  });
});
