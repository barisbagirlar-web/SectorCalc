// Auto-generated from wrestling-weight-class-calculator-schema.json
import * as z from 'zod';

export interface Wrestling_weight_class_calculatorInput {
  gender: number;
  weight: number;
  height: number;
  age: number;
  bodyFat: number;
  dataConfidence?: number;
}

export const Wrestling_weight_class_calculatorInputSchema = z.object({
  gender: z.number().default(1),
  weight: z.number().default(70),
  height: z.number().default(170),
  age: z.number().default(25),
  bodyFat: z.number().default(15),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Wrestling_weight_class_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight / ((input.height / 100) ** 2); results["bmi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bmi"] = Number.NaN; }
  try { const v = input.weight * (1 - input.bodyFat / 100); results["leanBodyMass"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["leanBodyMass"] = Number.NaN; }
  return results;
}


export function calculateWrestling_weight_class_calculator(input: Wrestling_weight_class_calculatorInput): Wrestling_weight_class_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["leanBodyMass"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
