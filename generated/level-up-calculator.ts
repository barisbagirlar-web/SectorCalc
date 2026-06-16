// Auto-generated from level-up-calculator-schema.json
import * as z from 'zod';

export interface Level_up_calculatorInput {
  currentProduction: number;
  sellingPrice: number;
  variableCost: number;
  fixedCosts: number;
  levelUpPercent: number;
  additionalFixedCost: number;
}

export const Level_up_calculatorInputSchema = z.object({
  currentProduction: z.number().default(5000),
  sellingPrice: z.number().default(100),
  variableCost: z.number().default(60),
  fixedCosts: z.number().default(150000),
  levelUpPercent: z.number().default(20),
  additionalFixedCost: z.number().default(30000),
});

function evaluateAllFormulas(input: Level_up_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentProduction * input.sellingPrice - input.currentProduction * input.variableCost - input.fixedCosts; results["currentProfit"] = Number.isFinite(v) ? v : 0; } catch { results["currentProfit"] = 0; }
  try { const v = input.currentProduction * (1 + input.levelUpPercent / 100); results["newProduction"] = Number.isFinite(v) ? v : 0; } catch { results["newProduction"] = 0; }
  try { const v = (results["newProduction"] ?? 0) * input.sellingPrice - (results["newProduction"] ?? 0) * input.variableCost - (input.fixedCosts + input.additionalFixedCost); results["newProfit"] = Number.isFinite(v) ? v : 0; } catch { results["newProfit"] = 0; }
  try { const v = (results["newProfit"] ?? 0) - (input.currentProduction * input.sellingPrice - input.currentProduction * input.variableCost - input.fixedCosts); results["monthlyProfitIncrease"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyProfitIncrease"] = 0; }
  try { const v = ((results["currentProfit"] ?? 0) / (input.currentProduction * input.sellingPrice)) * 100; results["profitMarginCurrent"] = Number.isFinite(v) ? v : 0; } catch { results["profitMarginCurrent"] = 0; }
  try { const v = ((results["newProfit"] ?? 0) / ((results["newProduction"] ?? 0) * input.sellingPrice)) * 100; results["profitMarginNew"] = Number.isFinite(v) ? v : 0; } catch { results["profitMarginNew"] = 0; }
  try { const v = input.additionalFixedCost > 0 ? ((results["monthlyProfitIncrease"] ?? 0) / input.additionalFixedCost) * 100 : 0; results["roi"] = Number.isFinite(v) ? v : 0; } catch { results["roi"] = 0; }
  return results;
}


export function calculateLevel_up_calculator(input: Level_up_calculatorInput): Level_up_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["monthlyProfitIncrease"] ?? 0;
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


export interface Level_up_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
