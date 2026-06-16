// Auto-generated from clv-calculator-schema.json
import * as z from 'zod';

export interface Clv_calculatorInput {
  averageOrderValue: number;
  orderFrequency: number;
  customerLifespan: number;
  profitMargin: number;
  discountRate: number;
}

export const Clv_calculatorInputSchema = z.object({
  averageOrderValue: z.number().default(100),
  orderFrequency: z.number().default(4),
  customerLifespan: z.number().default(3),
  profitMargin: z.number().default(25),
  discountRate: z.number().default(10),
});

function evaluateAllFormulas(input: Clv_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.averageOrderValue * input.orderFrequency * (input.profitMargin / 100)); results["annualProfit"] = Number.isFinite(v) ? v : 0; } catch { results["annualProfit"] = 0; }
  try { const v = (input.discountRate > 0) ? ((results["annualProfit"] ?? 0) * ((1 - Math.pow(1 + input.discountRate / 100, -input.customerLifespan)) / (input.discountRate / 100))) : ((results["annualProfit"] ?? 0) * input.customerLifespan); results["clv"] = Number.isFinite(v) ? v : 0; } catch { results["clv"] = 0; }
  try { const v = ((results["annualProfit"] ?? 0) * input.customerLifespan); results["totalProfitUndiscounted"] = Number.isFinite(v) ? v : 0; } catch { results["totalProfitUndiscounted"] = 0; }
  return results;
}


export function calculateClv_calculator(input: Clv_calculatorInput): Clv_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["clv"] ?? 0;
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


export interface Clv_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
