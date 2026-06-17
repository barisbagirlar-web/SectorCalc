// @ts-nocheck
// Auto-generated from wrestling-weight-class-calculator-schema.json
import * as z from 'zod';

export interface Wrestling_weight_class_calculatorInput {
  gender: number;
  weight: number;
  height: number;
  age: number;
  bodyFat: number;
}

export const Wrestling_weight_class_calculatorInputSchema = z.object({
  gender: z.number().default(1),
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(25),
  bodyFat: z.number().default(15),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Wrestling_weight_class_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.weight / ((input.height / 100) ** 2); results["bmi"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["bmi"] = 0; }
  try { const v = input.weight * (1 - input.bodyFat / 100); results["leanBodyMass"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["leanBodyMass"] = 0; }
  results["weightClass"] = 0;
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateWrestling_weight_class_calculator(input: Wrestling_weight_class_calculatorInput): Wrestling_weight_class_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["weightClass"]);
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


export interface Wrestling_weight_class_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
