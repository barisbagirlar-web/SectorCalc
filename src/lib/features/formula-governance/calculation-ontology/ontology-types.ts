/**
 * Calculation ontology types - Mind 2 variable/formula graph (Phase 5H-B-1).
 */

export type VariableRole = "input" | "derived" | "constant" | "target";

export type VariableKnowledgeLevel =
  | "user_known"
  | "estimable"
  | "defaultable"
  | "system_derived"
  | "expert_required";

export type VariableDimension =
  | "currency"
  | "percent"
  | "count"
  | "length"
  | "area"
  | "volume"
  | "time"
  | "rate"
  | "mass"
  | "energy"
  | "power"
  | "temperature"
  | "dimensionless";

export type MissingRisk = "low" | "medium" | "high";

export type VariableConstraint = {
  readonly min?: number;
  readonly max?: number;
  readonly integer?: boolean;
  readonly nonNegative?: boolean;
};

export type CalculationVariable = {
  readonly id: string;
  readonly label: string;
  readonly role: VariableRole;
  readonly dimension: VariableDimension;
  readonly unit: string;
  readonly knowledgeLevel: VariableKnowledgeLevel;
  readonly requiredForOutputs: readonly string[];
  readonly constraints?: VariableConstraint;
  readonly defaultValue?: number;
  readonly description: string;
  readonly missingRisk: MissingRisk;
};

export type FormulaType = "expression" | "ratio" | "aggregate";

export type InverseMapping = {
  readonly solvedVariable: string;
  readonly requiredInputs: readonly string[];
  readonly divisionRisk?: boolean;
};

export type FormulaNode = {
  readonly id: string;
  readonly label: string;
  readonly outputVariable: string;
  readonly requiredInputs: readonly string[];
  readonly optionalInputs?: readonly string[];
  readonly formulaType: FormulaType;
  readonly reversible: boolean;
  readonly inverseMappings?: readonly InverseMapping[];
  readonly expression: string;
  readonly assumptions: readonly string[];
  readonly limitations: readonly string[];
  readonly invariants: readonly string[];
  readonly tolerance?: number;
};

export type CalculationGoal = {
  readonly id: string;
  readonly slug: string;
  readonly targetVariable: string;
  readonly acceptedFormulaNodes: readonly string[];
  readonly decisionGoal: string;
  readonly primaryOutput: string;
  readonly secondaryOutputs?: readonly string[];
};

export type CalculationOntology = {
  readonly slug: string;
  readonly sector: string;
  readonly variables: readonly CalculationVariable[];
  readonly formulas: readonly FormulaNode[];
  readonly goals: readonly CalculationGoal[];
  readonly defaultAssumptions: readonly string[];
  readonly professionalUpgradeVariables?: readonly string[];
};

export type DependencyEdge = {
  readonly from: string;
  readonly to: string;
  readonly formulaNodeId: string;
};

export type DependencyGraph = {
  readonly variableIds: readonly string[];
  readonly edges: readonly DependencyEdge[];
  readonly formulaByOutput: Readonly<Record<string, string>>;
};

export type DependencyGraphIssue = {
  readonly code: "CIRCULAR_DEPENDENCY" | "UNREACHABLE_TARGET";
  readonly message: string;
  readonly variableIds: readonly string[];
};
