// Auto-generated from shear-force-diagram-calculator-schema.json
import * as z from 'zod';

export interface Shear_force_diagram_calculatorInput {
  dataConfidence?: number;
  yuk: number;
  mesafe: number;
  uzunluk: number;
}

export const Shear_force_diagram_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  yuk: z.number().min(0).default(10000),
  mesafe: z.number().min(0).default(1.5),
  uzunluk: z.number().min(0).default(6),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Shear_force_diagram_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["mesafe"] < input["uzunluk"] / 2 ? input["yuk"] / 2 : -input["yuk"] / 2; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateShear_force_diagram_calculator(input: Shear_force_diagram_calculatorInput): Shear_force_diagram_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify calculations with FEA or physical testing.","Use appropriate safety factors for design."];
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
    unit: "N",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Shear_force_diagram_calculatorOutput {
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

export const Shear_force_diagram_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "N",
  breakdownKeys: [],
} as const;
