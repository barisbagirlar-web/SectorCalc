// Auto-generated from soda-caffeine-calculator-schema.json
import * as z from 'zod';

export interface Soda_caffeine_calculatorInput {
  cansConsumed: number;
  caffeinePerServing: number;
  servingSize: number;
  bodyWeight: number;
  safeLimitPerKg: number;
  coffeeCaffeinePerCup: number;
}

export const Soda_caffeine_calculatorInputSchema = z.object({
  cansConsumed: z.number().default(1),
  caffeinePerServing: z.number().default(34),
  servingSize: z.number().default(12),
  bodyWeight: z.number().default(70),
  safeLimitPerKg: z.number().default(2.5),
  coffeeCaffeinePerCup: z.number().default(95),
});

function evaluateAllFormulas(input: Soda_caffeine_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cansConsumed * input.caffeinePerServing; results["totalCaffeine"] = Number.isFinite(v) ? v : 0; } catch { results["totalCaffeine"] = 0; }
  try { const v = input.bodyWeight * input.safeLimitPerKg; results["safeLimit"] = Number.isFinite(v) ? v : 0; } catch { results["safeLimit"] = 0; }
  try { const v = ((results["totalCaffeine"] ?? 0) / (results["safeLimit"] ?? 0)) * 100; results["percentOfLimit"] = Number.isFinite(v) ? v : 0; } catch { results["percentOfLimit"] = 0; }
  try { const v = (results["totalCaffeine"] ?? 0) / input.coffeeCaffeinePerCup; results["coffeeEquiv"] = Number.isFinite(v) ? v : 0; } catch { results["coffeeEquiv"] = 0; }
  return results;
}


export function calculateSoda_caffeine_calculator(input: Soda_caffeine_calculatorInput): Soda_caffeine_calculatorOutput {
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


export interface Soda_caffeine_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
