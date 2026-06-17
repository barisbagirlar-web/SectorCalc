// Auto-generated from how-long-to-lose-weight-schema.json
import * as z from 'zod';

export interface How_long_to_lose_weightInput {
  currentWeight: number;
  targetWeight: number;
  dailyDeficit: number;
  kcalPerKg: number;
}

export const How_long_to_lose_weightInputSchema = z.object({
  currentWeight: z.number(),
  targetWeight: z.number(),
  dailyDeficit: z.number(),
  kcalPerKg: z.number(),
});

function evaluateAllFormulas(input: How_long_to_lose_weightInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentWeight - input.targetWeight; results["weightLossKg"] = Number.isFinite(v) ? v : 0; } catch { results["weightLossKg"] = 0; }
  try { const v = (results["weightLossKg"] ?? 0) * input.kcalPerKg; results["totalDeficitNeeded"] = Number.isFinite(v) ? v : 0; } catch { results["totalDeficitNeeded"] = 0; }
  try { const v = (results["totalDeficitNeeded"] ?? 0) / input.dailyDeficit; results["days"] = Number.isFinite(v) ? v : 0; } catch { results["days"] = 0; }
  try { const v = (results["days"] ?? 0) / 7; results["weeks"] = Number.isFinite(v) ? v : 0; } catch { results["weeks"] = 0; }
  try { const v = (results["days"] ?? 0) / 30.4375; results["months"] = Number.isFinite(v) ? v : 0; } catch { results["months"] = 0; }
  return results;
}


export function calculateHow_long_to_lose_weight(input: How_long_to_lose_weightInput): How_long_to_lose_weightOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["days"] ?? 0;
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


export interface How_long_to_lose_weightOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
