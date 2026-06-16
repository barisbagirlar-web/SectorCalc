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

function evaluateAllFormulas(input: Pip_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.lotSize * input.tradeLots; results["tradeSize"] = Number.isFinite(v) ? v : 0; } catch { results["tradeSize"] = 0; }
  try { const v = (results["tradeSize"] ?? 0) * input.pipDecimal; results["pipValueInQuoteCurrency"] = Number.isFinite(v) ? v : 0; } catch { results["pipValueInQuoteCurrency"] = 0; }
  try { const v = (results["pipValueInQuoteCurrency"] ?? 0) * input.quoteToAccountRate; results["pipValueInAccountCurrency"] = Number.isFinite(v) ? v : 0; } catch { results["pipValueInAccountCurrency"] = 0; }
  return results;
}


export function calculatePip_calculator(input: Pip_calculatorInput): Pip_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["pipValueInAccountCurrency"] ?? 0;
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


export interface Pip_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
