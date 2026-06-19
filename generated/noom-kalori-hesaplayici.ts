// Auto-generated from noom-kalori-hesaplayici-schema.json
import * as z from 'zod';

export interface Noom_kalori_hesaplayiciInput {
  weight: number;
  height: number;
  age: number;
  gender: number;
  activityLevel: number;
  dataConfidence?: number;
}

export const Noom_kalori_hesaplayiciInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  gender: z.number().default(0),
  activityLevel: z.number().default(1.2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Noom_kalori_hesaplayiciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.gender === 0 ? 10*input.weight + 6.25*input.height - 5*input.age + 5 : 10*input.weight + 6.25*input.height - 5*input.age - 161; results["BMR"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["BMR"] = 0; }
  try { const v = (asFormulaNumber(results["BMR"])) * input.activityLevel; results["TDEE"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["TDEE"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateNoom_kalori_hesaplayici(input: Noom_kalori_hesaplayiciInput): Noom_kalori_hesaplayiciOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["BMR"]);
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


export interface Noom_kalori_hesaplayiciOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
