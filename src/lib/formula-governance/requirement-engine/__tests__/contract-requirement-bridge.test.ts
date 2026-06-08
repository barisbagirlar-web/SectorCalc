/**
 * Phase 5H-B-2 — requirement result → contract readiness audit tests.
 */

import { describe, expect, test } from "vitest";
import { FORMULA_CONTRACTS, getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { runGovernanceAudit } from "@/lib/formula-governance/audit-runner";
import { buildFormulaInventory, summarizeInventory } from "@/lib/formula-governance/inventory";
import { buildOntologyDraftFromFormulaContract } from "@/lib/formula-governance/calculation-ontology/contract-ontology-bridge";
import { compileOntologyDraftToCalculationOntology } from "@/lib/formula-governance/calculation-ontology/ontology-compiler";
import { buildOntologyAliasMap } from "@/lib/formula-governance/calculation-ontology/ontology-alias-map";
import { buildOntologyAlignmentPlan } from "@/lib/formula-governance/calculation-ontology/ontology-alignment-plan";
import { getFixtureOntologyForSlug } from "@/lib/formula-governance/calculation-ontology/fixture-ontology-registry";
import {
  auditFormulaContractInputReadiness,
} from "@/lib/formula-governance/requirement-engine/contract-requirement-bridge";
import type { RequirementSolveResult } from "@/lib/formula-governance/requirement-engine/requirement-engine-types";

const ROOFING_SLUG = "roofing-contract-margin-guard";

function makeRequirementResult(
  overrides: Partial<RequirementSolveResult> = {},
): RequirementSolveResult {
  return {
    status: "need_more_data",
    requiredMissingInputs: [],
    optionalRecommendedInputs: [],
    advancedRecommendedInputs: [],
    defaultedInputs: [],
    acceptedAssumptions: [],
    derivedResolutionPlan: [],
    selectedFormulaPath: [],
    blockers: [],
    warnings: [],
    ...overrides,
  };
}

describe("requirement result → contract readiness audit", () => {
  test("produces input readiness audit from requirement solve result", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const ontologyDraft = buildOntologyDraftFromFormulaContract(contract);

    const audit = auditFormulaContractInputReadiness({
      contract,
      ontologyDraft,
      requirementResult: makeRequirementResult({
        status: "ready_to_calculate",
        requiredMissingInputs: [],
      }),
    });

    expect(audit.slug).toBe(ROOFING_SLUG);
    expect(audit.status).toBe("input_ready");
  });

  test("reports defaulted input as accepted assumption gap", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const ontologyDraft = buildOntologyDraftFromFormulaContract(contract);

    const audit = auditFormulaContractInputReadiness({
      contract,
      ontologyDraft,
      requirementResult: makeRequirementResult({
        defaultedInputs: ["wasteFactor"],
        acceptedAssumptions: ["Waste factor defaults to 10% when not supplied."],
      }),
    });

    expect(audit.defaultAssumptionGaps.some((gap) => gap.includes("wasteFactor"))).toBe(true);
    expect(audit.status).toBe("needs_input_design");
  });

  test("warns when derived variable is requested from user", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const ontologyDraft = buildOntologyDraftFromFormulaContract(contract);

    const audit = auditFormulaContractInputReadiness({
      contract,
      ontologyDraft,
      requirementResult: makeRequirementResult({
        requiredMissingInputs: ["baseCost"],
      }),
    });

    expect(audit.derivedInputRisks.some((risk) => risk.includes("baseCost"))).toBe(true);
    expect(audit.warnings.some((warning) => warning.includes("baseCost"))).toBe(true);
  });

  test("marks audit blocked when requirement engine is blocked", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const ontologyDraft = buildOntologyDraftFromFormulaContract(contract);

    const audit = auditFormulaContractInputReadiness({
      contract,
      ontologyDraft,
      requirementResult: makeRequirementResult({
        status: "blocked",
        blockers: ["Circular dependency detected."],
      }),
    });

    expect(audit.status).toBe("blocked");
    expect(audit.blockers.some((blocker) => blocker.includes("Circular"))).toBe(true);
  });

  test("preserves existing behavior when alias and alignment plan are omitted", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const ontologyDraft = buildOntologyDraftFromFormulaContract(contract);

    const audit = auditFormulaContractInputReadiness({
      contract,
      ontologyDraft,
      requirementResult: makeRequirementResult({
        status: "ready_to_calculate",
        requiredMissingInputs: [],
      }),
    });

    expect(audit.alignmentSummary).toBeUndefined();
    expect(audit.status).toBe("input_ready");
    expect(audit.missingInputMetadata).toEqual([]);
  });

  test("enriches readiness audit with migration risk when alignment is provided", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const ontologyDraft = buildOntologyDraftFromFormulaContract(contract);
    const compiled = compileOntologyDraftToCalculationOntology(ontologyDraft);
    const fixtureOntology = getFixtureOntologyForSlug(ROOFING_SLUG)!;

    const aliasMap = buildOntologyAliasMap({
      contractOntology: compiled.ontology!,
      fixtureOntology,
      slug: ROOFING_SLUG,
    });
    const alignmentPlan = buildOntologyAlignmentPlan({
      contractOntology: compiled.ontology!,
      fixtureOntology,
      aliasMap,
    });

    const audit = auditFormulaContractInputReadiness({
      contract,
      ontologyDraft,
      requirementResult: makeRequirementResult({
        status: "need_more_data",
        requiredMissingInputs: ["materialCost", "laborHours"],
      }),
      aliasMap,
      alignmentPlan,
    });

    expect(audit.alignmentSummary).toBeDefined();
    expect(audit.alignmentSummary?.migrationRisk).toBeGreaterThan(0);
    expect(audit.alignmentSummary?.driftGateStatus).toBe("needs_review");
    expect(
      audit.alignmentSummary?.variableAliasContexts.some(
        (context) =>
          context.contractVariableId === "materialCost" &&
          context.professionalOntologyAlias === "materialCostPerSquare",
      ),
    ).toBe(true);
    expect(audit.warnings.some((warning) => warning.includes("drift gate"))).toBe(true);
  });

  test("keeps contract shape as source of truth for missing input decisions", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const ontologyDraft = buildOntologyDraftFromFormulaContract(contract);
    const compiled = compileOntologyDraftToCalculationOntology(ontologyDraft);
    const fixtureOntology = getFixtureOntologyForSlug(ROOFING_SLUG)!;
    const aliasMap = buildOntologyAliasMap({
      contractOntology: compiled.ontology!,
      fixtureOntology,
      slug: ROOFING_SLUG,
    });
    const alignmentPlan = buildOntologyAlignmentPlan({
      contractOntology: compiled.ontology!,
      fixtureOntology,
      aliasMap,
    });

    const withoutAlignment = auditFormulaContractInputReadiness({
      contract,
      ontologyDraft,
      requirementResult: makeRequirementResult({
        status: "need_more_data",
        requiredMissingInputs: ["materialCost"],
      }),
    });

    const withAlignment = auditFormulaContractInputReadiness({
      contract,
      ontologyDraft,
      requirementResult: makeRequirementResult({
        status: "need_more_data",
        requiredMissingInputs: ["materialCost"],
      }),
      aliasMap,
      alignmentPlan,
    });

    expect(withAlignment.status).toBe(withoutAlignment.status);
    expect(withAlignment.missingInputMetadata).toEqual(withoutAlignment.missingInputMetadata);
    expect(withAlignment.missingInputMetadata.some((gap) => gap.includes("materialCost"))).toBe(
      false,
    );
  });

  test("does not change existing formula audit contract and failure counts", () => {
    const inventoryBefore = summarizeInventory(buildFormulaInventory());
    const report = runGovernanceAudit({ strict: false });

    expect(FORMULA_CONTRACTS.length).toBe(120);
    expect(inventoryBefore.criticalMissingContracts.length).toBeGreaterThanOrEqual(15);
    expect(inventoryBefore.criticalMissingContracts.length).toBeLessThanOrEqual(25);

    const failCount = report.results.filter((result) => result.status === "FAIL").length;
    const oraclePassCount = report.results.filter((result) =>
      result.findings.some((finding) => finding.code === "ORACLE_COMPARISON_PASS"),
    ).length;

    expect(failCount).toBe(0);
    expect(oraclePassCount).toBeGreaterThan(110);
    expect(report.criticalToolsWithoutContract.length).toBe(
      inventoryBefore.criticalMissingContracts.length,
    );
  });
});
