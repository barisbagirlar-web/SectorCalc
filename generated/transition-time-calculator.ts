// Auto-generated from transition-time-calculator-schema.json
import * as z from 'zod';

export interface Transition_time_calculatorInput {
  dataConfidence?: number;
  distance: number;
  acceleration: number;
  maxVelocity: number;
  preDelay: number;
  postSettling: number;
}

export const Transition_time_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  distance: z.number().default(1.5),
  acceleration: z.number().default(2.5),
  maxVelocity: z.number().default(3),
  preDelay: z.number().default(0.1),
  postSettling: z.number().default(0.2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Transition_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["preDelay"]; results["preDelayTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["preDelayTime"] = Number.NaN; }
  try { const v = input["postSettling"]; results["postSettlingTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["postSettlingTime"] = Number.NaN; }
  try { const v = if input["maxVelocity"] === 0 then 0 else (input["distance"] / input["maxVelocity"]) + (input["maxVelocity"] / (2 * input["acceleration"])); results["motionTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["motionTime"] = Number.NaN; }
  return results;
}

export function calculateTransition_time_calculator(input: Transition_time_calculatorInput): Transition_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["postSettlingTime"]);
  const breakdown: Record<string, number> = {
    "0": toNumericFormulaValue(values["0"]),
    "1": toNumericFormulaValue(values["1"]),
    "2": toNumericFormulaValue(values["2"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    ["postSettlingTime"]: totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "s",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Transition_time_calculatorOutput {
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

export const Transition_time_calculatorOutputMeta = {
  primaryKey: "postSettlingTime",
  unit: "s",
  breakdownKeys: ["preDelayTime","motionTime"],
} as const;
