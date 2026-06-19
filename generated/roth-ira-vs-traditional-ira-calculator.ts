// Auto-generated from roth-ira-vs-traditional-ira-calculator-schema.json
import * as z from 'zod';

export interface Roth_ira_vs_traditional_ira_calculatorInput {
  annualContribution: number;
  currentAge: number;
  retirementAge: number;
  currentTaxRate: number;
  retirementTaxRate: number;
  annualReturnRate: number;
  dataConfidence?: number;
}

export const Roth_ira_vs_traditional_ira_calculatorInputSchema = z.object({
  annualContribution: z.number().default(6000),
  currentAge: z.number().default(30),
  retirementAge: z.number().default(65),
  currentTaxRate: z.number().default(22),
  retirementTaxRate: z.number().default(22),
  annualReturnRate: z.number().default(7),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Roth_ira_vs_traditional_ira_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.retirementAge - input.currentAge; results["n"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["n"] = 0; }
  try { const v = input.annualReturnRate / 100; results["r"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["r"] = 0; }
  try { const v = (1 + (asFormulaNumber(results["r"]))) ** (asFormulaNumber(results["n"])); results["fvFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fvFactor"] = 0; }
  try { const v = input.annualContribution * (((asFormulaNumber(results["fvFactor"])) - 1) / (asFormulaNumber(results["r"]))); results["fvContributionsTraditional"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fvContributionsTraditional"] = 0; }
  try { const v = (asFormulaNumber(results["fvContributionsTraditional"])) * (1 - input.retirementTaxRate / 100); results["traditionalAfterTax"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["traditionalAfterTax"] = 0; }
  try { const v = input.annualContribution * (1 - input.currentTaxRate / 100); results["effectiveRothContribution"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveRothContribution"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveRothContribution"])) * (((asFormulaNumber(results["fvFactor"])) - 1) / (asFormulaNumber(results["r"]))); results["fvContributionsRoth"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fvContributionsRoth"] = 0; }
  try { const v = (asFormulaNumber(results["fvContributionsRoth"])); results["rothAfterTax"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rothAfterTax"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRoth_ira_vs_traditional_ira_calculator(input: Roth_ira_vs_traditional_ira_calculatorInput): Roth_ira_vs_traditional_ira_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["n"]);
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


export interface Roth_ira_vs_traditional_ira_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
