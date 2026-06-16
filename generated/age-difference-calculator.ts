// Auto-generated from age-difference-calculator-schema.json
import * as z from 'zod';

export interface Age_difference_calculatorInput {
  person1Years: number;
  person1Months: number;
  person2Years: number;
  person2Months: number;
}

export const Age_difference_calculatorInputSchema = z.object({
  person1Years: z.number().default(30),
  person1Months: z.number().default(0),
  person2Years: z.number().default(25),
  person2Months: z.number().default(0),
});

function evaluateAllFormulas(input: Age_difference_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.abs(input.person1Years + input.person1Months / 12 - (input.person2Years + input.person2Months / 12)); results["diffYears"] = Number.isFinite(v) ? v : 0; } catch { results["diffYears"] = 0; }
  try { const v = input.person1Years + input.person1Months / 12; results["totalAge1"] = Number.isFinite(v) ? v : 0; } catch { results["totalAge1"] = 0; }
  try { const v = input.person2Years + input.person2Months / 12; results["totalAge2"] = Number.isFinite(v) ? v : 0; } catch { results["totalAge2"] = 0; }
  try { const v = Math.abs(input.person1Years + input.person1Months / 12 - (input.person2Years + input.person2Months / 12)) * 12; results["diffMonths"] = Number.isFinite(v) ? v : 0; } catch { results["diffMonths"] = 0; }
  return results;
}


export function calculateAge_difference_calculator(input: Age_difference_calculatorInput): Age_difference_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total"] ?? 0;
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


export interface Age_difference_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
