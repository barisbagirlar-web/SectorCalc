// Auto-generated from cat-calorie-calculator-schema.json
import * as z from 'zod';

export interface Cat_calorie_calculatorInput {
  weight: number;
  activityLevel: number;
  lifeStage: number;
  neutered: number;
  dataConfidence?: number;
}

export const Cat_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(4),
  activityLevel: z.number().default(3),
  lifeStage: z.number().default(2),
  neutered: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cat_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1.2 + (input.activityLevel - 1) * 0.1 + input.neutered * 0.2 + (input.lifeStage == 1 ? 0.2 : (input.lifeStage == 3 ? -0.1 : 0)); results["factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor"] = Number.NaN; }
  try { const v = 1.2 + (input.activityLevel - 1) * 0.1 + input.neutered * 0.2 + (input.lifeStage == 1 ? 0.2 : (input.lifeStage == 3 ? -0.1 : 0)); results["factor_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_aux"] = Number.NaN; }
  return results;
}


export function calculateCat_calorie_calculator(input: Cat_calorie_calculatorInput): Cat_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["factor_aux"]);
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


export interface Cat_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
