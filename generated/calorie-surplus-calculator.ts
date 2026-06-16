// Auto-generated from calorie-surplus-calculator-schema.json
import * as z from 'zod';

export interface Calorie_surplus_calculatorInput {
  totalGenerated: number;
  totalConsumed: number;
  lossPercent: number;
  storageEfficiency: number;
  auxConsumption: number;
}

export const Calorie_surplus_calculatorInputSchema = z.object({
  totalGenerated: z.number().default(10000),
  totalConsumed: z.number().default(8000),
  lossPercent: z.number().default(5),
  storageEfficiency: z.number().default(90),
  auxConsumption: z.number().default(200),
});

function evaluateAllFormulas(input: Calorie_surplus_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalGenerated - input.totalConsumed; results["grossSurplus"] = Number.isFinite(v) ? v : 0; } catch { results["grossSurplus"] = 0; }
  try { const v = (results["grossSurplus"] ?? 0) * (1 - input.lossPercent / 100) * (input.storageEfficiency / 100) - input.auxConsumption; results["netSurplus"] = Number.isFinite(v) ? v : 0; } catch { results["netSurplus"] = 0; }
  try { const v = (results["grossSurplus"] ?? 0) - (results["netSurplus"] ?? 0); results["totalLosses"] = Number.isFinite(v) ? v : 0; } catch { results["totalLosses"] = 0; }
  return results;
}


export function calculateCalorie_surplus_calculator(input: Calorie_surplus_calculatorInput): Calorie_surplus_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netSurplus"] ?? 0;
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


export interface Calorie_surplus_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
