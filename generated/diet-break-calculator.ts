// @ts-nocheck
// Auto-generated from diet-break-calculator-schema.json
import * as z from 'zod';

export interface Diet_break_calculatorInput {
  dailyCalories: number;
  dietDays: number;
  breakDays: number;
  activityFactor: number;
  weight: number;
}

export const Diet_break_calculatorInputSchema = z.object({
  dailyCalories: z.number().default(2000),
  dietDays: z.number().default(5),
  breakDays: z.number().default(2),
  activityFactor: z.number().default(1.2),
  weight: z.number().default(70),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Diet_break_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.dailyCalories * input.dietDays + (input.dailyCalories * input.activityFactor) * input.breakDays; results["totalWeeklyCalories"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalWeeklyCalories"] = 0; }
  try { const v = (input.dailyCalories * input.dietDays + (input.dailyCalories * input.activityFactor) * input.breakDays) / (input.dietDays + input.breakDays); results["averageDailyCalories"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["averageDailyCalories"] = 0; }
  try { const v = input.dailyCalories * input.activityFactor; results["breakDayCalories"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["breakDayCalories"] = 0; }
  try { const v = (input.dailyCalories * input.dietDays + (input.dailyCalories * input.activityFactor) * input.breakDays) / (input.dietDays + input.breakDays) - input.dailyCalories; results["calorieDifference"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["calorieDifference"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDiet_break_calculator(input: Diet_break_calculatorInput): Diet_break_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalWeeklyCalories"]);
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


export interface Diet_break_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
