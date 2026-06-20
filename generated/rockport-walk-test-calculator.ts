// Auto-generated from rockport-walk-test-calculator-schema.json
import * as z from 'zod';

export interface Rockport_walk_test_calculatorInput {
  age: number;
  gender: number;
  walkingTime: number;
  heartRate: number;
  weight: number;
  dataConfidence?: number;
}

export const Rockport_walk_test_calculatorInputSchema = z.object({
  age: z.number().default(30),
  gender: z.number().default(0),
  walkingTime: z.number().default(15),
  heartRate: z.number().default(120),
  weight: z.number().default(70),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Rockport_walk_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * 2.20462; results["weightLbs"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weightLbs"] = Number.NaN; }
  try { const v = 132.853 - (0.0769 * (toNumericFormulaValue(results["weightLbs"]))) - (0.3877 * input.age) + (6.315 * input.gender) - (3.2649 * input.walkingTime) - (0.1565 * input.heartRate); results["vo2max"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vo2max"] = Number.NaN; }
  return results;
}


export function calculateRockport_walk_test_calculator(input: Rockport_walk_test_calculatorInput): Rockport_walk_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["vo2max"]);
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


export interface Rockport_walk_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
