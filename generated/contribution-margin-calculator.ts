// Auto-generated from contribution-margin-calculator-schema.json
import * as z from 'zod';

export interface Contribution_margin_calculatorInput {
  salesPricePerUnit: number;
  variableCostPerUnit: number;
  unitsSold: number;
  fixedCosts: number;
}

export const Contribution_margin_calculatorInputSchema = z.object({
  salesPricePerUnit: z.number().default(100),
  variableCostPerUnit: z.number().default(60),
  unitsSold: z.number().default(1000),
  fixedCosts: z.number().default(20000),
});

function evaluateAllFormulas(input: Contribution_margin_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.salesPricePerUnit - input.variableCostPerUnit; results["contributionMarginPerUnit"] = Number.isFinite(v) ? v : 0; } catch { results["contributionMarginPerUnit"] = 0; }
  try { const v = (input.salesPricePerUnit - input.variableCostPerUnit) * input.unitsSold; results["totalContributionMargin"] = Number.isFinite(v) ? v : 0; } catch { results["totalContributionMargin"] = 0; }
  try { const v = (input.salesPricePerUnit - input.variableCostPerUnit) / input.salesPricePerUnit; results["contributionMarginRatio"] = Number.isFinite(v) ? v : 0; } catch { results["contributionMarginRatio"] = 0; }
  try { const v = (input.salesPricePerUnit - input.variableCostPerUnit) * input.unitsSold - input.fixedCosts; results["operatingProfit"] = Number.isFinite(v) ? v : 0; } catch { results["operatingProfit"] = 0; }
  return results;
}


export function calculateContribution_margin_calculator(input: Contribution_margin_calculatorInput): Contribution_margin_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalContributionMargin"] ?? 0;
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


export interface Contribution_margin_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
