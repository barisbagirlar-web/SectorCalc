// Auto-generated from roth-ira-vs-traditional-ira-calculator-schema.json
import * as z from 'zod';

export interface Roth_ira_vs_traditional_ira_calculatorInput {
  annualContribution: number;
  currentAge: number;
  retirementAge: number;
  currentTaxRate: number;
  retirementTaxRate: number;
  annualReturnRate: number;
}

export const Roth_ira_vs_traditional_ira_calculatorInputSchema = z.object({
  annualContribution: z.number().default(6000),
  currentAge: z.number().default(30),
  retirementAge: z.number().default(65),
  currentTaxRate: z.number().default(22),
  retirementTaxRate: z.number().default(22),
  annualReturnRate: z.number().default(7),
});

function evaluateAllFormulas(input: Roth_ira_vs_traditional_ira_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.retirementAge - input.currentAge; results["n"] = Number.isFinite(v) ? v : 0; } catch { results["n"] = 0; }
  try { const v = input.annualReturnRate / 100; results["r"] = Number.isFinite(v) ? v : 0; } catch { results["r"] = 0; }
  try { const v = (1 + (results["r"] ?? 0)) ** (results["n"] ?? 0); results["fvFactor"] = Number.isFinite(v) ? v : 0; } catch { results["fvFactor"] = 0; }
  try { const v = input.annualContribution * (((results["fvFactor"] ?? 0) - 1) / (results["r"] ?? 0)); results["fvContributionsTraditional"] = Number.isFinite(v) ? v : 0; } catch { results["fvContributionsTraditional"] = 0; }
  try { const v = (results["fvContributionsTraditional"] ?? 0) * (1 - input.retirementTaxRate / 100); results["traditionalAfterTax"] = Number.isFinite(v) ? v : 0; } catch { results["traditionalAfterTax"] = 0; }
  try { const v = input.annualContribution * (1 - input.currentTaxRate / 100); results["effectiveRothContribution"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveRothContribution"] = 0; }
  try { const v = (results["effectiveRothContribution"] ?? 0) * (((results["fvFactor"] ?? 0) - 1) / (results["r"] ?? 0)); results["fvContributionsRoth"] = Number.isFinite(v) ? v : 0; } catch { results["fvContributionsRoth"] = 0; }
  try { const v = (results["fvContributionsRoth"] ?? 0); results["rothAfterTax"] = Number.isFinite(v) ? v : 0; } catch { results["rothAfterTax"] = 0; }
  return results;
}


export function calculateRoth_ira_vs_traditional_ira_calculator(input: Roth_ira_vs_traditional_ira_calculatorInput): Roth_ira_vs_traditional_ira_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["n"] ?? 0;
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


export interface Roth_ira_vs_traditional_ira_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
