// Auto-generated from roth-vs-traditional-ira-calculator-schema.json
import * as z from 'zod';

export interface Roth_vs_traditional_ira_calculatorInput {
  currentAge: number;
  annualContribution: number;
  currentTaxRate: number;
  expectedRetirementTaxRate: number;
  expectedAnnualReturn: number;
  yearsUntilRetirement: number;
  dataConfidence?: number;
}

export const Roth_vs_traditional_ira_calculatorInputSchema = z.object({
  currentAge: z.number().default(30),
  annualContribution: z.number().default(6000),
  currentTaxRate: z.number().default(22),
  expectedRetirementTaxRate: z.number().default(15),
  expectedAnnualReturn: z.number().default(7),
  yearsUntilRetirement: z.number().default(30),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Roth_vs_traditional_ira_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.yearsUntilRetirement; results["n"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["n"] = 0; }
  try { const v = input.yearsUntilRetirement; results["n_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["n_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRoth_vs_traditional_ira_calculator(input: Roth_vs_traditional_ira_calculatorInput): Roth_vs_traditional_ira_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["n_aux"]);
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


export interface Roth_vs_traditional_ira_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
