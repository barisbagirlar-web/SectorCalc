// Auto-generated from degree-of-operating-leverage-calculator-schema.json
import * as z from 'zod';

export interface Degree_of_operating_leverage_calculatorInput {
  quantity: number;
  pricePerUnit: number;
  variableCostPerUnit: number;
  fixedCosts: number;
}

export const Degree_of_operating_leverage_calculatorInputSchema = z.object({
  quantity: z.number().default(1000),
  pricePerUnit: z.number().default(50),
  variableCostPerUnit: z.number().default(30),
  fixedCosts: z.number().default(10000),
});

function evaluateAllFormulas(input: Degree_of_operating_leverage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.pricePerUnit - input.variableCostPerUnit; results["contributionMarginPerUnit"] = Number.isFinite(v) ? v : 0; } catch { results["contributionMarginPerUnit"] = 0; }
  try { const v = input.quantity * (results["contributionMarginPerUnit"] ?? 0); results["totalContributionMargin"] = Number.isFinite(v) ? v : 0; } catch { results["totalContributionMargin"] = 0; }
  try { const v = (results["totalContributionMargin"] ?? 0) - input.fixedCosts; results["operatingIncome"] = Number.isFinite(v) ? v : 0; } catch { results["operatingIncome"] = 0; }
  try { const v = (results["totalContributionMargin"] ?? 0) / (results["operatingIncome"] ?? 0); results["degreeOfOperatingLeverage"] = Number.isFinite(v) ? v : 0; } catch { results["degreeOfOperatingLeverage"] = 0; }
  return results;
}


export function calculateDegree_of_operating_leverage_calculator(input: Degree_of_operating_leverage_calculatorInput): Degree_of_operating_leverage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["degreeOfOperatingLeverage"] ?? 0;
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


export interface Degree_of_operating_leverage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
