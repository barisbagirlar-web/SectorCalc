/**
 * Phase 5H-B-3 — contract requirement runner tests.
 */

import { describe, expect, test } from "vitest";
import { FORMULA_CONTRACTS, getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { runGovernanceAudit } from "@/lib/formula-governance/audit-runner";
import { buildFormulaInventory, summarizeInventory } from "@/lib/formula-governance/inventory";
import { compileOntologyDraftToCalculationOntology } from "@/lib/formula-governance/calculation-ontology/ontology-compiler";
import { buildOntologyDraftFromFormulaContract } from "@/lib/formula-governance/calculation-ontology/contract-ontology-bridge";
import { buildOntologyDraftWithProductionSource } from "@/lib/formula-governance/calculation-ontology/production-source-reference";
import { runRequirementEngineForContract } from "@/lib/formula-governance/requirement-engine/contract-requirement-runner";

const ROOFING_SLUG = "roofing-contract-margin-guard";
const CNC_SLUG = "cnc-quote-risk-analyzer";

const ROOFING_CRITICAL_INPUTS = [
  "materialCost",
  "laborHours",
  "laborRate",
  "tearOffCost",
  "dumpFees",
  "weatherDelayRiskPercent",
  "targetMargin",
] as const;

describe("contract requirement runner", () => {
  test("compiles contract-derived ontology for roofing-contract-margin-guard", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const draft = buildOntologyDraftWithProductionSource(
      ROOFING_SLUG,
      buildOntologyDraftFromFormulaContract(contract),
    );
    const compiled = compileOntologyDraftToCalculationOntology(draft);

    expect(compiled.ontology).not.toBeNull();
    expect(compiled.ontology?.variables.map((variable) => variable.id)).toEqual(
      expect.arrayContaining([...ROOFING_CRITICAL_INPUTS]),
    );
  });

  test("produces roofing pilot requirement result on contract variable IDs", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const result = runRequirementEngineForContract({
      contract,
      knownInputs: {},
    });

    expect(result.ontologyStatus).toBe("compiled");
    expect(result.requirementStatus).toBe("need_more_data");
    expect(result.requiredMissingInputs).toEqual(
      expect.arrayContaining([...ROOFING_CRITICAL_INPUTS]),
    );
    expect(result.requiredMissingInputs).not.toContain("baseCost");
    expect(result.requiredMissingInputs).not.toContain("p90Cost");
    expect(result.requiredMissingInputs).not.toContain("minimumSafePrice");
  });

  test("does not request derived outputs from user", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const partial = runRequirementEngineForContract({
      contract,
      knownInputs: {
        materialCost: 5000,
        laborHours: 40,
        laborRate: 55,
      },
    });

    expect(partial.requiredMissingInputs).not.toContain("baseCost");
    expect(partial.requiredMissingInputs).not.toContain("p90Cost");
    expect(partial.readinessAudit.derivedInputRisks).toHaveLength(0);
  });

  test("reports partial known inputs as remaining required contract fields", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const result = runRequirementEngineForContract({
      contract,
      knownInputs: {
        materialCost: 12000,
        laborHours: 32,
        laborRate: 48,
      },
    });

    expect(result.requiredMissingInputs).toEqual(
      expect.arrayContaining(["tearOffCost", "dumpFees", "weatherDelayRiskPercent", "targetMargin"]),
    );
    expect(result.requiredMissingInputs).not.toContain("materialCost");
    expect(result.requiredMissingInputs).not.toContain("laborHours");
    expect(result.requiredMissingInputs).not.toContain("laborRate");
  });

  test("produces input readiness audit status for roofing pilot", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const result = runRequirementEngineForContract({
      contract,
      knownInputs: { materialCost: 8000 },
    });

    expect(result.readinessAudit.slug).toBe(ROOFING_SLUG);
    expect(result.readinessAudit.status).toBe("needs_input_design");
    expect(result.readinessAudit.missingInputMetadata.length).toBe(0);
  });

  test("carries production source reference as metadata only", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const result = runRequirementEngineForContract({ contract, knownInputs: {} });

    expect(result.productionSource?.calculatorEntry).toContain("calcRoofing");
    expect(result.productionSource?.productionFilePath).toContain("premium-decision-engine.ts");
  });

  test("preserves CNC metadata blocker while still reporting readiness audit", () => {
    const contract = getFormulaContractBySlug(CNC_SLUG)!;
    const result = runRequirementEngineForContract({ contract, knownInputs: {} });

    expect(result.blockers.some((blocker) => blocker.includes("Production:"))).toBe(true);
    expect(result.readinessAudit.slug).toBe(CNC_SLUG);
    expect(result.requirementStatus).toBe("skipped");
  });

  test("does not import or execute production calculators", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const result = runRequirementEngineForContract({ contract, knownInputs: {} });

    expect(result.ontologyStatus).toBe("compiled");
    expect(result.warnings.some((warning) => warning.includes("calculator not imported"))).toBe(
      true,
    );
  });

  test("input design bridge separates required, defaulted and derived fields", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const result = runRequirementEngineForContract({
      contract,
      knownInputs: { materialCost: 10000, laborHours: 20 },
    });

    expect(result.inputDesign).toBeDefined();
    expect(result.inputDesign?.requiredFields.length).toBeGreaterThan(0);
    expect(result.inputDesign?.requiredFields.every((field) => field.derived !== true)).toBe(true);
    expect(result.inputDesign?.requiredFields[0]?.dimension).toBeTruthy();
    expect(result.inputDesign?.requiredFields[0]?.unit).toBeTruthy();
  });

  test("does not change existing audit metrics", () => {
    const inventory = summarizeInventory(buildFormulaInventory());
    const report = runGovernanceAudit({ strict: false });

    expect(FORMULA_CONTRACTS.length).toBe(41);
    expect(inventory.criticalMissingContracts.length).toBeGreaterThanOrEqual(23);
    expect(inventory.criticalMissingContracts.length).toBeLessThanOrEqual(27);
    expect(report.results.filter((entry) => entry.status === "FAIL").length).toBe(0);
  });
});
