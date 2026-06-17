// @ts-nocheck
// Auto-generated from heloc-calculator-schema.json
import * as z from 'zod';

export interface Heloc_calculatorInput {
  homeValue: number;
  mortgageBalance: number;
  ltvLimit: number;
  interestRate: number;
  drawAmount: number;
  loanTerm: number;
}

export const Heloc_calculatorInputSchema = z.object({
  homeValue: z.number().default(300000),
  mortgageBalance: z.number().default(200000),
  ltvLimit: z.number().default(80),
  interestRate: z.number().default(5),
  drawAmount: z.number().default(50000),
  loanTerm: z.number().default(10),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Heloc_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.homeValue * (input.ltvLimit / 100) - input.mortgageBalance; results["maxHeloc"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["maxHeloc"] = 0; }
  try { const v = input.homeValue - input.mortgageBalance; results["availableEquity"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["availableEquity"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateHeloc_calculator(input: Heloc_calculatorInput): Heloc_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["maxHeloc"]);
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


export interface Heloc_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
