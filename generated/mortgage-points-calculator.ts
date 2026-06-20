// Auto-generated from mortgage-points-calculator-schema.json
import * as z from 'zod';

export interface Mortgage_points_calculatorInput {
  loanAmount: number;
  baseInterestRate: number;
  pointsPurchased: number;
  rateReductionPerPoint: number;
  loanTermYears: number;
  dataConfidence?: number;
}

export const Mortgage_points_calculatorInputSchema = z.object({
  loanAmount: z.number().default(300000),
  baseInterestRate: z.number().default(6.5),
  pointsPurchased: z.number().default(2),
  rateReductionPerPoint: z.number().default(0.25),
  loanTermYears: z.number().default(30),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mortgage_points_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.baseInterestRate / 100 / 12; results["monthlyRateBase"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyRateBase"] = Number.NaN; }
  try { const v = (input.baseInterestRate - input.pointsPurchased * input.rateReductionPerPoint) / 100 / 12; results["monthlyRateWithPoints"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["monthlyRateWithPoints"] = Number.NaN; }
  try { const v = input.loanTermYears * 12; results["n"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["n"] = Number.NaN; }
  try { const v = input.loanAmount * input.pointsPurchased * 0.01; results["upfrontCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["upfrontCost"] = Number.NaN; }
  return results;
}


export function calculateMortgage_points_calculator(input: Mortgage_points_calculatorInput): Mortgage_points_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["upfrontCost"]);
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


export interface Mortgage_points_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
