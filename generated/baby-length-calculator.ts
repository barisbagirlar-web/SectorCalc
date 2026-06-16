// Auto-generated from baby-length-calculator-schema.json
import * as z from 'zod';

export interface Baby_length_calculatorInput {
  ageMonths: number;
  weightKg: number;
  genderCode: number;
  prematureWeeks: number;
}

export const Baby_length_calculatorInputSchema = z.object({
  ageMonths: z.number().default(6),
  weightKg: z.number().default(7.5),
  genderCode: z.number().default(0),
  prematureWeeks: z.number().default(0),
});

function evaluateAllFormulas(input: Baby_length_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ageMonths - (input.prematureWeeks / 4.345); results["correctedAge"] = Number.isFinite(v) ? v : 0; } catch { results["correctedAge"] = 0; }
  try { const v = 45 + 2.5 * (results["correctedAge"] ?? 0); results["ageComponent"] = Number.isFinite(v) ? v : 0; } catch { results["ageComponent"] = 0; }
  try { const v = 0.8 * input.weightKg; results["weightComponent"] = Number.isFinite(v) ? v : 0; } catch { results["weightComponent"] = 0; }
  try { const v = input.genderCode * 1.0; results["genderComponent"] = Number.isFinite(v) ? v : 0; } catch { results["genderComponent"] = 0; }
  try { const v = (results["ageComponent"] ?? 0) + (results["weightComponent"] ?? 0) + (results["genderComponent"] ?? 0); results["estimatedLength"] = Number.isFinite(v) ? v : 0; } catch { results["estimatedLength"] = 0; }
  return results;
}


export function calculateBaby_length_calculator(input: Baby_length_calculatorInput): Baby_length_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["estimatedLength"] ?? 0;
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


export interface Baby_length_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
