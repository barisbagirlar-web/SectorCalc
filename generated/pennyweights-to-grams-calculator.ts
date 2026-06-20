// Auto-generated from pennyweights-to-grams-calculator-schema.json
import * as z from 'zod';

export interface Pennyweights_to_grams_calculatorInput {
  pennyweight: number;
  conversionFactor: number;
  decimalPrecision: number;
  sampleCount: number;
  tolerance: number;
  dataConfidence?: number;
}

export const Pennyweights_to_grams_calculatorInputSchema = z.object({
  pennyweight: z.number().default(1),
  conversionFactor: z.number().default(1.55517384),
  decimalPrecision: z.number().default(2),
  sampleCount: z.number().default(1),
  tolerance: z.number().default(0.001),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pennyweights_to_grams_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pennyweight * input.conversionFactor; results["gramsPerSample"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["gramsPerSample"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["gramsPerSample"])) * input.sampleCount; results["totalGrams"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalGrams"] = Number.NaN; }
  return results;
}


export function calculatePennyweights_to_grams_calculator(input: Pennyweights_to_grams_calculatorInput): Pennyweights_to_grams_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalGrams"]);
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


export interface Pennyweights_to_grams_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
