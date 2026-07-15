import "server-only";

import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";
import type { ProFormulaResult } from "./pro-formula-contract";
import {
  createValidationState,
  divideOrError,
  finalizeResult,
  requireFiniteInputs,
  requireNonNegative,
  requirePositive,
  requireRange,
  roundDisplay,
} from "./pro-formula-safety";

export const toolKey = "true-employee-cost-statement";
export const formulaVersion = "5.3.1-pro-baris.1";

export const requiredInputKeys = [
  "n_labor_rate",
  "n_overhead_rate",
  "n_source_confidence_ratio",
] as const;

export const declaredOutputKeys = [
  "out_base_annual_compensation",
  "out_workspace_facility_cost",
  "out_fully_loaded_annual_cost",
  "out_monthly_employer_cost",
  "out_base_to_loaded_multiplier",
  "out_evidence_completeness",
  "out_expanded_uncertainty",
  "out_decision_state",
] as const;

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export function calculate(inputs: Record<string, number>): ProFormulaResult {
  const state = createValidationState();
  const v = requireFiniteInputs(inputs, requiredInputKeys, state);
  if (state.errors.length > 0) {
    return finalizeResult({ outputs: {}, outputKeys: declaredOutputKeys, state });
  }

  const annualBaseCompensation = v.n_labor_rate;
  const otherAnnualEmployerCosts = v.n_overhead_rate;
  const confidence = v.n_source_confidence_ratio;

  requirePositive(annualBaseCompensation, "Annual base compensation", state);
  requireNonNegative(otherAnnualEmployerCosts, "Other annual employer costs", state);
  requireRange(confidence, 0, 1, "Source confidence", state);

  if (state.errors.length > 0) {
    return finalizeResult({ outputs: {}, outputKeys: declaredOutputKeys, state });
  }

  // No statutory rates, benefit assumptions or productive-hour assumptions are
  // fabricated. The second input is an auditable aggregate from payroll/ledger
  // records. Detailed tax/benefit decomposition requires explicit source fields.
  const fullyLoadedAnnualCost = annualBaseCompensation + otherAnnualEmployerCosts;
  const monthlyEmployerCost = fullyLoadedAnnualCost / 12;
  const loadedMultiplier = divideOrError(
    fullyLoadedAnnualCost,
    annualBaseCompensation,
    "Base-to-loaded multiplier",
    state,
  );
  const uncertainty = fullyLoadedAnnualCost * (1 - confidence);

  let decision = 0;
  if (confidence < 0.7) decision = 1;
  if (confidence < 0.7) {
    state.warnings.push("Source confidence is below 70%; reconcile payroll and employer-cost ledger records.");
  }

  const outputs: Record<string, number> = {
    out_base_annual_compensation: roundDisplay(annualBaseCompensation, 2),
    out_workspace_facility_cost: roundDisplay(otherAnnualEmployerCosts, 2),
    out_fully_loaded_annual_cost: roundDisplay(fullyLoadedAnnualCost, 2),
    out_monthly_employer_cost: roundDisplay(monthlyEmployerCost, 2),
    out_base_to_loaded_multiplier: roundDisplay(loadedMultiplier, 6),
    out_evidence_completeness: roundDisplay(confidence, 4),
    out_expanded_uncertainty: roundDisplay(uncertainty, 2),
    out_decision_state: decision,
  };

  return finalizeResult({
    outputs,
    outputKeys: declaredOutputKeys,
    state,
    status: decision === 0 ? "OK" : "REVIEW",
  });
}
