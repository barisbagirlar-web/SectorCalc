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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ideal_body_weight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.heightFeet * 12 + input.heightInches; results["totalInches"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalInches"] = 0; }
  try { const v = 50 + 2.3 * ((asFormulaNumber(results["totalInches"])) - 60); results["ibwKgMale"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ibwKgMale"] = 0; }
  try { const v = 45.5 + 2.3 * ((asFormulaNumber(results["totalInches"])) - 60); results["ibwKgFemale"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ibwKgFemale"] = 0; }
  try { const v = input.genderCode == 1 ? (asFormulaNumber(results["ibwKgMale"])) : (asFormulaNumber(results["ibwKgFemale"])); results["ibwKg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ibwKg"] = 0; }
  try { const v = (asFormulaNumber(results["ibwKg"])) * input.frameFactor; results["ibwKgAdjusted"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ibwKgAdjusted"] = 0; }
  try { const v = (asFormulaNumber(results["totalInches"])) * 2.54; results["heightCm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["heightCm"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateIdeal_body_weight_calculator(input: Ideal_body_weight_calculatorInput): Ideal_body_weight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["ibwKgAdjusted"]));
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


export interface Ideal_body_weight_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
