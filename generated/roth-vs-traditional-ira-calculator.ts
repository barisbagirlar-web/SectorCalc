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
  try { const v = input.annualContribution * ((1 + input.expectedAnnualReturn/100) ^ input.yearsUntilRetirement); results["rothValue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rothValue"] = 0; }
  try { const v = input.annualContribution * (1 - input.currentTaxRate/100) * ((1 + input.expectedAnnualReturn/100) ^ input.yearsUntilRetirement) / (1 - input.expectedRetirementTaxRate/100); results["tradValue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tradValue"] = 0; }
  try { const v = (asFormulaNumber(results["rothValue"])) - (asFormulaNumber(results["tradValue"])); results["rothMinusTrad"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rothMinusTrad"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRoth_vs_traditional_ira_calculator(input: Roth_vs_traditional_ira_calculatorInput): Roth_vs_traditional_ira_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["rothMinusTrad"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
