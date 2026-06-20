// Auto-generated from vo2-max-calculator-schema.json
import * as z from 'zod';

export interface Vo2_max_calculatorInput {
  weight: number;
  age: number;
  gender: number;
  time: number;
  heartRate: number;
  dataConfidence?: number;
}

export const Vo2_max_calculatorInputSchema = z.object({
  weight: z.number().default(150),
  age: z.number().default(30),
  gender: z.number().default(1),
  time: z.number().default(15),
  heartRate: z.number().default(130),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Vo2_max_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 132.853 - (0.0769 * input.weight) - (0.3877 * input.age) + (6.315 * input.gender) - (3.2649 * input.time) - (0.1565 * input.heartRate); results["vo2MaxRelative"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vo2MaxRelative"] = Number.NaN; }
  try { const v = input.weight / 2.20462; results["weightKg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weightKg"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["vo2MaxRelative"])) * (toNumericFormulaValue(results["weightKg"])) / 1000; results["vo2MaxAbsolute"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vo2MaxAbsolute"] = Number.NaN; }
  return results;
}


export function calculateVo2_max_calculator(input: Vo2_max_calculatorInput): Vo2_max_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["vo2MaxRelative"]);
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


export interface Vo2_max_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
