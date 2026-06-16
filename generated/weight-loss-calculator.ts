// Auto-generated from weight-loss-calculator-schema.json
import * as z from 'zod';

export interface Weight_loss_calculatorInput {
  currentWeightKg: number;
  targetWeightKg: number;
  dailyDeficitKcal: number;
  periodDays: number;
}

export const Weight_loss_calculatorInputSchema = z.object({
  currentWeightKg: z.number().default(80),
  targetWeightKg: z.number().default(70),
  dailyDeficitKcal: z.number().default(500),
  periodDays: z.number().default(90),
});

function evaluateAllFormulas(input: Weight_loss_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.dailyDeficitKcal * input.periodDays) / 7700; results["estimatedWeightLossKg"] = Number.isFinite(v) ? v : 0; } catch { results["estimatedWeightLossKg"] = 0; }
  try { const v = input.dailyDeficitKcal * input.periodDays; results["totalDeficitKcal"] = Number.isFinite(v) ? v : 0; } catch { results["totalDeficitKcal"] = 0; }
  try { const v = input.currentWeightKg - ((input.dailyDeficitKcal * input.periodDays) / 7700); results["newWeightKg"] = Number.isFinite(v) ? v : 0; } catch { results["newWeightKg"] = 0; }
  return results;
}


export function calculateWeight_loss_calculator(input: Weight_loss_calculatorInput): Weight_loss_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["estimatedWeightLossKg"] ?? 0;
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


export interface Weight_loss_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
