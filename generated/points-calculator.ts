// Auto-generated from points-calculator-schema.json
import * as z from 'zod';

export interface Points_calculatorInput {
  purchaseAmount: number;
  basePointsRate: number;
  tierMultiplier: number;
  bonusPoints: number;
  capPoints: number;
  pointsConversionRate: number;
  dataConfidence?: number;
}

export const Points_calculatorInputSchema = z.object({
  purchaseAmount: z.number().default(100),
  basePointsRate: z.number().default(1),
  tierMultiplier: z.number().default(1),
  bonusPoints: z.number().default(0),
  capPoints: z.number().default(1000),
  pointsConversionRate: z.number().default(0.01),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Points_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.purchaseAmount * input.basePointsRate; results["basePointsEarned"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["basePointsEarned"] = 0; }
  try { const v = (asFormulaNumber(results["basePointsEarned"])) * input.tierMultiplier + input.bonusPoints; results["totalBeforeCap"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalBeforeCap"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePoints_calculator(input: Points_calculatorInput): Points_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalBeforeCap"]);
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


export interface Points_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
