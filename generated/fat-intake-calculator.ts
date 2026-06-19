// Auto-generated from fat-intake-calculator-schema.json
import * as z from 'zod';

export interface Fat_intake_calculatorInput {
  dailyCalories: number;
  fatPercentage: number;
  mealsPerDay: number;
  bodyWeight: number;
  dataConfidence?: number;
}

export const Fat_intake_calculatorInputSchema = z.object({
  dailyCalories: z.number().default(2000),
  fatPercentage: z.number().default(30),
  mealsPerDay: z.number().default(3),
  bodyWeight: z.number().default(70),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fat_intake_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dailyCalories * input.fatPercentage / 100 / 9; results["gramsFatPerDay"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["gramsFatPerDay"] = 0; }
  try { const v = input.dailyCalories * input.fatPercentage / 100; results["caloriesFromFat"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["caloriesFromFat"] = 0; }
  try { const v = (input.dailyCalories * input.fatPercentage / 100 / 9) / input.bodyWeight; results["gramsFatPerKg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["gramsFatPerKg"] = 0; }
  try { const v = (input.dailyCalories * input.fatPercentage / 100 / 9) / input.mealsPerDay; results["gramsFatPerMeal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["gramsFatPerMeal"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFat_intake_calculator(input: Fat_intake_calculatorInput): Fat_intake_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["gramsFatPerDay"]));
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


export interface Fat_intake_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
