// @ts-nocheck
// Auto-generated from 2-percent-rule-calculator-schema.json
import * as z from 'zod';

export interface _2_percent_rule_calculatorInput {
  propertyPrice: number;
  closingCosts: number;
  monthlyRent: number;
  targetPercent: number;
}

export const _2_percent_rule_calculatorInputSchema = z.object({
  propertyPrice: z.number().default(100000),
  closingCosts: z.number().default(5000),
  monthlyRent: z.number().default(2000),
  targetPercent: z.number().default(2),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: _2_percent_rule_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.monthlyRent / (input.propertyPrice + input.closingCosts)) * 100 >= input.targetPercent; results["meetsRule"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["meetsRule"] = 0; }
  try { const v = (input.monthlyRent / (input.propertyPrice + input.closingCosts)) * 100; results["actualPercent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["actualPercent"] = 0; }
  try { const v = (input.propertyPrice + input.closingCosts) * input.targetPercent / 100; results["requiredRent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["requiredRent"] = 0; }
  try { const v = (input.monthlyRent / (input.targetPercent / 100)) - input.closingCosts; results["maxPrice"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["maxPrice"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculate_2_percent_rule_calculator(input: _2_percent_rule_calculatorInput): _2_percent_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["meetsRule"]);
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


export interface _2_percent_rule_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
