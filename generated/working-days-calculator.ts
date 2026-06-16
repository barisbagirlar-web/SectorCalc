// Auto-generated from working-days-calculator-schema.json
import * as z from 'zod';

export interface Working_days_calculatorInput {
  startDate: number;
  endDate: number;
  includeStart: number;
  includeEnd: number;
  weekendDaysPerWeek: number;
  holidays: number;
}

export const Working_days_calculatorInputSchema = z.object({
  startDate: z.number().default(44927),
  endDate: z.number().default(44957),
  includeStart: z.number().default(1),
  includeEnd: z.number().default(1),
  weekendDaysPerWeek: z.number().default(2),
  holidays: z.number().default(0),
});

function evaluateAllFormulas(input: Working_days_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.endDate - input.startDate + input.includeStart + input.includeEnd - 1; results["totalCalendarDays"] = Number.isFinite(v) ? v : 0; } catch { results["totalCalendarDays"] = 0; }
  try { const v = (input.weekendDaysPerWeek / 7) * (results["totalCalendarDays"] ?? 0); results["estimatedWeekendDays"] = Number.isFinite(v) ? v : 0; } catch { results["estimatedWeekendDays"] = 0; }
  try { const v = (results["totalCalendarDays"] ?? 0) - (results["estimatedWeekendDays"] ?? 0) - input.holidays; results["workingDays"] = Number.isFinite(v) ? v : 0; } catch { results["workingDays"] = 0; }
  return results;
}


export function calculateWorking_days_calculator(input: Working_days_calculatorInput): Working_days_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["workingDays"] ?? 0;
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


export interface Working_days_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
