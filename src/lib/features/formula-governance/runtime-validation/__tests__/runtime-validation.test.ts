import { describe, expect, test } from "vitest";
import { ROOFING_CONTRACT_MARGIN_ONTOLOGY } from "@/lib/features/formula-governance/calculation-ontology";
import { getFormulaById } from "@/lib/features/formula-governance/calculation-ontology/formula-graph";
import {
  runCalculationIntelligenceLoop,
  validateCalculationInputsAndResult,
} from "@/lib/features/formula-governance/runtime-validation";

const COMPLETE_ROOFING_INPUTS = {
  roofSquares: 24,
  materialCostPerSquare: 350,
  laborCostPerSquare: 180,
  wasteFactor: 10,
  tearOffCost: 1200,
  permitCost: 250,
  overheadPercent: 15,
  riskBufferPercent: 10,
  targetMarginPercent: 25,
};

function computeRoofingFixtureResult(inputs: typeof COMPLETE_ROOFING_INPUTS) {
  const baseCost =
    inputs.roofSquares *
      (inputs.materialCostPerSquare + inputs.laborCostPerSquare) *
      (1 + inputs.wasteFactor / 100) +
    inputs.tearOffCost +
    inputs.permitCost;
  const riskAdjustedCost = baseCost * (1 + inputs.overheadPercent / 100 + inputs.riskBufferPercent / 100);
  const minimumSafeContractPrice = riskAdjustedCost / (1 - inputs.targetMarginPercent / 100);
  return { baseCost, riskAdjustedCost, minimumSafeContractPrice };
}

describe("runtime validation", () => {
  test("negative currency produces error", () => {
    const formula = getFormulaById(ROOFING_CONTRACT_MARGIN_ONTOLOGY, "roofing-base-cost")!;
    const validation = validateCalculationInputsAndResult({
      ontology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
      formulaNode: formula,
      inputs: { ...COMPLETE_ROOFING_INPUTS, materialCostPerSquare: -100 },
      result: { baseCost: -100 },
    });
    expect(validation.isValid).toBe(false);
    expect(validation.errors.some((error) => error.includes("materialCostPerSquare"))).toBe(true);
  });

  test("percent above 100 produces error", () => {
    const formula = getFormulaById(ROOFING_CONTRACT_MARGIN_ONTOLOGY, "roofing-minimum-safe-price")!;
    const validation = validateCalculationInputsAndResult({
      ontology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
      formulaNode: formula,
      inputs: { ...COMPLETE_ROOFING_INPUTS, targetMarginPercent: 110 },
      result: { minimumSafeContractPrice: 10000, riskAdjustedCost: 9000, targetMarginPercent: 110 },
    });
    expect(validation.isValid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
  });

  test("catches invariant violation when safe price below adjusted cost", () => {
    const formula = getFormulaById(ROOFING_CONTRACT_MARGIN_ONTOLOGY, "roofing-minimum-safe-price")!;
    const validation = validateCalculationInputsAndResult({
      ontology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
      formulaNode: formula,
      inputs: COMPLETE_ROOFING_INPUTS,
      result: { minimumSafeContractPrice: 8000, riskAdjustedCost: 12000, targetMarginPercent: 25 },
    });
    expect(validation.invariantViolations.length).toBeGreaterThan(0);
    expect(validation.isValid).toBe(false);
  });

  test("catches dimension mismatch on margin percent", () => {
    const formula = getFormulaById(ROOFING_CONTRACT_MARGIN_ONTOLOGY, "roofing-minimum-safe-price")!;
    const validation = validateCalculationInputsAndResult({
      ontology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
      formulaNode: formula,
      inputs: { ...COMPLETE_ROOFING_INPUTS, targetMarginPercent: 100 },
      result: { minimumSafeContractPrice: 12000, riskAdjustedCost: 9000, targetMarginPercent: 100 },
    });
    expect(validation.dimensionErrors.length).toBeGreaterThan(0);
  });

  test("valid roofing result passes validation", () => {
    const formula = getFormulaById(ROOFING_CONTRACT_MARGIN_ONTOLOGY, "roofing-minimum-safe-price")!;
    const result = computeRoofingFixtureResult(COMPLETE_ROOFING_INPUTS);
    const validation = validateCalculationInputsAndResult({
      ontology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
      formulaNode: formula,
      inputs: COMPLETE_ROOFING_INPUTS,
      result,
    });
    expect(validation.isValid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });
});

describe("calculation intelligence loop", () => {
  test("returns NEED_DATA when required inputs are missing", () => {
    const loop = runCalculationIntelligenceLoop({
      ontology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
      goalId: "roofing-safe-contract-price",
      knownInputs: { roofSquares: 20 },
    });
    expect(loop.status).toBe("NEED_DATA");
  });

  test("returns READY_TO_CALCULATE when requirements are satisfied", () => {
    const loop = runCalculationIntelligenceLoop({
      ontology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
      goalId: "roofing-safe-contract-price",
      knownInputs: {
        roofSquares: 24,
        materialCostPerSquare: 350,
        laborCostPerSquare: 180,
      },
    });
    expect(loop.status).toBe("READY_TO_CALCULATE");
  });

  test("returns SUCCESS when validation passes on calculated result", () => {
    const result = computeRoofingFixtureResult(COMPLETE_ROOFING_INPUTS);
    const loop = runCalculationIntelligenceLoop({
      ontology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
      goalId: "roofing-safe-contract-price",
      knownInputs: COMPLETE_ROOFING_INPUTS,
      calculatedResult: result,
      formulaNodeId: "roofing-minimum-safe-price",
    });
    expect(loop.status).toBe("SUCCESS");
  });

  test("returns PHYSICS_OR_LOGIC_ERROR on invalid calculated result", () => {
    const loop = runCalculationIntelligenceLoop({
      ontology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
      goalId: "roofing-safe-contract-price",
      knownInputs: COMPLETE_ROOFING_INPUTS,
      calculatedResult: {
        minimumSafeContractPrice: 5000,
        riskAdjustedCost: 12000,
        targetMarginPercent: 25,
      },
      formulaNodeId: "roofing-minimum-safe-price",
    });
    expect(loop.status).toBe("PHYSICS_OR_LOGIC_ERROR");
  });
});
