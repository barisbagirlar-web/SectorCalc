// Auto-generated from roic-calculator-schema.json
import * as z from 'zod';

export interface Roic_calculatorInput {
  ebit: number;
  taxRate: number;
  totalDebt: number;
  totalEquity: number;
  cash: number;
  dataConfidence?: number;
}

export const Roic_calculatorInputSchema = z.object({
  ebit: z.number().default(100000),
  taxRate: z.number().default(20),
  totalDebt: z.number().default(500000),
  totalEquity: z.number().default(500000),
  cash: z.number().default(50000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Roic_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ebit * (input.taxRate / 100) * input.totalDebt * input.totalEquity; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.ebit * (input.taxRate / 100) * input.totalDebt * input.totalEquity * (input.cash); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.cash; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRoic_calculator(input: Roic_calculatorInput): Roic_calculatorOutput {
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


export interface Roic_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
