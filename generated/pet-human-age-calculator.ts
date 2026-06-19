// Auto-generated from pet-human-age-calculator-schema.json
import * as z from 'zod';

export interface Pet_human_age_calculatorInput {
  petAgeYears: number;
  petAgeMonths: number;
  petType: number;
  size: number;
  dataConfidence?: number;
}

export const Pet_human_age_calculatorInputSchema = z.object({
  petAgeYears: z.number().default(0),
  petAgeMonths: z.number().default(0),
  petType: z.number().default(1),
  size: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pet_human_age_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.petAgeYears + input.petAgeMonths/12; results["totalYears"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalYears"] = 0; }
  try { const v = input.petType == 1 ? (input.size == 1 ? 4 : input.size == 2 ? 5 : 6) : (input.petType == 2 ? 4 : 0); results["factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePet_human_age_calculator(input: Pet_human_age_calculatorInput): Pet_human_age_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["factor"]);
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


export interface Pet_human_age_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
