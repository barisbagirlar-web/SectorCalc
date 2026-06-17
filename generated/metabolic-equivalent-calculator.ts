// @ts-nocheck
// Auto-generated from metabolic-equivalent-calculator-schema.json
import * as z from 'zod';

export interface Metabolic_equivalent_calculatorInput {
  weight: number;
  duration_hours: number;
  duration_minutes: number;
  met: number;
}

export const Metabolic_equivalent_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  duration_hours: z.number().default(0),
  duration_minutes: z.number().default(30),
  met: z.number().default(5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Metabolic_equivalent_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.met * input.weight * (input.duration_hours + input.duration_minutes/60); results["caloriesBurned"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["caloriesBurned"] = 0; }
  try { const v = input.met * (input.duration_hours*60 + input.duration_minutes); results["metMinutes"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["metMinutes"] = 0; }
  try { const v = (input.met * 3.5 * input.weight * (input.duration_hours*60 + input.duration_minutes)) / 1000; results["oxygenConsumed"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["oxygenConsumed"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMetabolic_equivalent_calculator(input: Metabolic_equivalent_calculatorInput): Metabolic_equivalent_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["caloriesBurned"]);
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


export interface Metabolic_equivalent_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
