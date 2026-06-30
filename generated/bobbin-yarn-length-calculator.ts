// Auto-generated from bobbin-yarn-length-calculator-schema.json
import * as z from 'zod';

export interface Bobbin_yarn_length_calculatorInput {
  dataConfidence?: number;
  bobinAgirlik: number;
  iplikNumara: number;
}

export const Bobbin_yarn_length_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  bobinAgirlik: z.number().min(0).default(100),
  iplikNumara: z.number().min(0).default(40),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Bobbin_yarn_length_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["bobinAgirlik"] / 1000) * input["iplikNumara"] * 1000; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateBobbin_yarn_length_calculator(input: Bobbin_yarn_length_calculatorInput): Bobbin_yarn_length_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = ["Waste in material or time indicates process improvement opportunity."];
  const suggestedActions: string[] = ["Optimize drying/cooling parameters for cycle time reduction.","Monitor defects and adjust process conditions accordingly."];
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
    unit: "m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Bobbin_yarn_length_calculatorOutput {
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

export const Bobbin_yarn_length_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "m",
  breakdownKeys: [],
} as const;
