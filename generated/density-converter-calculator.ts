// Auto-generated from density-converter-calculator-schema.json
import * as z from 'zod';

export interface Density_converter_calculatorInput {
  dataConfidence?: number;
  deger: number;
  kaynak: number;
}

export const Density_converter_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  deger: z.number().min(0).default(1),
  kaynak: z.number().min(0).default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Density_converter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["kaynak"] === 1 ? input["deger"] : input["kaynak"] === 2 ? input["deger"] * 1000 : input["deger"] * 16.018; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateDensity_converter_calculator(input: Density_converter_calculatorInput): Density_converter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Use calibrated equipment for measurements.","Consider temperature effects on material properties."];
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
    unit: "kg/m3",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Density_converter_calculatorOutput {
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

export const Density_converter_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "kg/m3",
  breakdownKeys: [],
} as const;
