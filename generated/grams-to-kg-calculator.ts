// Auto-generated from grams-to-kg-calculator-schema.json
import * as z from 'zod';

export interface Grams_to_kg_calculatorInput {
  grossWeightGrams: number;
  tareWeightGrams: number;
  decimalPlaces: number;
  roundingMode: number;
  dataConfidence?: number;
}

export const Grams_to_kg_calculatorInputSchema = z.object({
  grossWeightGrams: z.number().default(0),
  tareWeightGrams: z.number().default(0),
  decimalPlaces: z.number().default(3),
  roundingMode: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Grams_to_kg_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.grossWeightGrams - input.tareWeightGrams; results["netGrams"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netGrams"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["netGrams"])) / 1000; results["kgUnrounded"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["kgUnrounded"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["netGrams"])); results["netWeightGrams"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netWeightGrams"] = Number.NaN; }
  try { const v = input.grossWeightGrams / 1000; results["grossWeightKg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossWeightKg"] = Number.NaN; }
  return results;
}


export function calculateGrams_to_kg_calculator(input: Grams_to_kg_calculatorInput): Grams_to_kg_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["grossWeightKg"]);
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


export interface Grams_to_kg_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
