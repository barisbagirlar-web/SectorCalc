// @ts-nocheck
// Auto-generated from pip-calculator-schema.json
import * as z from 'zod';

export interface Pip_calculatorInput {
  lotSize: number;
  tradeLots: number;
  pipDecimal: number;
  quoteToAccountRate: number;
}

export const Pip_calculatorInputSchema = z.object({
  lotSize: z.number().default(100000),
  tradeLots: z.number().default(1),
  pipDecimal: z.number().default(0.0001),
  quoteToAccountRate: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pip_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.lotSize * input.tradeLots; results["tradeSize"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["tradeSize"] = 0; }
  try { const v = (asFormulaNumber(results["tradeSize"])) * input.pipDecimal; results["pipValueInQuoteCurrency"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pipValueInQuoteCurrency"] = 0; }
  try { const v = (asFormulaNumber(results["pipValueInQuoteCurrency"])) * input.quoteToAccountRate; results["pipValueInAccountCurrency"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pipValueInAccountCurrency"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePip_calculator(input: Pip_calculatorInput): Pip_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["pipValueInAccountCurrency"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
