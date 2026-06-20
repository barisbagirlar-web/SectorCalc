// Auto-generated from cashback-calculator-schema.json
import * as z from 'zod';

export interface Cashback_calculatorInput {
  purchaseAmount: number;
  cashbackRate: number;
  minSpend: number;
  maxCashback: number;
  campaignMultiplier: number;
  dataConfidence?: number;
}

export const Cashback_calculatorInputSchema = z.object({
  purchaseAmount: z.number().default(0),
  cashbackRate: z.number().default(5),
  minSpend: z.number().default(0),
  maxCashback: z.number().default(0),
  campaignMultiplier: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cashback_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.purchaseAmount * (input.cashbackRate / 100) * input.campaignMultiplier; results["baseCashback"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseCashback"] = Number.NaN; }
  try { const v = input.purchaseAmount >= input.minSpend ? input.purchaseAmount : 0; results["qualifyingSpend"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["qualifyingSpend"] = Number.NaN; }
  return results;
}


export function calculateCashback_calculator(input: Cashback_calculatorInput): Cashback_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["qualifyingSpend"]);
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


export interface Cashback_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
