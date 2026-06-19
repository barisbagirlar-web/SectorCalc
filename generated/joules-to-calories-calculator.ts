// Auto-generated from joules-to-calories-calculator-schema.json
import * as z from 'zod';

export interface Joules_to_calories_calculatorInput {
  joules: number;
  calorie_type: number;
  precision: number;
  round_method: number;
  dataConfidence?: number;
}

export const Joules_to_calories_calculatorInputSchema = z.object({
  joules: z.number().default(1000),
  calorie_type: z.number().default(1),
  precision: z.number().default(2),
  round_method: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Joules_to_calories_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.calorie_type == 1 ? 4.184 : (input.calorie_type == 2 ? 4.204 : (input.calorie_type == 3 ? 4.1855 : (input.calorie_type == 4 ? 4.1868 : 4.190))); results["conversion_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["conversion_factor"] = 0; }
  try { const v = input.joules / (asFormulaNumber(results["conversion_factor"])); results["calories_precise"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["calories_precise"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateJoules_to_calories_calculator(input: Joules_to_calories_calculatorInput): Joules_to_calories_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["calories_precise"]);
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


export interface Joules_to_calories_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
