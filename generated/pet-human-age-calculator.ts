// Auto-generated from pet-human-age-calculator-schema.json
import * as z from 'zod';

export interface Pet_human_age_calculatorInput {
  petAgeYears: number;
  petAgeMonths: number;
  petType: number;
  size: number;
}

export const Pet_human_age_calculatorInputSchema = z.object({
  petAgeYears: z.number().default(0),
  petAgeMonths: z.number().default(0),
  petType: z.number().default(1),
  size: z.number().default(1),
});

function evaluateAllFormulas(input: Pet_human_age_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.petAgeYears + input.petAgeMonths/12; results["totalYears"] = Number.isFinite(v) ? v : 0; } catch { results["totalYears"] = 0; }
  try { const v = input.petType == 1 ? (input.size == 1 ? 4 : input.size == 2 ? 5 : 6) : (input.petType == 2 ? 4 : 0); results["factor"] = Number.isFinite(v) ? v : 0; } catch { results["factor"] = 0; }
  try { const v = (Math.min((results["totalYears"] ?? 0),1)*15) + (Math.max(0, Math.min((results["totalYears"] ?? 0)-1,1))*9) + (Math.max(0, (results["totalYears"] ?? 0)-2)*(results["factor"] ?? 0)); results["humanAge"] = Number.isFinite(v) ? v : 0; } catch { results["humanAge"] = 0; }
  results["first_year___15_human_years__second_year"] = 0;
  return results;
}


export function calculatePet_human_age_calculator(input: Pet_human_age_calculatorInput): Pet_human_age_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["humanAge"] ?? 0;
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


export interface Pet_human_age_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
