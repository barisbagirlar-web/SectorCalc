// Auto-generated from polyphasic-sleep-calculator-schema.json
import * as z from 'zod';

export interface Polyphasic_sleep_calculatorInput {
  coreSleepDuration: number;
  numberOfNaps: number;
  napDuration: number;
  sleepGoal: number;
}

export const Polyphasic_sleep_calculatorInputSchema = z.object({
  coreSleepDuration: z.number().default(3),
  numberOfNaps: z.number().default(4),
  napDuration: z.number().default(20),
  sleepGoal: z.number().default(8),
});

function evaluateAllFormulas(input: Polyphasic_sleep_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.coreSleepDuration; results["coreSleepDuration"] = Number.isFinite(v) ? v : 0; } catch { results["coreSleepDuration"] = 0; }
  try { const v = (input.numberOfNaps * input.napDuration) / 60; results["napSleepHours"] = Number.isFinite(v) ? v : 0; } catch { results["napSleepHours"] = 0; }
  try { const v = input.coreSleepDuration + ((input.numberOfNaps * input.napDuration) / 60); results["totalSleepHours"] = Number.isFinite(v) ? v : 0; } catch { results["totalSleepHours"] = 0; }
  try { const v = Math.max(0, input.sleepGoal - (input.coreSleepDuration + ((input.numberOfNaps * input.napDuration) / 60))); results["sleepDeficit"] = Number.isFinite(v) ? v : 0; } catch { results["sleepDeficit"] = 0; }
  return results;
}


export function calculatePolyphasic_sleep_calculator(input: Polyphasic_sleep_calculatorInput): Polyphasic_sleep_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalSleepHours"] ?? 0;
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


export interface Polyphasic_sleep_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
