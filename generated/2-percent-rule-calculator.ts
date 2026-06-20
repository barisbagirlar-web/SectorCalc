// Auto-generated from 2-percent-rule-calculator-schema.json
import * as z from 'zod';

export interface _2_percent_rule_calculatorInput {
  propertyPrice: number;
  closingCosts: number;
  monthlyRent: number;
  targetPercent: number;
  dataConfidence?: number;
}

export const _2_percent_rule_calculatorInputSchema = z.object({
  propertyPrice: z.number().default(100000),
  closingCosts: z.number().default(5000),
  monthlyRent: z.number().default(2000),
  targetPercent: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: _2_percent_rule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.monthlyRent / (input.propertyPrice + input.closingCosts)) * 100 >= input.targetPercent; results["meetsRule"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["meetsRule"] = Number.NaN; }
  try { const v = (input.monthlyRent / (input.propertyPrice + input.closingCosts)) * 100; results["actualPercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["actualPercent"] = Number.NaN; }
  try { const v = (input.propertyPrice + input.closingCosts) * input.targetPercent / 100; results["requiredRent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["requiredRent"] = Number.NaN; }
  try { const v = (input.monthlyRent / (input.targetPercent / 100)) - input.closingCosts; results["maxPrice"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maxPrice"] = Number.NaN; }
  return results;
}


export function calculate_2_percent_rule_calculator(input: _2_percent_rule_calculatorInput): _2_percent_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["meetsRule"]);
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


export interface _2_percent_rule_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
