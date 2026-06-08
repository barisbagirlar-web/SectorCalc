/**
 * Phase 5H-B-4 — contract-mode runtime intelligence loop tests.
 */

import { describe, expect, test } from "vitest";
import { FORMULA_CONTRACTS, getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { runGovernanceAudit } from "@/lib/formula-governance/audit-runner";
import { buildFormulaInventory, summarizeInventory } from "@/lib/formula-governance/inventory";
import { runContractCalculationIntelligenceLoop } from "@/lib/formula-governance/runtime-validation/contract-runtime-loop";

const ROOFING_SLUG = "roofing-contract-margin-guard";
const CNC_SLUG = "cnc-quote-risk-analyzer";

const ROOFING_COMPLETE_INPUTS = {
  materialCost: 12000,
  laborHours: 32,
  laborRate: 48,
  tearOffCost: 800,
  dumpFees: 400,
  weatherDelayRiskPercent: 5,
  targetMargin: 25,
} as const;

const ROOFING_VALID_RESULT = {
  baseCost: 18000,
  p90Cost: 19800,
  minimumSafePrice: 24000,
};

const ROOFING_INVALID_RESULT = {
  baseCost: 18000,
  p90Cost: 19800,
  minimumSafePrice: -500,
};

describe("contract-mode runtime intelligence loop", () => {
  test("roofing empty knownInputs returns NEED_DATA", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const loop = runContractCalculationIntelligenceLoop({
      contract,
      knownInputs: {},
    });

    expect(loop.status).toBe("NEED_DATA");
    expect(loop.requiredMissingInputs.length).toBeGreaterThan(0);
    expect(loop.requiredMissingInputs).not.toContain("baseCost");
    expect(loop.requiredMissingInputs).not.toContain("p90Cost");
    expect(loop.requiredMissingInputs).not.toContain("minimumSafePrice");
  });

  test("roofing minimum knownInputs returns READY_TO_CALCULATE", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const loop = runContractCalculationIntelligenceLoop({
      contract,
      knownInputs: { ...ROOFING_COMPLETE_INPUTS },
    });

    expect(loop.status).toBe("READY_TO_CALCULATE");
    expect(loop.requiredMissingInputs).toHaveLength(0);
    expect(loop.requirementStatus).toBe("ready_to_calculate");
    expect(loop.ontologyStatus).toBe("compiled");
  });

  test("roofing valid mock calculatedResult returns SUCCESS", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const loop = runContractCalculationIntelligenceLoop({
      contract,
      knownInputs: { ...ROOFING_COMPLETE_INPUTS },
      calculatedResult: { ...ROOFING_VALID_RESULT },
    });

    expect(loop.status).toBe("SUCCESS");
    expect(loop.validationResult?.isValid).toBe(true);
    expect(loop.validationResult?.errors).toHaveLength(0);
  });

  test("roofing invalid negative result returns PHYSICS_OR_LOGIC_ERROR", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const loop = runContractCalculationIntelligenceLoop({
      contract,
      knownInputs: { ...ROOFING_COMPLETE_INPUTS },
      calculatedResult: { ...ROOFING_INVALID_RESULT },
    });

    expect(loop.status).toBe("PHYSICS_OR_LOGIC_ERROR");
    expect(loop.validationResult?.isValid).toBe(false);
    expect(loop.validationResult?.errors.length).toBeGreaterThan(0);
  });

  test("does not request derived outputs as missing user inputs", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const loop = runContractCalculationIntelligenceLoop({
      contract,
      knownInputs: {
        materialCost: 9000,
        laborHours: 20,
        laborRate: 45,
      },
    });

    expect(loop.requiredMissingInputs).not.toContain("baseCost");
    expect(loop.requiredMissingInputs).not.toContain("p90Cost");
    expect(loop.readinessAudit.derivedInputRisks).toHaveLength(0);
  });

  test("carries defaulted and accepted assumptions in response", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const loop = runContractCalculationIntelligenceLoop({
      contract,
      knownInputs: { ...ROOFING_COMPLETE_INPUTS },
      calculatedResult: { ...ROOFING_VALID_RESULT },
    });

    expect(loop.acceptedAssumptions.length + loop.warnings.length).toBeGreaterThan(0);
    expect(loop.readinessAudit.slug).toBe(ROOFING_SLUG);
    expect(loop.readinessAudit.status).toBe("input_ready");
  });

  test("returns BLOCKED when contract pipeline has blockers", () => {
    const contract = getFormulaContractBySlug(CNC_SLUG)!;
    const loop = runContractCalculationIntelligenceLoop({
      contract: {
        ...contract,
        assumptions: contract.assumptions.filter((line) => !line.startsWith("Production:")),
      },
      knownInputs: {},
    });

    expect(loop.status).toBe("BLOCKED");
    expect(loop.blockers.some((blocker) => blocker.includes("Production:"))).toBe(true);
    expect(loop.requirementStatus).toBe("skipped");
  });

  test("does not import or execute production calculators", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const loop = runContractCalculationIntelligenceLoop({
      contract,
      knownInputs: { ...ROOFING_COMPLETE_INPUTS },
      calculatedResult: { ...ROOFING_VALID_RESULT },
    });

    expect(loop.productionSource?.calculatorEntry).toContain("calcRoofing");
    expect(loop.warnings.some((warning) => warning.includes("calculator not imported"))).toBe(
      true,
    );
    expect(loop.status).toBe("SUCCESS");
  });

  test("does not change existing audit metrics", () => {
    const inventory = summarizeInventory(buildFormulaInventory());
    const report = runGovernanceAudit({ strict: false });

    expect(FORMULA_CONTRACTS.length).toBe(131);
    expect(inventory.criticalMissingContracts.length).toBeGreaterThanOrEqual(0);
    expect(inventory.criticalMissingContracts.length).toBeLessThanOrEqual(5);
    expect(report.results.filter((entry) => entry.status === "FAIL").length).toBe(0);
  });
});
