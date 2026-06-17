// @ts-nocheck
// Auto-generated from cycling-calorie-calculator-schema.json
import * as z from 'zod';

export interface Cycling_calorie_calculatorInput {
  weight: number;
  distance: number;
  duration: number;
  incline: number;
}

export const Cycling_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  distance: z.number().default(10),
  duration: z.number().default(30),
  incline: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cycling_calorie_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.distance / (input.duration / 60); results["average_speed"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["average_speed"] = 0; }
  try { const v = (asFormulaNumber(results["average_speed"])) <= 15 ? 5 : ((asFormulaNumber(results["average_speed"])) <= 20 ? 7 : ((asFormulaNumber(results["average_speed"])) <= 25 ? 10 : 12)); results["met_base"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["met_base"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCycling_calorie_calculator(input: Cycling_calorie_calculatorInput): Cycling_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["met_base"]);
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


export interface Cycling_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
