// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Water_usage_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.showerMinutesPerDay * input.flowRateShower; results["showerUsagePerPersonPerDay"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["showerUsagePerPersonPerDay"] = 0; }
  try { const v = input.toiletFlushesPerDay * input.flushVolume; results["toiletUsagePerPersonPerDay"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["toiletUsagePerPersonPerDay"] = 0; }
  try { const v = (input.washingMachineLoadsPerWeek * input.waterPerLoad) / 7; results["laundryUsagePerPersonPerDay"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["laundryUsagePerPersonPerDay"] = 0; }
  try { const v = (asFormulaNumber(results["showerUsagePerPersonPerDay"])) + (asFormulaNumber(results["toiletUsagePerPersonPerDay"])) + (asFormulaNumber(results["laundryUsagePerPersonPerDay"])) + input.otherDailyUsage; results["totalUsagePerPersonPerDay"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalUsagePerPersonPerDay"] = 0; }
  try { const v = (asFormulaNumber(results["totalUsagePerPersonPerDay"])) * input.numberOfPeople; results["totalUsagePerDay"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalUsagePerDay"] = 0; }
  try { const v = (asFormulaNumber(results["totalUsagePerDay"])) * 30; results["totalUsagePerMonth"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalUsagePerMonth"] = 0; }
  try { const v = (asFormulaNumber(results["totalUsagePerDay"])) * 365; results["totalUsagePerYear"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalUsagePerYear"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateWater_usage_calculator(input: Water_usage_calculatorInput): Water_usage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalUsagePerDay"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
