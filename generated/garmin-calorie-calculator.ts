// @ts-nocheck
// Auto-generated from garmin-calorie-calculator-schema.json
import * as z from 'zod';

export interface Garmin_calorie_calculatorInput {
  weight: number;
  age: number;
  heartRate: number;
  duration: number;
  genderFactor: number;
}

export const Garmin_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  age: z.number().default(30),
  heartRate: z.number().default(120),
  duration: z.number().default(30),
  genderFactor: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Garmin_calorie_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = ((input.genderFactor >= 1) ? ((input.age * 0.2017 - input.weight * 0.09036 + input.heartRate * 0.6309 - 55.0969) * input.duration / 4.184) : ((input.age * 0.074 - input.weight * 0.05741 + input.heartRate * 0.4472 - 20.4022) * input.duration / 4.184)); results["calories"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["calories"] = 0; }
  try { const v = (asFormulaNumber(results["calories"])) / input.duration; results["caloriesPerMin"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["caloriesPerMin"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateGarmin_calorie_calculator(input: Garmin_calorie_calculatorInput): Garmin_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["calories"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Garmin_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
