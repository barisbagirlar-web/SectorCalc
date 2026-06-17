// @ts-nocheck
// Auto-generated from age-in-minutes-calculator-schema.json
import * as z from 'zod';

export interface Age_in_minutes_calculatorInput {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
}

export const Age_in_minutes_calculatorInputSchema = z.object({
  years: z.number().default(0),
  months: z.number().default(0),
  days: z.number().default(0),
  hours: z.number().default(0),
  minutes: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Age_in_minutes_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.years * 365.25 * 24 * 60; results["yearsInMinutes"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["yearsInMinutes"] = 0; }
  try { const v = input.months * 30.44 * 24 * 60; results["monthsInMinutes"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthsInMinutes"] = 0; }
  try { const v = input.days * 24 * 60; results["daysInMinutes"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["daysInMinutes"] = 0; }
  try { const v = input.hours * 60; results["hoursInMinutes"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["hoursInMinutes"] = 0; }
  try { const v = (asFormulaNumber(results["yearsInMinutes"])) + (asFormulaNumber(results["monthsInMinutes"])) + (asFormulaNumber(results["daysInMinutes"])) + (asFormulaNumber(results["hoursInMinutes"])) + input.minutes; results["totalMinutes"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalMinutes"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateAge_in_minutes_calculator(input: Age_in_minutes_calculatorInput): Age_in_minutes_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalMinutes"]);
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


export interface Age_in_minutes_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
