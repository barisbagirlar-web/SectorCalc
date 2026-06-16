// Auto-generated from wendler-531-calculator-schema.json
import * as z from 'zod';

export interface Wendler_531_calculatorInput {
  oneRepMax: number;
  trainingMaxPercent: number;
  week: number;
  set1Percent: number;
  set2Percent: number;
  set3Percent: number;
}

export const Wendler_531_calculatorInputSchema = z.object({
  oneRepMax: z.number().default(100),
  trainingMaxPercent: z.number().default(90),
  week: z.number().default(1),
  set1Percent: z.number().default(65),
  set2Percent: z.number().default(75),
  set3Percent: z.number().default(85),
});

function evaluateAllFormulas(input: Wendler_531_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.oneRepMax * input.trainingMaxPercent / 100; results["trainingMax"] = Number.isFinite(v) ? v : 0; } catch { results["trainingMax"] = 0; }
  try { const v = (results["trainingMax"] ?? 0) * input.set1Percent / 100; results["set1Weight"] = Number.isFinite(v) ? v : 0; } catch { results["set1Weight"] = 0; }
  try { const v = (results["trainingMax"] ?? 0) * input.set2Percent / 100; results["set2Weight"] = Number.isFinite(v) ? v : 0; } catch { results["set2Weight"] = 0; }
  try { const v = (results["trainingMax"] ?? 0) * input.set3Percent / 100; results["set3Weight"] = Number.isFinite(v) ? v : 0; } catch { results["set3Weight"] = 0; }
  return results;
}


export function calculateWendler_531_calculator(input: Wendler_531_calculatorInput): Wendler_531_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["set3Weight"] ?? 0;
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


export interface Wendler_531_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
