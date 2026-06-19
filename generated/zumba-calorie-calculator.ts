// Auto-generated from zumba-calorie-calculator-schema.json
import * as z from 'zod';

export interface Zumba_calorie_calculatorInput {
  weight: number;
  duration: number;
  MET: number;
  intensityFactor: number;
  dataConfidence?: number;
}

export const Zumba_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  duration: z.number().default(60),
  MET: z.number().default(7.5),
  intensityFactor: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Zumba_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * input.MET * (input.duration / 60) * input.intensityFactor; results["caloriesBurned"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["caloriesBurned"] = 0; }
  try { const v = input.duration / 60; results["hours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["hours"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateZumba_calorie_calculator(input: Zumba_calorie_calculatorInput): Zumba_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["caloriesBurned"]);
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


export interface Zumba_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
