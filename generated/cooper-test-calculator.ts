// Auto-generated from cooper-test-calculator-schema.json
import * as z from 'zod';

export interface Cooper_test_calculatorInput {
  distance_m: number;
  age_years: number;
  gender: number;
  weight_kg: number;
}

export const Cooper_test_calculatorInputSchema = z.object({
  distance_m: z.number().default(2400),
  age_years: z.number().default(30),
  gender: z.number().default(0),
  weight_kg: z.number().default(70),
});

function evaluateAllFormulas(input: Cooper_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.distance_m - 504.9) / 44.73; results["vo2max"] = Number.isFinite(v) ? v : 0; } catch { results["vo2max"] = 0; }
  try { const v = (input.gender === 0 ? (input.age_years < 30 ? ((results["vo2max"] ?? 0) >= 55 ? 'Excellent' : (results["vo2max"] ?? 0) >= 45 ? 'Good' : (results["vo2max"] ?? 0) >= 35 ? 'Average' : (results["vo2max"] ?? 0) >= 30 ? 'Fair' : 'Poor') : input.age_years < 40 ? ((results["vo2max"] ?? 0) >= 50 ? 'Excellent' : (results["vo2max"] ?? 0) >= 40 ? 'Good' : (results["vo2max"] ?? 0) >= 33 ? 'Average' : (results["vo2max"] ?? 0) >= 28 ? 'Fair' : 'Poor') : input.age_years < 50 ? ((results["vo2max"] ?? 0) >= 45 ? 'Excellent' : (results["vo2max"] ?? 0) >= 36 ? 'Good' : (results["vo2max"] ?? 0) >= 30 ? 'Average' : (results["vo2max"] ?? 0) >= 26 ? 'Fair' : 'Poor') : ((results["vo2max"] ?? 0) >= 40 ? 'Excellent' : (results["vo2max"] ?? 0) >= 32 ? 'Good' : (results["vo2max"] ?? 0) >= 27 ? 'Average' : (results["vo2max"] ?? 0) >= 23 ? 'Fair' : 'Poor')) : (input.age_years < 30 ? ((results["vo2max"] ?? 0) >= 50 ? 'Excellent' : (results["vo2max"] ?? 0) >= 39 ? 'Good' : (results["vo2max"] ?? 0) >= 30 ? 'Average' : (results["vo2max"] ?? 0) >= 25 ? 'Fair' : 'Poor') : input.age_years < 40 ? ((results["vo2max"] ?? 0) >= 46 ? 'Excellent' : (results["vo2max"] ?? 0) >= 35 ? 'Good' : (results["vo2max"] ?? 0) >= 28 ? 'Average' : (results["vo2max"] ?? 0) >= 23 ? 'Fair' : 'Poor') : input.age_years < 50 ? ((results["vo2max"] ?? 0) >= 40 ? 'Excellent' : (results["vo2max"] ?? 0) >= 32 ? 'Good' : (results["vo2max"] ?? 0) >= 25 ? 'Average' : (results["vo2max"] ?? 0) >= 21 ? 'Fair' : 'Poor') : ((results["vo2max"] ?? 0) >= 36 ? 'Excellent' : (results["vo2max"] ?? 0) >= 28 ? 'Good' : (results["vo2max"] ?? 0) >= 22 ? 'Average' : (results["vo2max"] ?? 0) >= 18 ? 'Fair' : 'Poor'))); results["category"] = Number.isFinite(v) ? v : 0; } catch { results["category"] = 0; }
  try { const v = input.weight_kg * (input.distance_m / 1000) * 0.97; results["calories"] = Number.isFinite(v) ? v : 0; } catch { results["calories"] = 0; }
  return results;
}


export function calculateCooper_test_calculator(input: Cooper_test_calculatorInput): Cooper_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["vo2max"] ?? 0;
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


export interface Cooper_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
