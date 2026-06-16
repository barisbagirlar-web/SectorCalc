// Auto-generated from turkey-cooking-time-calculator-schema.json
import * as z from 'zod';

export interface Turkey_cooking_time_calculatorInput {
  weightKg: number;
  ovenTempC: number;
  isStuffed: number;
  startTempC: number;
}

export const Turkey_cooking_time_calculatorInputSchema = z.object({
  weightKg: z.number().default(5),
  ovenTempC: z.number().default(175),
  isStuffed: z.number().default(0),
  startTempC: z.number().default(4),
});

function evaluateAllFormulas(input: Turkey_cooking_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weightKg * 2.20462; results["weightLbs"] = Number.isFinite(v) ? v : 0; } catch { results["weightLbs"] = 0; }
  try { const v = input.ovenTempC * 9/5 + 32; results["ovenTempF"] = Number.isFinite(v) ? v : 0; } catch { results["ovenTempF"] = 0; }
  try { const v = input.isStuffed * 5; results["stuffingRate"] = Number.isFinite(v) ? v : 0; } catch { results["stuffingRate"] = 0; }
  try { const v = 17.5 + (results["stuffingRate"] ?? 0); results["baseRate"] = Number.isFinite(v) ? v : 0; } catch { results["baseRate"] = 0; }
  try { const v = (results["weightLbs"] ?? 0) * (results["baseRate"] ?? 0); results["baseTime"] = Number.isFinite(v) ? v : 0; } catch { results["baseTime"] = 0; }
  try { const v = (results["baseTime"] ?? 0) * (325 / (results["ovenTempF"] ?? 0)); results["adjustedTime"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedTime"] = 0; }
  try { const v = (74 - input.startTempC) / 70; results["startFactor"] = Number.isFinite(v) ? v : 0; } catch { results["startFactor"] = 0; }
  try { const v = (results["adjustedTime"] ?? 0) * (results["startFactor"] ?? 0); results["finalTimeMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["finalTimeMinutes"] = 0; }
  try { const v = (results["finalTimeMinutes"] ?? 0) / 60; results["finalTimeHours"] = Number.isFinite(v) ? v : 0; } catch { results["finalTimeHours"] = 0; }
  return results;
}


export function calculateTurkey_cooking_time_calculator(input: Turkey_cooking_time_calculatorInput): Turkey_cooking_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["finalTimeMinutes"] ?? 0;
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


export interface Turkey_cooking_time_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
