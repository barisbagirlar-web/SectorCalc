// @ts-nocheck
// Auto-generated from four-percent-rule-calculator-schema.json
import * as z from 'zod';

export interface Four_percent_rule_calculatorInput {
  portfolioValue: number;
  desiredAnnualWithdrawal: number;
  withdrawalRate: number;
}

export const Four_percent_rule_calculatorInputSchema = z.object({
  portfolioValue: z.number().default(1000000),
  desiredAnnualWithdrawal: z.number().default(40000),
  withdrawalRate: z.number().default(4),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Four_percent_rule_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.portfolioValue * input.withdrawalRate / 100; results["safeWithdrawal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["safeWithdrawal"] = 0; }
  try { const v = input.desiredAnnualWithdrawal / (input.withdrawalRate / 100); results["neededPortfolio"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["neededPortfolio"] = 0; }
  try { const v = input.portfolioValue > 0 ? input.portfolioValue * input.withdrawalRate / 100 : (input.desiredAnnualWithdrawal > 0 ? input.desiredAnnualWithdrawal / (input.withdrawalRate / 100) : 0); results["primary"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["primary"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFour_percent_rule_calculator(input: Four_percent_rule_calculatorInput): Four_percent_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["primary"]);
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


export interface Four_percent_rule_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
