// @ts-nocheck
// Auto-generated from transition-fit-calculator-schema.json
import * as z from 'zod';

export interface Transition_fit_calculatorInput {
  basic_size: number;
  hole_upper_dev: number;
  hole_lower_dev: number;
  shaft_upper_dev: number;
  shaft_lower_dev: number;
}

export const Transition_fit_calculatorInputSchema = z.object({
  basic_size: z.number().default(50),
  hole_upper_dev: z.number().default(0.025),
  hole_lower_dev: z.number().default(0),
  shaft_upper_dev: z.number().default(0.018),
  shaft_lower_dev: z.number().default(0.002),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Transition_fit_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.basic_size + input.hole_upper_dev; results["holeMax"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["holeMax"] = 0; }
  try { const v = input.basic_size + input.hole_lower_dev; results["holeMin"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["holeMin"] = 0; }
  try { const v = input.basic_size + input.shaft_upper_dev; results["shaftMax"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["shaftMax"] = 0; }
  try { const v = input.basic_size + input.shaft_lower_dev; results["shaftMin"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["shaftMin"] = 0; }
  try { const v = (asFormulaNumber(results["holeMax"])) - (asFormulaNumber(results["shaftMin"])); results["maxClearance"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["maxClearance"] = 0; }
  try { const v = (asFormulaNumber(results["holeMin"])) - (asFormulaNumber(results["shaftMax"])); results["minClearance"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["minClearance"] = 0; }
  results["result"] = 0;
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateTransition_fit_calculator(input: Transition_fit_calculatorInput): Transition_fit_calculatorOutput {
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


export interface Transition_fit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
