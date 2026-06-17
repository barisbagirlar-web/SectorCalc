// @ts-nocheck
// Auto-generated from 4-rule-calculator-schema.json
import * as z from 'zod';

export interface _4_rule_calculatorInput {
  portfolioValue: number;
  withdrawalRate: number;
  retirementYears: number;
  inflationRate: number;
  expectedReturn: number;
}

export const _4_rule_calculatorInputSchema = z.object({
  portfolioValue: z.number().default(1000000),
  withdrawalRate: z.number().default(4),
  retirementYears: z.number().default(30),
  inflationRate: z.number().default(2),
  expectedReturn: z.number().default(7),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: _4_rule_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.portfolioValue * (input.withdrawalRate / 100); results["annualWithdrawal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["annualWithdrawal"] = 0; }
  try { const v = (asFormulaNumber(results["annualWithdrawal"])) / 12; results["monthlyWithdrawal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyWithdrawal"] = 0; }
  try { const v = (asFormulaNumber(results["annualWithdrawal"])) * (1 + input.inflationRate / 100); results["adjustedAnnualWithdrawal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustedAnnualWithdrawal"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculate_4_rule_calculator(input: _4_rule_calculatorInput): _4_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["annualWithdrawal"]);
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


export interface _4_rule_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
