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

function evaluateAllFormulas(input: _4_rule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.portfolioValue * (input.withdrawalRate / 100); results["annualWithdrawal"] = Number.isFinite(v) ? v : 0; } catch { results["annualWithdrawal"] = 0; }
  try { const v = (results["annualWithdrawal"] ?? 0) / 12; results["monthlyWithdrawal"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyWithdrawal"] = 0; }
  try { const v = (results["annualWithdrawal"] ?? 0) * (1 + input.inflationRate / 100); results["adjustedAnnualWithdrawal"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedAnnualWithdrawal"] = 0; }
  try { const v = Math.log(1 + (input.expectedReturn / 100 - input.inflationRate / 100) / (input.withdrawalRate / 100)) / Math.log(1 + (input.expectedReturn / 100 - input.inflationRate / 100)); results["sustainableYears"] = Number.isFinite(v) ? v : 0; } catch { results["sustainableYears"] = 0; }
  try { const v = input.portfolioValue * (1 + input.expectedReturn / 100) ** input.retirementYears - (results["annualWithdrawal"] ?? 0) * ((1 + input.expectedReturn / 100) ** input.retirementYears - 1) / (input.expectedReturn / 100); results["finalPortfolioValue"] = Number.isFinite(v) ? v : 0; } catch { results["finalPortfolioValue"] = 0; }
  return results;
}


export function calculate_4_rule_calculator(input: _4_rule_calculatorInput): _4_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["annualWithdrawal"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
