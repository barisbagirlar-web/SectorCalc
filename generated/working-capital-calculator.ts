// Auto-generated from working-capital-calculator-schema.json
import * as z from 'zod';

export interface Working_capital_calculatorInput {
  cash: number;
  receivables: number;
  inventory: number;
  payables: number;
  shortTermDebt: number;
}

export const Working_capital_calculatorInputSchema = z.object({
  cash: z.number().default(0),
  receivables: z.number().default(0),
  inventory: z.number().default(0),
  payables: z.number().default(0),
  shortTermDebt: z.number().default(0),
});

function evaluateAllFormulas(input: Working_capital_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cash + input.receivables + input.inventory; results["currentAssets"] = Number.isFinite(v) ? v : 0; } catch { results["currentAssets"] = 0; }
  try { const v = input.payables + input.shortTermDebt; results["currentLiabilities"] = Number.isFinite(v) ? v : 0; } catch { results["currentLiabilities"] = 0; }
  try { const v = (results["currentAssets"] ?? 0) - (results["currentLiabilities"] ?? 0); results["workingCapital"] = Number.isFinite(v) ? v : 0; } catch { results["workingCapital"] = 0; }
  return results;
}


export function calculateWorking_capital_calculator(input: Working_capital_calculatorInput): Working_capital_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["workingCapital"] ?? 0;
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


export interface Working_capital_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
