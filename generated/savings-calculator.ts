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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Savings_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialDeposit + input.monthlyContribution * 12 * input.years; results["totalContributions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalContributions"] = 0; }
  try { const v = input.initialDeposit + input.monthlyContribution * 12 * input.years; results["totalContributions_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalContributions_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSavings_calculator(input: Savings_calculatorInput): Savings_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalContributions_aux"]));
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


export interface Savings_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
