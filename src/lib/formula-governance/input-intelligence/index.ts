/**
 * Input intelligence bridge exports — Mind 2 requirement → input design adapter.
 */

export {
  buildInputDesignFromRequirementResult,
} from "@/lib/formula-governance/requirement-engine/input-design-bridge";
export type {
  BuildInputDesignOptions,
  ToolInputDesign,
  ToolInputDesignField,
} from "@/lib/formula-governance/requirement-engine/input-design-bridge";
export {
  runContractCalculationIntelligenceLoop,
} from "@/lib/formula-governance/runtime-validation/contract-runtime-loop";
export type {
  ContractCalculationIntelligenceLoopResult,
  RunContractCalculationIntelligenceLoopParams,
} from "@/lib/formula-governance/runtime-validation/contract-runtime-loop";
