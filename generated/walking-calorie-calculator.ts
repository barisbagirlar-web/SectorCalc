// Auto-generated from walking-calorie-calculator-schema.json
import * as z from 'zod';

export interface Walking_calorie_calculatorInput {
  weight: number;
  duration: number;
  speed: number;
  grade: number;
  dataConfidence?: number;
}

export const Walking_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  duration: z.number().default(30),
  speed: z.number().default(5),
  grade: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Walking_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 3.5 + ((input.speed * 1000 / 60) * 0.1) + ((input.grade / 100) * (input.speed * 1000 / 60) * 1.8); results["VO2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["VO2"] = 0; }
  try { const v = (asFormulaNumber(results["VO2"])) / 3.5; results["MET"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["MET"] = 0; }
  try { const v = (asFormulaNumber(results["MET"])) * input.weight * (input.duration / 60); results["calories"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["calories"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWalking_calorie_calculator(input: Walking_calorie_calculatorInput): Walking_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["calories"]));
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


export interface Walking_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
