// Auto-generated from contribution-margin-calculator-schema.json
import * as z from 'zod';

export interface Contribution_margin_calculatorInput {
  salesPricePerUnit: number;
  variableCostPerUnit: number;
  unitsSold: number;
  fixedCosts: number;
  dataConfidence?: number;
}

export const Contribution_margin_calculatorInputSchema = z.object({
  salesPricePerUnit: z.number().default(100),
  variableCostPerUnit: z.number().default(60),
  unitsSold: z.number().default(1000),
  fixedCosts: z.number().default(20000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Contribution_margin_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.salesPricePerUnit - input.variableCostPerUnit; results["contributionMarginPerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["contributionMarginPerUnit"] = Number.NaN; }
  try { const v = (input.salesPricePerUnit - input.variableCostPerUnit) * input.unitsSold; results["totalContributionMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalContributionMargin"] = Number.NaN; }
  try { const v = (input.salesPricePerUnit - input.variableCostPerUnit) / input.salesPricePerUnit; results["contributionMarginRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["contributionMarginRatio"] = Number.NaN; }
  try { const v = (input.salesPricePerUnit - input.variableCostPerUnit) * input.unitsSold - input.fixedCosts; results["operatingProfit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["operatingProfit"] = Number.NaN; }
  return results;
}


export function calculateContribution_margin_calculator(input: Contribution_margin_calculatorInput): Contribution_margin_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalContributionMargin"]);
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


export interface Contribution_margin_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
