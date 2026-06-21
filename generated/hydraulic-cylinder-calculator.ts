// Auto-generated from hydraulic-cylinder-calculator-schema.json
import * as z from 'zod';

export interface Hydraulic_cylinder_calculatorInput {
  boreDiameter: number;
  rodDiameter: number;
  pressure: number;
  strokeLength: number;
  frictionForce: number;
  elasticModulus: number;
  maxAppliedLoad: number;
  momentOfInertia: number;
  effectiveLengthFactor: number;
  velocity: number;
  cushionStroke: number;
  flowRate: number;
  dataConfidence?: number;
}

export const Hydraulic_cylinder_calculatorInputSchema = z.object({
  boreDiameter: z.number().min(0).default(0),
  rodDiameter: z.number().min(0).default(0),
  pressure: z.number().min(0).default(0),
  strokeLength: z.number().min(0).default(0),
  frictionForce: z.number().min(0).default(0),
  elasticModulus: z.number().min(0).default(0),
  maxAppliedLoad: z.number().min(0).default(0),
  momentOfInertia: z.number().min(0).default(0),
  effectiveLengthFactor: z.number().min(0).default(0),
  velocity: z.number().min(0).default(0),
  cushionStroke: z.number().min(0).default(0),
  flowRate: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hydraulic_cylinder_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.boreDiameter * input.rodDiameter * input.pressure * input.strokeLength; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.boreDiameter * input.rodDiameter * input.pressure * input.strokeLength * (input.frictionForce * input.elasticModulus * input.maxAppliedLoad * input.momentOfInertia * input.effectiveLengthFactor * input.velocity * input.cushionStroke * input.flowRate); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.frictionForce * input.elasticModulus * input.maxAppliedLoad * input.momentOfInertia * input.effectiveLengthFactor * input.velocity * input.cushionStroke * input.flowRate; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateHydraulic_cylinder_calculator(input: Hydraulic_cylinder_calculatorInput): Hydraulic_cylinder_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    normalized_product: toNumericFormulaValue(values["normalized_product"]),
    adjustment_factor: toNumericFormulaValue(values["adjustment_factor"])
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
    unit: "units",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report"],
  };
}


export interface Hydraulic_cylinder_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Hydraulic_cylinder_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

