// Auto-generated from cup-to-gram-calculator-schema.json
import * as z from 'zod';

export interface Cup_to_gram_calculatorInput {
  cups: number;
  cupVolume: number;
  density: number;
  temperature: number;
  densityCorrectionFactor: number;
}

export const Cup_to_gram_calculatorInputSchema = z.object({
  cups: z.number().default(1),
  cupVolume: z.number().default(236.588),
  density: z.number().default(1),
  temperature: z.number().default(20),
  densityCorrectionFactor: z.number().default(0),
});

function evaluateAllFormulas(input: Cup_to_gram_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.density * (1 + input.densityCorrectionFactor * (input.temperature - 20)); results["correctedDensity"] = Number.isFinite(v) ? v : 0; } catch { results["correctedDensity"] = 0; }
  try { const v = input.cups * input.cupVolume; results["volumeInML"] = Number.isFinite(v) ? v : 0; } catch { results["volumeInML"] = 0; }
  try { const v = (results["volumeInML"] ?? 0) * (results["correctedDensity"] ?? 0); results["massInGrams"] = Number.isFinite(v) ? v : 0; } catch { results["massInGrams"] = 0; }
  return results;
}


export function calculateCup_to_gram_calculator(input: Cup_to_gram_calculatorInput): Cup_to_gram_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["massInGrams"] ?? 0;
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


export interface Cup_to_gram_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
