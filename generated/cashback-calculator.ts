// Auto-generated from cashback-calculator-schema.json
import * as z from 'zod';

export interface Cashback_calculatorInput {
  purchaseAmount: number;
  cashbackRate: number;
  minSpend: number;
  maxCashback: number;
  campaignMultiplier: number;
}

export const Cashback_calculatorInputSchema = z.object({
  purchaseAmount: z.number().default(0),
  cashbackRate: z.number().default(5),
  minSpend: z.number().default(0),
  maxCashback: z.number().default(0),
  campaignMultiplier: z.number().default(1),
});

function evaluateAllFormulas(input: Cashback_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.purchaseAmount >= input.minSpend ? Math.min(input.purchaseAmount * (input.cashbackRate / 100) * input.campaignMultiplier, input.maxCashback || Infinity) : 0; results["cashbackAmount"] = Number.isFinite(v) ? v : 0; } catch { results["cashbackAmount"] = 0; }
  try { const v = input.purchaseAmount * (input.cashbackRate / 100) * input.campaignMultiplier; results["baseCashback"] = Number.isFinite(v) ? v : 0; } catch { results["baseCashback"] = 0; }
  try { const v = input.purchaseAmount >= input.minSpend ? input.purchaseAmount : 0; results["qualifyingSpend"] = Number.isFinite(v) ? v : 0; } catch { results["qualifyingSpend"] = 0; }
  return results;
}


export function calculateCashback_calculator(input: Cashback_calculatorInput): Cashback_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cashbackAmount"] ?? 0;
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


export interface Cashback_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
