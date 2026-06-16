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

function evaluateAllFormulas(input: Four_percent_rule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.portfolioValue * input.withdrawalRate / 100; results["safeWithdrawal"] = Number.isFinite(v) ? v : 0; } catch { results["safeWithdrawal"] = 0; }
  try { const v = input.desiredAnnualWithdrawal / (input.withdrawalRate / 100); results["neededPortfolio"] = Number.isFinite(v) ? v : 0; } catch { results["neededPortfolio"] = 0; }
  try { const v = input.portfolioValue > 0 ? input.portfolioValue * input.withdrawalRate / 100 : (input.desiredAnnualWithdrawal > 0 ? input.desiredAnnualWithdrawal / (input.withdrawalRate / 100) : 0); results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  return results;
}


export function calculateFour_percent_rule_calculator(input: Four_percent_rule_calculatorInput): Four_percent_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primary"] ?? 0;
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


export interface Four_percent_rule_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
