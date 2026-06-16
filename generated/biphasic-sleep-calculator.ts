// Auto-generated from biphasic-sleep-calculator-schema.json
import * as z from 'zod';

export interface Biphasic_sleep_calculatorInput {
  wakeTime: number;
  coreDuration: number;
  napDuration: number;
  napTime: number;
}

export const Biphasic_sleep_calculatorInputSchema = z.object({
  wakeTime: z.number().default(7),
  coreDuration: z.number().default(5),
  napDuration: z.number().default(1.5),
  napTime: z.number().default(14),
});

function evaluateAllFormulas(input: Biphasic_sleep_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.wakeTime - input.coreDuration + 24) % 24; results["coreStart"] = Number.isFinite(v) ? v : 0; } catch { results["coreStart"] = 0; }
  try { const v = input.wakeTime; results["coreEnd"] = Number.isFinite(v) ? v : 0; } catch { results["coreEnd"] = 0; }
  try { const v = (input.napTime + input.napDuration) % 24; results["napEnd"] = Number.isFinite(v) ? v : 0; } catch { results["napEnd"] = 0; }
  try { const v = input.coreDuration + input.napDuration; results["totalSleep"] = Number.isFinite(v) ? v : 0; } catch { results["totalSleep"] = 0; }
  return results;
}


export function calculateBiphasic_sleep_calculator(input: Biphasic_sleep_calculatorInput): Biphasic_sleep_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalSleep"] ?? 0;
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


export interface Biphasic_sleep_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
