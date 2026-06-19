// Auto-generated from ounces-to-grams-calculator-schema.json
import * as z from 'zod';

export interface Ounces_to_grams_calculatorInput {
  ounces: number;
  conversionFactor: number;
  measurementUncertaintyOunces: number;
  outputPrecision: number;
  batchMultiplier: number;
  dataConfidence?: number;
}

export const Ounces_to_grams_calculatorInputSchema = z.object({
  ounces: z.number().default(1),
  conversionFactor: z.number().default(28.349523125),
  measurementUncertaintyOunces: z.number().default(0.001),
  outputPrecision: z.number().default(2),
  batchMultiplier: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ounces_to_grams_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ounces * input.conversionFactor * input.batchMultiplier; results["totalGrams"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalGrams"] = 0; }
  try { const v = input.ounces * input.conversionFactor; results["rawConversion"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rawConversion"] = 0; }
  try { const v = input.ounces * input.conversionFactor * input.batchMultiplier; results["gramsInBatch"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["gramsInBatch"] = 0; }
  try { const v = input.measurementUncertaintyOunces * input.conversionFactor * input.batchMultiplier; results["expandedUncertainty"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["expandedUncertainty"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateOunces_to_grams_calculator(input: Ounces_to_grams_calculatorInput): Ounces_to_grams_calculatorOutput {
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


export interface Ounces_to_grams_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
