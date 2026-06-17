// @ts-nocheck
// Auto-generated from grains-to-grams-calculator-schema.json
import * as z from 'zod';

export interface Grains_to_grams_calculatorInput {
  grains: number;
  conversionFactor: number;
  precision: number;
  batchCount: number;
}

export const Grains_to_grams_calculatorInputSchema = z.object({
  grains: z.number().default(0),
  conversionFactor: z.number().default(0.06479891),
  precision: z.number().default(2),
  batchCount: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Grains_to_grams_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.conversionFactor; results["gramsPerGrain"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["gramsPerGrain"] = 0; }
  try { const v = input.grains * input.batchCount; results["totalGrains"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalGrains"] = 0; }
  try { const v = input.grains * input.conversionFactor * input.batchCount; results["unroundedGrams"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["unroundedGrams"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateGrains_to_grams_calculator(input: Grains_to_grams_calculatorInput): Grains_to_grams_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["unroundedGrams"]);
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


export interface Grains_to_grams_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
