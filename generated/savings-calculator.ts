// Auto-generated from savings-calculator-schema.json
import * as z from 'zod';

export interface Savings_calculatorInput {
  initialDeposit: number;
  monthlyContribution: number;
  annualInterestRate: number;
  years: number;
  dataConfidence?: number;
}

export const Savings_calculatorInputSchema = z.object({
  initialDeposit: z.number().default(1000),
  monthlyContribution: z.number().default(100),
  annualInterestRate: z.number().default(5),
  years: z.number().default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Savings_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialDeposit + input.monthlyContribution * 12 * input.years; results["totalContributions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalContributions"] = Number.NaN; }
  try { const v = input.initialDeposit + input.monthlyContribution * 12 * input.years; results["totalContributions_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalContributions_aux"] = Number.NaN; }
  return results;
}


export function calculateSavings_calculator(input: Savings_calculatorInput): Savings_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalContributions_aux"]);
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


export interface Savings_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
