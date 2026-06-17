// @ts-nocheck
// Auto-generated from card-value-calculator-schema.json
import * as z from 'zod';

export interface Card_value_calculatorInput {
  spendingPerYear: number;
  rewardsRate: number;
  annualFee: number;
  otherBenefits: number;
  interestRate: number;
  averageBalance: number;
}

export const Card_value_calculatorInputSchema = z.object({
  spendingPerYear: z.number().default(5000),
  rewardsRate: z.number().default(1),
  annualFee: z.number().default(100),
  otherBenefits: z.number().default(0),
  interestRate: z.number().default(0),
  averageBalance: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Card_value_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.spendingPerYear * (input.rewardsRate / 100) + input.otherBenefits; results["grossBenefits"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["grossBenefits"] = 0; }
  try { const v = input.annualFee + (input.averageBalance * (input.interestRate / 100)); results["totalCosts"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCosts"] = 0; }
  try { const v = (asFormulaNumber(results["grossBenefits"])) - (asFormulaNumber(results["totalCosts"])); results["netValue"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netValue"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCard_value_calculator(input: Card_value_calculatorInput): Card_value_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netValue"]);
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


export interface Card_value_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
