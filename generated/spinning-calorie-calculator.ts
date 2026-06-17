// @ts-nocheck
// Auto-generated from spinning-calorie-calculator-schema.json
import * as z from 'zod';

export interface Spinning_calorie_calculatorInput {
  duration_min: number;
  speed_kmh: number;
  resistance_level: number;
  weight_kg: number;
  age_years: number;
}

export const Spinning_calorie_calculatorInputSchema = z.object({
  duration_min: z.number().default(30),
  speed_kmh: z.number().default(20),
  resistance_level: z.number().default(5),
  weight_kg: z.number().default(70),
  age_years: z.number().default(30),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Spinning_calorie_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 3.5 + (input.speed_kmh * 0.2) + (input.resistance_level * 0.5); results["met_value"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["met_value"] = 0; }
  try { const v = (asFormulaNumber(results["met_value"])) * input.weight_kg * (input.duration_min / 60); results["total_calories"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["total_calories"] = 0; }
  try { const v = (asFormulaNumber(results["total_calories"])) / input.duration_min; results["calories_per_minute"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["calories_per_minute"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSpinning_calorie_calculator(input: Spinning_calorie_calculatorInput): Spinning_calorie_calculatorOutput {
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


export interface Spinning_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
