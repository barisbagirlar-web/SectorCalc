// Auto-generated from negative-predictive-value-calculator-schema.json
import * as z from 'zod';

export interface Negative_predictive_value_calculatorInput {
  tn: number;
  fn: number;
  tp: number;
  fp: number;
  dataConfidence?: number;
}

export const Negative_predictive_value_calculatorInputSchema = z.object({
  tn: z.number().default(0),
  fn: z.number().default(0),
  tp: z.number().default(0),
  fp: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Negative_predictive_value_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.tn + input.fn ? input.tn / (input.tn + input.fn) : 0; results["npv"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["npv"] = Number.NaN; }
  try { const v = input.tn; results["tn"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tn"] = Number.NaN; }
  try { const v = input.fn; results["fn"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fn"] = Number.NaN; }
  try { const v = input.tn + input.fn; results["tn___fn"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tn___fn"] = Number.NaN; }
  try { const v = input.tn + input.fn ? input.tn / (input.tn + input.fn) : 0; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateNegative_predictive_value_calculator(input: Negative_predictive_value_calculatorInput): Negative_predictive_value_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Negative_predictive_value_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
