// Auto-generated from dog-years-calculator-schema.json
import * as z from 'zod';

export interface Dog_years_calculatorInput {
  humanAge: number;
  breedSize: number;
  weight: number;
  activityLevel: number;
}

export const Dog_years_calculatorInputSchema = z.object({
  humanAge: z.number().default(5),
  breedSize: z.number().default(2),
  weight: z.number().default(15),
  activityLevel: z.number().default(2),
});

function evaluateAllFormulas(input: Dog_years_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.humanAge * 7; results["dogYearsOld"] = Number.isFinite(v) ? v : 0; } catch { results["dogYearsOld"] = 0; }
  try { const v = 16 * Math.log(input.humanAge) + 31; results["dogYearsNew"] = Number.isFinite(v) ? v : 0; } catch { results["dogYearsNew"] = 0; }
  try { const v = input.breedSize * (16 * Math.log(input.humanAge) + 31) / 2; results["dogYearsAdjusted"] = Number.isFinite(v) ? v : 0; } catch { results["dogYearsAdjusted"] = 0; }
  return results;
}


export function calculateDog_years_calculator(input: Dog_years_calculatorInput): Dog_years_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dogYearsAdjusted"] ?? 0;
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


export interface Dog_years_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
