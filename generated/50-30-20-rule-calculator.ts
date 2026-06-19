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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: _50_30_20_rule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.monthlyIncome * input.needsPercentage / 100; results["needsAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["needsAmount"] = 0; }
  try { const v = input.monthlyIncome * input.wantsPercentage / 100; results["wantsAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wantsAmount"] = 0; }
  try { const v = input.monthlyIncome * input.savingsPercentage / 100; results["savingsAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["savingsAmount"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculate_50_30_20_rule_calculator(input: _50_30_20_rule_calculatorInput): _50_30_20_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["savingsAmount"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
