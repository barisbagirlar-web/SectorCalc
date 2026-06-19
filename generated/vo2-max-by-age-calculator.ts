// Auto-generated from vo2-max-by-age-calculator-schema.json
import * as z from 'zod';

export interface Vo2_max_by_age_calculatorInput {
  age: number;
  weight: number;
  gender: number;
  walkTime: number;
  heartRate: number;
  dataConfidence?: number;
}

export const Vo2_max_by_age_calculatorInputSchema = z.object({
  age: z.number().default(30),
  weight: z.number().default(70),
  gender: z.number().default(1),
  walkTime: z.number().default(12),
  heartRate: z.number().default(140),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Vo2_max_by_age_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 132.853 - 0.0769 * input.weight - 0.3877 * input.age + 6.315 * input.gender - 3.2649 * input.walkTime - 0.1565 * input.heartRate; results["vo2max"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["vo2max"] = 0; }
  try { const v = 132.853 - 0.0769 * input.weight - 0.3877 * input.age + 6.315 * input.gender - 3.2649 * input.walkTime - 0.1565 * input.heartRate; results["132_853___0_0769___weight___0_3877___age"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["132_853___0_0769___weight___0_3877___age"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateVo2_max_by_age_calculator(input: Vo2_max_by_age_calculatorInput): Vo2_max_by_age_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["132_853___0_0769___weight___0_3877___age"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Vo2_max_by_age_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
