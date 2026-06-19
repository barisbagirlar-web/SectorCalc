// Auto-generated from tablespoon-to-teaspoon-calculator-schema.json
import * as z from 'zod';

export interface Tablespoon_to_teaspoon_calculatorInput {
  tablespoons: number;
  conversionRate: number;
  precision: number;
  batchMultiplier: number;
  dataConfidence?: number;
}

export const Tablespoon_to_teaspoon_calculatorInputSchema = z.object({
  tablespoons: z.number().default(1),
  conversionRate: z.number().default(3),
  precision: z.number().default(2),
  batchMultiplier: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Tablespoon_to_teaspoon_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.tablespoons * input.conversionRate * input.batchMultiplier; results["rawTeaspoons"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rawTeaspoons"] = 0; }
  try { const v = input.conversionRate; results["conversionRateUsed"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["conversionRateUsed"] = 0; }
  try { const v = input.batchMultiplier; results["batchMultiplierUsed"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["batchMultiplierUsed"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTablespoon_to_teaspoon_calculator(input: Tablespoon_to_teaspoon_calculatorInput): Tablespoon_to_teaspoon_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["batchMultiplierUsed"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Tablespoon_to_teaspoon_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
