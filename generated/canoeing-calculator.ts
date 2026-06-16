// Auto-generated from canoeing-calculator-schema.json
import * as z from 'zod';

export interface Canoeing_calculatorInput {
  paddlePower: number;
  dragCoefficient: number;
  waterDensity: number;
  frontalArea: number;
  canoeWeight: number;
  paddlerWeight: number;
}

export const Canoeing_calculatorInputSchema = z.object({
  paddlePower: z.number().default(100),
  dragCoefficient: z.number().default(0.04),
  waterDensity: z.number().default(1000),
  frontalArea: z.number().default(0.5),
  canoeWeight: z.number().default(20),
  paddlerWeight: z.number().default(75),
});

function evaluateAllFormulas(input: Canoeing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.pow((2 * input.paddlePower) / (input.dragCoefficient * input.waterDensity * input.frontalArea), 1/3); results["speed"] = Number.isFinite(v) ? v : 0; } catch { results["speed"] = 0; }
  try { const v = 0.5 * input.dragCoefficient * input.waterDensity * input.frontalArea * Math.pow((results["speed"] ?? 0), 2); results["dragForce"] = Number.isFinite(v) ? v : 0; } catch { results["dragForce"] = 0; }
  try { const v = input.canoeWeight + input.paddlerWeight; results["totalWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  return results;
}


export function calculateCanoeing_calculator(input: Canoeing_calculatorInput): Canoeing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["speed"] ?? 0;
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


export interface Canoeing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
