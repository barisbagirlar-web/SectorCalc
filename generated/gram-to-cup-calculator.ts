// Auto-generated from gram-to-cup-calculator-schema.json
import * as z from 'zod';

export interface Gram_to_cup_calculatorInput {
  grams: number;
  density: number;
  cupVolume: number;
  packingFactor: number;
}

export const Gram_to_cup_calculatorInputSchema = z.object({
  grams: z.number().default(100),
  density: z.number().default(0.59),
  cupVolume: z.number().default(240),
  packingFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Gram_to_cup_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.grams / (input.density * input.packingFactor * input.cupVolume); results["cups"] = Number.isFinite(v) ? v : 0; } catch { results["cups"] = 0; }
  try { const v = input.grams / (input.density * input.packingFactor); results["volumeML"] = Number.isFinite(v) ? v : 0; } catch { results["volumeML"] = 0; }
  try { const v = input.density * input.packingFactor * input.cupVolume; results["gramsPerCup"] = Number.isFinite(v) ? v : 0; } catch { results["gramsPerCup"] = 0; }
  return results;
}


export function calculateGram_to_cup_calculator(input: Gram_to_cup_calculatorInput): Gram_to_cup_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cups"] ?? 0;
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


export interface Gram_to_cup_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
