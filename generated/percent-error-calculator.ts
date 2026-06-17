// @ts-nocheck
// Auto-generated from percent-error-calculator-schema.json
import * as z from 'zod';

export interface Percent_error_calculatorInput {
  measuredValue: number;
  trueValue: number;
  tolerancePercent: number;
  measurementUncertainty: number;
  coverageFactor: number;
}

export const Percent_error_calculatorInputSchema = z.object({
  measuredValue: z.number().default(0),
  trueValue: z.number().default(100),
  tolerancePercent: z.number().default(5),
  measurementUncertainty: z.number().default(0.1),
  coverageFactor: z.number().default(2),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Percent_error_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.measuredValue - input.trueValue; results["error"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["error"] = 0; }
  try { const v = input.coverageFactor * input.measurementUncertainty; results["expandedUncertainty"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["expandedUncertainty"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePercent_error_calculator(input: Percent_error_calculatorInput): Percent_error_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["expandedUncertainty"]);
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


export interface Percent_error_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
