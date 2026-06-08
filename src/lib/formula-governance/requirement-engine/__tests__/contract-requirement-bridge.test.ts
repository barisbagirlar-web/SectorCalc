/**
 * Phase 5H-B-2 — requirement result → contract readiness audit tests.
 */

import { describe, expect, test } from "vitest";
import { FORMULA_CONTRACTS, getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { runGovernanceAudit } from "@/lib/formula-governance/audit-runner";
import { buildFormulaInventory, summarizeInventory } from "@/lib/formula-governance/inventory";
import { buildOntologyDraftFromFormulaContract } from "@/lib/formula-governance/calculation-ontology/contract-ontology-bridge";
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

  test("does not change existing formula audit contract and failure counts", () => {
    const inventoryBefore = summarizeInventory(buildFormulaInventory());
    const report = runGovernanceAudit({ strict: false });

    expect(FORMULA_CONTRACTS.length).toBe(41);
    expect(inventoryBefore.criticalMissingContracts.length).toBeGreaterThanOrEqual(23);
    expect(inventoryBefore.criticalMissingContracts.length).toBeLessThanOrEqual(27);

    const failCount = report.results.filter((result) => result.status === "FAIL").length;
    const oraclePassCount = report.results.filter((result) =>
      result.findings.some((finding) => finding.code === "ORACLE_COMPARISON_PASS"),
    ).length;

    expect(failCount).toBe(0);
    expect(oraclePassCount).toBeGreaterThan(30);
    expect(report.criticalToolsWithoutContract.length).toBe(
      inventoryBefore.criticalMissingContracts.length,
    );
  });
});
