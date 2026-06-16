// Auto-generated from caffeine-calculator-schema.json
import * as z from 'zod';

export interface Caffeine_calculatorInput {
  volumePerServing: number;
  numberOfServings: number;
  caffeineContentPer100ml: number;
  bodyWeight: number;
}

export const Caffeine_calculatorInputSchema = z.object({
  volumePerServing: z.number().default(250),
  numberOfServings: z.number().default(1),
  caffeineContentPer100ml: z.number().default(40),
  bodyWeight: z.number().default(70),
});

function evaluateAllFormulas(input: Caffeine_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.volumePerServing * input.numberOfServings * (input.caffeineContentPer100ml / 100); results["totalCaffeine"] = Number.isFinite(v) ? v : 0; } catch { results["totalCaffeine"] = 0; }
  try { const v = input.bodyWeight * 6; results["safeLimit"] = Number.isFinite(v) ? v : 0; } catch { results["safeLimit"] = 0; }
  try { const v = (results["safeLimit"] ?? 0) - (results["totalCaffeine"] ?? 0); results["remainingCaffeine"] = Number.isFinite(v) ? v : 0; } catch { results["remainingCaffeine"] = 0; }
  return results;
}


export function calculateCaffeine_calculator(input: Caffeine_calculatorInput): Caffeine_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCaffeine"] ?? 0;
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


export interface Caffeine_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
