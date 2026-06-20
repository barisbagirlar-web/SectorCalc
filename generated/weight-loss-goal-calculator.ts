// Auto-generated from weight-loss-goal-calculator-schema.json
import * as z from 'zod';

export interface Weight_loss_goal_calculatorInput {
  currentWeight: number;
  targetWeight: number;
  dailyDeficit: number;
  caloriePerKg: number;
  dataConfidence?: number;
}

export const Weight_loss_goal_calculatorInputSchema = z.object({
  currentWeight: z.number().default(80),
  targetWeight: z.number().default(70),
  dailyDeficit: z.number().default(500),
  caloriePerKg: z.number().default(7700),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Weight_loss_goal_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.currentWeight - input.targetWeight) * input.caloriePerKg; results["totalDeficit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDeficit"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalDeficit"])) / input.dailyDeficit; results["daysToTarget"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["daysToTarget"] = Number.NaN; }
  try { const v = (input.dailyDeficit * 7) / input.caloriePerKg; results["weeklyLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weeklyLoss"] = Number.NaN; }
  return results;
}


export function calculateWeight_loss_goal_calculator(input: Weight_loss_goal_calculatorInput): Weight_loss_goal_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalDeficit"]);
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


export interface Weight_loss_goal_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
