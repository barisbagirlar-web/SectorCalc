// Auto-generated from years-between-dates-calculator-schema.json
import * as z from 'zod';

export interface Years_between_dates_calculatorInput {
  startDay: number;
  startMonth: number;
  startYear: number;
  endDay: number;
  endMonth: number;
  endYear: number;
  dataConfidence?: number;
}

export const Years_between_dates_calculatorInputSchema = z.object({
  startDay: z.number().default(1),
  startMonth: z.number().default(1),
  startYear: z.number().default(2025),
  endDay: z.number().default(1),
  endMonth: z.number().default(1),
  endYear: z.number().default(2025),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Years_between_dates_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.endYear - input.startYear) * 365 + (input.endMonth - input.startMonth) * 30 + (input.endDay - input.startDay); results["totalDays"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDays"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalDays"])) / 365.25; results["yearsDifference"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yearsDifference"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalDays"])) / 30; results["totalMonths"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMonths"] = Number.NaN; }
  return results;
}


export function calculateYears_between_dates_calculator(input: Years_between_dates_calculatorInput): Years_between_dates_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["yearsDifference"]);
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


export interface Years_between_dates_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
