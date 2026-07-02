/**
 * SectorCalc Formula Engine - public facade.
 *
 * Canonical implementation lives under `src/lib/formula-governance/` (Dual-Intelligence).
 * Mind 2: requirement / input resolution. Mind 1: oracle, scenario, property validation.
 *
 * Every production formula is backed by a versioned FormulaContract with regulation metadata.
 */

export type {
  FormulaContract,
  AuditStatus,
  DecisionImpact,
  ValidationRule,
  ScenarioTestSpec,
} from "@/lib/features/formula-governance/types";

export {
  FORMULA_CONTRACTS,
  getFormulaContractBySlug,
} from "@/lib/features/formula-governance/contracts";

export { runGovernanceAudit } from "@/lib/features/formula-governance/audit-runner";

export { runFullExistingToolAudit } from "@/lib/features/formula-governance/full-tool-audit/full-tool-audit-runner";

export {
  buildSmartFormFieldSpecsFromContract,
  type SmartFormContractFieldPlan,
} from "@/lib/features/formula-governance/runtime-validation/smart-form-contract-adapter";

export {
  runRequirementEngineForContract,
  type ContractRequirementRunResult,
} from "@/lib/features/formula-governance/requirement-engine/contract-requirement-runner";

export { auditOracleComparisonForSlug } from "@/lib/features/formula-governance/oracle/compare-production-oracle";

export {
  assertFormulaRegulationMetadata,
  resolveFormulaRegulationMetadata,
  type FormulaRegulationMetadata,
} from "@/lib/features/formulas/formula-regulation";
