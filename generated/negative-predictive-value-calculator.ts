// @ts-nocheck
// Auto-generated from negative-predictive-value-calculator-schema.json
import * as z from 'zod';

export interface Negative_predictive_value_calculatorInput {
  tn: number;
  fn: number;
  tp: number;
  fp: number;
}

export const Negative_predictive_value_calculatorInputSchema = z.object({
  tn: z.number().default(0),
  fn: z.number().default(0),
  tp: z.number().default(0),
  fp: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Negative_predictive_value_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.tn + input.fn ? input.tn / (input.tn + input.fn) : 0; results["npv"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["npv"] = 0; }
  try { const v = input.tn; results["tn"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["tn"] = 0; }
  try { const v = input.fn; results["fn"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["fn"] = 0; }
  try { const v = input.tn + input.fn; results["tn___fn"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["tn___fn"] = 0; }
  try { const v = input.tn + input.fn ? input.tn / (input.tn + input.fn) : 0; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateNegative_predictive_value_calculator(input: Negative_predictive_value_calculatorInput): Negative_predictive_value_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Negative_predictive_value_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
