// @ts-nocheck
// Auto-generated from intermediate-value-theorem-checker-calculator-schema.json
import * as z from 'zod';

export interface Intermediate_value_theorem_checker_calculatorInput {
  a: number;
  b: number;
  f_a: number;
  f_b: number;
  k: number;
}

export const Intermediate_value_theorem_checker_calculatorInputSchema = z.object({
  a: z.number().default(0),
  b: z.number().default(1),
  f_a: z.number().default(-1),
  f_b: z.number().default(1),
  k: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Intermediate_value_theorem_checker_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.a * input.b * input.f_a * input.f_b; results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.a * input.b * input.f_a * input.f_b * (input.k); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.k; results["adjustment_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateIntermediate_value_theorem_checker_calculator(input: Intermediate_value_theorem_checker_calculatorInput): Intermediate_value_theorem_checker_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Intermediate_value_theorem_checker_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
