// Auto-generated from grams-to-moles-calculator-schema.json
import * as z from 'zod';

export interface Grams_to_moles_calculatorInput {
  mass_in_grams: number;
  molecular_weight: number;
  purity_percent: number;
  yield_percent: number;
}

export const Grams_to_moles_calculatorInputSchema = z.object({
  mass_in_grams: z.number().default(0),
  molecular_weight: z.number().default(18.015),
  purity_percent: z.number().default(100),
  yield_percent: z.number().default(100),
});

function evaluateAllFormulas(input: Grams_to_moles_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mass_in_grams * (input.purity_percent / 100); results["effectiveMass"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveMass"] = 0; }
  try { const v = (results["effectiveMass"] ?? 0) / input.molecular_weight; results["theoreticalMoles"] = Number.isFinite(v) ? v : 0; } catch { results["theoreticalMoles"] = 0; }
  try { const v = (results["theoreticalMoles"] ?? 0) * (input.yield_percent / 100); results["actualMoles"] = Number.isFinite(v) ? v : 0; } catch { results["actualMoles"] = 0; }
  return results;
}


export function calculateGrams_to_moles_calculator(input: Grams_to_moles_calculatorInput): Grams_to_moles_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["actualMoles"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
