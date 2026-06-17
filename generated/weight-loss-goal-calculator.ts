// Auto-generated from weight-loss-goal-calculator-schema.json
import * as z from 'zod';

export interface Weight_loss_goal_calculatorInput {
  currentWeight: number;
  targetWeight: number;
  dailyDeficit: number;
  caloriePerKg: number;
}

export const Weight_loss_goal_calculatorInputSchema = z.object({
  currentWeight: z.number().default(80),
  targetWeight: z.number().default(70),
  dailyDeficit: z.number().default(500),
  caloriePerKg: z.number().default(7700),
});

function evaluateAllFormulas(input: Weight_loss_goal_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.currentWeight - input.targetWeight) * input.caloriePerKg; results["totalDeficit"] = Number.isFinite(v) ? v : 0; } catch { results["totalDeficit"] = 0; }
  try { const v = (results["totalDeficit"] ?? 0) / input.dailyDeficit; results["daysToTarget"] = Number.isFinite(v) ? v : 0; } catch { results["daysToTarget"] = 0; }
  try { const v = (input.dailyDeficit * 7) / input.caloriePerKg; results["weeklyLoss"] = Number.isFinite(v) ? v : 0; } catch { results["weeklyLoss"] = 0; }
  return results;
}


export function calculateWeight_loss_goal_calculator(input: Weight_loss_goal_calculatorInput): Weight_loss_goal_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Estimated"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
