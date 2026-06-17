// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Years_between_dates_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.endYear - input.startYear) * 365 + (input.endMonth - input.startMonth) * 30 + (input.endDay - input.startDay); results["totalDays"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalDays"] = 0; }
  try { const v = (asFormulaNumber(results["totalDays"])) / 365.25; results["yearsDifference"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["yearsDifference"] = 0; }
  try { const v = (asFormulaNumber(results["totalDays"])) / 30; results["totalMonths"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalMonths"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateYears_between_dates_calculator(input: Years_between_dates_calculatorInput): Years_between_dates_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["yearsDifference"]);
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


export interface Years_between_dates_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
