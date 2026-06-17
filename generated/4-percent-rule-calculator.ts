// @ts-nocheck
// Auto-generated from 4-percent-rule-calculator-schema.json
import * as z from 'zod';

export interface _4_percent_rule_calculatorInput {
  desiredAnnualIncome: number;
  otherAnnualIncome: number;
  withdrawalRate: number;
  currentSavings: number;
}

export const _4_percent_rule_calculatorInputSchema = z.object({
  desiredAnnualIncome: z.number().default(80000),
  otherAnnualIncome: z.number().default(20000),
  withdrawalRate: z.number().default(4),
  currentSavings: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: _4_percent_rule_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.desiredAnnualIncome - input.otherAnnualIncome; results["netAnnualIncome"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netAnnualIncome"] = 0; }
  try { const v = (asFormulaNumber(results["netAnnualIncome"])) / (input.withdrawalRate / 100); results["requiredSavings"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["requiredSavings"] = 0; }
  try { const v = (asFormulaNumber(results["netAnnualIncome"])) / 12; results["monthlyIncome"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyIncome"] = 0; }
  try { const v = (asFormulaNumber(results["requiredSavings"])) - input.currentSavings; results["savingsGap"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["savingsGap"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculate_4_percent_rule_calculator(input: _4_percent_rule_calculatorInput): _4_percent_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["requiredSavings"]);
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


export interface _4_percent_rule_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
