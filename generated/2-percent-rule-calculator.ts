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

function evaluateAllFormulas(input: _2_percent_rule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.monthlyRent / (input.propertyPrice + input.closingCosts)) * 100 >= input.targetPercent; results["meetsRule"] = Number.isFinite(v) ? v : 0; } catch { results["meetsRule"] = 0; }
  try { const v = (input.monthlyRent / (input.propertyPrice + input.closingCosts)) * 100; results["actualPercent"] = Number.isFinite(v) ? v : 0; } catch { results["actualPercent"] = 0; }
  try { const v = (input.propertyPrice + input.closingCosts) * input.targetPercent / 100; results["requiredRent"] = Number.isFinite(v) ? v : 0; } catch { results["requiredRent"] = 0; }
  try { const v = (input.monthlyRent / (input.targetPercent / 100)) - input.closingCosts; results["maxPrice"] = Number.isFinite(v) ? v : 0; } catch { results["maxPrice"] = 0; }
  return results;
}


export function calculate_2_percent_rule_calculator(input: _2_percent_rule_calculatorInput): _2_percent_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["meetsRule"] ?? 0;
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


export interface _2_percent_rule_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
