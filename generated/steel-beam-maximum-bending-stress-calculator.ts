// Auto-generated from steel-beam-maximum-bending-stress-calculator-schema.json
import * as z from 'zod';

export interface Steel_beam_maximum_bending_stress_calculatorInput {
  dataConfidence?: number;
  moment: number;
  kesitModulu: number;
}

export const Steel_beam_maximum_bending_stress_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  moment: z.number().min(0).default(50000),
  kesitModulu: z.number().min(0).default(0.00025),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Steel_beam_maximum_bending_stress_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["moment"] / Math.max(0.0001, input["kesitModulu"]); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateSteel_beam_maximum_bending_stress_calculator(input: Steel_beam_maximum_bending_stress_calculatorInput): Steel_beam_maximum_bending_stress_calculatorOutput {
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
    unit: "Pa",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Steel_beam_maximum_bending_stress_calculatorOutput {
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

export const Steel_beam_maximum_bending_stress_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "Pa",
  breakdownKeys: [],
} as const;
