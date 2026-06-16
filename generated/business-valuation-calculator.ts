// Auto-generated from business-valuation-calculator-schema.json
import * as z from 'zod';

export interface Business_valuation_calculatorInput {
  revenue: number;
  expenses: number;
  growthRate: number;
  discountRate: number;
  assets: number;
  liabilities: number;
}

export const Business_valuation_calculatorInputSchema = z.object({
  revenue: z.number().default(1000000),
  expenses: z.number().default(800000),
  growthRate: z.number().default(3),
  discountRate: z.number().default(10),
  assets: z.number().default(500000),
  liabilities: z.number().default(200000),
});

function evaluateAllFormulas(input: Business_valuation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.revenue - input.expenses; results["netProfit"] = Number.isFinite(v) ? v : 0; } catch { results["netProfit"] = 0; }
  try { const v = (results["netProfit"] ?? 0) / (input.discountRate/100 - input.growthRate/100); results["dcfValuation"] = Number.isFinite(v) ? v : 0; } catch { results["dcfValuation"] = 0; }
  try { const v = input.assets - input.liabilities; results["assetBasedValuation"] = Number.isFinite(v) ? v : 0; } catch { results["assetBasedValuation"] = 0; }
  try { const v = ((results["dcfValuation"] ?? 0) + (results["assetBasedValuation"] ?? 0)) / 2; results["businessValuation"] = Number.isFinite(v) ? v : 0; } catch { results["businessValuation"] = 0; }
  return results;
}


export function calculateBusiness_valuation_calculator(input: Business_valuation_calculatorInput): Business_valuation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["businessValuation"] ?? 0;
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


export interface Business_valuation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
