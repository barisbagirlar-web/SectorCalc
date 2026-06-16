// Auto-generated from pmi-calculator-schema.json
import * as z from 'zod';

export interface Pmi_calculatorInput {
  revenue: number;
  costOfGoodsSold: number;
  operatingExpenses: number;
  taxRate: number;
}

export const Pmi_calculatorInputSchema = z.object({
  revenue: z.number().default(100000),
  costOfGoodsSold: z.number().default(60000),
  operatingExpenses: z.number().default(20000),
  taxRate: z.number().default(20),
});

function evaluateAllFormulas(input: Pmi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.revenue - input.costOfGoodsSold; results["grossProfit"] = Number.isFinite(v) ? v : 0; } catch { results["grossProfit"] = 0; }
  try { const v = (results["grossProfit"] ?? 0) - input.operatingExpenses; results["operatingProfit"] = Number.isFinite(v) ? v : 0; } catch { results["operatingProfit"] = 0; }
  try { const v = (results["operatingProfit"] ?? 0) * (1 - input.taxRate / 100); results["netProfit"] = Number.isFinite(v) ? v : 0; } catch { results["netProfit"] = 0; }
  try { const v = (results["grossProfit"] ?? 0) / input.revenue * 100; results["grossProfitMargin"] = Number.isFinite(v) ? v : 0; } catch { results["grossProfitMargin"] = 0; }
  try { const v = (results["operatingProfit"] ?? 0) / input.revenue * 100; results["operatingProfitMargin"] = Number.isFinite(v) ? v : 0; } catch { results["operatingProfitMargin"] = 0; }
  try { const v = (results["netProfit"] ?? 0) / input.revenue * 100; results["netProfitMargin"] = Number.isFinite(v) ? v : 0; } catch { results["netProfitMargin"] = 0; }
  return results;
}


export function calculatePmi_calculator(input: Pmi_calculatorInput): Pmi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netProfitMargin"] ?? 0;
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


export interface Pmi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
