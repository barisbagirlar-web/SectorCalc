// @ts-nocheck
// Auto-generated from weight-watchers-points-calculator-schema.json
import * as z from 'zod';

export interface Weight_watchers_points_calculatorInput {
  calories: number;
  saturatedFat: number;
  sugar: number;
  protein: number;
}

export const Weight_watchers_points_calculatorInputSchema = z.object({
  calories: z.number().default(0),
  saturatedFat: z.number().default(0),
  sugar: z.number().default(0),
  protein: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Weight_watchers_points_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.calories * 0.0305 + input.saturatedFat * 0.275 + input.sugar * 0.12 - input.protein * 0.098; results["rawPoints"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rawPoints"] = 0; }
  try { const v = input.calories * 0.0305; results["caloriesContrib"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["caloriesContrib"] = 0; }
  try { const v = input.saturatedFat * 0.275; results["saturatedFatContrib"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["saturatedFatContrib"] = 0; }
  try { const v = input.sugar * 0.12; results["sugarContrib"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["sugarContrib"] = 0; }
  try { const v = input.protein * 0.098; results["proteinContrib"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["proteinContrib"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateWeight_watchers_points_calculator(input: Weight_watchers_points_calculatorInput): Weight_watchers_points_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["proteinContrib"]);
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


export interface Weight_watchers_points_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
