export type {
  CalculationGoal,
  CalculationOntology,
  CalculationVariable,
  DependencyEdge,
  DependencyGraph,
  DependencyGraphIssue,
  FormulaNode,
  FormulaType,
  InverseMapping,
  MissingRisk,
  VariableConstraint,
  VariableDimension,
  VariableKnowledgeLevel,
  VariableRole,
} from "@/lib/formula-governance/calculation-ontology/ontology-types";

export {
  buildDependencyGraph,
  detectCircularDependencies,
  detectUnreachableTargetVariables,
  getDependenciesForTarget,
  getDerivedVariableChain,
  getFormulaCandidatesForTarget,
} from "@/lib/formula-governance/calculation-ontology/dependency-graph";

export {
  getAcceptedFormulaCandidatesForGoal,
  getFormulaById,
  getFormulaByOutputVariable,
  getFormulaCandidatesForOutput,
  topologicalFormulaOrder,
} from "@/lib/formula-governance/calculation-ontology/formula-graph";

export {
  createOntology,
  listFormulaNodesForVariable,
  listUserFacingVariables,
  validateOntologyStructure,
} from "@/lib/formula-governance/calculation-ontology/ontology-builder";
export type { OntologyValidationResult } from "@/lib/formula-governance/calculation-ontology/ontology-builder";

export { ROOFING_CONTRACT_MARGIN_ONTOLOGY } from "@/lib/formula-governance/calculation-ontology/fixtures/roofing-contract-margin-ontology";
export { CNC_QUOTE_RISK_ONTOLOGY } from "@/lib/formula-governance/calculation-ontology/fixtures/cnc-quote-risk-ontology";
