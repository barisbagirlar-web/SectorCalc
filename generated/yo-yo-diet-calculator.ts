// Auto-generated from yo-yo-diet-calculator-schema.json
import * as z from 'zod';

export interface Yo_yo_diet_calculatorInput {
  initialWeight: number;
  currentWeight: number;
  numberOfCycles: number;
  weightLossPerCycle: number;
  weightRegainPerCycle: number;
  cycleDurationDays: number;
}

export const Yo_yo_diet_calculatorInputSchema = z.object({
  initialWeight: z.number().default(80),
  currentWeight: z.number().default(82),
  numberOfCycles: z.number().default(3),
  weightLossPerCycle: z.number().default(5),
  weightRegainPerCycle: z.number().default(4),
  cycleDurationDays: z.number().default(30),
});

function evaluateAllFormulas(input: Yo_yo_diet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentWeight - input.initialWeight; results["netWeightChange"] = Number.isFinite(v) ? v : 0; } catch { results["netWeightChange"] = 0; }
  try { const v = input.numberOfCycles * input.weightLossPerCycle; results["totalWeightLost"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeightLost"] = 0; }
  try { const v = input.numberOfCycles * input.weightRegainPerCycle; results["totalWeightRegained"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeightRegained"] = 0; }
  try { const v = (results["totalWeightLost"] ?? 0) !== 0 ? (results["totalWeightRegained"] ?? 0) / (results["totalWeightLost"] ?? 0) : 0; results["yoyoIndex"] = Number.isFinite(v) ? v : 0; } catch { results["yoyoIndex"] = 0; }
  try { const v = (input.weightLossPerCycle + input.weightRegainPerCycle) / 2; results["averageCycleFluctuation"] = Number.isFinite(v) ? v : 0; } catch { results["averageCycleFluctuation"] = 0; }
  return results;
}


export function calculateYo_yo_diet_calculator(input: Yo_yo_diet_calculatorInput): Yo_yo_diet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["yoyoIndex"] ?? 0;
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


export interface Yo_yo_diet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
