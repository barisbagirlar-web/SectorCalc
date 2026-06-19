// Auto-generated from non-exercise-activity-thermogenesis-calculator-schema.json
import * as z from 'zod';

export interface Non_exercise_activity_thermogenesis_calculatorInput {
  tdee: number;
  bmr: number;
  tef: number;
  exercise: number;
  dataConfidence?: number;
}

export const Non_exercise_activity_thermogenesis_calculatorInputSchema = z.object({
  tdee: z.number().default(2000),
  bmr: z.number().default(1500),
  tef: z.number().default(200),
  exercise: z.number().default(150),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Non_exercise_activity_thermogenesis_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.tdee - input.bmr - input.tef - input.exercise; results["neat"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["neat"] = 0; }
  try { const v = ((asFormulaNumber(results["neat"])) / input.tdee) * 100; results["neatPercentage"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["neatPercentage"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateNon_exercise_activity_thermogenesis_calculator(input: Non_exercise_activity_thermogenesis_calculatorInput): Non_exercise_activity_thermogenesis_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["neat"]));
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


export interface Non_exercise_activity_thermogenesis_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
