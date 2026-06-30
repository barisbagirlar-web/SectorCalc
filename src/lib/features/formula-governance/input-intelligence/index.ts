/**
 * Input intelligence bridge exports — Mind 2 requirement → input design adapter.
 */

export {
  buildInputDesignFromRequirementResult,
} from "@/lib/features/formula-governance/requirement-engine/input-design-bridge";
export type {
  BuildInputDesignOptions,
  ToolInputDesign,
  ToolInputDesignField,
} from "@/lib/features/formula-governance/requirement-engine/input-design-bridge";
export {
  runContractCalculationIntelligenceLoop,
} from "@/lib/features/formula-governance/runtime-validation/contract-runtime-loop";
export type {
  ContractCalculationIntelligenceLoopResult,
  RunContractCalculationIntelligenceLoopParams,
} from "@/lib/features/formula-governance/runtime-validation/contract-runtime-loop";
