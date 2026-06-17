// @ts-nocheck
// Auto-generated from running-calorie-calculator-schema.json
import * as z from 'zod';

export interface Running_calorie_calculatorInput {
  weight: number;
  distance: number;
  elevation_gain: number;
  load_kg: number;
}

export const Running_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  distance: z.number().default(10),
  elevation_gain: z.number().default(0),
  load_kg: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Running_calorie_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.weight + input.load_kg; results["totalWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalWeight"] = 0; }
  try { const v = input.elevation_gain / (input.distance * 1000); results["gradient"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["gradient"] = 0; }
  try { const v = (asFormulaNumber(results["totalWeight"])) * input.distance * 1.036; results["flat_calories"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["flat_calories"] = 0; }
  try { const v = (asFormulaNumber(results["totalWeight"])) * input.elevation_gain * 0.0008; results["elevation_calories"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["elevation_calories"] = 0; }
  try { const v = (asFormulaNumber(results["flat_calories"])) + (asFormulaNumber(results["elevation_calories"])); results["total_calories"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["total_calories"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRunning_calorie_calculator(input: Running_calorie_calculatorInput): Running_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["total_calories"]);
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


export interface Running_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
