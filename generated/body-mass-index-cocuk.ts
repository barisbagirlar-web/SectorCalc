// Auto-generated from body-mass-index-cocuk-schema.json
import * as z from 'zod';

export interface Body_mass_index_cocukInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
}

export const Body_mass_index_cocukInputSchema = z.object({
  weight: z.number().default(30),
  height: z.number().default(130),
  age: z.number().default(8),
  gender: z.number().default(0),
});

function evaluateAllFormulas(input: Body_mass_index_cocukInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight / ((input.height / 100) ** 2); results["bmi"] = Number.isFinite(v) ? v : 0; } catch { results["bmi"] = 0; }
  try { const v = 0.5 + 0.5 * Math.erf(((results["bmi"] ?? 0) - 17.5) / (2.5 * Math.sqrt(2))); results["bmiPercentile"] = Number.isFinite(v) ? v : 0; } catch { results["bmiPercentile"] = 0; }
  try { const v = (results["bmi"] ?? 0) < 14.5 ? 'Zayıf' : ((results["bmi"] ?? 0) < 18.5 ? 'Normal' : ((results["bmi"] ?? 0) < 25 ? 'Fazla Kilolu' : 'Obez')); results["bmiCategory"] = Number.isFinite(v) ? v : 0; } catch { results["bmiCategory"] = 0; }
  return results;
}


export function calculateBody_mass_index_cocuk(input: Body_mass_index_cocukInput): Body_mass_index_cocukOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["bmi"] ?? 0;
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


export interface Body_mass_index_cocukOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
