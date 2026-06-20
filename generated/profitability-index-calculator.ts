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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Profitability_index_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialInvestment * (input.discountRate / 100) * input.cashFlowYear1 * input.cashFlowYear2; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.initialInvestment * (input.discountRate / 100) * input.cashFlowYear1 * input.cashFlowYear2 * (input.cashFlowYear3 * input.cashFlowYear4 * input.cashFlowYear5); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.cashFlowYear3 * input.cashFlowYear4 * input.cashFlowYear5; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateProfitability_index_calculator(input: Profitability_index_calculatorInput): Profitability_index_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Profitability_index_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
