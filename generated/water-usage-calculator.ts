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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Water_usage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.showerMinutesPerDay * input.flowRateShower; results["showerUsagePerPersonPerDay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["showerUsagePerPersonPerDay"] = Number.NaN; }
  try { const v = input.toiletFlushesPerDay * input.flushVolume; results["toiletUsagePerPersonPerDay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["toiletUsagePerPersonPerDay"] = Number.NaN; }
  try { const v = (input.washingMachineLoadsPerWeek * input.waterPerLoad) / 7; results["laundryUsagePerPersonPerDay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["laundryUsagePerPersonPerDay"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["showerUsagePerPersonPerDay"])) + (toNumericFormulaValue(results["toiletUsagePerPersonPerDay"])) + (toNumericFormulaValue(results["laundryUsagePerPersonPerDay"])) + input.otherDailyUsage; results["totalUsagePerPersonPerDay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalUsagePerPersonPerDay"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalUsagePerPersonPerDay"])) * input.numberOfPeople; results["totalUsagePerDay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalUsagePerDay"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalUsagePerDay"])) * 30; results["totalUsagePerMonth"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalUsagePerMonth"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalUsagePerDay"])) * 365; results["totalUsagePerYear"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalUsagePerYear"] = Number.NaN; }
  return results;
}


export function calculateWater_usage_calculator(input: Water_usage_calculatorInput): Water_usage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalUsagePerDay"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
