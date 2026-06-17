// @ts-nocheck
// Auto-generated from metabolic-age-calculator-schema.json
import * as z from 'zod';

export interface Metabolic_age_calculatorInput {
  chronologicalAge: number;
  gender: number;
  weightKg: number;
  heightCm: number;
}

export const Metabolic_age_calculatorInputSchema = z.object({
  chronologicalAge: z.number().default(30),
  gender: z.number().default(0),
  weightKg: z.number().default(70),
  heightCm: z.number().default(170),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Metabolic_age_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (10 * input.weightKg + 6.25 * input.heightCm - 5 * input.chronologicalAge) + (input.gender === 0 ? 5 : -161); results["bmr"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["bmr"] = 0; }
  try { const v = (input.gender === 0 ? 1800 - 5 * input.chronologicalAge : 1600 - 5 * input.chronologicalAge); results["expectedBmr"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["expectedBmr"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMetabolic_age_calculator(input: Metabolic_age_calculatorInput): Metabolic_age_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["expectedBmr"]);
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


export interface Metabolic_age_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
