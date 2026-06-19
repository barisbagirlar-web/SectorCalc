// Auto-generated from degree-of-financial-leverage-calculator-schema.json
import * as z from 'zod';

export interface Degree_of_financial_leverage_calculatorInput {
  ebit: number;
  interest: number;
  taxRate: number;
  preferredDividends: number;
  dataConfidence?: number;
}

export const Degree_of_financial_leverage_calculatorInputSchema = z.object({
  ebit: z.number().default(100000),
  interest: z.number().default(20000),
  taxRate: z.number().default(0.25),
  preferredDividends: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Degree_of_financial_leverage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ebit * input.interest * input.taxRate * input.preferredDividends; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.ebit * input.interest * input.taxRate * input.preferredDividends; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDegree_of_financial_leverage_calculator(input: Degree_of_financial_leverage_calculatorInput): Degree_of_financial_leverage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
