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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Weight_loss_goal_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.currentWeight - input.targetWeight) * input.caloriePerKg; results["totalDeficit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalDeficit"] = 0; }
  try { const v = (asFormulaNumber(results["totalDeficit"])) / input.dailyDeficit; results["daysToTarget"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["daysToTarget"] = 0; }
  try { const v = (input.dailyDeficit * 7) / input.caloriePerKg; results["weeklyLoss"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["weeklyLoss"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWeight_loss_goal_calculator(input: Weight_loss_goal_calculatorInput): Weight_loss_goal_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalDeficit"]));
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


export interface Weight_loss_goal_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
