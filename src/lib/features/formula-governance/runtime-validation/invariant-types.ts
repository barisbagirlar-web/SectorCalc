/**
 * Runtime validation types — Mind 1 loop outputs (Phase 5H-B-1).
 */

import type { CalculationOntology, FormulaNode } from "@/lib/features/formula-governance/calculation-ontology/ontology-types";

export type CalculationValues = Readonly<Record<string, number>>;

export type ValidationResult = {
  readonly isValid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
  readonly invariantViolations: readonly string[];
  readonly dimensionErrors: readonly string[];
};

export type ValidateCalculationParams = {
  readonly ontology: CalculationOntology;
  readonly formulaNode: FormulaNode;
  readonly inputs: CalculationValues;
  readonly result: CalculationValues;
};

export type CalculationIntelligenceStatus =
  | "NEED_DATA"
  | "READY_TO_CALCULATE"
  | "PHYSICS_OR_LOGIC_ERROR"
  | "SUCCESS"
  | "BLOCKED";

export type CalculationIntelligenceLoopParams = {
  readonly ontology: CalculationOntology;
  readonly goalId: string;
  readonly knownInputs: CalculationValues;
  readonly formulaNodeId?: string;
  readonly calculatedResult?: CalculationValues;
};

export type CalculationIntelligenceLoopResult = {
  readonly status: CalculationIntelligenceStatus;
  readonly requirement: import("@/lib/features/formula-governance/requirement-engine/requirement-engine-types").RequirementSolveResult;
  readonly validation?: ValidationResult;
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
};
