// Auto-generated from current-ratio-calculator-schema.json
import * as z from 'zod';

export interface Current_ratio_calculatorInput {
  cash: number;
  receivables: number;
  inventory: number;
  otherCurrentAssets: number;
  payables: number;
  shortTermDebt: number;
  otherCurrentLiabilities: number;
}

export const Current_ratio_calculatorInputSchema = z.object({
  cash: z.number().default(0),
  receivables: z.number().default(0),
  inventory: z.number().default(0),
  otherCurrentAssets: z.number().default(0),
  payables: z.number().default(0),
  shortTermDebt: z.number().default(0),
  otherCurrentLiabilities: z.number().default(0),
});

function evaluateAllFormulas(input: Current_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cash + input.receivables + input.inventory + input.otherCurrentAssets; results["totalCurrentAssets"] = Number.isFinite(v) ? v : 0; } catch { results["totalCurrentAssets"] = 0; }
  try { const v = input.payables + input.shortTermDebt + input.otherCurrentLiabilities; results["totalCurrentLiabilities"] = Number.isFinite(v) ? v : 0; } catch { results["totalCurrentLiabilities"] = 0; }
  try { const v = (results["totalCurrentAssets"] ?? 0) / (results["totalCurrentLiabilities"] ?? 0); results["currentRatio"] = Number.isFinite(v) ? v : 0; } catch { results["currentRatio"] = 0; }
  return results;
}


export function calculateCurrent_ratio_calculator(input: Current_ratio_calculatorInput): Current_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["currentRatio"] ?? 0;
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


export interface Current_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
