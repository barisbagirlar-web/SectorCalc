// Auto-generated from four-percent-rule-calculator-schema.json
import * as z from 'zod';

export interface Four_percent_rule_calculatorInput {
  portfolioValue: number;
  desiredAnnualWithdrawal: number;
  withdrawalRate: number;
  dataConfidence?: number;
}

export const Four_percent_rule_calculatorInputSchema = z.object({
  portfolioValue: z.number().default(1000000),
  desiredAnnualWithdrawal: z.number().default(40000),
  withdrawalRate: z.number().default(4),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Four_percent_rule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.portfolioValue * input.withdrawalRate / 100; results["safeWithdrawal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["safeWithdrawal"] = Number.NaN; }
  try { const v = input.desiredAnnualWithdrawal / (input.withdrawalRate / 100); results["neededPortfolio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["neededPortfolio"] = Number.NaN; }
  try { const v = input.portfolioValue > 0 ? input.portfolioValue * input.withdrawalRate / 100 : (input.desiredAnnualWithdrawal > 0 ? input.desiredAnnualWithdrawal / (input.withdrawalRate / 100) : 0); results["primary"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["primary"] = Number.NaN; }
  return results;
}


export function calculateFour_percent_rule_calculator(input: Four_percent_rule_calculatorInput): Four_percent_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["primary"]);
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


export interface Four_percent_rule_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
