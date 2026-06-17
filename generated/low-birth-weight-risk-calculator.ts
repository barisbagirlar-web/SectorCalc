// @ts-nocheck
// Auto-generated from low-birth-weight-risk-calculator-schema.json
import * as z from 'zod';

export interface Low_birth_weight_risk_calculatorInput {
  maternalAge: number;
  gestationalAge: number;
  prePregnancyBMI: number;
  smoking: number;
  previousLBW: number;
  parity: number;
}

export const Low_birth_weight_risk_calculatorInputSchema = z.object({
  maternalAge: z.number().default(28),
  gestationalAge: z.number().default(40),
  prePregnancyBMI: z.number().default(22),
  smoking: z.number().default(0),
  previousLBW: z.number().default(0),
  parity: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Low_birth_weight_risk_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = -3.5 + 0.05 * input.maternalAge - 0.1 * input.gestationalAge - 0.03 * input.prePregnancyBMI + 0.5 * input.smoking + 1.5 * input.previousLBW + 0.2 * input.parity; results["linearPredictor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["linearPredictor"] = 0; }
  try { const v = -3.5 + 0.05 * input.maternalAge - 0.1 * input.gestationalAge - 0.03 * input.prePregnancyBMI + 0.5 * input.smoking + 1.5 * input.previousLBW + 0.2 * input.parity; results["linearPredictor_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["linearPredictor_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateLow_birth_weight_risk_calculator(input: Low_birth_weight_risk_calculatorInput): Low_birth_weight_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["linearPredictor_aux"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Low_birth_weight_risk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
