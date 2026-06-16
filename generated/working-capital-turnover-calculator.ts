// Auto-generated from working-capital-turnover-calculator-schema.json
import * as z from 'zod';

export interface Working_capital_turnover_calculatorInput {
  netSales: number;
  begCurrentAssets: number;
  endCurrentAssets: number;
  begCurrentLiabilities: number;
  endCurrentLiabilities: number;
}

export const Working_capital_turnover_calculatorInputSchema = z.object({
  netSales: z.number().default(0),
  begCurrentAssets: z.number().default(0),
  endCurrentAssets: z.number().default(0),
  begCurrentLiabilities: z.number().default(0),
  endCurrentLiabilities: z.number().default(0),
});

function evaluateAllFormulas(input: Working_capital_turnover_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.begCurrentAssets + input.endCurrentAssets) / 2; results["averageCurrentAssets"] = Number.isFinite(v) ? v : 0; } catch { results["averageCurrentAssets"] = 0; }
  try { const v = (input.begCurrentLiabilities + input.endCurrentLiabilities) / 2; results["averageCurrentLiabilities"] = Number.isFinite(v) ? v : 0; } catch { results["averageCurrentLiabilities"] = 0; }
  try { const v = (results["averageCurrentAssets"] ?? 0) - (results["averageCurrentLiabilities"] ?? 0); results["averageWorkingCapital"] = Number.isFinite(v) ? v : 0; } catch { results["averageWorkingCapital"] = 0; }
  try { const v = (results["averageWorkingCapital"] ?? 0) !== 0 ? input.netSales / (results["averageWorkingCapital"] ?? 0) : 0; results["workingCapitalTurnover"] = Number.isFinite(v) ? v : 0; } catch { results["workingCapitalTurnover"] = 0; }
  return results;
}


export function calculateWorking_capital_turnover_calculator(input: Working_capital_turnover_calculatorInput): Working_capital_turnover_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["workingCapitalTurnover"] ?? 0;
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


export interface Working_capital_turnover_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
