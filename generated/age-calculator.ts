// Auto-generated from age-calculator-schema.json
import * as z from 'zod';

export interface Age_calculatorInput {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  referenceYear: number;
  referenceMonth: number;
  referenceDay: number;
}

export const Age_calculatorInputSchema = z.object({
  birthYear: z.number().default(1990),
  birthMonth: z.number().default(1),
  birthDay: z.number().default(1),
  referenceYear: z.number().default(2025),
  referenceMonth: z.number().default(1),
  referenceDay: z.number().default(1),
});

function evaluateAllFormulas(input: Age_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.floor((new Date(input.referenceYear, input.referenceMonth - 1, input.referenceDay) - new Date(input.birthYear, input.birthMonth - 1, input.birthDay)) / 86400000); results["ageInDays"] = Number.isFinite(v) ? v : 0; } catch { results["ageInDays"] = 0; }
  try { const v = (results["ageInDays"] ?? 0) / 365.25; results["ageInYears"] = Number.isFinite(v) ? v : 0; } catch { results["ageInYears"] = 0; }
  try { const v = (results["ageInDays"] ?? 0) / 30.4375; results["ageInMonths"] = Number.isFinite(v) ? v : 0; } catch { results["ageInMonths"] = 0; }
  try { const v = (results["ageInDays"] ?? 0) / 7; results["ageInWeeks"] = Number.isFinite(v) ? v : 0; } catch { results["ageInWeeks"] = 0; }
  try { const v = (results["ageInDays"] ?? 0) * 24; results["ageInHours"] = Number.isFinite(v) ? v : 0; } catch { results["ageInHours"] = 0; }
  return results;
}


export function calculateAge_calculator(input: Age_calculatorInput): Age_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["ageInYears"] ?? 0;
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


export interface Age_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
