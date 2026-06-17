// @ts-nocheck
// Auto-generated from resting-metabolic-rate-calculator-schema.json
import * as z from 'zod';

export interface Resting_metabolic_rate_calculatorInput {
  genderCode: number;
  age: number;
  weight: number;
  height: number;
}

export const Resting_metabolic_rate_calculatorInputSchema = z.object({
  genderCode: z.number().default(1),
  age: z.number().default(30),
  weight: z.number().default(70),
  height: z.number().default(170),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Resting_metabolic_rate_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 10 * input.weight; results["weightContribution"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["weightContribution"] = 0; }
  try { const v = 6.25 * input.height; results["heightContribution"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["heightContribution"] = 0; }
  try { const v = -5 * input.age; results["ageContribution"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["ageContribution"] = 0; }
  try { const v = 166 * input.genderCode - 161; results["genderOffset"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["genderOffset"] = 0; }
  try { const v = (asFormulaNumber(results["weightContribution"])) + (asFormulaNumber(results["heightContribution"])) + (asFormulaNumber(results["ageContribution"])) + (asFormulaNumber(results["genderOffset"])); results["restingMetabolicRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["restingMetabolicRate"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateResting_metabolic_rate_calculator(input: Resting_metabolic_rate_calculatorInput): Resting_metabolic_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["restingMetabolicRate"]);
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


export interface Resting_metabolic_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
