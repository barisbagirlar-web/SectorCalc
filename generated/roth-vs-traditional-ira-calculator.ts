// Auto-generated from roth-vs-traditional-ira-calculator-schema.json
import * as z from 'zod';

export interface Roth_vs_traditional_ira_calculatorInput {
  currentAge: number;
  annualContribution: number;
  currentTaxRate: number;
  expectedRetirementTaxRate: number;
  expectedAnnualReturn: number;
  yearsUntilRetirement: number;
}

export const Roth_vs_traditional_ira_calculatorInputSchema = z.object({
  currentAge: z.number().default(30),
  annualContribution: z.number().default(6000),
  currentTaxRate: z.number().default(22),
  expectedRetirementTaxRate: z.number().default(15),
  expectedAnnualReturn: z.number().default(7),
  yearsUntilRetirement: z.number().default(30),
});

function evaluateAllFormulas(input: Roth_vs_traditional_ira_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.expectedAnnualReturn / 100; results["r"] = Number.isFinite(v) ? v : 0; } catch { results["r"] = 0; }
  try { const v = input.yearsUntilRetirement; results["n"] = Number.isFinite(v) ? v : 0; } catch { results["n"] = 0; }
  try { const v = (Math.pow(1 + (results["r"] ?? 0), (results["n"] ?? 0)) - 1) / (results["r"] ?? 0); results["growthFactor"] = Number.isFinite(v) ? v : 0; } catch { results["growthFactor"] = 0; }
  try { const v = input.annualContribution * (results["growthFactor"] ?? 0) * (1 - input.expectedRetirementTaxRate / 100); results["tradValue"] = Number.isFinite(v) ? v : 0; } catch { results["tradValue"] = 0; }
  try { const v = input.annualContribution * (results["growthFactor"] ?? 0); results["rothValue"] = Number.isFinite(v) ? v : 0; } catch { results["rothValue"] = 0; }
  try { const v = (results["rothValue"] ?? 0) - (results["tradValue"] ?? 0); results["rothMinusTrad"] = Number.isFinite(v) ? v : 0; } catch { results["rothMinusTrad"] = 0; }
  return results;
}


export function calculateRoth_vs_traditional_ira_calculator(input: Roth_vs_traditional_ira_calculatorInput): Roth_vs_traditional_ira_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["rothMinusTrad"] ?? 0;
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


export interface Roth_vs_traditional_ira_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
