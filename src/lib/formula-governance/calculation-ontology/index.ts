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
export {
  getFixtureOntologyForSlug,
  hasFixtureOntologyForSlug,
  listFixtureOntologySlugs,
} from "@/lib/formula-governance/calculation-ontology/fixture-ontology-registry";

export {
  inferVariableDimensionFromContractField,
  inferVariableKnowledgeLevelFromContractField,
  inferVariableRoleFromContractField,
  isVerdictOutput,
  normalizeContractInputsToVariables,
  normalizeContractOutputsToVariables,
  normalizeContractVariableKey,
  resolveContractTargetOutput,
} from "@/lib/formula-governance/calculation-ontology/contract-variable-normalizer";
export type {
  ContractFieldKind,
  NormalizedContractVariable,
} from "@/lib/formula-governance/calculation-ontology/contract-variable-normalizer";

export {
  compileOntologyDraftToCalculationOntology,
} from "@/lib/formula-governance/calculation-ontology/ontology-compiler";
export type { OntologyCompileResult } from "@/lib/formula-governance/calculation-ontology/ontology-compiler";

export {
  buildOntologyDraftFromFormulaContract,
} from "@/lib/formula-governance/calculation-ontology/contract-ontology-bridge";
export type {
  OntologyDraft,
  OntologyFormulaNodeDraft,
  OntologyGoalDraft,
  OntologyVariableDraft,
} from "@/lib/formula-governance/calculation-ontology/contract-ontology-bridge";

export {
  attachProductionSourceToOntologyDraft,
  buildOntologyDraftWithProductionSource,
  buildProductionSourceReference,
} from "@/lib/formula-governance/calculation-ontology/production-source-reference";

export type {
  BuildOntologyAliasMapParams,
  CompositeOntologyAlias,
  OntologyAliasConfidence,
  OntologyAliasMap,
  OntologyAliasSource,
  OntologyVariableAlias,
} from "@/lib/formula-governance/calculation-ontology/ontology-alias-types";

export { buildOntologyAliasMap } from "@/lib/formula-governance/calculation-ontology/ontology-alias-map";

export {
  buildOntologyAlignmentPlan,
} from "@/lib/formula-governance/calculation-ontology/ontology-alignment-plan";
export type {
  AlignmentStatus,
  BuildOntologyAlignmentPlanParams,
  ManualReviewItem,
  OntologyAlignmentPlan,
} from "@/lib/formula-governance/calculation-ontology/ontology-alignment-plan";
export type {
  OntologyDraftWithProductionSource,
  ProductionSourceReference,
} from "@/lib/formula-governance/calculation-ontology/production-source-reference";
