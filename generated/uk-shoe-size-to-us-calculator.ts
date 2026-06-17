// @ts-nocheck
// Auto-generated from uk-shoe-size-to-us-calculator-schema.json
import * as z from 'zod';

export interface Uk_shoe_size_to_us_calculatorInput {
  ukSize: number;
  gender: number;
  adjustment: number;
  rounding: number;
}

export const Uk_shoe_size_to_us_calculatorInputSchema = z.object({
  ukSize: z.number().default(8),
  gender: z.number().default(0),
  adjustment: z.number().default(0),
  rounding: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Uk_shoe_size_to_us_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 1 + input.gender; results["offset"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["offset"] = 0; }
  try { const v = input.ukSize + (asFormulaNumber(results["offset"])) + input.adjustment; results["rawSize"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rawSize"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateUk_shoe_size_to_us_calculator(input: Uk_shoe_size_to_us_calculatorInput): Uk_shoe_size_to_us_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["rawSize"]);
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


export interface Uk_shoe_size_to_us_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
