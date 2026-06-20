// Auto-generated from forex-pip-value-calculator-schema.json
import * as z from 'zod';

export interface Forex_pip_value_calculatorInput {
  trade_size_lots: number;
  contract_size: number;
  pip_definition: number;
  quote_to_account_rate: number;
  dataConfidence?: number;
}

export const Forex_pip_value_calculatorInputSchema = z.object({
  trade_size_lots: z.number().default(1),
  contract_size: z.number().default(100000),
  pip_definition: z.number().default(0.0001),
  quote_to_account_rate: z.number().default(1.2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Forex_pip_value_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.trade_size_lots * input.contract_size * input.pip_definition; results["pipValueInQuote"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pipValueInQuote"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["pipValueInQuote"])) * input.quote_to_account_rate; results["pipValueInAccount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pipValueInAccount"] = Number.NaN; }
  return results;
}


export function calculateForex_pip_value_calculator(input: Forex_pip_value_calculatorInput): Forex_pip_value_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["pipValueInAccount"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Forex_pip_value_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
