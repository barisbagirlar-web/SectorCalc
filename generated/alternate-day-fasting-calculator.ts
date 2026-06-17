// Auto-generated from alternate-day-fasting-calculator-schema.json
import * as z from 'zod';

export interface Alternate_day_fasting_calculatorInput {
  normalCal: number;
  fastingCal: number;
  totalDays: number;
  startDay: number;
}

export const Alternate_day_fasting_calculatorInputSchema = z.object({
  normalCal: z.number().default(2000),
  fastingCal: z.number().default(500),
  totalDays: z.number().default(30),
  startDay: z.number().default(0),
});

function evaluateAllFormulas(input: Alternate_day_fasting_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.startDay === 0 ? Math.floor(input.totalDays / 2) : Math.ceil(input.totalDays / 2); results["fastingDays"] = Number.isFinite(v) ? v : 0; } catch { results["fastingDays"] = 0; }
  try { const v = input.totalDays - (results["fastingDays"] ?? 0); results["normalDays"] = Number.isFinite(v) ? v : 0; } catch { results["normalDays"] = 0; }
  try { const v = (results["normalDays"] ?? 0) * input.normalCal + (results["fastingDays"] ?? 0) * input.fastingCal; results["totalCalories"] = Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  try { const v = (results["totalCalories"] ?? 0) / input.totalDays; results["averageDailyCalories"] = Number.isFinite(v) ? v : 0; } catch { results["averageDailyCalories"] = 0; }
  return results;
}


export function calculateAlternate_day_fasting_calculator(input: Alternate_day_fasting_calculatorInput): Alternate_day_fasting_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCalories"] ?? 0;
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


export interface Alternate_day_fasting_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
