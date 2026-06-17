// Auto-generated from 50-30-20-rule-calculator-schema.json
import * as z from 'zod';

export interface _50_30_20_rule_calculatorInput {
  monthlyIncome: number;
  needsPercentage: number;
  wantsPercentage: number;
  savingsPercentage: number;
}

export const _50_30_20_rule_calculatorInputSchema = z.object({
  monthlyIncome: z.number().default(5000),
  needsPercentage: z.number().default(50),
  wantsPercentage: z.number().default(30),
  savingsPercentage: z.number().default(20),
});

function evaluateAllFormulas(input: _50_30_20_rule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.monthlyIncome * input.needsPercentage / 100; results["needsAmount"] = Number.isFinite(v) ? v : 0; } catch { results["needsAmount"] = 0; }
  try { const v = input.monthlyIncome * input.wantsPercentage / 100; results["wantsAmount"] = Number.isFinite(v) ? v : 0; } catch { results["wantsAmount"] = 0; }
  try { const v = input.monthlyIncome * input.savingsPercentage / 100; results["savingsAmount"] = Number.isFinite(v) ? v : 0; } catch { results["savingsAmount"] = 0; }
  try { const v = $(results["needsAmount"] ?? 0); results["__needsAmount_"] = Number.isFinite(v) ? v : 0; } catch { results["__needsAmount_"] = 0; }
  try { const v = $(results["wantsAmount"] ?? 0); results["__wantsAmount_"] = Number.isFinite(v) ? v : 0; } catch { results["__wantsAmount_"] = 0; }
  try { const v = $(results["savingsAmount"] ?? 0); results["__savingsAmount_"] = Number.isFinite(v) ? v : 0; } catch { results["__savingsAmount_"] = 0; }
  results["result"] = 0;
  return results;
}


export function calculate_50_30_20_rule_calculator(input: _50_30_20_rule_calculatorInput): _50_30_20_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface _50_30_20_rule_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
