// Auto-generated from grams-to-moles-calculator-schema.json
import * as z from 'zod';

export interface Grams_to_moles_calculatorInput {
  mass_in_grams: number;
  molecular_weight: number;
  purity_percent: number;
  yield_percent: number;
  dataConfidence?: number;
}

export const Grams_to_moles_calculatorInputSchema = z.object({
  mass_in_grams: z.number().default(0),
  molecular_weight: z.number().default(18.015),
  purity_percent: z.number().default(100),
  yield_percent: z.number().default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Grams_to_moles_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mass_in_grams * (input.purity_percent / 100); results["effectiveMass"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveMass"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["effectiveMass"])) / input.molecular_weight; results["theoreticalMoles"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["theoreticalMoles"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["theoreticalMoles"])) * (input.yield_percent / 100); results["actualMoles"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["actualMoles"] = Number.NaN; }
  return results;
}


export function calculateGrams_to_moles_calculator(input: Grams_to_moles_calculatorInput): Grams_to_moles_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["actualMoles"]);
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


export interface Grams_to_moles_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
