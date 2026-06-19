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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Grams_to_kg_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.grossWeightGrams - input.tareWeightGrams; results["netGrams"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netGrams"] = 0; }
  try { const v = (asFormulaNumber(results["netGrams"])) / 1000; results["kgUnrounded"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["kgUnrounded"] = 0; }
  try { const v = (asFormulaNumber(results["netGrams"])); results["netWeightGrams"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netWeightGrams"] = 0; }
  try { const v = input.grossWeightGrams / 1000; results["grossWeightKg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["grossWeightKg"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
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
