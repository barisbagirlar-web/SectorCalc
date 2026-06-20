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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Roth_ira_vs_traditional_ira_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.retirementAge - input.currentAge; results["n"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["n"] = Number.NaN; }
  try { const v = input.annualReturnRate / 100; results["r"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["r"] = Number.NaN; }
  try { const v = (1 + (toNumericFormulaValue(results["r"]))) ** (toNumericFormulaValue(results["n"])); results["fvFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fvFactor"] = Number.NaN; }
  try { const v = input.annualContribution * (((toNumericFormulaValue(results["fvFactor"])) - 1) / (toNumericFormulaValue(results["r"]))); results["fvContributionsTraditional"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fvContributionsTraditional"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["fvContributionsTraditional"])) * (1 - input.retirementTaxRate / 100); results["traditionalAfterTax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["traditionalAfterTax"] = Number.NaN; }
  try { const v = input.annualContribution * (1 - input.currentTaxRate / 100); results["effectiveRothContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveRothContribution"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["effectiveRothContribution"])) * (((toNumericFormulaValue(results["fvFactor"])) - 1) / (toNumericFormulaValue(results["r"]))); results["fvContributionsRoth"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fvContributionsRoth"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["fvContributionsRoth"])); results["rothAfterTax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rothAfterTax"] = Number.NaN; }
  return results;
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
