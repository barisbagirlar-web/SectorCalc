// Auto-generated from business-days-calculator-schema.json
import * as z from 'zod';

export interface Business_days_calculatorInput {
  totalCalendarDays: number;
  saturdays: number;
  sundays: number;
  holidays: number;
}

export const Business_days_calculatorInputSchema = z.object({
  totalCalendarDays: z.number().default(0),
  saturdays: z.number().default(0),
  sundays: z.number().default(0),
  holidays: z.number().default(0),
});

function evaluateAllFormulas(input: Business_days_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalCalendarDays - input.saturdays - input.sundays - input.holidays; results["businessDays"] = Number.isFinite(v) ? v : 0; } catch { results["businessDays"] = 0; }
  try { const v = input.saturdays + input.sundays; results["totalWeekendDays"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeekendDays"] = 0; }
  try { const v = input.saturdays + input.sundays + input.holidays; results["totalNonWorkingDays"] = Number.isFinite(v) ? v : 0; } catch { results["totalNonWorkingDays"] = 0; }
  return results;
}


export function calculateBusiness_days_calculator(input: Business_days_calculatorInput): Business_days_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["businessDays"] ?? 0;
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


export interface Business_days_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
