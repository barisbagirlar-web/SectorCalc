// Auto-generated from months-between-dates-calculator-schema.json
import * as z from 'zod';

export interface Months_between_dates_calculatorInput {
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
}

export const Months_between_dates_calculatorInputSchema = z.object({
  startYear: z.number().default(2023),
  startMonth: z.number().default(1),
  endYear: z.number().default(2024),
  endMonth: z.number().default(1),
});

function evaluateAllFormulas(input: Months_between_dates_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.endYear - input.startYear) * 12 + (input.endMonth - input.startMonth); results["totalMonths"] = Number.isFinite(v) ? v : 0; } catch { results["totalMonths"] = 0; }
  try { const v = Math.floor((results["totalMonths"] ?? 0) / 12); results["years"] = Number.isFinite(v) ? v : 0; } catch { results["years"] = 0; }
  try { const v = (results["totalMonths"] ?? 0) % 12; results["months"] = Number.isFinite(v) ? v : 0; } catch { results["months"] = 0; }
  return results;
}


export function calculateMonths_between_dates_calculator(input: Months_between_dates_calculatorInput): Months_between_dates_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalMonths"] ?? 0;
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


export interface Months_between_dates_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
