// Auto-generated from transition-fit-calculator-schema.json
import * as z from 'zod';

export interface Transition_fit_calculatorInput {
  dataConfidence?: number;
  basic-size: number;
  hole-upper-dev: number;
  hole-lower-dev: number;
  shaft-upper-dev: number;
  shaft-lower-dev: number;
}

export const Transition_fit_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  basic-size: z.number().default(50),
  hole-upper-dev: z.number().default(0.025),
  hole-lower-dev: z.number().default(0),
  shaft-upper-dev: z.number().default(0.018),
  shaft-lower-dev: z.number().default(0.002),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Transition_fit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["basic-size"] + input["hole-upper-dev"]; results["holeMax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["holeMax"] = Number.NaN; }
  try { const v = input["basic-size"] + input["hole-lower-dev"]; results["holeMin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["holeMin"] = Number.NaN; }
  try { const v = input["basic-size"] + input["shaft-upper-dev"]; results["shaftMax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["shaftMax"] = Number.NaN; }
  try { const v = input["basic-size"] + input["shaft-lower-dev"]; results["shaftMin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["shaftMin"] = Number.NaN; }
  try { const v = results["holeMax"] - results["shaftMin"]; results["maxClearance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maxClearance"] = Number.NaN; }
  try { const v = results["holeMin"] - results["shaftMax"]; results["minClearance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["minClearance"] = Number.NaN; }
  return results;
}

export function calculateTransition_fit_calculator(input: Transition_fit_calculatorInput): Transition_fit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["minClearance"]);
  const breakdown: Record<string, number> = {
    "0": toNumericFormulaValue(values["0"]),
    "1": toNumericFormulaValue(values["1"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    ["minClearance"]: totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "mm",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Transition_fit_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: Record<string, number>;
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
  [key: string]: unknown;
}

export const Transition_fit_calculatorOutputMeta = {
  primaryKey: "minClearance",
  unit: "mm",
  breakdownKeys: ["holeMax","holeMin","shaftMax","shaftMin","maxClearance"],
} as const;
