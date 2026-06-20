// Auto-generated from hamwi-formula-calculator-schema.json
import * as z from 'zod';

export interface Hamwi_formula_calculatorInput {
  gender: number;
  heightFeet: number;
  heightInches: number;
  outputUnit: number;
  dataConfidence?: number;
}

export const Hamwi_formula_calculatorInputSchema = z.object({
  gender: z.number().default(1),
  heightFeet: z.number().default(5),
  heightInches: z.number().default(8),
  outputUnit: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hamwi_formula_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.heightFeet * 12 + input.heightInches; results["totalHeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalHeight"] = Number.NaN; }
  try { const v = input.gender === 1 ? 106 + 6 * ((toNumericFormulaValue(results["totalHeight"])) - 60) : 100 + 5 * ((toNumericFormulaValue(results["totalHeight"])) - 60); results["idealWeightLbs"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["idealWeightLbs"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["idealWeightLbs"])) * 0.453592; results["idealWeightKg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["idealWeightKg"] = Number.NaN; }
  try { const v = ((input.outputUnit === 0 ? (toNumericFormulaValue(results["idealWeightLbs"])) : (toNumericFormulaValue(results["idealWeightKg"]))) ? 1 : 0); results["idealWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["idealWeight"] = Number.NaN; }
  return results;
}


export function calculateHamwi_formula_calculator(input: Hamwi_formula_calculatorInput): Hamwi_formula_calculatorOutput {
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


export interface Hamwi_formula_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
