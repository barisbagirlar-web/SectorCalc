// Auto-generated from level-up-calculator-schema.json
import * as z from 'zod';

export interface Level_up_calculatorInput {
  currentProduction: number;
  sellingPrice: number;
  variableCost: number;
  fixedCosts: number;
  levelUpPercent: number;
  additionalFixedCost: number;
  dataConfidence?: number;
}

export const Level_up_calculatorInputSchema = z.object({
  currentProduction: z.number().default(5000),
  sellingPrice: z.number().default(100),
  variableCost: z.number().default(60),
  fixedCosts: z.number().default(150000),
  levelUpPercent: z.number().default(20),
  additionalFixedCost: z.number().default(30000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Level_up_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentProduction * input.sellingPrice - input.currentProduction * input.variableCost - input.fixedCosts; results["currentProfit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["currentProfit"] = Number.NaN; }
  try { const v = input.currentProduction * (1 + input.levelUpPercent / 100); results["newProduction"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["newProduction"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["newProduction"])) * input.sellingPrice - (toNumericFormulaValue(results["newProduction"])) * input.variableCost - (input.fixedCosts + input.additionalFixedCost); results["newProfit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["newProfit"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["newProfit"])) - (input.currentProduction * input.sellingPrice - input.currentProduction * input.variableCost - input.fixedCosts); results["monthlyProfitIncrease"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyProfitIncrease"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["currentProfit"])) / (input.currentProduction * input.sellingPrice)) * 100; results["profitMarginCurrent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["profitMarginCurrent"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["newProfit"])) / ((toNumericFormulaValue(results["newProduction"])) * input.sellingPrice)) * 100; results["profitMarginNew"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["profitMarginNew"] = Number.NaN; }
  try { const v = input.additionalFixedCost > 0 ? ((toNumericFormulaValue(results["monthlyProfitIncrease"])) / input.additionalFixedCost) * 100 : 0; results["roi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["roi"] = Number.NaN; }
  return results;
}


export function calculateLevel_up_calculator(input: Level_up_calculatorInput): Level_up_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["monthlyProfitIncrease"]);
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


export interface Level_up_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
