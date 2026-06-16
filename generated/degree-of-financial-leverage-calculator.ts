// Auto-generated from degree-of-financial-leverage-calculator-schema.json
import * as z from 'zod';

export interface Degree_of_financial_leverage_calculatorInput {
  ebit: number;
  interest: number;
  taxRate: number;
  preferredDividends: number;
}

export const Degree_of_financial_leverage_calculatorInputSchema = z.object({
  ebit: z.number().default(100000),
  interest: z.number().default(20000),
  taxRate: z.number().default(0.25),
  preferredDividends: z.number().default(0),
});

function evaluateAllFormulas(input: Degree_of_financial_leverage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ebit; results["ebit"] = Number.isFinite(v) ? v : 0; } catch { results["ebit"] = 0; }
  try { const v = input.interest; results["interest"] = Number.isFinite(v) ? v : 0; } catch { results["interest"] = 0; }
  try { const v = input.taxRate; results["taxRate"] = Number.isFinite(v) ? v : 0; } catch { results["taxRate"] = 0; }
  try { const v = input.preferredDividends; results["preferredDividends"] = Number.isFinite(v) ? v : 0; } catch { results["preferredDividends"] = 0; }
  try { const v = input.preferredDividends / (1 - input.taxRate); results["preferredAfterTax"] = Number.isFinite(v) ? v : 0; } catch { results["preferredAfterTax"] = 0; }
  try { const v = input.ebit - input.interest - (input.preferredDividends / (1 - input.taxRate)); results["denominator"] = Number.isFinite(v) ? v : 0; } catch { results["denominator"] = 0; }
  try { const v = input.ebit / (input.ebit - input.interest - (input.preferredDividends / (1 - input.taxRate))); results["degreeOfFinancialLeverage"] = Number.isFinite(v) ? v : 0; } catch { results["degreeOfFinancialLeverage"] = 0; }
  return results;
}


export function calculateDegree_of_financial_leverage_calculator(input: Degree_of_financial_leverage_calculatorInput): Degree_of_financial_leverage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["degreeOfFinancialLeverage"] ?? 0;
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


export interface Degree_of_financial_leverage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
