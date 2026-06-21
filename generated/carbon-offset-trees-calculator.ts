// Auto-generated from carbon-offset-trees-calculator-schema.json
import * as z from 'zod';

export interface Carbon_offset_trees_calculatorInput {
  emisyon: number;
  agacYillikYutak: number;
  dataConfidence?: number;
}

export const Carbon_offset_trees_calculatorInputSchema = z.object({
  emisyon: z.number().min(0).default(100),
  agacYillikYutak: z.number().min(0).default(22),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Carbon_offset_trees_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.emisyon * 1000) / Math.max(0.0001, input.agacYillikYutak); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateCarbon_offset_trees_calculator(input: Carbon_offset_trees_calculatorInput): Carbon_offset_trees_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Low SNR indicates poor signal quality.","High Q indicates narrow bandwidth."];
  const suggestedActions: string[] = ["Use proper shielding for sensitive measurements.","Consider efficiency losses in energy calculations."];
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
    unit: "trees",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Carbon_offset_trees_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Carbon_offset_trees_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "trees",
  breakdownKeys: ["sonuc"],
} as const;

