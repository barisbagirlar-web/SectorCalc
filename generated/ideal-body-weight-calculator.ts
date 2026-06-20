// Auto-generated from ideal-body-weight-calculator-schema.json
import * as z from 'zod';

export interface Ideal_body_weight_calculatorInput {
  heightFeet: number;
  heightInches: number;
  genderCode: number;
  frameFactor: number;
  dataConfidence?: number;
}

export const Ideal_body_weight_calculatorInputSchema = z.object({
  heightFeet: z.number().default(5),
  heightInches: z.number().default(0),
  genderCode: z.number().default(1),
  frameFactor: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ideal_body_weight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.heightFeet * 12 + input.heightInches; results["totalInches"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalInches"] = Number.NaN; }
  try { const v = 50 + 2.3 * ((toNumericFormulaValue(results["totalInches"])) - 60); results["ibwKgMale"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ibwKgMale"] = Number.NaN; }
  try { const v = 45.5 + 2.3 * ((toNumericFormulaValue(results["totalInches"])) - 60); results["ibwKgFemale"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ibwKgFemale"] = Number.NaN; }
  try { const v = input.genderCode == 1 ? (toNumericFormulaValue(results["ibwKgMale"])) : (toNumericFormulaValue(results["ibwKgFemale"])); results["ibwKg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ibwKg"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["ibwKg"])) * input.frameFactor; results["ibwKgAdjusted"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ibwKgAdjusted"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalInches"])) * 2.54; results["heightCm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["heightCm"] = Number.NaN; }
  return results;
}


export function calculateIdeal_body_weight_calculator(input: Ideal_body_weight_calculatorInput): Ideal_body_weight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ibwKgAdjusted"]);
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


export interface Ideal_body_weight_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
