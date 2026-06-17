// @ts-nocheck
// Auto-generated from persian-calendar-calculator-schema.json
import * as z from 'zod';

export interface Persian_calendar_calculatorInput {
  persianYear: number;
  persianMonth: number;
  persianDay: number;
  dayFraction: number;
}

export const Persian_calendar_calculatorInputSchema = z.object({
  persianYear: z.number().default(1402),
  persianMonth: z.number().default(1),
  persianDay: z.number().default(1),
  dayFraction: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Persian_calendar_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 365 * (input.persianYear - 1) + 30 * (input.persianMonth - 1) + (input.persianDay - 1) + input.dayFraction; results["julianDay"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["julianDay"] = 0; }
  try { const v = 365 * (input.persianYear - 1); results["daysFromYear"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["daysFromYear"] = 0; }
  try { const v = 30 * (input.persianMonth - 1); results["daysFromMonth"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["daysFromMonth"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePersian_calendar_calculator(input: Persian_calendar_calculatorInput): Persian_calendar_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["julianDay"]);
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


export interface Persian_calendar_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
