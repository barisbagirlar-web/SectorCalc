// Auto-generated from flip-calculator-schema.json
import * as z from 'zod';

export interface Flip_calculatorInput {
  purchasePrice: number;
  renovationCost: number;
  holdingCosts: number;
  sellingPrice: number;
  sellingCosts: number;
  financingCosts: number;
}

export const Flip_calculatorInputSchema = z.object({
  purchasePrice: z.number().default(100000),
  renovationCost: z.number().default(20000),
  holdingCosts: z.number().default(5000),
  sellingPrice: z.number().default(150000),
  sellingCosts: z.number().default(10000),
  financingCosts: z.number().default(3000),
});

function evaluateAllFormulas(input: Flip_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.purchasePrice + input.renovationCost + input.holdingCosts; results["totalInvestment"] = Number.isFinite(v) ? v : 0; } catch { results["totalInvestment"] = 0; }
  try { const v = input.sellingPrice - (results["totalInvestment"] ?? 0) - input.sellingCosts - input.financingCosts; results["grossProfit"] = Number.isFinite(v) ? v : 0; } catch { results["grossProfit"] = 0; }
  try { const v = (results["grossProfit"] ?? 0); results["netProfit"] = Number.isFinite(v) ? v : 0; } catch { results["netProfit"] = 0; }
  try { const v = (results["totalInvestment"] ?? 0) !== 0 ? ((results["netProfit"] ?? 0) / (results["totalInvestment"] ?? 0)) * 100 : 0; results["roi"] = Number.isFinite(v) ? v : 0; } catch { results["roi"] = 0; }
  return results;
}


export function calculateFlip_calculator(input: Flip_calculatorInput): Flip_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netProfit"] ?? 0;
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


export interface Flip_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
