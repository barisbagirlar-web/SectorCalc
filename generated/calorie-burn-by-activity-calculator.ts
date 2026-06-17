// @ts-nocheck
// Auto-generated from calorie-burn-by-activity-calculator-schema.json
import * as z from 'zod';

export interface Calorie_burn_by_activity_calculatorInput {
  weight_kg: number;
  duration_min: number;
  met_value: number;
  efficiency_factor: number;
}

export const Calorie_burn_by_activity_calculatorInputSchema = z.object({
  weight_kg: z.number().default(70),
  duration_min: z.number().default(30),
  met_value: z.number().default(5),
  efficiency_factor: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Calorie_burn_by_activity_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.weight_kg * input.met_value * (input.duration_min / 60) * input.efficiency_factor; results["total_calories_burned"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["total_calories_burned"] = 0; }
  try { const v = input.duration_min / 60; results["duration_hours"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["duration_hours"] = 0; }
  try { const v = input.met_value * (input.duration_min / 60); results["met_hours"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["met_hours"] = 0; }
  try { const v = input.met_value * input.weight_kg * input.efficiency_factor; results["calories_per_hour"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["calories_per_hour"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCalorie_burn_by_activity_calculator(input: Calorie_burn_by_activity_calculatorInput): Calorie_burn_by_activity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["total_calories_burned"]);
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


export interface Calorie_burn_by_activity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
