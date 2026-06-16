// Auto-generated from points-calculator-schema.json
import * as z from 'zod';

export interface Points_calculatorInput {
  purchaseAmount: number;
  basePointsRate: number;
  tierMultiplier: number;
  bonusPoints: number;
  capPoints: number;
  pointsConversionRate: number;
}

export const Points_calculatorInputSchema = z.object({
  purchaseAmount: z.number().default(100),
  basePointsRate: z.number().default(1),
  tierMultiplier: z.number().default(1),
  bonusPoints: z.number().default(0),
  capPoints: z.number().default(1000),
  pointsConversionRate: z.number().default(0.01),
});

function evaluateAllFormulas(input: Points_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.purchaseAmount * input.basePointsRate; results["basePointsEarned"] = Number.isFinite(v) ? v : 0; } catch { results["basePointsEarned"] = 0; }
  try { const v = (results["basePointsEarned"] ?? 0) * input.tierMultiplier + input.bonusPoints; results["totalBeforeCap"] = Number.isFinite(v) ? v : 0; } catch { results["totalBeforeCap"] = 0; }
  try { const v = input.capPoints > 0 ? Math.min((results["totalBeforeCap"] ?? 0), input.capPoints) : (results["totalBeforeCap"] ?? 0); results["totalPoints"] = Number.isFinite(v) ? v : 0; } catch { results["totalPoints"] = 0; }
  try { const v = (results["totalPoints"] ?? 0) * input.pointsConversionRate; results["monetaryValue"] = Number.isFinite(v) ? v : 0; } catch { results["monetaryValue"] = 0; }
  return results;
}


export function calculatePoints_calculator(input: Points_calculatorInput): Points_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalPoints"] ?? 0;
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


export interface Points_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
