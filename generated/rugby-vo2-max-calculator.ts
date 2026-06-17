// @ts-nocheck
// Auto-generated from rugby-vo2-max-calculator-schema.json
import * as z from 'zod';

export interface Rugby_vo2_max_calculatorInput {
  weight: number;
  age: number;
  gender: number;
  time: number;
  heartRate: number;
}

export const Rugby_vo2_max_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  age: z.number().default(30),
  gender: z.number().default(0),
  time: z.number().default(15),
  heartRate: z.number().default(120),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Rugby_vo2_max_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 132.853 - (0.1692 * input.weight) - (0.3877 * input.age) + (6.315 * input.gender) - (3.2649 * input.time) - (0.1565 * input.heartRate); results["vo2max_relative"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["vo2max_relative"] = 0; }
  try { const v = ((asFormulaNumber(results["vo2max_relative"])) * input.weight) / 1000; results["absolute_vo2"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["absolute_vo2"] = 0; }
  try { const v = (asFormulaNumber(results["vo2max_relative"])) / 3.5; results["mets"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["mets"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRugby_vo2_max_calculator(input: Rugby_vo2_max_calculatorInput): Rugby_vo2_max_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["vo2max_relative"]);
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


export interface Rugby_vo2_max_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
