/**
 * Requirement engine types — Mind 2 outputs (Phase 5H-B-1).
 */

export type RequirementSolveStatus = "ready_to_calculate" | "need_more_data" | "blocked";

export type DerivedResolutionStep = {
  readonly variableId: string;
  readonly formulaNodeId: string;
  readonly requiredInputs: readonly string[];
};

export type RequirementSolveResult = {
  readonly status: RequirementSolveStatus;
  readonly requiredMissingInputs: readonly string[];
  readonly optionalRecommendedInputs: readonly string[];
  readonly advancedRecommendedInputs: readonly string[];
  readonly defaultedInputs: readonly string[];
  readonly acceptedAssumptions: readonly string[];
  readonly derivedResolutionPlan: readonly DerivedResolutionStep[];
  readonly selectedFormulaPath: readonly string[];
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
};

export type InverseRequirementStatus = "resolved" | "blocked" | "warning";

export type InverseRequirementResult = {
  readonly status: InverseRequirementStatus;
  readonly solvedVariable?: string;
  readonly requiredInputs: readonly string[];
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
};

export type KnownInputs = Readonly<Record<string, number>>;

export type SolveRequiredInputsParams = {
  readonly ontology: import("@/lib/features/formula-governance/calculation-ontology/ontology-types").CalculationOntology;
  readonly goalId: string;
  readonly knownInputs: KnownInputs;
};

export type ResolveInverseRequirementParams = {
  readonly formulaNode: import("@/lib/features/formula-governance/calculation-ontology/ontology-types").FormulaNode;
  readonly targetVariable: string;
  readonly knownInputs: KnownInputs;
};
