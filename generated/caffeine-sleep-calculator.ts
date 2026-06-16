// Auto-generated from caffeine-sleep-calculator-schema.json
import * as z from 'zod';

export interface Caffeine_sleep_calculatorInput {
  caffeineDose: number;
  halfLife: number;
  hoursBeforeSleep: number;
  toleranceFactor: number;
}

export const Caffeine_sleep_calculatorInputSchema = z.object({
  caffeineDose: z.number().default(200),
  halfLife: z.number().default(5),
  hoursBeforeSleep: z.number().default(8),
  toleranceFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Caffeine_sleep_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.caffeineDose * Math.pow(0.5, input.hoursBeforeSleep / input.halfLife); results["caffeineRemainingAtBedtime"] = Number.isFinite(v) ? v : 0; } catch { results["caffeineRemainingAtBedtime"] = 0; }
  try { const v = ((input.caffeineDose - (results["caffeineRemainingAtBedtime"] ?? 0)) / input.caffeineDose) * 100; results["percentEliminated"] = Number.isFinite(v) ? v : 0; } catch { results["percentEliminated"] = 0; }
  try { const v = (results["caffeineRemainingAtBedtime"] ?? 0) * input.toleranceFactor; results["adjustedCaffeineRemaining"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedCaffeineRemaining"] = 0; }
  return results;
}


export function calculateCaffeine_sleep_calculator(input: Caffeine_sleep_calculatorInput): Caffeine_sleep_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["caffeineRemainingAtBedtime"] ?? 0;
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


export interface Caffeine_sleep_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
