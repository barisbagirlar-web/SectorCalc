// @ts-nocheck
// Auto-generated from mortgage-points-calculator-schema.json
import * as z from 'zod';

export interface Mortgage_points_calculatorInput {
  loanAmount: number;
  baseInterestRate: number;
  pointsPurchased: number;
  rateReductionPerPoint: number;
  loanTermYears: number;
}

export const Mortgage_points_calculatorInputSchema = z.object({
  loanAmount: z.number().default(300000),
  baseInterestRate: z.number().default(6.5),
  pointsPurchased: z.number().default(2),
  rateReductionPerPoint: z.number().default(0.25),
  loanTermYears: z.number().default(30),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mortgage_points_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.baseInterestRate / 100 / 12; results["monthlyRateBase"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyRateBase"] = 0; }
  try { const v = (input.baseInterestRate - input.pointsPurchased * input.rateReductionPerPoint) / 100 / 12; results["monthlyRateWithPoints"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyRateWithPoints"] = 0; }
  try { const v = input.loanTermYears * 12; results["n"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["n"] = 0; }
  try { const v = input.loanAmount * input.pointsPurchased * 0.01; results["upfrontCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["upfrontCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMortgage_points_calculator(input: Mortgage_points_calculatorInput): Mortgage_points_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["upfrontCost"]);
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


export interface Mortgage_points_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
