// Auto-generated from freelance-rate-calculator-schema.json
import * as z from 'zod';

export interface Freelance_rate_calculatorInput {
  desiredAnnualIncome: number;
  overheadCosts: number;
  billableHoursPerYear: number;
  profitMarginPercent: number;
  taxRatePercent: number;
  dataConfidence?: number;
}

export const Freelance_rate_calculatorInputSchema = z.object({
  desiredAnnualIncome: z.number().default(100000),
  overheadCosts: z.number().default(20000),
  billableHoursPerYear: z.number().default(1500),
  profitMarginPercent: z.number().default(20),
  taxRatePercent: z.number().default(30),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Freelance_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.desiredAnnualIncome / (1 - input.taxRatePercent / 100); results["annualGrossIncomeNeeded"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annualGrossIncomeNeeded"] = 0; }
  try { const v = (asFormulaNumber(results["annualGrossIncomeNeeded"])) + input.overheadCosts; results["totalAnnualCosts"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalAnnualCosts"] = 0; }
  try { const v = (asFormulaNumber(results["totalAnnualCosts"])) / input.billableHoursPerYear * (1 + input.profitMarginPercent / 100); results["hourlyRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["hourlyRate"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFreelance_rate_calculator(input: Freelance_rate_calculatorInput): Freelance_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["hourlyRate"]));
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


export interface Freelance_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
