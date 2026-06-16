// Auto-generated from hamwi-formula-calculator-schema.json
import * as z from 'zod';

export interface Hamwi_formula_calculatorInput {
  gender: number;
  heightFeet: number;
  heightInches: number;
  outputUnit: number;
}

export const Hamwi_formula_calculatorInputSchema = z.object({
  gender: z.number().default(1),
  heightFeet: z.number().default(5),
  heightInches: z.number().default(8),
  outputUnit: z.number().default(0),
});

function evaluateAllFormulas(input: Hamwi_formula_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.heightFeet * 12 + input.heightInches; results["totalHeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalHeight"] = 0; }
  try { const v = input.gender === 1 ? 106 + 6 * ((results["totalHeight"] ?? 0) - 60) : 100 + 5 * ((results["totalHeight"] ?? 0) - 60); results["idealWeightLbs"] = Number.isFinite(v) ? v : 0; } catch { results["idealWeightLbs"] = 0; }
  try { const v = (results["idealWeightLbs"] ?? 0) * 0.453592; results["idealWeightKg"] = Number.isFinite(v) ? v : 0; } catch { results["idealWeightKg"] = 0; }
  try { const v = input.outputUnit === 0 ? (results["idealWeightLbs"] ?? 0) : (results["idealWeightKg"] ?? 0); results["idealWeight"] = Number.isFinite(v) ? v : 0; } catch { results["idealWeight"] = 0; }
  return results;
}


export function calculateHamwi_formula_calculator(input: Hamwi_formula_calculatorInput): Hamwi_formula_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["idealWeight"] ?? 0;
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


export interface Hamwi_formula_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
