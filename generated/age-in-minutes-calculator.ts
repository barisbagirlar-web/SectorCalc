// Auto-generated from age-in-minutes-calculator-schema.json
import * as z from 'zod';

export interface Age_in_minutes_calculatorInput {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  dataConfidence?: number;
}

export const Age_in_minutes_calculatorInputSchema = z.object({
  years: z.number().default(0),
  months: z.number().default(0),
  days: z.number().default(0),
  hours: z.number().default(0),
  minutes: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Age_in_minutes_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.years * 365.25 * 24 * 60; results["yearsInMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yearsInMinutes"] = Number.NaN; }
  try { const v = input.months * 30.44 * 24 * 60; results["monthsInMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthsInMinutes"] = Number.NaN; }
  try { const v = input.days * 24 * 60; results["daysInMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["daysInMinutes"] = Number.NaN; }
  try { const v = input.hours * 60; results["hoursInMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["hoursInMinutes"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["yearsInMinutes"])) + (toNumericFormulaValue(results["monthsInMinutes"])) + (toNumericFormulaValue(results["daysInMinutes"])) + (toNumericFormulaValue(results["hoursInMinutes"])) + input.minutes; results["totalMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMinutes"] = Number.NaN; }
  return results;
}


export function calculateAge_in_minutes_calculator(input: Age_in_minutes_calculatorInput): Age_in_minutes_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalMinutes"]);
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


export interface Age_in_minutes_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
