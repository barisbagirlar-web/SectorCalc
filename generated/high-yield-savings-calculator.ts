// @ts-nocheck
// Auto-generated from high-yield-savings-calculator-schema.json
import * as z from 'zod';

export interface High_yield_savings_calculatorInput {
  initialDeposit: number;
  monthlyContribution: number;
  annualInterestRate: number;
  years: number;
  compoundFrequency: number;
}

export const High_yield_savings_calculatorInputSchema = z.object({
  initialDeposit: z.number().default(1000),
  monthlyContribution: z.number().default(200),
  annualInterestRate: z.number().default(2.5),
  years: z.number().default(10),
  compoundFrequency: z.number().default(12),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: High_yield_savings_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.annualInterestRate / 100 / input.compoundFrequency; results["monthlyRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyRate"] = 0; }
  try { const v = input.years * input.compoundFrequency; results["totalPeriods"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalPeriods"] = 0; }
  try { const v = input.initialDeposit + input.monthlyContribution * (asFormulaNumber(results["totalPeriods"])); results["totalDeposits"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalDeposits"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateHigh_yield_savings_calculator(input: High_yield_savings_calculatorInput): High_yield_savings_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalDeposits"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface High_yield_savings_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
