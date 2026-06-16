// Auto-generated from horse-weight-calculator-schema.json
import * as z from 'zod';

export interface Horse_weight_calculatorInput {
  heartGirthCm: number;
  bodyLengthCm: number;
  heightCm: number;
  ageYears: number;
}

export const Horse_weight_calculatorInputSchema = z.object({
  heartGirthCm: z.number().default(180),
  bodyLengthCm: z.number().default(170),
  heightCm: z.number().default(155),
  ageYears: z.number().default(7),
});

function evaluateAllFormulas(input: Horse_weight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.heartGirthCm ** 2 * input.bodyLengthCm) / 11877; results["weightKg"] = Number.isFinite(v) ? v : 0; } catch { results["weightKg"] = 0; }
  try { const v = (results["weightKg"] ?? 0) * 2.20462; results["weightLbs"] = Number.isFinite(v) ? v : 0; } catch { results["weightLbs"] = 0; }
  return results;
}


export function calculateHorse_weight_calculator(input: Horse_weight_calculatorInput): Horse_weight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["weightKg"] ?? 0;
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


export interface Horse_weight_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
