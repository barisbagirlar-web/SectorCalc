// Auto-generated from overtraining-calculator-schema.json
import * as z from 'zod';

export interface Overtraining_calculatorInput {
  dailyHours: number;
  trainingDays: number;
  recoveryFactor: number;
  experience: number;
  taskComplexity: number;
  dataConfidence?: number;
}

export const Overtraining_calculatorInputSchema = z.object({
  dailyHours: z.number().default(2),
  trainingDays: z.number().default(5),
  recoveryFactor: z.number().default(7),
  experience: z.number().default(2),
  taskComplexity: z.number().default(3),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Overtraining_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dailyHours * input.trainingDays; results["weeklyTrainingLoad"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["weeklyTrainingLoad"] = 0; }
  try { const v = input.recoveryFactor * 0.1; results["recoveryIndex"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["recoveryIndex"] = 0; }
  try { const v = ((asFormulaNumber(results["weeklyTrainingLoad"])) / (input.experience + input.taskComplexity)) / (asFormulaNumber(results["recoveryIndex"])); results["overtrainingScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["overtrainingScore"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateOvertraining_calculator(input: Overtraining_calculatorInput): Overtraining_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["overtrainingScore"]);
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


export interface Overtraining_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
