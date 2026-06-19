// Auto-generated from bmr-calculator-schema.json
import * as z from 'zod';

export interface Bmr_calculatorInput {
  weight: number;
  height: number;
  age: number;
  isMale: number;
  dataConfidence?: number;
}

export const Bmr_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(30),
  isMale: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Bmr_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.isMale === 1 ? (10 * input.weight + 6.25 * input.height - 5 * input.age + 5) : (10 * input.weight + 6.25 * input.height - 5 * input.age - 161); results["bmr"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bmr"] = 0; }
  try { const v = 10 * input.weight + 6.25 * input.height - 5 * input.age + 5; results["maleBmr"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["maleBmr"] = 0; }
  try { const v = 10 * input.weight + 6.25 * input.height - 5 * input.age - 161; results["femaleBmr"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["femaleBmr"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBmr_calculator(input: Bmr_calculatorInput): Bmr_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["bmr"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Bmr_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
