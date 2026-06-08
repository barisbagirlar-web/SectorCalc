export type {
  DerivedResolutionStep,
  InverseRequirementResult,
  InverseRequirementStatus,
  KnownInputs,
  RequirementSolveResult,
  RequirementSolveStatus,
  ResolveInverseRequirementParams,
  SolveRequiredInputsParams,
} from "@/lib/formula-governance/requirement-engine/requirement-engine-types";

export { solveRequiredInputs } from "@/lib/formula-governance/requirement-engine/requirement-engine";
export { resolveInverseRequirement } from "@/lib/formula-governance/requirement-engine/inverse-problem-resolver";
export {
  resolveRequirementsForFormulaPath,
  scoreRequirementPath,
} from "@/lib/formula-governance/requirement-engine/dependency-resolver";
export type { ResolvedRequirementSet } from "@/lib/formula-governance/requirement-engine/dependency-resolver";
export { auditRequirementSolveResult } from "@/lib/formula-governance/requirement-engine/requirement-auditor";
export type {
  AuditRequirementSolveResultParams,
  RequirementAuditFinding,
} from "@/lib/formula-governance/requirement-engine/requirement-auditor";
export {
  evaluateDriftScoreGate,
} from "@/lib/formula-governance/requirement-engine/drift-score-gate";
export type {
  DriftGateStatus,
  DriftScoreGateResult,
  EvaluateDriftScoreGateParams,
} from "@/lib/formula-governance/requirement-engine/drift-score-gate";
export {
  exportBatchAlignmentAuditResult,
  formatBatchAlignmentAuditReport,
  runBatchAlignmentAudit,
} from "@/lib/formula-governance/requirement-engine/batch-alignment-audit";
export type {
  BatchAlignmentAuditResult,
  BatchAlignmentStatus,
  BatchAlignmentSummary,
  RunBatchAlignmentAuditParams,
} from "@/lib/formula-governance/requirement-engine/batch-alignment-audit";
export {
  buildContractFixtureAlignmentContext,
  resolveContractOntologyForAlignment,
} from "@/lib/formula-governance/requirement-engine/contract-fixture-alignment";
export type {
  BuildContractFixtureAlignmentContextParams,
  ContractFixtureAlignmentContext,
} from "@/lib/formula-governance/requirement-engine/contract-fixture-alignment";
export {
  buildInputDesignFromRequirementResult,
} from "@/lib/formula-governance/requirement-engine/input-design-bridge";
export type {
  BuildInputDesignOptions,
  ToolInputDesign,
  ToolInputDesignField,
} from "@/lib/formula-governance/requirement-engine/input-design-bridge";
export {
  compareContractOntologyWithFixture,
} from "@/lib/formula-governance/requirement-engine/contract-fixture-drift";
export type {
  CompareContractOntologyWithFixtureParams,
  ContractFixtureDriftReport,
  PossibleAliasReport,
} from "@/lib/formula-governance/requirement-engine/contract-fixture-drift";
export type { OntologyVariableAlias } from "@/lib/formula-governance/calculation-ontology/ontology-alias-types";
export { computeMigrationRiskScore } from "@/lib/formula-governance/requirement-engine/contract-fixture-drift";
export {
  runRequirementEngineForContract,
} from "@/lib/formula-governance/requirement-engine/contract-requirement-runner";
export type {
  ContractRequirementRunResult,
  OntologyPipelineStatus,
  RunRequirementEngineForContractParams,
} from "@/lib/formula-governance/requirement-engine/contract-requirement-runner";
export {
  auditFormulaContractInputReadiness,
} from "@/lib/formula-governance/requirement-engine/contract-requirement-bridge";
export type {
  AuditFormulaContractInputReadinessParams,
  ContractOnlyAlignmentContext,
  InputReadinessAlignmentSummary,
  InputReadinessAudit,
  InputReadinessStatus,
  VariableAliasReadinessContext,
} from "@/lib/formula-governance/requirement-engine/contract-requirement-bridge";
