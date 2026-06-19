// Auto-generated from kilograms-to-grams-calculator-schema.json
import * as z from 'zod';

export interface Kilograms_to_grams_calculatorInput {
  kg: number;
  items: number;
  packagingKg: number;
  factor: number;
  dataConfidence?: number;
}

export const Kilograms_to_grams_calculatorInputSchema = z.object({
  kg: z.number().default(1),
  items: z.number().default(1),
  packagingKg: z.number().default(0),
  factor: z.number().default(1000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Kilograms_to_grams_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.kg * input.items + input.packagingKg) * input.factor; results["totalGrams"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalGrams"] = 0; }
  try { const v = input.kg * input.items * input.factor; results["itemGrams"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["itemGrams"] = 0; }
  try { const v = input.packagingKg * input.factor; results["packagingGrams"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["packagingGrams"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateKilograms_to_grams_calculator(input: Kilograms_to_grams_calculatorInput): Kilograms_to_grams_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalGrams"]));
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


export interface Kilograms_to_grams_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
