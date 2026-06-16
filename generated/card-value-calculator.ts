// Auto-generated from card-value-calculator-schema.json
import * as z from 'zod';

export interface Card_value_calculatorInput {
  spendingPerYear: number;
  rewardsRate: number;
  annualFee: number;
  otherBenefits: number;
  interestRate: number;
  averageBalance: number;
}

export const Card_value_calculatorInputSchema = z.object({
  spendingPerYear: z.number().default(5000),
  rewardsRate: z.number().default(1),
  annualFee: z.number().default(100),
  otherBenefits: z.number().default(0),
  interestRate: z.number().default(0),
  averageBalance: z.number().default(0),
});

function evaluateAllFormulas(input: Card_value_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.spendingPerYear * (input.rewardsRate / 100) + input.otherBenefits; results["grossBenefits"] = Number.isFinite(v) ? v : 0; } catch { results["grossBenefits"] = 0; }
  try { const v = input.annualFee + (input.averageBalance * (input.interestRate / 100)); results["totalCosts"] = Number.isFinite(v) ? v : 0; } catch { results["totalCosts"] = 0; }
  try { const v = (results["grossBenefits"] ?? 0) - (results["totalCosts"] ?? 0); results["netValue"] = Number.isFinite(v) ? v : 0; } catch { results["netValue"] = 0; }
  return results;
}


export function calculateCard_value_calculator(input: Card_value_calculatorInput): Card_value_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netValue"] ?? 0;
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


export interface Card_value_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
