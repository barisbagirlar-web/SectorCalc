// Auto-generated from rectangular-section-moment-of-inertia-calculator-schema.json
import * as z from 'zod';

export interface Rectangular_section_moment_of_inertia_calculatorInput {
  genislik: number;
  yukseklik: number;
  dataConfidence?: number;
}

export const Rectangular_section_moment_of_inertia_calculatorInputSchema = z.object({
  genislik: z.number().min(0).default(0.2),
  yukseklik: z.number().min(0).default(0.4),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Rectangular_section_moment_of_inertia_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.genislik * Math.pow(input.yukseklik, 3)) / 12; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateRectangular_section_moment_of_inertia_calculator(input: Rectangular_section_moment_of_inertia_calculatorInput): Rectangular_section_moment_of_inertia_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify calculations with FEA or physical testing.","Use appropriate safety factors for design."];
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
    unit: "m4",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Rectangular_section_moment_of_inertia_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Rectangular_section_moment_of_inertia_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "m4",
  breakdownKeys: ["sonuc"],
} as const;

