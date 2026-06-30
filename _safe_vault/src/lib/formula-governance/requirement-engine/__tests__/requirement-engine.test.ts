import { describe, expect, test } from "vitest";
import { ROOFING_CONTRACT_MARGIN_ONTOLOGY } from "@/lib/formula-governance/calculation-ontology";
import { getFormulaById } from "@/lib/formula-governance/calculation-ontology/formula-graph";
import {
  buildInputDesignFromRequirementResult,
  resolveInverseRequirement,
  solveRequiredInputs,
} from "@/lib/formula-governance/requirement-engine";

describe("requirement engine roofing fixture", () => {
  test("finds missing required inputs for minimumSafeContractPrice", () => {
    const result = solveRequiredInputs({
      ontology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
      goalId: "roofing-safe-contract-price",
      knownInputs: { roofSquares: 24 },
    });

    expect(result.status).toBe("need_more_data");
    expect(result.requiredMissingInputs).toContain("materialCostPerSquare");
    expect(result.requiredMissingInputs).toContain("laborCostPerSquare");
    expect(result.requiredMissingInputs).not.toContain("baseCost");
    expect(result.requiredMissingInputs).not.toContain("riskAdjustedCost");
  });

  test("returns ready_to_calculate when user-known inputs are complete", () => {
    const result = solveRequiredInputs({
      ontology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
      goalId: "roofing-safe-contract-price",
      knownInputs: {
        roofSquares: 24,
        materialCostPerSquare: 350,
        laborCostPerSquare: 180,
      },
    });

    expect(result.status).toBe("ready_to_calculate");
    expect(result.requiredMissingInputs).toHaveLength(0);
    expect(result.selectedFormulaPath.length).toBeGreaterThan(0);
  });

  test("marks defaultable inputs as defaulted with accepted assumptions", () => {
    const result = solveRequiredInputs({
      ontology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
      goalId: "roofing-safe-contract-price",
      knownInputs: {
        roofSquares: 20,
        materialCostPerSquare: 320,
        laborCostPerSquare: 160,
      },
    });

    expect(result.defaultedInputs).toContain("wasteFactor");
    expect(result.defaultedInputs).toContain("targetMarginPercent");
    expect(result.acceptedAssumptions.length).toBeGreaterThan(0);
  });

  test("does not ask user for derived variables", () => {
    const result = solveRequiredInputs({
      ontology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
      goalId: "roofing-safe-contract-price",
      knownInputs: { roofSquares: 18 },
    });

    expect(result.requiredMissingInputs).not.toContain("baseCost");
    expect(result.requiredMissingInputs).not.toContain("minimumSafeContractPrice");
    expect(result.derivedResolutionPlan.length).toBeGreaterThan(0);
  });
});

describe("inverse problem resolver", () => {
  test("works for reversible formula inverse mapping", () => {
    const formula = getFormulaById(ROOFING_CONTRACT_MARGIN_ONTOLOGY, "roofing-minimum-safe-price");
    expect(formula).toBeDefined();
    const inverse = resolveInverseRequirement({
      formulaNode: formula!,
      targetVariable: "targetMarginPercent",
      knownInputs: {
        minimumSafeContractPrice: 15000,
        riskAdjustedCost: 11000,
      },
    });

    expect(inverse.status).toBe("resolved");
    expect(inverse.requiredInputs).toContain("minimumSafeContractPrice");
    expect(inverse.requiredInputs).toContain("riskAdjustedCost");
  });

  test("blocks non-reversible formula inverse requests", () => {
    const formula = getFormulaById(ROOFING_CONTRACT_MARGIN_ONTOLOGY, "roofing-base-cost");
    expect(formula).toBeDefined();
    const inverse = resolveInverseRequirement({
      formulaNode: formula!,
      targetVariable: "roofSquares",
      knownInputs: {},
    });

    expect(inverse.status).toBe("blocked");
    expect(inverse.blockers.length).toBeGreaterThan(0);
  });
});

describe("input design bridge", () => {
  test("carries required and defaulted separation into ToolInputDesign adapter", () => {
    const requirement = solveRequiredInputs({
      ontology: ROOFING_CONTRACT_MARGIN_ONTOLOGY,
      goalId: "roofing-safe-contract-price",
      knownInputs: { roofSquares: 22 },
    });

    const design = buildInputDesignFromRequirementResult(requirement, ROOFING_CONTRACT_MARGIN_ONTOLOGY);
    expect(design.requiredFields.map((field) => field.variableId)).toEqual(
      expect.arrayContaining(["materialCostPerSquare", "laborCostPerSquare"]),
    );
    expect(design.defaultedFields.map((field) => field.variableId).length).toBeGreaterThan(0);
    expect(design.acceptedAssumptions.length).toBeGreaterThan(0);
  });
});
