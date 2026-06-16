// Auto-generated from series-i-savings-bond-calculator-schema.json
import * as z from 'zod';

export interface Series_i_savings_bond_calculatorInput {
  principal: number;
  fixedRate: number;
  inflationRate: number;
  years: number;
}

export const Series_i_savings_bond_calculatorInputSchema = z.object({
  principal: z.number().default(10000),
  fixedRate: z.number().default(0),
  inflationRate: z.number().default(1.5),
  years: z.number().default(5),
});

function evaluateAllFormulas(input: Series_i_savings_bond_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fixedRate/100 + 2*(input.inflationRate/100) + (input.fixedRate/100)*(input.inflationRate/100); results["compositeRate"] = Number.isFinite(v) ? v : 0; } catch { results["compositeRate"] = 0; }
  try { const v = input.principal * Math.pow(1 + (results["compositeRate"] ?? 0)/2, 2*input.years); results["futureValue"] = Number.isFinite(v) ? v : 0; } catch { results["futureValue"] = 0; }
  try { const v = (results["futureValue"] ?? 0) - input.principal; results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  return results;
}


export function calculateSeries_i_savings_bond_calculator(input: Series_i_savings_bond_calculatorInput): Series_i_savings_bond_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["futureValue"] ?? 0;
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


export interface Series_i_savings_bond_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
