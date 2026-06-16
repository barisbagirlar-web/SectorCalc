// Auto-generated from water-usage-calculator-schema.json
import * as z from 'zod';

export interface Water_usage_calculatorInput {
  numberOfPeople: number;
  showerMinutesPerDay: number;
  flowRateShower: number;
  toiletFlushesPerDay: number;
  flushVolume: number;
  washingMachineLoadsPerWeek: number;
  waterPerLoad: number;
  otherDailyUsage: number;
}

export const Water_usage_calculatorInputSchema = z.object({
  numberOfPeople: z.number().default(4),
  showerMinutesPerDay: z.number().default(5),
  flowRateShower: z.number().default(9),
  toiletFlushesPerDay: z.number().default(5),
  flushVolume: z.number().default(6),
  washingMachineLoadsPerWeek: z.number().default(5),
  waterPerLoad: z.number().default(50),
  otherDailyUsage: z.number().default(30),
});

function evaluateAllFormulas(input: Water_usage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.showerMinutesPerDay * input.flowRateShower; results["showerUsagePerPersonPerDay"] = Number.isFinite(v) ? v : 0; } catch { results["showerUsagePerPersonPerDay"] = 0; }
  try { const v = input.toiletFlushesPerDay * input.flushVolume; results["toiletUsagePerPersonPerDay"] = Number.isFinite(v) ? v : 0; } catch { results["toiletUsagePerPersonPerDay"] = 0; }
  try { const v = (input.washingMachineLoadsPerWeek * input.waterPerLoad) / 7; results["laundryUsagePerPersonPerDay"] = Number.isFinite(v) ? v : 0; } catch { results["laundryUsagePerPersonPerDay"] = 0; }
  try { const v = (results["showerUsagePerPersonPerDay"] ?? 0) + (results["toiletUsagePerPersonPerDay"] ?? 0) + (results["laundryUsagePerPersonPerDay"] ?? 0) + input.otherDailyUsage; results["totalUsagePerPersonPerDay"] = Number.isFinite(v) ? v : 0; } catch { results["totalUsagePerPersonPerDay"] = 0; }
  try { const v = (results["totalUsagePerPersonPerDay"] ?? 0) * input.numberOfPeople; results["totalUsagePerDay"] = Number.isFinite(v) ? v : 0; } catch { results["totalUsagePerDay"] = 0; }
  try { const v = (results["totalUsagePerDay"] ?? 0) * 30; results["totalUsagePerMonth"] = Number.isFinite(v) ? v : 0; } catch { results["totalUsagePerMonth"] = 0; }
  try { const v = (results["totalUsagePerDay"] ?? 0) * 365; results["totalUsagePerYear"] = Number.isFinite(v) ? v : 0; } catch { results["totalUsagePerYear"] = 0; }
  return results;
}


export function calculateWater_usage_calculator(input: Water_usage_calculatorInput): Water_usage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalUsagePerDay"] ?? 0;
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


export interface Water_usage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
