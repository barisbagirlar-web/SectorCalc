import { describe, expect, test } from "vitest";
import {
  buildDependencyGraph,
  CNC_QUOTE_RISK_ONTOLOGY,
  detectCircularDependencies,
  detectUnreachableTargetVariables,
  getDependenciesForTarget,
  getDerivedVariableChain,
  getFormulaCandidatesForTarget,
  ROOFING_CONTRACT_MARGIN_ONTOLOGY,
} from "@/lib/formula-governance/calculation-ontology";
import type { CalculationOntology } from "@/lib/formula-governance/calculation-ontology/ontology-types";

const CIRCULAR_ONTOLOGY: CalculationOntology = {
  slug: "circular-test",
  sector: "test",
  defaultAssumptions: [],
  variables: [
    {
      id: "a",
      label: "A",
      role: "derived",
      dimension: "currency",
      unit: "USD",
      knowledgeLevel: "system_derived",
      requiredForOutputs: ["c"],
      description: "A",
      missingRisk: "low",
    },
    {
      id: "b",
      label: "B",
      role: "derived",
      dimension: "currency",
      unit: "USD",
      knowledgeLevel: "system_derived",
      requiredForOutputs: ["c"],
      description: "B",
      missingRisk: "low",
    },
    {
      id: "c",
      label: "C",
      role: "target",
      dimension: "currency",
      unit: "USD",
      knowledgeLevel: "system_derived",
      requiredForOutputs: ["c"],
      description: "C",
      missingRisk: "low",
    },
  ],
  formulas: [
    {
      id: "f-a",
      label: "F A",
      outputVariable: "a",
      requiredInputs: ["b"],
      formulaType: "expression",
      reversible: false,
      expression: "b",
      assumptions: [],
      limitations: [],
      invariants: [],
    },
    {
      id: "f-b",
      label: "F B",
      outputVariable: "b",
      requiredInputs: ["a"],
      formulaType: "expression",
      reversible: false,
      expression: "a",
      assumptions: [],
      limitations: [],
      invariants: [],
    },
    {
      id: "f-c",
      label: "F C",
      outputVariable: "c",
      requiredInputs: ["a"],
      formulaType: "expression",
      reversible: false,
      expression: "a",
      assumptions: [],
      limitations: [],
      invariants: [],
    },
  ],
  goals: [
    {
      id: "goal-c",
      slug: "circular-test",
      targetVariable: "c",
      acceptedFormulaNodes: ["f-c"],
      decisionGoal: "test",
      primaryOutput: "c",
    },
  ],
};

const UNREACHABLE_ONTOLOGY: CalculationOntology = {
  slug: "unreachable-test",
  sector: "test",
  defaultAssumptions: [],
  variables: [
    {
      id: "orphanTarget",
      label: "Orphan",
      role: "target",
      dimension: "currency",
      unit: "USD",
      knowledgeLevel: "system_derived",
      requiredForOutputs: ["orphanTarget"],
      description: "orphan",
      missingRisk: "low",
    },
  ],
  formulas: [],
  goals: [
    {
      id: "orphan-goal",
      slug: "unreachable-test",
      targetVariable: "orphanTarget",
      acceptedFormulaNodes: [],
      decisionGoal: "test",
      primaryOutput: "orphanTarget",
    },
  ],
};

describe("calculation ontology dependency graph", () => {
  test("roofing dependency graph extracts target dependencies", () => {
    const deps = getDependenciesForTarget(
      ROOFING_CONTRACT_MARGIN_ONTOLOGY,
      "minimumSafeContractPrice",
    );
    expect(deps).toContain("roofSquares");
    expect(deps).toContain("materialCostPerSquare");
    expect(deps).toContain("laborCostPerSquare");
    expect(deps).toContain("baseCost");
    expect(deps).toContain("riskAdjustedCost");
  });

  test("cnc dependency graph extracts target dependencies", () => {
    const deps = getDependenciesForTarget(CNC_QUOTE_RISK_ONTOLOGY, "minimumSafeQuotePrice");
    expect(deps).toContain("materialCost");
    expect(deps).toContain("machineHours");
    expect(deps).toContain("baseCost");
    expect(deps).toContain("riskAdjustedCost");
  });

  test("detects circular dependencies", () => {
    const issues = detectCircularDependencies(CIRCULAR_ONTOLOGY);
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0]?.code).toBe("CIRCULAR_DEPENDENCY");
  });

  test("detects unreachable target variables", () => {
    const issues = detectUnreachableTargetVariables(UNREACHABLE_ONTOLOGY);
    expect(issues.some((issue) => issue.code === "UNREACHABLE_TARGET")).toBe(true);
  });

  test("extracts derived variable chain", () => {
    const chain = getDerivedVariableChain(
      ROOFING_CONTRACT_MARGIN_ONTOLOGY,
      "minimumSafeContractPrice",
    );
    expect(chain).toContain("riskAdjustedCost");
    expect(chain).toContain("baseCost");
  });

  test("buildDependencyGraph indexes formula outputs", () => {
    const graph = buildDependencyGraph(ROOFING_CONTRACT_MARGIN_ONTOLOGY);
    expect(graph.formulaByOutput.minimumSafeContractPrice).toBe("roofing-minimum-safe-price");
    expect(getFormulaCandidatesForTarget(ROOFING_CONTRACT_MARGIN_ONTOLOGY, "baseCost")).toContain(
      "roofing-base-cost",
    );
  });
});
