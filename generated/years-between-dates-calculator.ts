// Auto-generated from years-between-dates-calculator-schema.json
import * as z from 'zod';

export interface Years_between_dates_calculatorInput {
  startDay: number;
  startMonth: number;
  startYear: number;
  endDay: number;
  endMonth: number;
  endYear: number;
}

export const Years_between_dates_calculatorInputSchema = z.object({
  startDay: z.number().default(1),
  startMonth: z.number().default(1),
  startYear: z.number().default(2025),
  endDay: z.number().default(1),
  endMonth: z.number().default(1),
  endYear: z.number().default(2025),
});

function evaluateAllFormulas(input: Years_between_dates_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.endYear - input.startYear) * 365 + (input.endMonth - input.startMonth) * 30 + (input.endDay - input.startDay); results["totalDays"] = Number.isFinite(v) ? v : 0; } catch { results["totalDays"] = 0; }
  try { const v = (results["totalDays"] ?? 0) / 365.25; results["yearsDifference"] = Number.isFinite(v) ? v : 0; } catch { results["yearsDifference"] = 0; }
  try { const v = (results["totalDays"] ?? 0) / 30; results["totalMonths"] = Number.isFinite(v) ? v : 0; } catch { results["totalMonths"] = 0; }
  return results;
}


export function calculateYears_between_dates_calculator(input: Years_between_dates_calculatorInput): Years_between_dates_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["yearsDifference"] ?? 0;
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


export interface Years_between_dates_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
