// Auto-generated from devine-formula-calculator-schema.json
import * as z from 'zod';

export interface Devine_formula_calculatorInput {
  height: number;
  sex: number;
  age: number;
  currentWeight: number;
}

export const Devine_formula_calculatorInputSchema = z.object({
  height: z.number().default(170),
  sex: z.number().default(0),
  age: z.number().default(30),
  currentWeight: z.number().default(70),
});

function evaluateAllFormulas(input: Devine_formula_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.height / 2.54; results["heightInInches"] = Number.isFinite(v) ? v : 0; } catch { results["heightInInches"] = 0; }
  try { const v = input.sex == 1 ? 50 : 45.5; results["baseWeight"] = Number.isFinite(v) ? v : 0; } catch { results["baseWeight"] = 0; }
  try { const v = 2.3 * ((results["heightInInches"] ?? 0) - 60); results["addition"] = Number.isFinite(v) ? v : 0; } catch { results["addition"] = 0; }
  try { const v = (results["baseWeight"] ?? 0) + (results["addition"] ?? 0); results["idealWeight"] = Number.isFinite(v) ? v : 0; } catch { results["idealWeight"] = 0; }
  return results;
}


export function calculateDevine_formula_calculator(input: Devine_formula_calculatorInput): Devine_formula_calculatorOutput {
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


export interface Devine_formula_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
