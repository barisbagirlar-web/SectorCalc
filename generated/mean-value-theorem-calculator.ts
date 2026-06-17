// @ts-nocheck
// Auto-generated from mean-value-theorem-calculator-schema.json
import * as z from 'zod';

export interface Mean_value_theorem_calculatorInput {
  A: number;
  B: number;
  C: number;
  a: number;
  b: number;
}

export const Mean_value_theorem_calculatorInputSchema = z.object({
  A: z.number().default(1),
  B: z.number().default(0),
  C: z.number().default(0),
  a: z.number().default(0),
  b: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mean_value_theorem_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.A * input.a**2 + input.B * input.a + input.C; results["f_a"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["f_a"] = 0; }
  try { const v = input.A * input.b**2 + input.B * input.b + input.C; results["f_b"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["f_b"] = 0; }
  try { const v = ((asFormulaNumber(results["f_b"])) - (asFormulaNumber(results["f_a"]))) / (input.b - input.a); results["slope"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["slope"] = 0; }
  try { const v = ((asFormulaNumber(results["slope"])) - input.B) / (2 * input.A); results["c"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["c"] = 0; }
  try { const v = 2 * input.A * (asFormulaNumber(results["c"])) + input.B; results["f_prime_c"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["f_prime_c"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMean_value_theorem_calculator(input: Mean_value_theorem_calculatorInput): Mean_value_theorem_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["c"]);
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


export interface Mean_value_theorem_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
