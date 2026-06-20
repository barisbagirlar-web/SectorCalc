// Auto-generated from 50-30-20-rule-calculator-schema.json
import * as z from 'zod';

export interface _50_30_20_rule_calculatorInput {
  monthlyIncome: number;
  needsPercentage: number;
  wantsPercentage: number;
  savingsPercentage: number;
  dataConfidence?: number;
}

export const _50_30_20_rule_calculatorInputSchema = z.object({
  monthlyIncome: z.number().default(5000),
  needsPercentage: z.number().default(50),
  wantsPercentage: z.number().default(30),
  savingsPercentage: z.number().default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: _50_30_20_rule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.monthlyIncome * input.needsPercentage / 100; results["needsAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["needsAmount"] = Number.NaN; }
  try { const v = input.monthlyIncome * input.wantsPercentage / 100; results["wantsAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wantsAmount"] = Number.NaN; }
  try { const v = input.monthlyIncome * input.savingsPercentage / 100; results["savingsAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["savingsAmount"] = Number.NaN; }
  return results;
}


export function calculate_50_30_20_rule_calculator(input: _50_30_20_rule_calculatorInput): _50_30_20_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["savingsAmount"]);
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


export interface _50_30_20_rule_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
