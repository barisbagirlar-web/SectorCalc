// Auto-generated from devine-formula-calculator-schema.json
import * as z from 'zod';

export interface Devine_formula_calculatorInput {
  height: number;
  sex: number;
  age: number;
  currentWeight: number;
  dataConfidence?: number;
}

export const Devine_formula_calculatorInputSchema = z.object({
  height: z.number().default(170),
  sex: z.number().default(0),
  age: z.number().default(30),
  currentWeight: z.number().default(70),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Devine_formula_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.height / 2.54; results["heightInInches"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["heightInInches"] = Number.NaN; }
  try { const v = input.sex == 1 ? 50 : 45.5; results["baseWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseWeight"] = Number.NaN; }
  try { const v = 2.3 * ((toNumericFormulaValue(results["heightInInches"])) - 60); results["addition"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["addition"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["baseWeight"])) + (toNumericFormulaValue(results["addition"])); results["idealWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["idealWeight"] = Number.NaN; }
  return results;
}


export function calculateDevine_formula_calculator(input: Devine_formula_calculatorInput): Devine_formula_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["idealWeight"]);
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


export interface Devine_formula_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
