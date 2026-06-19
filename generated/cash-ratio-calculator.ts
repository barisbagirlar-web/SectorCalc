// Auto-generated from cash-ratio-calculator-schema.json
import * as z from 'zod';

export interface Cash_ratio_calculatorInput {
  cash: number;
  bankDeposits: number;
  shortTermInvestments: number;
  currentLiabilities: number;
  dataConfidence?: number;
}

export const Cash_ratio_calculatorInputSchema = z.object({
  cash: z.number().default(0),
  bankDeposits: z.number().default(0),
  shortTermInvestments: z.number().default(0),
  currentLiabilities: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cash_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cash + input.bankDeposits + input.shortTermInvestments; results["totalCash"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCash"] = 0; }
  try { const v = (asFormulaNumber(results["totalCash"])) / input.currentLiabilities; results["cashRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cashRatio"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCash_ratio_calculator(input: Cash_ratio_calculatorInput): Cash_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["cashRatio"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Cash_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
