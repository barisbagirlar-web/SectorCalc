// @ts-nocheck
// Auto-generated from protein-intake-calculator-schema.json
import * as z from 'zod';

export interface Protein_intake_calculatorInput {
  bodyWeightKg: number;
  baseProtein: number;
  activityFactor: number;
  goalFactor: number;
}

export const Protein_intake_calculatorInputSchema = z.object({
  bodyWeightKg: z.number().default(70),
  baseProtein: z.number().default(0.8),
  activityFactor: z.number().default(1),
  goalFactor: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Protein_intake_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.bodyWeightKg * input.baseProtein * input.activityFactor * input.goalFactor; results["dailyProteinGrams"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["dailyProteinGrams"] = 0; }
  try { const v = (asFormulaNumber(results["dailyProteinGrams"])) * 4; results["proteinCalories"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["proteinCalories"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateProtein_intake_calculator(input: Protein_intake_calculatorInput): Protein_intake_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dailyProteinGrams"]);
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


export interface Protein_intake_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
