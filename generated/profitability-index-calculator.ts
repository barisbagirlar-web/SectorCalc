// Auto-generated from profitability-index-calculator-schema.json
import * as z from 'zod';

export interface Profitability_index_calculatorInput {
  initialInvestment: number;
  discountRate: number;
  cashFlowYear1: number;
  cashFlowYear2: number;
  cashFlowYear3: number;
  cashFlowYear4: number;
  cashFlowYear5: number;
}

export const Profitability_index_calculatorInputSchema = z.object({
  initialInvestment: z.number().default(100000),
  discountRate: z.number().default(10),
  cashFlowYear1: z.number().default(30000),
  cashFlowYear2: z.number().default(30000),
  cashFlowYear3: z.number().default(30000),
  cashFlowYear4: z.number().default(30000),
  cashFlowYear5: z.number().default(30000),
});

function evaluateAllFormulas(input: Profitability_index_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cashFlowYear1 / Math.pow(1 + input.discountRate/100, 1); results["presentValueYear1"] = Number.isFinite(v) ? v : 0; } catch { results["presentValueYear1"] = 0; }
  try { const v = input.cashFlowYear2 / Math.pow(1 + input.discountRate/100, 2); results["presentValueYear2"] = Number.isFinite(v) ? v : 0; } catch { results["presentValueYear2"] = 0; }
  try { const v = input.cashFlowYear3 / Math.pow(1 + input.discountRate/100, 3); results["presentValueYear3"] = Number.isFinite(v) ? v : 0; } catch { results["presentValueYear3"] = 0; }
  try { const v = input.cashFlowYear4 / Math.pow(1 + input.discountRate/100, 4); results["presentValueYear4"] = Number.isFinite(v) ? v : 0; } catch { results["presentValueYear4"] = 0; }
  try { const v = input.cashFlowYear5 / Math.pow(1 + input.discountRate/100, 5); results["presentValueYear5"] = Number.isFinite(v) ? v : 0; } catch { results["presentValueYear5"] = 0; }
  try { const v = (results["presentValueYear1"] ?? 0) + (results["presentValueYear2"] ?? 0) + (results["presentValueYear3"] ?? 0) + (results["presentValueYear4"] ?? 0) + (results["presentValueYear5"] ?? 0); results["totalPresentValue"] = Number.isFinite(v) ? v : 0; } catch { results["totalPresentValue"] = 0; }
  try { const v = (results["totalPresentValue"] ?? 0) / input.initialInvestment; results["profitabilityIndex"] = Number.isFinite(v) ? v : 0; } catch { results["profitabilityIndex"] = 0; }
  return results;
}


export function calculateProfitability_index_calculator(input: Profitability_index_calculatorInput): Profitability_index_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["profitabilityIndex"] ?? 0;
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


export interface Profitability_index_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
