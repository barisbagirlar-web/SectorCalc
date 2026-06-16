// Auto-generated from real-return-calculator-schema.json
import * as z from 'zod';

export interface Real_return_calculatorInput {
  nominalReturn: number;
  inflationRate: number;
  taxRate: number;
  investmentAmount: number;
}

export const Real_return_calculatorInputSchema = z.object({
  nominalReturn: z.number().default(5),
  inflationRate: z.number().default(2),
  taxRate: z.number().default(0),
  investmentAmount: z.number().default(1000),
});

function evaluateAllFormulas(input: Real_return_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((1 + (input.nominalReturn * (1 - input.taxRate / 100)) / 100) / (1 + input.inflationRate / 100) - 1) * 100; results["realReturn"] = Number.isFinite(v) ? v : 0; } catch { results["realReturn"] = 0; }
  try { const v = input.investmentAmount * (1 + ((1 + (input.nominalReturn * (1 - input.taxRate / 100)) / 100) / (1 + input.inflationRate / 100) - 1)); results["realValue"] = Number.isFinite(v) ? v : 0; } catch { results["realValue"] = 0; }
  try { const v = input.nominalReturn * (1 - input.taxRate / 100); results["nominalAfterTax"] = Number.isFinite(v) ? v : 0; } catch { results["nominalAfterTax"] = 0; }
  return results;
}


export function calculateReal_return_calculator(input: Real_return_calculatorInput): Real_return_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["realReturn"] ?? 0;
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


export interface Real_return_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
