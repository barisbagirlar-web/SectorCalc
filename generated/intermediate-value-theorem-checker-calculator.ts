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
  try { const v = input.a + input.b + input.f_a; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.a + input.b + input.f_a; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
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


export interface Intermediate_value_theorem_checker_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
