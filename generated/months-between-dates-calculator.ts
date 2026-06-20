// Auto-generated from months-between-dates-calculator-schema.json
import * as z from 'zod';

export interface Months_between_dates_calculatorInput {
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
  dataConfidence?: number;
}

export const Months_between_dates_calculatorInputSchema = z.object({
  startYear: z.number().default(2023),
  startMonth: z.number().default(1),
  endYear: z.number().default(2024),
  endMonth: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Months_between_dates_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.endYear - input.startYear) * 12 + (input.endMonth - input.startMonth); results["totalMonths"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMonths"] = Number.NaN; }
  try { const v = (input.endYear - input.startYear) * 12 + (input.endMonth - input.startMonth); results["totalMonths_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMonths_aux"] = Number.NaN; }
  return results;
}


export function calculateMonths_between_dates_calculator(input: Months_between_dates_calculatorInput): Months_between_dates_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalMonths"]);
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


export interface Months_between_dates_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
