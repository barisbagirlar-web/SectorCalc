// Auto-generated from age-in-days-calculator-schema.json
import * as z from 'zod';

export interface Age_in_days_calculatorInput {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  refYear: number;
  refMonth: number;
  refDay: number;
}

export const Age_in_days_calculatorInputSchema = z.object({
  birthYear: z.number().default(1990),
  birthMonth: z.number().default(1),
  birthDay: z.number().default(1),
  refYear: z.number().default(2025),
  refMonth: z.number().default(1),
  refDay: z.number().default(1),
});

function evaluateAllFormulas(input: Age_in_days_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { const birth = new Date(input.birthYear, input.birthMonth - 1, input.birthDay); const ref = new Date(input.refYear, input.refMonth - 1, input.refDay); const diff = Math.floor((ref - birth) / (1000 * 60 * 60 * 24)); return { ageInDays: diff, birthString: birth.toISOString().split('T')[0], refString: ref.toISOString().split('T')[0], diffDays: diff }; })(); results["calculate"] = Number.isFinite(v) ? v : 0; } catch { results["calculate"] = 0; }
  return results;
}


export function calculateAge_in_days_calculator(input: Age_in_days_calculatorInput): Age_in_days_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["ageInDays"] ?? 0;
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


export interface Age_in_days_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
