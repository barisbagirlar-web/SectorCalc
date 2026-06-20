// Auto-generated from state-space-controllability-calculator-schema.json
import * as z from 'zod';

export interface State_space_controllability_calculatorInput {
  a11: number;
  a12: number;
  a21: number;
  a22: number;
  b1: number;
  b2: number;
  dataConfidence?: number;
}

export const State_space_controllability_calculatorInputSchema = z.object({
  a11: z.number().default(0),
  a12: z.number().default(1),
  a21: z.number().default(-2),
  a22: z.number().default(-3),
  b1: z.number().default(0),
  b2: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: State_space_controllability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.b1; results["c11"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["c11"] = Number.NaN; }
  try { const v = input.a11 * input.b1 + input.a12 * input.b2; results["c12"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["c12"] = Number.NaN; }
  try { const v = input.b2; results["c21"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["c21"] = Number.NaN; }
  try { const v = input.a21 * input.b1 + input.a22 * input.b2; results["c22"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["c22"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["c11"])) * (toNumericFormulaValue(results["c22"])) - (toNumericFormulaValue(results["c12"])) * (toNumericFormulaValue(results["c21"])); results["det"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["det"] = Number.NaN; }
  return results;
}


export function calculateState_space_controllability_calculator(input: State_space_controllability_calculatorInput): State_space_controllability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["det"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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


export interface State_space_controllability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
