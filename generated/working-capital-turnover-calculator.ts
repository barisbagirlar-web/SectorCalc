// Auto-generated from working-capital-turnover-calculator-schema.json
import * as z from 'zod';

export interface Working_capital_turnover_calculatorInput {
  netSales: number;
  begCurrentAssets: number;
  endCurrentAssets: number;
  begCurrentLiabilities: number;
  endCurrentLiabilities: number;
  dataConfidence?: number;
}

export const Working_capital_turnover_calculatorInputSchema = z.object({
  netSales: z.number().default(0),
  begCurrentAssets: z.number().default(0),
  endCurrentAssets: z.number().default(0),
  begCurrentLiabilities: z.number().default(0),
  endCurrentLiabilities: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Working_capital_turnover_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.begCurrentAssets + input.endCurrentAssets) / 2; results["averageCurrentAssets"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["averageCurrentAssets"] = 0; }
  try { const v = (input.begCurrentLiabilities + input.endCurrentLiabilities) / 2; results["averageCurrentLiabilities"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["averageCurrentLiabilities"] = 0; }
  try { const v = (asFormulaNumber(results["averageCurrentAssets"])) - (asFormulaNumber(results["averageCurrentLiabilities"])); results["averageWorkingCapital"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["averageWorkingCapital"] = 0; }
  try { const v = (((asFormulaNumber(results["averageWorkingCapital"])) !== 0 ? input.netSales / (asFormulaNumber(results["averageWorkingCapital"])) : 0) ? 1 : 0); results["workingCapitalTurnover"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["workingCapitalTurnover"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWorking_capital_turnover_calculator(input: Working_capital_turnover_calculatorInput): Working_capital_turnover_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["workingCapitalTurnover"]);
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


export interface Working_capital_turnover_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
