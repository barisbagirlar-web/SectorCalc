// Auto-generated from age-in-hours-calculator-schema.json
import * as z from 'zod';

export interface Age_in_hours_calculatorInput {
  ageYears: number;
  ageMonths: number;
  ageDays: number;
  ageHours: number;
}

export const Age_in_hours_calculatorInputSchema = z.object({
  ageYears: z.number().default(0),
  ageMonths: z.number().default(0),
  ageDays: z.number().default(0),
  ageHours: z.number().default(0),
});

function evaluateAllFormulas(input: Age_in_hours_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ageYears * 365.2425 + input.ageMonths * 30.436875 + input.ageDays; results["totalDays"] = Number.isFinite(v) ? v : 0; } catch { results["totalDays"] = 0; }
  try { const v = (results["totalDays"] ?? 0) * 24 + input.ageHours; results["totalHours"] = Number.isFinite(v) ? v : 0; } catch { results["totalHours"] = 0; }
  return results;
}


export function calculateAge_in_hours_calculator(input: Age_in_hours_calculatorInput): Age_in_hours_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalDays"] ?? 0;
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


export interface Age_in_hours_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
