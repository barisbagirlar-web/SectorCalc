/**
 * Contract loop status mapper — requirement + validation → unified status (Phase 5H-B-4).
 */

import type { RequirementSolveResult } from "@/lib/formula-governance/requirement-engine/requirement-engine-types";
import type {
  CalculationIntelligenceStatus,
  ValidationResult,
} from "@/lib/formula-governance/runtime-validation/invariant-types";

export type ContractLoopStatus = CalculationIntelligenceStatus;

export type MapContractLoopStatusParams = {
  readonly requirementResult: RequirementSolveResult;
  readonly validationResult?: ValidationResult;
  readonly blockers: readonly string[];
  readonly hasCalculatedResult: boolean;
};

export function mapContractLoopStatus(params: MapContractLoopStatusParams): ContractLoopStatus {
  const { requirementResult, validationResult, blockers, hasCalculatedResult } = params;

  if (requirementResult.status === "blocked" || blockers.length > 0) {
    return "BLOCKED";
  }

  if (
    requirementResult.status === "need_more_data" ||
    requirementResult.requiredMissingInputs.length > 0
  ) {
    return "NEED_DATA";
  }

  if (!hasCalculatedResult) {
    return "READY_TO_CALCULATE";
  }

  if (!validationResult) {
    return "READY_TO_CALCULATE";
  }

  if (!validationResult.isValid) {
    return "PHYSICS_OR_LOGIC_ERROR";
  }

  return "SUCCESS";
}
