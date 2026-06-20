// Auto-generated from transition-fit-calculator-schema.json
import * as z from 'zod';

export interface Transition_fit_calculatorInput {
  basic_size: number;
  hole_upper_dev: number;
  hole_lower_dev: number;
  shaft_upper_dev: number;
  shaft_lower_dev: number;
  dataConfidence?: number;
}

export const Transition_fit_calculatorInputSchema = z.object({
  basic_size: z.number().default(50),
  hole_upper_dev: z.number().default(0.025),
  hole_lower_dev: z.number().default(0),
  shaft_upper_dev: z.number().default(0.018),
  shaft_lower_dev: z.number().default(0.002),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Transition_fit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.basic_size + input.hole_upper_dev; results["holeMax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["holeMax"] = Number.NaN; }
  try { const v = input.basic_size + input.hole_lower_dev; results["holeMin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["holeMin"] = Number.NaN; }
  try { const v = input.basic_size + input.shaft_upper_dev; results["shaftMax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["shaftMax"] = Number.NaN; }
  try { const v = input.basic_size + input.shaft_lower_dev; results["shaftMin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["shaftMin"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["holeMax"])) - (toNumericFormulaValue(results["shaftMin"])); results["maxClearance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maxClearance"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["holeMin"])) - (toNumericFormulaValue(results["shaftMax"])); results["minClearance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["minClearance"] = Number.NaN; }
  return results;
}


export function calculateTransition_fit_calculator(input: Transition_fit_calculatorInput): Transition_fit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["minClearance"]);
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


export interface Transition_fit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
