// Auto-generated from biweekly-mortgage-calculator-schema.json
import * as z from 'zod';

export interface Biweekly_mortgage_calculatorInput {
  principal: number;
  annualRate: number;
  termYears: number;
  extraBiweekly: number;
  dataConfidence?: number;
}

export const Biweekly_mortgage_calculatorInputSchema = z.object({
  principal: z.number().default(250000),
  annualRate: z.number().default(6.5),
  termYears: z.number().default(30),
  extraBiweekly: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Biweekly_mortgage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualRate / 100 / 12; results["monthlyRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthlyRate"] = 0; }
  try { const v = input.termYears * 12; results["numberOfMonths"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["numberOfMonths"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBiweekly_mortgage_calculator(input: Biweekly_mortgage_calculatorInput): Biweekly_mortgage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["numberOfMonths"]));
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


export interface Biweekly_mortgage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
