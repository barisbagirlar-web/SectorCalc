// Auto-generated from boxing-calorie-calculator-schema.json
import * as z from 'zod';

export interface Boxing_calorie_calculatorInput {
  weight: number;
  duration: number;
  met: number;
  intensity: number;
  dataConfidence?: number;
}

export const Boxing_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  duration: z.number().default(30),
  met: z.number().default(7.8),
  intensity: z.number().default(100),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Boxing_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.duration / 60; results["duration_hours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["duration_hours"] = 0; }
  try { const v = input.met * input.weight * (asFormulaNumber(results["duration_hours"])) * (input.intensity / 100); results["calories_burned"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["calories_burned"] = 0; }
  try { const v = (asFormulaNumber(results["calories_burned"])) / input.duration; results["calories_per_minute"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["calories_per_minute"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBoxing_calorie_calculator(input: Boxing_calorie_calculatorInput): Boxing_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["duration_hours"]));
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


export interface Boxing_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
