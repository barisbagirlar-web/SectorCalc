// Auto-generated from day-of-year-calculator-schema.json
import * as z from 'zod';

export interface Day_of_year_calculatorInput {
  month: number;
  day: number;
  year: number;
  fiscalStartMonth: number;
  fiscalStartDay: number;
}

export const Day_of_year_calculatorInputSchema = z.object({
  month: z.number().default(1),
  day: z.number().default(1),
  year: z.number().default(2023),
  fiscalStartMonth: z.number().default(1),
  fiscalStartDay: z.number().default(1),
});

function evaluateAllFormulas(input: Day_of_year_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.year % 4 === 0 && input.year % 100 !== 0) || (input.year % 400 === 0); results["isLeapYear"] = Number.isFinite(v) ? v : 0; } catch { results["isLeapYear"] = 0; }
  try { const v = [0,31,59,90,120,151,181,212,243,273,304,334] + input.day + ((input.month > 2 && (results["isLeapYear"] ?? 0)) ? 1 : 0); results["dayOfYear"] = Number.isFinite(v) ? v : 0; } catch { results["dayOfYear"] = 0; }
  try { const v = [0,31,59,90,120,151,181,212,243,273,304,334] + input.fiscalStartDay + ((input.fiscalStartMonth > 2 && (results["isLeapYear"] ?? 0)) ? 1 : 0); results["fiscalStartDayOfYear"] = Number.isFinite(v) ? v : 0; } catch { results["fiscalStartDayOfYear"] = 0; }
  try { const v = (((results["dayOfYear"] ?? 0) - (results["fiscalStartDayOfYear"] ?? 0) + ((results["isLeapYear"] ?? 0) ? 366 : 365)) % ((results["isLeapYear"] ?? 0) ? 366 : 365)) + 1; results["dayOfFiscalYear"] = Number.isFinite(v) ? v : 0; } catch { results["dayOfFiscalYear"] = 0; }
  return results;
}


export function calculateDay_of_year_calculator(input: Day_of_year_calculatorInput): Day_of_year_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dayOfYear"] ?? 0;
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


export interface Day_of_year_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
