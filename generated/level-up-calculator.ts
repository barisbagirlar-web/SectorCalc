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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Level_up_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentProduction * input.sellingPrice - input.currentProduction * input.variableCost - input.fixedCosts; results["currentProfit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["currentProfit"] = 0; }
  try { const v = input.currentProduction * (1 + input.levelUpPercent / 100); results["newProduction"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["newProduction"] = 0; }
  try { const v = (asFormulaNumber(results["newProduction"])) * input.sellingPrice - (asFormulaNumber(results["newProduction"])) * input.variableCost - (input.fixedCosts + input.additionalFixedCost); results["newProfit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["newProfit"] = 0; }
  try { const v = (asFormulaNumber(results["newProfit"])) - (input.currentProduction * input.sellingPrice - input.currentProduction * input.variableCost - input.fixedCosts); results["monthlyProfitIncrease"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthlyProfitIncrease"] = 0; }
  try { const v = ((asFormulaNumber(results["currentProfit"])) / (input.currentProduction * input.sellingPrice)) * 100; results["profitMarginCurrent"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["profitMarginCurrent"] = 0; }
  try { const v = ((asFormulaNumber(results["newProfit"])) / ((asFormulaNumber(results["newProduction"])) * input.sellingPrice)) * 100; results["profitMarginNew"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["profitMarginNew"] = 0; }
  try { const v = input.additionalFixedCost > 0 ? ((asFormulaNumber(results["monthlyProfitIncrease"])) / input.additionalFixedCost) * 100 : 0; results["roi"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["roi"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
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
