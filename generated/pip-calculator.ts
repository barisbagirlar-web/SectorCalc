// Auto-generated from pip-calculator-schema.json
import * as z from 'zod';

export interface Pip_calculatorInput {
  lotSize: number;
  tradeLots: number;
  pipDecimal: number;
  quoteToAccountRate: number;
  dataConfidence?: number;
}

export const Pip_calculatorInputSchema = z.object({
  lotSize: z.number().default(100000),
  tradeLots: z.number().default(1),
  pipDecimal: z.number().default(0.0001),
  quoteToAccountRate: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pip_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.lotSize * input.tradeLots; results["tradeSize"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tradeSize"] = 0; }
  try { const v = (asFormulaNumber(results["tradeSize"])) * input.pipDecimal; results["pipValueInQuoteCurrency"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pipValueInQuoteCurrency"] = 0; }
  try { const v = (asFormulaNumber(results["pipValueInQuoteCurrency"])) * input.quoteToAccountRate; results["pipValueInAccountCurrency"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pipValueInAccountCurrency"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePip_calculator(input: Pip_calculatorInput): Pip_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["pipValueInAccountCurrency"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Pip_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
