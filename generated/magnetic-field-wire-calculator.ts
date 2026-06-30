// Auto-generated from magnetic-field-wire-calculator-schema.json
import * as z from 'zod';

export interface Magnetic_field_wire_calculatorInput {
  dataConfidence?: number;
  akim: number;
  mesafe: number;
}

export const Magnetic_field_wire_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  akim: z.number().min(0).default(10),
  mesafe: z.number().min(0).default(0.1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Magnetic_field_wire_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (4 * Math.PI * 1e-7 * input["akim"]) / Math.max(0.0001, (2 * Math.PI * input["mesafe"])); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateMagnetic_field_wire_calculator(input: Magnetic_field_wire_calculatorInput): Magnetic_field_wire_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = ["Low Q factor indicates broader frequency response."];
  const suggestedActions: string[] = ["Verify component tolerances affect circuit performance.","Use proper safety equipment for high voltage/current work."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    ["sonuc"]: totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "T",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Magnetic_field_wire_calculatorOutput {
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

export const Magnetic_field_wire_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "T",
  breakdownKeys: [],
} as const;
