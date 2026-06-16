// Auto-generated from 1031-exchange-calculator-schema.json
import * as z from 'zod';

export interface _1031_exchange_calculatorInput {
  salePrice: number;
  mortgagePayoff: number;
  sellingCosts: number;
  purchasePrice: number;
  newMortgage: number;
  buyingCosts: number;
}

export const _1031_exchange_calculatorInputSchema = z.object({
  salePrice: z.number().default(500000),
  mortgagePayoff: z.number().default(300000),
  sellingCosts: z.number().default(30000),
  purchasePrice: z.number().default(600000),
  newMortgage: z.number().default(350000),
  buyingCosts: z.number().default(15000),
});

function evaluateAllFormulas(input: _1031_exchange_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.salePrice - input.mortgagePayoff - input.sellingCosts; results["netProceeds"] = Number.isFinite(v) ? v : 0; } catch { results["netProceeds"] = 0; }
  try { const v = input.purchasePrice - input.newMortgage + input.buyingCosts; results["cashRequired"] = Number.isFinite(v) ? v : 0; } catch { results["cashRequired"] = 0; }
  try { const v = Math.max(0, (results["netProceeds"] ?? 0) - (results["cashRequired"] ?? 0)); results["cashBoot"] = Number.isFinite(v) ? v : 0; } catch { results["cashBoot"] = 0; }
  try { const v = Math.max(0, input.mortgagePayoff - input.newMortgage); results["mortgageBoot"] = Number.isFinite(v) ? v : 0; } catch { results["mortgageBoot"] = 0; }
  try { const v = (results["cashBoot"] ?? 0) + (results["mortgageBoot"] ?? 0); results["totalBoot"] = Number.isFinite(v) ? v : 0; } catch { results["totalBoot"] = 0; }
  return results;
}


export function calculate_1031_exchange_calculator(input: _1031_exchange_calculatorInput): _1031_exchange_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalBoot"] ?? 0;
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


export interface _1031_exchange_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
