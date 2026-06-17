// @ts-nocheck
// Auto-generated from safe-withdrawal-rate-calculator-schema.json
import * as z from 'zod';

export interface Safe_withdrawal_rate_calculatorInput {
  initialPortfolio: number;
  expectedReturnRate: number;
  inflationRate: number;
  retirementYears: number;
}

export const Safe_withdrawal_rate_calculatorInputSchema = z.object({
  initialPortfolio: z.number().default(1000000),
  expectedReturnRate: z.number().default(7),
  inflationRate: z.number().default(3),
  retirementYears: z.number().default(30),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Safe_withdrawal_rate_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (1 + input.expectedReturnRate/100) / (1 + input.inflationRate/100) - 1; results["realRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["realRate"] = 0; }
  try { const v = (1 + input.expectedReturnRate/100) / (1 + input.inflationRate/100) - 1; results["realRate_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["realRate_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSafe_withdrawal_rate_calculator(input: Safe_withdrawal_rate_calculatorInput): Safe_withdrawal_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["realRate_aux"]);
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


export interface Safe_withdrawal_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
