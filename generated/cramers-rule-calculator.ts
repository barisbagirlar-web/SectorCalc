// Auto-generated from cramers-rule-calculator-schema.json
import * as z from 'zod';

export interface Cramers_rule_calculatorInput {
  a11: number;
  a12: number;
  a13: number;
  b1: number;
  a21: number;
  a22: number;
  a23: number;
  b2: number;
  dataConfidence?: number;
}

export const Cramers_rule_calculatorInputSchema = z.object({
  a11: z.number().default(1),
  a12: z.number().default(1),
  a13: z.number().default(1),
  b1: z.number().default(1),
  a21: z.number().default(1),
  a22: z.number().default(1),
  a23: z.number().default(1),
  b2: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cramers_rule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.a11 * input.a12 * input.a13 * input.b1; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.a11 * input.a12 * input.a13 * input.b1 * (input.a21 * input.a22 * input.a23 * input.b2); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.a21 * input.a22 * input.a23 * input.b2; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCramers_rule_calculator(input: Cramers_rule_calculatorInput): Cramers_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Cramers_rule_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
