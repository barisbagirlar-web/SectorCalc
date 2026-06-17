// @ts-nocheck
// Auto-generated from s-n-curve-calculator-schema.json
import * as z from 'zod';

export interface S_n_curve_calculatorInput {
  stress_amplitude: number;
  mean_stress: number;
  ultimate_tensile_strength: number;
  fatigue_strength_coefficient: number;
  fatigue_strength_exponent: number;
}

export const S_n_curve_calculatorInputSchema = z.object({
  stress_amplitude: z.number().default(200),
  mean_stress: z.number().default(0),
  ultimate_tensile_strength: z.number().default(600),
  fatigue_strength_coefficient: z.number().default(900),
  fatigue_strength_exponent: z.number().default(-0.1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: S_n_curve_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.stress_amplitude / (1 - input.mean_stress / input.ultimate_tensile_strength); results["eq_stress"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["eq_stress"] = 0; }
  try { const v = 0.5 * ((asFormulaNumber(results["eq_stress"])) / input.fatigue_strength_coefficient) ** (1 / input.fatigue_strength_exponent); results["cycles"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["cycles"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateS_n_curve_calculator(input: S_n_curve_calculatorInput): S_n_curve_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["cycles"]);
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


export interface S_n_curve_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
