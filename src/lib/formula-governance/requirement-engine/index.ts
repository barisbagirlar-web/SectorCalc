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
export type { RequirementAuditFinding } from "@/lib/formula-governance/requirement-engine/requirement-auditor";
export {
  buildInputDesignFromRequirementResult,
} from "@/lib/formula-governance/requirement-engine/input-design-bridge";
export type { ToolInputDesign, ToolInputDesignField } from "@/lib/formula-governance/requirement-engine/input-design-bridge";
