// Auto-generated from apr-calculator-schema.json
import * as z from 'zod';

export interface Apr_calculatorInput {
  loanAmount: number;
  nominalRate: number;
  loanTermYears: number;
  compoundingFrequency: number;
  fees: number;
}

export const Apr_calculatorInputSchema = z.object({
  loanAmount: z.number().default(10000),
  nominalRate: z.number().default(5),
  loanTermYears: z.number().default(5),
  compoundingFrequency: z.number().default(12),
  fees: z.number().default(0),
});

function evaluateAllFormulas(input: Apr_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.loanAmount * (input.nominalRate/100/input.compoundingFrequency)) / (1 - Math.pow(1 + (input.nominalRate/100/input.compoundingFrequency), -(input.loanTermYears*input.compoundingFrequency))); results["monthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPayment"] = 0; }
  try { const v = (results["monthlyPayment"] ?? 0) * (input.loanTermYears*input.compoundingFrequency); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (Math.pow((results["totalCost"] ?? 0) / (input.loanAmount - input.fees), 1/input.loanTermYears) - 1) * 100; results["APR"] = Number.isFinite(v) ? v : 0; } catch { results["APR"] = 0; }
  return results;
}


export function calculateApr_calculator(input: Apr_calculatorInput): Apr_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["APR"] ?? 0;
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


export interface Apr_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
