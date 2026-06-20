// Auto-generated from age-in-hours-calculator-schema.json
import * as z from 'zod';

export interface Age_in_hours_calculatorInput {
  ageYears: number;
  ageMonths: number;
  ageDays: number;
  ageHours: number;
  dataConfidence?: number;
}

export const Age_in_hours_calculatorInputSchema = z.object({
  ageYears: z.number().default(0),
  ageMonths: z.number().default(0),
  ageDays: z.number().default(0),
  ageHours: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Age_in_hours_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ageYears * 365.2425 + input.ageMonths * 30.436875 + input.ageDays; results["totalDays"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDays"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalDays"])) * 24 + input.ageHours; results["totalHours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalHours"] = Number.NaN; }
  return results;
}


export function calculateAge_in_hours_calculator(input: Age_in_hours_calculatorInput): Age_in_hours_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalDays"]);
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


export interface Age_in_hours_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
